
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  onNewTicket: () => void;
}

const DashboardHeader = ({ onNewTicket }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Acompanhamento de Chamados</h2>
      
      <Button onClick={onNewTicket}>
        <Plus className="h-4 w-4 mr-2" /> Novo Chamado
      </Button>
    </div>
  );
};

export default DashboardHeader;
