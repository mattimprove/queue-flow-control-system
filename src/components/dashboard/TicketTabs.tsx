
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

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="waiting">Aguardando</TabsTrigger>
        <TabsTrigger value="inProgress">Em Atendimento</TabsTrigger>
        <TabsTrigger value="finished">Finalizados</TabsTrigger>
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
