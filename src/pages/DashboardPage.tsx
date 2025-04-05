
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import MainHeader from "@/components/MainHeader";
import TicketList from "@/components/TicketList";
import NewTicketForm from "@/components/NewTicketForm";
import FullscreenAlert from "@/components/FullscreenAlert";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { getTickets, getStages } from "@/services/dataService";
import { getTimeStatus } from "@/utils/timeUtils";
import { Stage, Ticket } from "@/types";
import { Plus } from "lucide-react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false);
  const [criticalTicket, setCriticalTicket] = useState<Ticket | null>(null);
  
  // Load tickets and stages
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [ticketsData, stagesData] = await Promise.all([
        getTickets(),
        getStages(),
      ]);
      setTickets(ticketsData);
      setStages(stagesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    loadData();
  }, []);
  
  // Check for authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Check for critical tickets that need full-screen alert
  useEffect(() => {
    const checkForCriticalTickets = () => {
      const waitingTickets = tickets.filter((ticket) => ticket.etapa_numero === 1);
      
      for (const ticket of waitingTickets) {
        const timeInfo = getTimeStatus(
          ticket.data_criado,
          settings.warningTimeMinutes,
          settings.criticalTimeMinutes
        );
        
        if (timeInfo.minutes >= settings.fullScreenAlertMinutes) {
          setCriticalTicket(ticket);
          return;
        }
      }
      
      // No critical tickets found
      setCriticalTicket(null);
    };
    
    checkForCriticalTickets();
    
    // Set up interval to check periodically
    const intervalId = setInterval(checkForCriticalTickets, 60000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [tickets, settings]);
  
  // Count tickets in waiting status for alerts
  const pendingTicketsCount = tickets.filter(
    (ticket) => ticket.etapa_numero === 1
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader title="Sistema de Fila de Atendimento" pendingAlerts={pendingTicketsCount} />
      
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Acompanhamento de Chamados</h2>
          
          <Button onClick={() => setNewTicketDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Novo Chamado
          </Button>
        </div>
        
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
                onTicketChange={loadData} 
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
                onTicketChange={loadData}
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
                onTicketChange={loadData} 
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
                onTicketChange={loadData} 
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      {/* New Ticket Dialog */}
      <Dialog open={newTicketDialogOpen} onOpenChange={setNewTicketDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Chamado</DialogTitle>
          </DialogHeader>
          <NewTicketForm
            onTicketCreated={() => {
              setNewTicketDialogOpen(false);
              loadData();
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Critical Ticket Alert */}
      {criticalTicket && (
        <FullscreenAlert 
          ticket={criticalTicket} 
          onClose={() => setCriticalTicket(null)} 
        />
      )}
    </div>
  );
};

export default DashboardPage;
