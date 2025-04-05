
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Volume2, VolumeX, Play } from "lucide-react";
import { playSound, stopSound, unlockAudio, canPlayAudio, debugAudioSystems, preloadSounds } from "@/services/notificationService";
import { UseFormReturn } from "react-hook-form";
import { AppSettings } from "@/types";

interface SoundSettingsProps {
  form: UseFormReturn<AppSettings>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  audioPermissionGranted: boolean;
  setAudioPermissionGranted: React.Dispatch<React.SetStateAction<boolean>>;
}

const SoundSettings = ({ 
  form,
  isMuted,
  setIsMuted,
  audioPermissionGranted,
  setAudioPermissionGranted
}: SoundSettingsProps) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const handleSoundPreview = (type: string, volume: number) => {
    // Log audio state before playing
    console.log("Before playing, audio system state:", debugAudioSystems());
    
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
    const success = playSound(type, volume);
    
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
          playSound(type, volume);
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    stopSound();
    
    if (!isMuted) {
      toast.info("Som desativado");
    } else {
      toast.info("Som ativado");
      // Tenta desbloquear o áudio quando desmutado
      unlockAudio();
    }
  };

  // Efeito para verificar permissões de áudio sempre que o componente for montado
  useEffect(() => {
    console.log("SoundSettings component mounted");
    
    const checkAudioPermission = () => {
      const canPlay = canPlayAudio();
      setAudioPermissionGranted(canPlay);
      
      // Log current audio state
      console.log("Audio system state:", debugAudioSystems());
      
      return canPlay;
    };
    
    checkAudioPermission();
    
    // Tentar desbloquear o áudio também
    unlockAudio();
    
    // Try preloading sounds
    preloadSounds();
    
    // Adicionar listener para interações do usuário para atualizar o estado
    const handleUserInteraction = () => {
      console.log("User interaction detected in SoundSettings");
      
      // Desbloquear o áudio
      unlockAudio();
      
      // Try preloading sounds after interaction
      preloadSounds();
      
      // Atualizar estado de permissão
      const canPlay = canPlayAudio();
      if (canPlay && !audioPermissionGranted) {
        setAudioPermissionGranted(true);
        toast.success("Sons ativados com sucesso!");
      }
      
      // Log updated audio state
      console.log("After interaction audio state:", debugAudioSystems());
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      // Limpar quaisquer sons em reprodução quando o componente for desmontado
      stopSound();
      // Remover listeners
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [audioPermissionGranted, setAudioPermissionGranted]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Configurações de Som</h2>
      
      <div className={`p-4 rounded-md ${audioPermissionGranted ? 'bg-green-50 dark:bg-green-950/30' : 'bg-amber-50 dark:bg-amber-950/30'} mb-4`}>
        <p className={`text-sm ${audioPermissionGranted ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
          {audioPermissionGranted 
            ? "✓ Som ativado! Você pode testar os sons abaixo." 
            : "⚠️ Sons bloqueados pelo navegador. Clique em qualquer lugar da página para ativar."}
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="soundType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Som</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um som" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="notification">Notificação</SelectItem>
                <SelectItem value="alert">Alerta</SelectItem>
                <SelectItem value="beep">Beep</SelectItem>
                <SelectItem value="podium">Som de Pódio</SelectItem>
                <SelectItem value="firstPlace">Som de 1º Lugar</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="soundVolume"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Volume ({Math.round(field.value * 100)}%)</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleMute}
                  className={isMuted ? "text-destructive" : ""}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <div className="flex-grow">
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    disabled={isMuted}
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="pt-2 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSoundPreview(form.getValues("soundType"), form.getValues("soundVolume"))}
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
    </div>
  );
};

export default SoundSettings;
