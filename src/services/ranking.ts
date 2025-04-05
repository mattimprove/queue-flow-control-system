
import { AttendantPerformance } from "./performance";
import { create } from "zustand";
import { toast } from "sonner";
import { playSound } from "./notificationService";
import { AppSettings } from "@/types";

// Interfaces
interface RankingPosition {
  id: string;
  nome: string;
  position: number;
}

interface PodiumState {
  podiumPositions: RankingPosition[];
  isUpdatingRanking: boolean;
  showConfetti: boolean;
  confettiType: 'podium' | 'first-place';
  celebratingAttendant: string | null;
  // Funções
  updateRanking: (newRanking: AttendantPerformance[], settings: AppSettings) => void;
  clearCelebration: () => void;
}

// Store para gerenciar estado do pódio globalmente
export const useRankingStore = create<PodiumState>((set, get) => ({
  podiumPositions: [],
  isUpdatingRanking: false,
  showConfetti: false,
  confettiType: 'podium',
  celebratingAttendant: null,
  
  updateRanking: (newRanking, settings) => {
    if (get().isUpdatingRanking) return;
    
    set({ isUpdatingRanking: true });
    const oldPodium = get().podiumPositions;
    
    // Obter novas posições do pódio (top 3)
    const newPodium = newRanking.slice(0, 3).map((attendant, index) => ({
      id: attendant.id,
      nome: attendant.nome,
      position: index + 1
    }));
    
    // Verificar mudanças
    if (newPodium.length > 0) {
      console.log("🏆 Verificando mudanças no pódio:", { oldPodium, newPodium });
      
      for (const newPos of newPodium) {
        const oldPosition = oldPodium.find(old => old.id === newPos.id);
        
        // Se a pessoa não estava no pódio antes
        if (!oldPosition) {
          console.log(`🏆 ${newPos.nome} entrou no pódio! Agora está em ${newPos.position}º lugar!`);
          
          // Mostrar toast e confete
          toast.success(
            `${newPos.nome.split(' ')[0]} entrou no pódio! Agora está em ${newPos.position}º lugar!`,
            {
              duration: 6000,
              icon: "🏆",
              position: "top-center",
              className: "podium-toast"
            }
          );
          
          // Tocar som e mostrar confete
          console.log(`🔊 Tocando som para novo participante no pódio: ${newPos.nome}`);
          playSound(settings.podiumSound, settings.soundVolume);
          set({
            showConfetti: true,
            confettiType: 'podium',
            celebratingAttendant: newPos.nome.split(' ')[0]
          });
          
          break;
        }
        // Se melhorou a posição no pódio
        else if (oldPosition.position > newPos.position) {
          console.log(`🏆 ${newPos.nome} subiu para ${newPos.position}º lugar no pódio!`);
          
          // Mostrar toast e confete
          toast.success(
            `${newPos.nome.split(' ')[0]} subiu para ${newPos.position}º lugar no pódio!`,
            {
              duration: 6000,
              icon: "🎉",
              position: "top-center",
              className: "podium-toast"
            }
          );
          
          // Tocar som e mostrar confete para 1º lugar ou mudanças normais
          if (newPos.position === 1) {
            console.log(`🔊 Tocando som para novo primeiro lugar: ${newPos.nome}`);
            playSound(settings.firstPlaceSound, settings.soundVolume);
            set({
              showConfetti: true,
              confettiType: 'first-place',
              celebratingAttendant: newPos.nome.split(' ')[0]
            });
          } else {
            console.log(`🔊 Tocando som para melhoria no pódio: ${newPos.nome}`);
            playSound(settings.podiumSound, settings.soundVolume);
            set({
              showConfetti: true,
              confettiType: 'podium',
              celebratingAttendant: newPos.nome.split(' ')[0]
            });
          }
          
          break;
        }
      }
    }
    
    // Atualizar posições do pódio
    set({
      podiumPositions: newPodium,
      isUpdatingRanking: false
    });
  },
  
  clearCelebration: () => {
    console.log("🧹 Limpando celebração do pódio");
    set({
      showConfetti: false,
      celebratingAttendant: null
    });
  }
}));
