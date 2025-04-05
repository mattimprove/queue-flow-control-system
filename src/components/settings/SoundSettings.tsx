
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AppSettings } from "@/types";
import { unlockAudio, canPlayAudio, debugAudioSystems, preloadSounds, stopSound } from "@/services/notificationService";

import AudioPermissionBanner from "./AudioPermissionBanner";
import SoundTypeSelector from "./SoundTypeSelector";
import VolumeControl from "./VolumeControl";
import SoundTester from "./SoundTester";

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
      
      <AudioPermissionBanner audioPermissionGranted={audioPermissionGranted} />
      
      <SoundTypeSelector form={form} />
      
      <VolumeControl 
        form={form} 
        isMuted={isMuted} 
        onToggleMute={toggleMute} 
      />
      
      <SoundTester 
        soundType={form.getValues("soundType")}
        volume={form.getValues("soundVolume")}
        isMuted={isMuted}
        audioPermissionGranted={audioPermissionGranted}
        setAudioPermissionGranted={setAudioPermissionGranted}
      />
    </div>
  );
};

export default SoundSettings;
