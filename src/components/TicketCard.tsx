
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Ticket, Stage } from "@/types";
import { formatTimeSince, getTimeStatus } from "@/utils/timeUtils";
import { formatPhoneDisplay } from "@/utils/phoneUtils";
import { useSettings } from "@/contexts/SettingsContext";

interface TicketCardProps {
  ticket: Ticket;
  stages: Stage[];
  onStatusChange?: (ticketId: string, newStageNumber: number) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, stages, onStatusChange }) => {
  const { settings } = useSettings();
  const { showUserNS, phoneDisplayMode, warningTimeMinutes, criticalTimeMinutes } = settings;
  const [, forceUpdate] = useState<number>(0);
  
  // Find current stage
  const currentStage = stages.find((stage) => stage.numero === ticket.etapa_numero);
  
  // Calculate time status
  const timeInfo = getTimeStatus(
    ticket.data_atualizado,
    warningTimeMinutes,
    criticalTimeMinutes
  );

  // Update time display every minute
  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate(prev => prev + 1);
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="animate-slide-in">
      <Card className="relative overflow-hidden">
        {/* Stage color indicator */}
        <div
          className="stage-indicator"
          style={{ backgroundColor: currentStage?.cor || "#808080" }}
        />
        
        <CardContent className="p-4 pl-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg">{ticket.nome}</h3>
              {ticket.telefone && (
                <p className="text-sm text-muted-foreground">
                  {formatPhoneDisplay(ticket.telefone, phoneDisplayMode)}
                </p>
              )}
            </div>
            
            {/* Agent info */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-sm">{ticket.nome_atendente || ticket.email_atendente}</span>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={ticket.url_imagem_atendente} />
                  <AvatarFallback>
                    {getInitials(ticket.nome_atendente || ticket.email_atendente)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs text-muted-foreground">{ticket.email_atendente}</span>
            </div>
          </div>
          
          <div className="mb-2">
            <p className="text-sm font-medium">Motivo:</p>
            <p className="text-sm">{ticket.motivo}</p>
          </div>
          
          {ticket.setor && (
            <div className="mb-2">
              <p className="text-sm font-medium">Setor:</p>
              <p className="text-sm">{ticket.setor}</p>
            </div>
          )}
          
          {/* Optional UserNS display based on settings */}
          {showUserNS && (
            <div className="mb-2">
              <p className="text-sm font-medium">ID:</p>
              <p className="text-sm">{ticket.user_ns}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-3">
            <Badge
              style={{
                backgroundColor: currentStage?.cor || "#808080",
                color: "#fff",
              }}
            >
              {currentStage?.nome || "Desconhecido"}
            </Badge>
            
            <span
              className={`text-sm ${
                timeInfo.status === "critical"
                  ? "text-critical animate-pulse-attention"
                  : timeInfo.status === "warning"
                  ? "text-warning"
                  : "text-muted-foreground"
              }`}
            >
              {formatTimeSince(ticket.data_atualizado)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketCard;
