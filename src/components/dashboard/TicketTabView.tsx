
import { Ticket, Stage } from "@/types";
import TicketFilterBar from "./TicketFilterBar";
import TicketTabs from "./TicketTabs";
import { useTicketFilters } from "./useTicketFilters";

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
  const {
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
  } = useTicketFilters(tickets);

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <TicketFilterBar 
        tickets={tickets}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        clearFilters={clearFilters}
      />
      
      {/* Tabs Section */}
      <TicketTabs
        tickets={filteredTickets}
        stages={stages}
        isLoading={isLoading}
        onTicketChange={onTicketChange}
      />
    </div>
  );
};

export default TicketTabView;
