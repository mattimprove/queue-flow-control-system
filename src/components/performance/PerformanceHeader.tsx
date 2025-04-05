
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PerformanceHeaderProps {
  onRefresh: () => void;
}

const PerformanceHeader = ({ onRefresh }: PerformanceHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
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
      
      <Button variant="outline" onClick={onRefresh} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Atualizar
      </Button>
    </div>
  );
};

export default PerformanceHeader;
