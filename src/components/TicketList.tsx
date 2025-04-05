
import { useState, useEffect } from "react";
import { Ticket, Stage } from "@/types";
import TicketCard from "./TicketCard";
import { updateTicket } from "@/services/dataService";
import { toast } from "sonner";
import { useSettings } from "@/contexts/SettingsContext";
import { getTimeStatus } from "@/utils/timeUtils";
import { startAlertNotification, stopAlertNotification } from "@/services/notificationService";

interface TicketListProps {
  tickets: Ticket[];
  stages: Stage[];
  onTicketChange: () => void;
}

const TicketList = ({ tickets, stages, onTicketChange }: TicketListProps) => {
  const { settings } = useSettings();
  const [alertActive, setAlertActive] = useState(false);
  
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
    pendingTickets.forEach(ticket => {
      const timeInfo = getTimeStatus(
        ticket.data_criado,
        settings.warningTimeMinutes,
        settings.criticalTimeMinutes
      );
      
      if (timeInfo.minutes >= settings.fullScreenAlertMinutes) {
        // TODO: Implement full-screen alert
        // For now, just use a toast notification
        toast.error(`Atendimento crítico pendente: ${ticket.nome}`, {
          id: `critical-${ticket.id}`,
          duration: 10000,
        });
      }
    });
    
    // Cleanup
    return () => {
      stopAlertNotification();
    };
  }, [tickets, alertActive, settings]);

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
  );
};

export default TicketList;
