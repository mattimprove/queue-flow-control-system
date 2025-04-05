
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
              <SelectItem value="notification">Notificação</SelectItem>
              <SelectItem value="alert">Alerta</SelectItem>
              <SelectItem value="beep">Beep</SelectItem>
              <SelectItem value="podium">Som de Pódio</SelectItem>
              <SelectItem value="firstPlace">Som de 1º Lugar</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SoundTypeSelector;
