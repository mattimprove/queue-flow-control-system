
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import TicketList from "@/components/TicketList";
import { Ticket, Stage } from "@/types";

interface TicketTabViewProps {
  tickets: Ticket[];
  stages: Stage[];
  isLoading: boolean;
  onTicketChange: () => void;
}

const TicketTabView = ({ 
  tickets, 
  stages, 
  isLoading, 
  onTicketChange 
}: TicketTabViewProps) => {
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
            tickets={tickets} 
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
            tickets={tickets.filter((ticket) => ticket.etapa_numero === 1)} 
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
            tickets={tickets.filter((ticket) => ticket.etapa_numero === 2)} 
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
            tickets={tickets.filter((ticket) => ticket.etapa_numero === 5)} 
            stages={stages} 
            onTicketChange={onTicketChange} 
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TicketTabView;
