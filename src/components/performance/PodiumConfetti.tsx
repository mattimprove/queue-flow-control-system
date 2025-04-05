
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

type ConfettiType = 'podium' | 'first-place';

interface PodiumConfettiProps {
  isActive: boolean;
  type?: ConfettiType;
  onComplete?: () => void;
}

const PodiumConfetti = ({ isActive, type = 'podium', onComplete }: PodiumConfettiProps) => {
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect();
      
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
      const leftConfetti = confetti.create(document.createElement('canvas'), {
        resize: true,
        useWorker: true,
      });
      
      leftConfetti({
        particleCount,
        origin: { x: 0.2, y: 0.5 },
        spread,
        colors,
        gravity: 0.8,
        scalar: 1.2,
        shapes: ['star', 'circle'],
      });
      
      // Criar confete do lado direito
      const rightConfetti = confetti.create(document.createElement('canvas'), {
        resize: true,
        useWorker: true,
      });
      
      rightConfetti({
        particleCount,
        origin: { x: 0.8, y: 0.5 },
        spread,
        colors,
        gravity: 0.8,
        scalar: 1.2,
        shapes: ['star', 'circle'],
      });
      
      // Notificar quando completar
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2500);
    }
  }, [isActive, type, onComplete]);

  return (
    <div 
      ref={confettiRef} 
      className="fixed inset-0 pointer-events-none z-50"
      style={{ display: isActive ? 'block' : 'none' }}
    />
  );
};

export default PodiumConfetti;
