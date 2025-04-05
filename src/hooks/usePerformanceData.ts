
import { useState, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useRankingStore } from "@/services/ranking";
import { 
  getAttendantPerformance, 
  getAttendantStrikes, 
  AttendantPerformance, 
  StrikeData 
} from "@/services/performance";

export const usePerformanceData = () => {
  const { settings } = useSettings();
  const { updateRanking } = useRankingStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<AttendantPerformance[]>([]);
  const [strikesData, setStrikesData] = useState<StrikeData[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [performance, strikes] = await Promise.all([
        getAttendantPerformance(),
        getAttendantStrikes(settings.criticalTimeMinutes)
      ]);
      
      setPerformanceData(performance);
      setStrikesData(strikes);
      
      // Atualizar o ranking no store global para gerar notificações
      updateRanking(performance, settings);
    } catch (error) {
      console.error("Erro ao carregar dados de desempenho:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [settings.criticalTimeMinutes]);

  return {
    isLoading,
    performanceData,
    strikesData,
    loadData
  };
};
