
import { useState } from "react";
import { Agent } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { updateAgent } from "@/services/dataService";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";

interface AgentListProps {
  agents: Agent[];
  onAgentChange: () => void;
  onEditAgent: (agent: Agent) => void;
}

const AgentList = ({ agents, onAgentChange, onEditAgent }: AgentListProps) => {
  const [loadingAgentId, setLoadingAgentId] = useState<string | null>(null);

  const handleToggleActive = async (agent: Agent) => {
    try {
      setLoadingAgentId(agent.id);
      await updateAgent(agent.id, { ativo: !agent.ativo });
      onAgentChange();
      toast.success(`Atendente ${agent.ativo ? "desativado" : "ativado"} com sucesso`);
    } catch (error) {
      console.error("Error toggling agent status:", error);
      toast.error("Erro ao atualizar status do atendente");
    } finally {
      setLoadingAgentId(null);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id} className={agent.ativo ? "" : "opacity-60"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span className="truncate">{agent.nome}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditAgent(agent)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Switch
                  checked={agent.ativo}
                  onCheckedChange={() => handleToggleActive(agent)}
                  disabled={loadingAgentId === agent.id}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={agent.url_imagem} />
              <AvatarFallback>{getInitials(agent.nome)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground break-all">
                {agent.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {agent.ativo ? "Ativo" : "Inativo"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {agents.length === 0 && (
        <div className="col-span-full text-center p-12">
          <p className="text-muted-foreground">Nenhum atendente encontrado</p>
        </div>
      )}
    </div>
  );
};

export default AgentList;
