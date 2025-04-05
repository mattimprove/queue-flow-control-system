
import PodiumDisplay from "./PodiumDisplay";
import PerformanceRanking from "./PerformanceRanking";
import StrikesTable from "./StrikesTable";
import { AttendantPerformance, StrikeData } from "@/services/performance";

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
  return (
    <div className="space-y-8">
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
