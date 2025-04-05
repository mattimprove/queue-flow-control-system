
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { toast } from "sonner";
import { playSound, stopSound, unlockAudio, canPlayAudio, preloadSounds } from "@/services/notificationService";

interface SoundTesterProps {
  soundType: string;
  volume: number;
  isMuted: boolean;
  audioPermissionGranted: boolean;
  setAudioPermissionGranted: React.Dispatch<React.SetStateAction<boolean>>;
}

const SoundTester = ({ 
  soundType, 
  volume, 
  isMuted, 
  audioPermissionGranted,
  setAudioPermissionGranted 
}: SoundTesterProps) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const handleSoundPreview = () => {
    // Tentar desbloquear o áudio primeiro (crucial para iOS/Safari)
    unlockAudio();
    
    // Preload sounds
    preloadSounds();
    
    // Parar qualquer som em reprodução
    stopSound();
    
    if (isMuted) {
      toast.warning("O som está mutado. Clique no botão de volume para ativar.");
      return;
    }
    
    setIsPlayingSound(true);
    
    // Tenta reproduzir o som e fornecer feedback
    const success = playSound(soundType, volume);
    
    // Set timeout to update UI state
    setTimeout(() => setIsPlayingSound(false), 1500);
    
    if (!success) {
      if (!audioPermissionGranted) {
        toast.warning(
          "Para permitir reprodução de áudio, interaja com a página primeiro.",
          { duration: 5000 }
        );
        
        // Add one-time click handler to try again on interaction
        const handleInteraction = () => {
          unlockAudio();
          preloadSounds();
          playSound(soundType, volume);
          setAudioPermissionGranted(true);
          document.removeEventListener('click', handleInteraction);
        };
        
        document.addEventListener('click', handleInteraction, { once: true });
      } else {
        toast.error(
          "Não foi possível reproduzir o som. Verifique as configurações do seu navegador.",
          { duration: 5000 }
        );
      }
    } else {
      toast.success("Som de teste reproduzido");
      setAudioPermissionGranted(true);
    }
  };

  return (
    <div className="pt-2 flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleSoundPreview}
        disabled={isMuted || isPlayingSound}
        className="relative"
      >
        {isPlayingSound ? (
          <>Tocando... <span className="animate-ping absolute right-2">🔊</span></>
        ) : (
          <>Testar Som <Play className="h-3 w-3 ml-2" /></>
        )}
      </Button>
    </div>
  );
};

export default SoundTester;
