
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import TicketList from "@/components/TicketList";
import { Ticket, Stage } from "@/types";

interface TicketTabsProps {
  tickets: Ticket[];
  stages: Stage[];
  isLoading: boolean;
  onTicketChange: () => void;
}

const TicketTabs = ({ 
  tickets, 
  stages, 
  isLoading, 
  onTicketChange 
}: TicketTabsProps) => {
  // Filter tickets by status for each tab
  const getTicketsByStatus = (status: number | null) => {
    return status === null 
      ? tickets 
      : tickets.filter((ticket) => ticket.etapa_numero === status);
  };

  // Find stage colors for each tab
  const getStageColor = (stageNumber: number): string => {
    const stage = stages.find(s => s.numero === stageNumber);
    return stage?.cor || "#9b87f5"; // Default color if not found
  };

  // Get waiting stage color (stage 1)
  const waitingColor = getStageColor(1);
  // Get in progress stage color (stage 2)
  const inProgressColor = getStageColor(2);
  // Get finished stage color (stage 5)
  const finishedColor = getStageColor(5);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-400" />
          <span>Todos</span>
        </TabsTrigger>
        <TabsTrigger value="waiting" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: waitingColor }} />
          <span>Aguardando</span>
        </TabsTrigger>
        <TabsTrigger value="inProgress" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: inProgressColor }} />
          <span>Em Atendimento</span>
        </TabsTrigger>
        <TabsTrigger value="finished" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: finishedColor }} />
          <span>Finalizados</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        {isLoading ? (
          <div className="text-center py-12">Carregando chamados...</div>
        ) : (
          <TicketList 
            tickets={getTicketsByStatus(null)} 
            stages={stages} 
            onTicketChange={onTicketChange} 
          />
        )}
      </TabsContent>
      
      <TabsContent value="waiting">
        {isLoading ? (
          <div className="text-center py-12">Carregando chamados...</div>
        ) : (
          <TicketList 
            tickets={getTicketsByStatus(1)} 
            stages={stages} 
            onTicketChange={onTicketChange}
          />
        )}
      </TabsContent>
      
      <TabsContent value="inProgress">
        {isLoading ? (
          <div className="text-center py-12">Carregando chamados...</div>
        ) : (
          <TicketList 
            tickets={getTicketsByStatus(2)} 
            stages={stages} 
            onTicketChange={onTicketChange} 
          />
        )}
      </TabsContent>
      
      <TabsContent value="finished">
        {isLoading ? (
          <div className="text-center py-12">Carregando chamados...</div>
        ) : (
          <TicketList 
            tickets={getTicketsByStatus(5)} 
            stages={stages} 
            onTicketChange={onTicketChange} 
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TicketTabs;
