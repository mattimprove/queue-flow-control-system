
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/types";
import { getTimeStatus } from "@/utils/timeUtils";
import { useSettings } from "@/contexts/SettingsContext";
import { stopAlertNotification, playSound } from "@/services/notificationService";
import { X } from "lucide-react";

interface FullscreenAlertProps {
  ticket: Ticket;
  onClose: () => void;
}

const FullscreenAlert = ({ ticket, onClose }: FullscreenAlertProps) => {
  const { settings } = useSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // First stop any existing alert sound
    stopAlertNotification();
    
    // Play critical alert sound
    playSound("alert", settings.soundVolume, true);
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Clean up
    return () => {
      stopAlertNotification();
    };
  }, [settings.soundVolume]);

  // Format time since creation
  const { minutes } = getTimeStatus(
    ticket.data_criado, 
    settings.warningTimeMinutes, 
    settings.criticalTimeMinutes
  );

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
    stopAlertNotification();
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-card border border-destructive p-8 rounded-lg max-w-md w-full animate-pulse-attention">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-destructive">ATENDIMENTO CRÍTICO</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X />
          </Button>
        </div>
        
        <div className="space-y-4 mb-6">
          <p className="text-lg"><strong>Cliente:</strong> {ticket.nome}</p>
          <p><strong>Motivo:</strong> {ticket.motivo}</p>
          <p><strong>Setor:</strong> {ticket.setor || "Não especificado"}</p>
          <p className="text-destructive font-bold">
            Aguardando há {minutes} minutos
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button variant="destructive" size="lg" onClick={handleClose}>
            Fechar Alerta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FullscreenAlert;
