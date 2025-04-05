
import { useState, useEffect } from "react";
import { Ticket, Stage } from "@/types";
import TicketCard from "./TicketCard";
import { updateTicket } from "@/services/dataService";
import { toast } from "sonner";
import { useSettings } from "@/contexts/SettingsContext";
import { getTimeStatus } from "@/utils/timeUtils";
import { 
  startAlertNotification, 
  stopAlertNotification, 
  playSound, 
  unlockAudio, 
  debugAudioSystems,
  preloadSounds
} from "@/services/notificationService";
import FullscreenAlert from "./FullscreenAlert";

interface TicketListProps {
  tickets: Ticket[];
  stages: Stage[];
  onTicketChange: () => void;
}

const TicketList = ({ tickets, stages, onTicketChange }: TicketListProps) => {
  const { settings } = useSettings();
  const [alertActive, setAlertActive] = useState(false);
  const [criticalTicket, setCriticalTicket] = useState<Ticket | null>(null);
  
  // Initialize audio context on first render and preload sounds
  useEffect(() => {
    console.log("TicketList mounted, initializing audio systems...");
    
    // Attempt to unlock audio early
    unlockAudio();
    
    // Debug audio state
    console.log("Initial audio state:", debugAudioSystems());
    
    // Initialize handler for user interaction to unlock audio
    const handleUserInteraction = () => {
      console.log("User interaction detected in TicketList");
      
      // Unlock audio
      const unlocked = unlockAudio();
      
      // Preload sounds
      preloadSounds();
      
      // Play a test sound with very low volume to ensure the audio context is running
      const testAudio = new Audio();
      testAudio.volume = 0.01; // Almost silent
      testAudio.play().catch(e => console.log("Silent test audio play failed:", e));
      
      // Debug current state
      console.log("After interaction audio state:", debugAudioSystems());
      
      // Remove handlers after first interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
    
    // Add interaction listeners
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);
    
    // Cleanup function
    return () => {
      stopAlertNotification();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);
  
  // Check if we need to play alert sounds
  useEffect(() => {
    const pendingTickets = tickets.filter(ticket => ticket.etapa_numero === 1);
    
    if (pendingTickets.length > 0 && !alertActive) {
      console.log("Pending tickets found, attempting to start alert notification");
      
      // Unlock audio first
      unlockAudio();
      
      // Start alert sound
      const success = startAlertNotification(settings.soundType, settings.soundVolume);
      
      if (success) {
        console.log("✅ Alert notification started successfully");
        setAlertActive(true);
      } else {
        console.warn("⚠️ Failed to start alert notification, audio may be blocked");
        // Try again with user interaction
        const retryWithInteraction = () => {
          unlockAudio();
          const retrySuccess = startAlertNotification(settings.soundType, settings.soundVolume);
          if (retrySuccess) {
            setAlertActive(true);
            document.removeEventListener("click", retryWithInteraction);
          }
        };
        
        // Add temporary listener to retry on click
        document.addEventListener("click", retryWithInteraction, { once: true });
      }
    } else if (pendingTickets.length === 0 && alertActive) {
      // Stop alert sound
      stopAlertNotification();
      setAlertActive(false);
    }
    
    // Check for tickets that need full-screen alert
    let mostCriticalTicket: Ticket | null = null;
    let maxWaitTime = -1;
    
    pendingTickets.forEach(ticket => {
      const timeInfo = getTimeStatus(
        ticket.data_criado,
        settings.warningTimeMinutes,
        settings.criticalTimeMinutes
      );
      
      // Find the ticket with the longest wait time that exceeds the fullscreen threshold
      if (timeInfo.minutes >= settings.fullScreenAlertMinutes && timeInfo.minutes > maxWaitTime) {
        maxWaitTime = timeInfo.minutes;
        mostCriticalTicket = ticket;
      }
    });
    
    // Update critical ticket for fullscreen alert
    if (mostCriticalTicket && !criticalTicket) {
      setCriticalTicket(mostCriticalTicket);
      // Try to play a sound with unlock attempt first
      unlockAudio();
      const success = playSound("alert", settings.soundVolume, false);
      if (!success) {
        console.warn("⚠️ Could not play critical alert sound - may need user interaction");
        toast.warning("Clique na tela para ativar os alertas sonoros", { duration: 5000 });
      }
    } else if (!mostCriticalTicket && criticalTicket) {
      setCriticalTicket(null);
    }
    
    // Cleanup
    return () => {
      stopAlertNotification();
    };
  }, [tickets, alertActive, settings, criticalTicket]);

  // Update ticket status
  const handleStatusChange = async (ticketId: string, newStageNumber: number) => {
    try {
      await updateTicket(ticketId, { etapa_numero: newStageNumber });
      onTicketChange();
      
      // If moving from "Aguardando" to any other stage, stop alert sound
      if (newStageNumber !== 1 && alertActive) {
        const stillHasPending = tickets.some(
          ticket => ticket.id !== ticketId && ticket.etapa_numero === 1
        );
        
        if (!stillHasPending) {
          stopAlertNotification();
          setAlertActive(false);
        }
      }
      
      toast.success("Status do chamado atualizado com sucesso");
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Erro ao atualizar status do chamado");
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            stages={stages}
            onStatusChange={handleStatusChange}
          />
        ))}
        
        {tickets.length === 0 && (
          <div className="col-span-full text-center p-12">
            <p className="text-muted-foreground">Nenhum chamado encontrado</p>
          </div>
        )}
      </div>
      
      {/* Fullscreen critical alert */}
      {criticalTicket && (
        <FullscreenAlert
          ticket={criticalTicket}
          onClose={() => setCriticalTicket(null)}
        />
      )}
    </>
  );
};

export default TicketList;
