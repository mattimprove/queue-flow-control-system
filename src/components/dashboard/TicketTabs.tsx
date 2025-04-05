
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

  // Ensure stages are sorted by numero
  const sortedStages = [...stages].sort((a, b) => a.numero - b.numero);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="flex mb-6 w-full justify-start overflow-x-auto">
        {/* "All" tab is always present */}
        <TabsTrigger value="all" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-400" />
          <span>Todos</span>
        </TabsTrigger>
        
        {/* Generate a tab for each stage */}
        {sortedStages.map((stage) => (
          <TabsTrigger 
            key={stage.id} 
            value={`stage-${stage.numero}`} 
            className="flex items-center gap-2"
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: stage.cor }} 
            />
            <span>{stage.nome}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      {/* Content for "All" tab */}
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
      
      {/* Generate content for each stage */}
      {sortedStages.map((stage) => (
        <TabsContent key={stage.id} value={`stage-${stage.numero}`}>
          {isLoading ? (
            <div className="text-center py-12">Carregando chamados...</div>
          ) : (
            <TicketList 
              tickets={getTicketsByStatus(stage.numero)} 
              stages={stages} 
              onTicketChange={onTicketChange}
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TicketTabs;
