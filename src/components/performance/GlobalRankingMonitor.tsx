
import { useEffect, useRef } from "react";
import { getAttendantPerformance } from "@/services/performance";
import { useRankingStore } from "@/services/ranking";
import { useSettings } from "@/contexts/SettingsContext";
import PodiumConfetti from "./PodiumConfetti";

// Intervalo de atualização do ranking em milissegundos (2 minutos)
const RANKING_UPDATE_INTERVAL = 2 * 60 * 1000;

const GlobalRankingMonitor = () => {
  const { settings } = useSettings();
  const { updateRanking, showConfetti, confettiType, clearCelebration } = useRankingStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Função para carregar dados de ranking
    const loadRankingData = async () => {
      try {
        const performance = await getAttendantPerformance();
        if (performance.length > 0) {
          updateRanking(performance, settings);
        }
      } catch (error) {
        console.error("Erro ao carregar dados de ranking global:", error);
      }
    };

    // Carregar dados iniciais
    loadRankingData();

    // Configurar intervalo para atualizações regulares
    intervalRef.current = setInterval(loadRankingData, RANKING_UPDATE_INTERVAL);

    // Limpar intervalo ao desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateRanking, settings]);

  // Renderizar o componente de confete quando necessário
  return (
    <>
      <PodiumConfetti 
        isActive={showConfetti}
        type={confettiType}
        onComplete={clearCelebration}
      />
    </>
  );
};

export default GlobalRankingMonitor;
