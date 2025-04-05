
import React from "react";

interface AudioPermissionBannerProps {
  audioPermissionGranted: boolean;
}

const AudioPermissionBanner = ({ audioPermissionGranted }: AudioPermissionBannerProps) => {
  return (
    <div className={`p-4 rounded-md ${audioPermissionGranted ? 'bg-green-50 dark:bg-green-950/30' : 'bg-amber-50 dark:bg-amber-950/30'} mb-4`}>
      <p className={`text-sm ${audioPermissionGranted ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
        {audioPermissionGranted 
          ? "✓ Som ativado! Você pode testar os sons abaixo." 
          : "⚠️ Sons bloqueados pelo navegador. Clique em qualquer lugar da página para ativar."}
      </p>
    </div>
  );
};

export default AudioPermissionBanner;
