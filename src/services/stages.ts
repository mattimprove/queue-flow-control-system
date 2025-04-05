
import { Stage } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
