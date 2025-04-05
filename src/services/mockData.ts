
import { Agent, Stage, Ticket } from "@/types";

// Mock stages
export const mockStages: Stage[] = [
  {
    id: "1",
    numero: 1,
    nome: "Aguardando",
    cor: "#808080",
    data_criado: new Date().toISOString(),
    data_atualizado: new Date().toISOString(),
  },
  {
    id: "2",
    numero: 2,
    nome: "Em Atendimento",
    cor: "#2196F3",
    data_criado: new Date().toISOString(),
    data_atualizado: new Date().toISOString(),
  },
  {
    id: "3",
    numero: 3,
    nome: "Bloqueado",
    cor: "#FF0000",
    data_criado: new Date().toISOString(),
    data_atualizado: new Date().toISOString(),
  },
  {
    id: "4",
    numero: 4,
    nome: "Atraso",
    cor: "#FFA500",
    data_criado: new Date().toISOString(),
    data_atualizado: new Date().toISOString(),
  },
  {
    id: "5",
    numero: 5,
    nome: "Finalizado",
    cor: "#4CAF50",
    data_criado: new Date().toISOString(),
    data_atualizado: new Date().toISOString(),
  },
];

// Mock agents
export const mockAgents: Agent[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@example.com",
    ativo: true,
    url_imagem: "https://i.pravatar.cc/150?u=joao",
    data_criado: new Date().toISOString(),
    data_atualizado: new Date().toISOString(),
  },
  {
    id: "2",
    nome: "Maria Souza",
    email: "maria.souza@example.com",
    ativo: true,
    url_imagem: "https://i.pravatar.cc/150?u=maria",
    data_criado: new Date().toISOString(),
    data_atualizado: new Date().toISOString(),
  },
  {
    id: "3",
    nome: "Carlos Ferreira",
    email: "carlos.ferreira@example.com",
    ativo: false,
    url_imagem: "https://i.pravatar.cc/150?u=carlos",
    data_criado: new Date().toISOString(),
    data_atualizado: new Date().toISOString(),
  },
];

// Generate a random time between now and 30 minutes ago
const getRandomTime = () => {
  const now = new Date();
  const randomMinutesAgo = Math.floor(Math.random() * 30);
  now.setMinutes(now.getMinutes() - randomMinutesAgo);
  return now.toISOString();
};

// Mock tickets
export const mockTickets: Ticket[] = [
  {
    id: "1",
    nome: "Alberto Fernandes",
    telefone: "11987654321",
    user_ns: "AF123456",
    motivo: "Problemas com login no sistema",
    setor: "Suporte Técnico",
    atendente_id: "1",
    email_atendente: "joao.silva@example.com",
    nome_atendente: "João Silva",
    etapa_numero: 1,
    url_imagem_atendente: "https://i.pravatar.cc/150?u=joao",
    data_criado: getRandomTime(),
    data_atualizado: getRandomTime(),
  },
  {
    id: "2",
    nome: "Mariana Costa",
    telefone: "11912345678",
    user_ns: "MC789012",
    motivo: "Solicitação de novo equipamento",
    setor: "TI",
    atendente_id: "2",
    email_atendente: "maria.souza@example.com",
    nome_atendente: "Maria Souza",
    etapa_numero: 2,
    url_imagem_atendente: "https://i.pravatar.cc/150?u=maria",
    data_criado: getRandomTime(),
    data_atualizado: getRandomTime(),
  },
  {
    id: "3",
    nome: "Pedro Alves",
    telefone: "11955554444",
    user_ns: "PA456789",
    motivo: "Dúvidas sobre faturamento",
    setor: "Financeiro",
    atendente_id: "1",
    email_atendente: "joao.silva@example.com",
    nome_atendente: "João Silva",
    etapa_numero: 3,
    url_imagem_atendente: "https://i.pravatar.cc/150?u=joao",
    data_criado: getRandomTime(),
    data_atualizado: getRandomTime(),
  },
  {
    id: "4",
    nome: "Sandra Lima",
    telefone: "11922223333",
    user_ns: "SL987654",
    motivo: "Configuração de VPN",
    setor: "Suporte Técnico",
    atendente_id: "2",
    email_atendente: "maria.souza@example.com",
    nome_atendente: "Maria Souza",
    etapa_numero: 4,
    url_imagem_atendente: "https://i.pravatar.cc/150?u=maria",
    data_criado: getRandomTime(),
    data_atualizado: getRandomTime(),
  },
];
