
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/types";
import { getTimeStatus, formatTimeSince } from "@/utils/timeUtils";
import { useSettings } from "@/contexts/SettingsContext";
import { stopAlertNotification, playSound, unlockAudio, debugAudioSystems } from "@/services/notificationService";
import { X } from "lucide-react";
import { toast } from "sonner";

interface FullscreenAlertProps {
  ticket: Ticket;
  onClose: () => void;
  onDismissAll: () => void; // New prop for dismissing all alerts
}

const FullscreenAlert = ({ ticket, onClose, onDismissAll }: FullscreenAlertProps) => {
  const { settings } = useSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [, forceUpdate] = useState<number>(0);

  useEffect(() => {
    // Log audio system state for debugging
    console.log("FullscreenAlert mounted, audio system state:", debugAudioSystems());
    
    // Primeiro pára qualquer som de alerta existente
    stopAlertNotification();
    
    // Tenta desbloquear o áudio primeiro (importante para iOS/Safari)
    unlockAudio();
    
    // Função para tentar reproduzir o som do alerta
    const tryPlaySound = () => {
      // Solicit unlocking sound before attempting to play
      unlockAudio();
      
      const success = playSound("alert", settings.soundVolume, true);
      if (success) {
        setSoundPlayed(true);
        console.log("✅ Critical alert sound started successfully");
      } else {
        console.warn("⚠️ Failed to play critical alert sound, will retry on interaction");
        toast.warning("Clique na tela para permitir sons de alerta", { duration: 5000 });
      }
    };
    
    // Tenta tocar o som imediatamente
    tryPlaySound();
    
    // Configurar event listener para interação do usuário
    const handleUserInteraction = () => {
      if (!soundPlayed) {
        console.log("User interaction detected in FullscreenAlert, trying to play sound...");
        tryPlaySound();
      }
    };
    
    // Adiciona event listeners para interação do usuário
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    // Animação de entrada
    setTimeout(() => setIsVisible(true), 100);
    
    // Update time display every second
    const timer = setInterval(() => {
      forceUpdate(prev => prev + 1);
    }, 1000); // Update every second
    
    // Limpeza
    return () => {
      stopAlertNotification();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      clearInterval(timer);
    };
  }, [settings.soundVolume, soundPlayed]);

  // Formata o tempo desde a criação
  const { minutes } = getTimeStatus(
    ticket.data_criado, 
    settings.warningTimeMinutes, 
    settings.criticalTimeMinutes
  );
  
  // Obtenha a contagem de tempo formatada
  const timeDisplay = formatTimeSince(ticket.data_criado);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Espera a animação terminar
    stopAlertNotification();
  };

  const handleDismissAll = () => {
    setIsVisible(false);
    setTimeout(onDismissAll, 300); // Espera a animação terminar
    stopAlertNotification();
    toast.success("Todos os alertas atuais foram dispensados");
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={() => {
        // Try to unlock audio on any click on the alert
        unlockAudio();
        if (!soundPlayed) {
          playSound("alert", settings.soundVolume, true);
          setSoundPlayed(true);
        }
      }}
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
            Aguardando há {timeDisplay}
          </p>
        </div>
        
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={handleDismissAll}>
            Dispensar Alertas Atuais
          </Button>
          <Button variant="destructive" onClick={handleClose}>
            Fechar Alerta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FullscreenAlert;
