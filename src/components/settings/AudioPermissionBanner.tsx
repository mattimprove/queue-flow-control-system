
import React from "react";

interface AudioPermissionBannerProps {
  audioPermissionGranted: boolean;
}

const AudioPermissionBanner = ({ audioPermissionGranted }: AudioPermissionBannerProps) => {
  return (
    <div className={`p-4 rounded-md ${audioPermissionGranted ? 'bg-green-50 dark:bg-green-950/30' : 'bg-amber-50 dark:bg-amber-950/30'} mb-4`}>
      <p className={`text-sm ${audioPermissionGranted ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
        {audioPermissionGranted 
          ? "✓ Sons ativados! Você pode testar os diferentes sons abaixo." 
          : "⚠️ Sons bloqueados pelo navegador. Clique em qualquer lugar da página para ativar."}
      </p>
      {audioPermissionGranted && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
          Os sons serão tocados para: novos atendimentos, alertas de atraso, entrada no pódio e primeiro lugar.
        </p>
      )}
    </div>
  );
};

export default AudioPermissionBanner;
