
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PerformanceRanking from "@/components/performance/PerformanceRanking";
import StrikesTable from "@/components/performance/StrikesTable";
import { getAttendantPerformance, getAttendantStrikes, AttendantPerformance, StrikeData } from "@/services/performance";
import { RefreshCw, Trophy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PerformancePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();
  
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<AttendantPerformance[]>([]);
  const [strikesData, setStrikesData] = useState<StrikeData[]>([]);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    
    loadData();
    
    // Detectar tamanho de tela para responsividade
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? "mobile" : "desktop");
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isAuthenticated, navigate, settings.criticalTimeMinutes]);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [performance, strikes] = await Promise.all([
        getAttendantPerformance(),
        getAttendantStrikes(settings.criticalTimeMinutes)
      ]);
      
      setPerformanceData(performance);
      setStrikesData(strikes);
    } catch (error) {
      console.error("Erro ao carregar dados de desempenho:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = () => {
    loadData();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader title="Sistema de Fila de Atendimento" pendingAlerts={0} />
      
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Dashboard de Desempenho</h2>
          
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
        
        {viewMode === "desktop" ? (
          // Desktop view
          <div className="space-y-8">
            <PerformanceRanking 
              attendants={performanceData} 
              isLoading={isLoading} 
            />
            <StrikesTable 
              strikes={strikesData} 
              isLoading={isLoading} 
            />
          </div>
        ) : (
          // Mobile view com tabs
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
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PerformancePage;
