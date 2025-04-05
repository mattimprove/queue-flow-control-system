
import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, ArrowDown, ArrowUp } from "lucide-react";
import TicketList from "@/components/TicketList";
import { Ticket, Stage, Agent } from "@/types";
import { getAgents } from "@/services";

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
  // Filter and sort states
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc"); // desc = newest first
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  
  // Get unique sectors from tickets
  const sectors = Array.from(new Set(tickets.filter(t => t.setor).map(t => t.setor as string)));

  // Fetch agents on component mount
  useEffect(() => {
    const loadAgents = async () => {
      setIsLoadingAgents(true);
      try {
        const agentsData = await getAgents();
        setAgents(agentsData);
      } catch (error) {
        console.error("Error loading agents:", error);
      } finally {
        setIsLoadingAgents(false);
      }
    };
    
    loadAgents();
  }, []);

  // Update filtered tickets whenever tickets, filters, or sort order change
  useEffect(() => {
    let result = [...tickets];
    
    // Apply sector filter if selected
    if (selectedSector && selectedSector !== "all") {
      result = result.filter(ticket => ticket.setor === selectedSector);
    }
    
    // Apply agent filter if selected
    if (selectedAgent && selectedAgent !== "all") {
      result = result.filter(ticket => 
        ticket.email_atendente === selectedAgent
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === "desc") {
        return new Date(b.data_criado).getTime() - new Date(a.data_criado).getTime();
      } else {
        return new Date(a.data_criado).getTime() - new Date(b.data_criado).getTime();
      }
    });
    
    setFilteredTickets(result);
  }, [tickets, selectedSector, selectedAgent, sortOrder]);
  
  // Filter tickets by status for each tab
  const getTicketsByStatus = (status: number | null) => {
    return status === null 
      ? filteredTickets 
      : filteredTickets.filter((ticket) => ticket.etapa_numero === status);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedSector("all");
    setSelectedAgent("all");
    setSortOrder("desc");
  };
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-medium">Filtros e Ordenação</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sector Filter */}
          <div>
            <label htmlFor="sector-filter" className="text-xs text-muted-foreground mb-1 block">
              Filtrar por Setor
            </label>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger id="sector-filter" className="w-full">
                <SelectValue placeholder="Todos os setores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os setores</SelectItem>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Agent Email Filter */}
          <div>
            <label htmlFor="agent-filter" className="text-xs text-muted-foreground mb-1 block">
              Filtrar por Atendente
            </label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger id="agent-filter" className="w-full">
                <SelectValue placeholder="Todos os atendentes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os atendentes</SelectItem>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.email}>{agent.nome} ({agent.email})</SelectItem>
                ))}
                {isLoadingAgents && <SelectItem value="loading" disabled>Carregando...</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          
          {/* Sort Order & Clear Filters */}
          <div className="flex items-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleSortOrder}
              className="flex items-center gap-1 h-10 flex-grow"
            >
              {sortOrder === "desc" ? (
                <>
                  <ArrowDown size={16} />
                  <span>Mais recentes</span>
                </>
              ) : (
                <>
                  <ArrowUp size={16} />
                  <span>Mais antigos</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-10"
            >
              Limpar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabs Section */}
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
    </div>
  );
};

export default TicketTabView;
