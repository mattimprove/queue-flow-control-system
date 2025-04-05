
import { useState, useMemo } from "react";
import { Ticket } from "@/types";

export const useTicketFilters = (tickets: Ticket[]) => {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  
  // Apply all filters to tickets
  const filteredTickets = useMemo(() => {
    // Start with all tickets
    let filtered = [...tickets];

    // Filter by sector
    if (selectedSector !== "all") {
      filtered = filtered.filter((ticket) => ticket.setor === selectedSector);
    }
    
    // Filter by agent
    if (selectedAgent !== "all") {
      filtered = filtered.filter((ticket) => ticket.email_atendente === selectedAgent);
    }
    
    // Filter by stage
    if (selectedStage !== "all") {
      filtered = filtered.filter((ticket) => ticket.etapa_numero === selectedStage);
    }
    
    // Sort tickets
    return filtered.sort((a, b) => {
      const dateA = new Date(a.data_criado);
      const dateB = new Date(b.data_criado);
      return sortOrder === "desc" 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });
  }, [tickets, selectedSector, selectedAgent, selectedStage, sortOrder]);
  
  const clearFilters = () => {
    setSelectedSector("all");
    setSelectedAgent("all");
    setSelectedStage("all");
    setSortOrder("desc");
  };
  
  return {
    filteredTickets,
    selectedSector,
    setSelectedSector,
    selectedAgent,
    setSelectedAgent,
    selectedStage,
    setSelectedStage,
    sortOrder,
    setSortOrder,
    clearFilters,
  };
};
