
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import PerformanceHeader from "@/components/performance/PerformanceHeader";
import PerformanceDesktopView from "@/components/performance/PerformanceDesktopView";
import PerformanceMobileView from "@/components/performance/PerformanceMobileView";
import { usePerformanceData } from "@/hooks/usePerformanceData";

const PerformancePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isLoading, performanceData, strikesData, loadData } = usePerformanceData();
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    
    // Detectar tamanho de tela para responsividade
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? "mobile" : "desktop");
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader title="Sistema de Fila de Atendimento" pendingAlerts={0} />
      
      <main className="flex-1 container py-6">
        <PerformanceHeader onRefresh={loadData} />
        
        {viewMode === "desktop" ? (
          <PerformanceDesktopView 
            performanceData={performanceData} 
            strikesData={strikesData} 
            isLoading={isLoading}
          />
        ) : (
          <PerformanceMobileView 
            performanceData={performanceData} 
            strikesData={strikesData} 
            isLoading={isLoading}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PerformancePage;
