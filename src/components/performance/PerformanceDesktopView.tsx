
import PodiumDisplay from "./PodiumDisplay";
import PerformanceRanking from "./PerformanceRanking";
import StrikesTable from "./StrikesTable";
import { AttendantPerformance, StrikeData } from "@/services/performance";
import PodiumConfetti from "./PodiumConfetti";
import { useRankingStore } from "@/services/ranking";

interface PerformanceDesktopViewProps {
  performanceData: AttendantPerformance[];
  strikesData: StrikeData[];
  isLoading: boolean;
}

const PerformanceDesktopView = ({ 
  performanceData, 
  strikesData, 
  isLoading 
}: PerformanceDesktopViewProps) => {
  const { showConfetti, confettiType, clearCelebration } = useRankingStore();

  return (
    <div className="space-y-8">
      {/* Confetti animation for podium celebrations */}
      <PodiumConfetti 
        isActive={showConfetti}
        type={confettiType}
        onComplete={clearCelebration}
      />
      
      <PodiumDisplay 
        attendants={performanceData.slice(0, 3)} 
        isLoading={isLoading}
      />
      <PerformanceRanking 
        attendants={performanceData} 
        isLoading={isLoading} 
      />
      <StrikesTable 
        strikes={strikesData} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default PerformanceDesktopView;
