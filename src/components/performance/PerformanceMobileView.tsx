
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, AlertTriangle } from "lucide-react";
import PodiumDisplay from "./PodiumDisplay";
import PerformanceRanking from "./PerformanceRanking";
import StrikesTable from "./StrikesTable";
import { AttendantPerformance, StrikeData } from "@/services/performance";

interface PerformanceMobileViewProps {
  performanceData: AttendantPerformance[];
  strikesData: StrikeData[];
  isLoading: boolean;
}

const PerformanceMobileView = ({ 
  performanceData, 
  strikesData, 
  isLoading 
}: PerformanceMobileViewProps) => {
  return (
    <Tabs defaultValue="ranking" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="ranking" className="gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Ranking
        </TabsTrigger>
        <TabsTrigger value="strikes" className="gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          Strikes
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="ranking">
        <PodiumDisplay 
          attendants={performanceData.slice(0, 3)} 
          isLoading={isLoading}
        />
        <PerformanceRanking 
          attendants={performanceData} 
          isLoading={isLoading} 
        />
      </TabsContent>
      
      <TabsContent value="strikes">
        <StrikesTable 
          strikes={strikesData} 
          isLoading={isLoading} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default PerformanceMobileView;
