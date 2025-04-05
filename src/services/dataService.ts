
import { Agent, Stage, Ticket } from "@/types";
import { mockAgents, mockStages, mockTickets } from "./mockData";

// In-memory storage for mock data
let tickets = [...mockTickets];
let stages = [...mockStages];
let agents = [...mockAgents];

// Helper to simulate delay for async operations
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Tickets
export const getTickets = async (): Promise<Ticket[]> => {
  await delay(300); // Simulate network delay
  return [...tickets];
};

export const getTicketById = async (id: string): Promise<Ticket | undefined> => {
  await delay(300);
  return tickets.find((ticket) => ticket.id === id);
};

export const createTicket = async (ticket: Omit<Ticket, "id" | "data_criado" | "data_atualizado">): Promise<Ticket> => {
  await delay(300);
  
  // Auto-set the stage to 1 (Aguardando) if not specified
  if (!ticket.etapa_numero) {
    ticket.etapa_numero = 1;
  }
  
  // Check if the agent exists
  const existingAgent = agents.find((agent) => agent.email === ticket.email_atendente);
  
  // If agent doesn't exist, create one automatically
  if (!existingAgent) {
    const newAgent: Agent = {
      id: Date.now().toString(),
      nome: ticket.email_atendente, // Use email as name if not provided
      email: ticket.email_atendente,
      ativo: true,
      data_criado: new Date().toISOString(),
      data_atualizado: new Date().toISOString(),
    };
    agents.push(newAgent);
    ticket.atendente_id = newAgent.id;
    ticket.nome_atendente = newAgent.nome;
  } else {
    // Use existing agent details
    ticket.atendente_id = existingAgent.id;
    ticket.nome_atendente = existingAgent.nome;
    ticket.url_imagem_atendente = existingAgent.url_imagem;
  }
  
  // Create the new ticket
  const newTicket: Ticket = {
    ...ticket as any,
    id: Date.now().toString(),
    data_criado: new Date().toISOString(),
    data_atualizado: new Date().toISOString(),
  };
  
  tickets.push(newTicket);
  return newTicket;
};

export const updateTicket = async (id: string, updates: Partial<Ticket>): Promise<Ticket> => {
  await delay(300);
  
  const index = tickets.findIndex((ticket) => ticket.id === id);
  if (index === -1) throw new Error("Ticket not found");
  
  // Update ticket
  const updatedTicket = { ...tickets[index], ...updates, data_atualizado: new Date().toISOString() };
  tickets[index] = updatedTicket;
  
  return updatedTicket;
};

export const deleteTicket = async (id: string): Promise<void> => {
  await delay(300);
  tickets = tickets.filter((ticket) => ticket.id !== id);
};

// Stages
export const getStages = async (): Promise<Stage[]> => {
  await delay(300);
  return [...stages];
};

export const updateStage = async (id: string, updates: Partial<Stage>): Promise<Stage> => {
  await delay(300);
  
  const index = stages.findIndex((stage) => stage.id === id);
  if (index === -1) throw new Error("Stage not found");
  
  const updatedStage = { ...stages[index], ...updates, data_atualizado: new Date().toISOString() };
  stages[index] = updatedStage;
  
  return updatedStage;
};

export const createStage = async (stage: Omit<Stage, "id" | "data_criado" | "data_atualizado">): Promise<Stage> => {
  await delay(300);
  
  const newStage: Stage = {
    ...stage as any,
    id: Date.now().toString(),
    data_criado: new Date().toISOString(),
    data_atualizado: new Date().toISOString(),
  };
  
  stages.push(newStage);
  return newStage;
};

export const deleteStage = async (id: string): Promise<void> => {
  await delay(300);
  stages = stages.filter((stage) => stage.id !== id);
};

// Agents
export const getAgents = async (): Promise<Agent[]> => {
  await delay(300);
  return [...agents];
};

export const getAgentById = async (id: string): Promise<Agent | undefined> => {
  await delay(300);
  return agents.find((agent) => agent.id === id);
};

export const getAgentByEmail = async (email: string): Promise<Agent | undefined> => {
  await delay(300);
  return agents.find((agent) => agent.email === email);
};

export const createAgent = async (agent: Omit<Agent, "id" | "data_criado" | "data_atualizado">): Promise<Agent> => {
  await delay(300);
  
  const newAgent: Agent = {
    ...agent as any,
    id: Date.now().toString(),
    data_criado: new Date().toISOString(),
    data_atualizado: new Date().toISOString(),
  };
  
  agents.push(newAgent);
  return newAgent;
};

export const updateAgent = async (id: string, updates: Partial<Agent>): Promise<Agent> => {
  await delay(300);
  
  const index = agents.findIndex((agent) => agent.id === id);
  if (index === -1) throw new Error("Agent not found");
  
  const updatedAgent = { ...agents[index], ...updates, data_atualizado: new Date().toISOString() };
  agents[index] = updatedAgent;
  
  // Update all tickets associated with this agent
  if (updates.nome || updates.url_imagem) {
    tickets = tickets.map((ticket) => {
      if (ticket.atendente_id === id) {
        return {
          ...ticket,
          nome_atendente: updates.nome || ticket.nome_atendente,
          url_imagem_atendente: updates.url_imagem || ticket.url_imagem_atendente,
          data_atualizado: new Date().toISOString(),
        };
      }
      return ticket;
    });
  }
  
  return updatedAgent;
};

export const deleteAgent = async (id: string): Promise<void> => {
  await delay(300);
  agents = agents.filter((agent) => agent.id !== id);
};
