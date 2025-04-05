
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppSettings } from "@/types";

interface SoundTypeSelectorProps {
  form: UseFormReturn<AppSettings>;
}

const SoundTypeSelector = ({ form }: SoundTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="soundType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Som</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um som" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="notification">Som de Novo Atendimento</SelectItem>
              <SelectItem value="alert">Som de Alerta de Atraso</SelectItem>
              <SelectItem value="beep">Som de Beep (Geral)</SelectItem>
              <SelectItem value="podium">Som de Entrada no Pódio</SelectItem>
              <SelectItem value="firstPlace">Som de Primeiro Lugar</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SoundTypeSelector;
