
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

import MainHeader from "@/components/MainHeader";
import FullscreenAlert from "@/components/FullscreenAlert";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TicketTabView from "@/components/dashboard/TicketTabView";
import NewTicketDialog from "@/components/dashboard/NewTicketDialog";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { getTickets, getStages } from "@/services";
import { getTimeStatus } from "@/utils/timeUtils";
import { Stage, Ticket } from "@/types";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false);
  const [criticalTicket, setCriticalTicket] = useState<Ticket | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  
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
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    const checkForCriticalTickets = () => {
      const waitingTickets = tickets.filter((ticket) => ticket.etapa_numero === 1);
      
      for (const ticket of waitingTickets) {
        const timeInfo = getTimeStatus(
          ticket.data_criado,
          settings.warningTimeMinutes,
          settings.criticalTimeMinutes
        );
        
        if (timeInfo.minutes >= settings.fullScreenAlertMinutes && !dismissedAlerts.has(ticket.id)) {
          setCriticalTicket(ticket);
          return;
        }
      }
      
      setCriticalTicket(null);
    };
    
    checkForCriticalTickets();
    
    const intervalId = setInterval(checkForCriticalTickets, 60000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [tickets, settings, dismissedAlerts]);
  
  const pendingTicketsCount = tickets.filter(
    (ticket) => ticket.etapa_numero === 1
  ).length;

  const handleCloseAlert = (ticketId: string) => {
    setDismissedAlerts(prev => {
      const newSet = new Set(prev);
      newSet.add(ticketId);
      return newSet;
    });
    setCriticalTicket(null);
  };

  const handleTicketCreated = () => {
    setNewTicketDialogOpen(false);
    loadData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader title="Sistema de Fila de Atendimento" pendingAlerts={pendingTicketsCount} />
      
      <main className="flex-1 container py-6">
        <DashboardHeader onNewTicket={() => setNewTicketDialogOpen(true)} />
        
        <TicketTabView 
          tickets={tickets}
          stages={stages}
          isLoading={isLoading}
          onTicketChange={loadData}
        />
      </main>
      
      <NewTicketDialog 
        open={newTicketDialogOpen}
        onOpenChange={setNewTicketDialogOpen}
        onTicketCreated={handleTicketCreated}
      />
      
      {criticalTicket && (
        <FullscreenAlert 
          ticket={criticalTicket} 
          onClose={() => handleCloseAlert(criticalTicket.id)} 
        />
      )}
      
      <Footer />
    </div>
  );
};

export default DashboardPage;
