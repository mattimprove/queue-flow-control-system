
import { useState, useEffect } from "react";
import { Ticket } from "@/types";

export const useTicketFilters = (tickets: Ticket[]) => {
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc"); // desc = newest first

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
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedSector("all");
    setSelectedAgent("all");
    setSortOrder("desc");
  };

  return {
    filteredTickets,
    selectedSector,
    setSelectedSector,
    selectedAgent,
    setSelectedAgent,
    sortOrder,
    setSortOrder,
    clearFilters,
  };
};
