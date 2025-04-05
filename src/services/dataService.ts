
import { Agent, Stage, Ticket } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Tickets
export const getTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("data_criado", { ascending: false });

    if (error) {
      console.error("Error fetching tickets:", error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getTickets:", error);
    toast.error("Erro ao carregar chamados");
    return [];
  }
};

export const getTicketById = async (id: string): Promise<Ticket | undefined> => {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching ticket:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error in getTicketById:", error);
    toast.error("Erro ao carregar chamado");
    return undefined;
  }
};

export const createTicket = async (ticket: Omit<Ticket, "id" | "data_criado" | "data_atualizado">): Promise<Ticket> => {
  try {
    // Auto-set the stage to 1 (Aguardando) if not specified
    if (!ticket.etapa_numero) {
      ticket.etapa_numero = 1;
    }
    
    const { data, error } = await supabase
      .from("tickets")
      .insert(ticket)
      .select()
      .single();

    if (error) {
      console.error("Error creating ticket:", error);
      throw new Error(error.message);
    }

    toast.success("Chamado criado com sucesso");
    return data;
  } catch (error) {
    console.error("Error in createTicket:", error);
    toast.error("Erro ao criar chamado");
    throw error;
  }
};

export const updateTicket = async (id: string, updates: Partial<Ticket>): Promise<Ticket> => {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating ticket:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error in updateTicket:", error);
    toast.error("Erro ao atualizar chamado");
    throw error;
  }
};

export const deleteTicket = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("tickets")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting ticket:", error);
      throw new Error(error.message);
    }

    toast.success("Chamado excluído com sucesso");
  } catch (error) {
    console.error("Error in deleteTicket:", error);
    toast.error("Erro ao excluir chamado");
    throw error;
  }
};

// Stages
export const getStages = async (): Promise<Stage[]> => {
  try {
    const { data, error } = await supabase
      .from("etapas")
      .select("*")
      .order("numero", { ascending: true });

    if (error) {
      console.error("Error fetching stages:", error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getStages:", error);
    toast.error("Erro ao carregar etapas");
    return [];
  }
};

export const updateStage = async (id: string, updates: Partial<Stage>): Promise<Stage> => {
  try {
    const { data, error } = await supabase
      .from("etapas")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating stage:", error);
      throw new Error(error.message);
    }

    toast.success("Etapa atualizada com sucesso");
    return data;
  } catch (error) {
    console.error("Error in updateStage:", error);
    toast.error("Erro ao atualizar etapa");
    throw error;
  }
};

export const createStage = async (stage: Omit<Stage, "id" | "data_criado" | "data_atualizado">): Promise<Stage> => {
  try {
    const { data, error } = await supabase
      .from("etapas")
      .insert(stage)
      .select()
      .single();

    if (error) {
      console.error("Error creating stage:", error);
      throw new Error(error.message);
    }

    toast.success("Etapa criada com sucesso");
    return data;
  } catch (error) {
    console.error("Error in createStage:", error);
    toast.error("Erro ao criar etapa");
    throw error;
  }
};

export const deleteStage = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("etapas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting stage:", error);
      throw new Error(error.message);
    }

    toast.success("Etapa excluída com sucesso");
  } catch (error) {
    console.error("Error in deleteStage:", error);
    toast.error("Erro ao excluir etapa");
    throw error;
  }
};

// Agents
export const getAgents = async (): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from("atendentes")
      .select("*");

    if (error) {
      console.error("Error fetching agents:", error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAgents:", error);
    toast.error("Erro ao carregar atendentes");
    return [];
  }
};

export const getAgentById = async (id: string): Promise<Agent | undefined> => {
  try {
    const { data, error } = await supabase
      .from("atendentes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching agent:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error in getAgentById:", error);
    toast.error("Erro ao carregar atendente");
    return undefined;
  }
};

export const getAgentByEmail = async (email: string): Promise<Agent | undefined> => {
  try {
    const { data, error } = await supabase
      .from("atendentes")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== 'PGRST116') { // No rows found is not a real error
      console.error("Error fetching agent by email:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error in getAgentByEmail:", error);
    return undefined;
  }
};

export const createAgent = async (agent: Omit<Agent, "id" | "data_criado" | "data_atualizado">): Promise<Agent> => {
  try {
    const { data, error } = await supabase
      .from("atendentes")
      .insert(agent)
      .select()
      .single();

    if (error) {
      console.error("Error creating agent:", error);
      throw new Error(error.message);
    }

    toast.success("Atendente criado com sucesso");
    return data;
  } catch (error) {
    console.error("Error in createAgent:", error);
    toast.error("Erro ao criar atendente");
    throw error;
  }
};

export const updateAgent = async (id: string, updates: Partial<Agent>): Promise<Agent> => {
  try {
    const { data, error } = await supabase
      .from("atendentes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating agent:", error);
      throw new Error(error.message);
    }

    toast.success("Atendente atualizado com sucesso");
    return data;
  } catch (error) {
    console.error("Error in updateAgent:", error);
    toast.error("Erro ao atualizar atendente");
    throw error;
  }
};

export const deleteAgent = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("atendentes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting agent:", error);
      throw new Error(error.message);
    }

    toast.success("Atendente excluído com sucesso");
  } catch (error) {
    console.error("Error in deleteAgent:", error);
    toast.error("Erro ao excluir atendente");
    throw error;
  }
};
