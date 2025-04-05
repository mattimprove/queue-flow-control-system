
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PerformanceRanking from "@/components/performance/PerformanceRanking";
import StrikesTable from "@/components/performance/StrikesTable";
import PodiumDisplay from "@/components/performance/PodiumDisplay";
import { getAttendantPerformance, getAttendantStrikes, AttendantPerformance, StrikeData } from "@/services/performance";
import { RefreshCw, Trophy, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { playSound } from "@/services/notificationService";

const PerformancePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();
  
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<AttendantPerformance[]>([]);
  const [strikesData, setStrikesData] = useState<StrikeData[]>([]);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  
  // References to previous podium positions for comparison
  const prevPodiumRef = useRef<{id: string, position: number}[]>([]);

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
      
      setPerformanceData(previous => {
        // Check for podium changes and show notifications
        if (previous.length > 0 && performance.length > 0) {
          checkPodiumChanges(previous, performance);
        }
        
        // Update the reference to the current podium
        prevPodiumRef.current = performance.slice(0, 3).map((attendant, index) => ({
          id: attendant.id,
          position: index + 1
        }));
        
        return performance;
      });
      
      setStrikesData(strikes);
    } catch (error) {
      console.error("Erro ao carregar dados de desempenho:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check for podium changes and trigger notifications
  const checkPodiumChanges = (oldData: AttendantPerformance[], newData: AttendantPerformance[]) => {
    // Get top 3 from previous data
    const oldPodium = oldData.slice(0, 3).map((attendant, index) => ({
      id: attendant.id,
      nome: attendant.nome,
      position: index + 1
    }));
    
    // Get top 3 from new data
    const newPodium = newData.slice(0, 3).map((attendant, index) => ({
      id: attendant.id,
      nome: attendant.nome,
      position: index + 1
    }));

    // Check for changes in positions
    newPodium.forEach(newPos => {
      const oldPosition = oldPodium.find(old => old.id === newPos.id);
      
      // If this person wasn't in the podium before
      if (!oldPosition) {
        toast.success(
          `${newPos.nome.split(' ')[0]} entrou no pódio! Agora está em ${newPos.position}º lugar!`, 
          {
            duration: 5000,
            icon: "🏆"
          }
        );
        
        // Play podium sound
        playSound("podium", settings.soundVolume);
      }
      // If this person improved their position in the podium
      else if (oldPosition.position > newPos.position) {
        toast.success(
          `${newPos.nome.split(' ')[0]} subiu para ${newPos.position}º lugar no pódio!`,
          {
            duration: 5000,
            icon: "🎉"
          }
        );
        
        // Play podium sound or first place sound if they reached #1
        if (newPos.position === 1) {
          playSound("firstPlace", settings.soundVolume);
        } else {
          playSound("podium", settings.soundVolume);
        }
      }
    });
  };
  
  const handleRefresh = () => {
    loadData();
  };

  const handleBack = () => {
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader title="Sistema de Fila de Atendimento" pendingAlerts={0} />
      
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack} 
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold">Dashboard de Desempenho</h2>
          </div>
          
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
        
        {viewMode === "desktop" ? (
          // Desktop view
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
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PerformancePage;
