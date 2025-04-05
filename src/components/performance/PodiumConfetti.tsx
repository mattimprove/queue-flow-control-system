
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

type ConfettiType = 'podium' | 'first-place';

interface PodiumConfettiProps {
  isActive: boolean;
  type?: ConfettiType;
  onComplete?: () => void;
}

const PodiumConfetti = ({ isActive, type = 'podium', onComplete }: PodiumConfettiProps) => {
  useEffect(() => {
    if (isActive) {
      // Configurações baseadas no tipo
      let colors: string[] = ['#FFD700', '#C0C0C0', '#CD7F32'];  // Ouro, Prata, Bronze
      let particleCount = 100;
      let spread = 70;
      
      // Configurações especiais para primeiro lugar
      if (type === 'first-place') {
        colors = ['#FFD700', '#FFD700', '#FFFF00', '#FFA500']; // Variação de dourado
        particleCount = 150;
        spread = 90;
      }
      
      // Criar confete do lado esquerdo
      const leftConfettiCanvas = document.createElement('canvas');
      document.body.appendChild(leftConfettiCanvas);
      leftConfettiCanvas.style.position = 'fixed';
      leftConfettiCanvas.style.inset = '0';
      leftConfettiCanvas.style.width = '100%';
      leftConfettiCanvas.style.height = '100%';
      leftConfettiCanvas.style.pointerEvents = 'none';
      leftConfettiCanvas.style.zIndex = '9999';
      
      const leftConfettiInstance = confetti.create(leftConfettiCanvas, {
        resize: true,
        useWorker: true,
      });
      
      leftConfettiInstance({
        particleCount,
        origin: { x: 0.2, y: 0.5 },
        spread,
        colors,
        gravity: 0.8,
        scalar: 1.2,
        shapes: ['star', 'circle'],
      });
      
      // Criar confete do lado direito
      const rightConfettiCanvas = document.createElement('canvas');
      document.body.appendChild(rightConfettiCanvas);
      rightConfettiCanvas.style.position = 'fixed';
      rightConfettiCanvas.style.inset = '0';
      rightConfettiCanvas.style.width = '100%';
      rightConfettiCanvas.style.height = '100%';
      rightConfettiCanvas.style.pointerEvents = 'none';
      rightConfettiCanvas.style.zIndex = '9999';
      
      const rightConfettiInstance = confetti.create(rightConfettiCanvas, {
        resize: true,
        useWorker: true,
      });
      
      rightConfettiInstance({
        particleCount,
        origin: { x: 0.8, y: 0.5 },
        spread,
        colors,
        gravity: 0.8,
        scalar: 1.2,
        shapes: ['star', 'circle'],
      });
      
      // Limpar e notificar quando completar
      setTimeout(() => {
        document.body.removeChild(leftConfettiCanvas);
        document.body.removeChild(rightConfettiCanvas);
        if (onComplete) onComplete();
      }, 2500);
    }
  }, [isActive, type, onComplete]);

  // Não precisamos de um elemento DOM, pois os canvas são criados dinamicamente
  return null;
};

export default PodiumConfetti;
