
import { useState, useEffect } from "react";
import { Ticket, Stage } from "@/types";
import TicketCard from "./TicketCard";
import { updateTicket } from "@/services/dataService";
import { toast } from "sonner";
import { useSettings } from "@/contexts/SettingsContext";
import { getTimeStatus } from "@/utils/timeUtils";
import { startAlertNotification, stopAlertNotification, playSound } from "@/services/notificationService";
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
  
  // Initialize audio context on first user interaction to enable auto-play
  useEffect(() => {
    const handleUserInteraction = () => {
      // Try to play a silent sound to unlock audio
      const unlockAudio = new Audio();
      unlockAudio.play().catch(e => console.log("Audio context not unlocked:", e));
      
      // Remove the event listeners
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
    
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);
    
    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);
  
  // Check if we need to play alert sounds
  useEffect(() => {
    const pendingTickets = tickets.filter(ticket => ticket.etapa_numero === 1);
    
    if (pendingTickets.length > 0 && !alertActive) {
      // Start alert sound
      startAlertNotification(settings.soundType, settings.soundVolume);
      setAlertActive(true);
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
      // Play a sound to notify
      playSound("alert", settings.soundVolume, false);
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
