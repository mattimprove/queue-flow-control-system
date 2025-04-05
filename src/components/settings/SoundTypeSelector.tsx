
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppSettings } from "@/types";

interface SoundTypeSelectorProps {
  form: UseFormReturn<AppSettings>;
  soundType: "notificationSound" | "alertSound" | "podiumSound" | "firstPlaceSound";
  label: string;
}

const SoundTypeSelector = ({ form, soundType, label }: SoundTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name={soundType}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
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
              <SelectItem value="notification">Som de Notificação</SelectItem>
              <SelectItem value="alert">Som de Alerta</SelectItem>
              <SelectItem value="beep">Som de Beep</SelectItem>
              <SelectItem value="podium">Som de Pódio</SelectItem>
              <SelectItem value="firstPlace">Som de Primeiro Lugar</SelectItem>
              <SelectItem value="none">Sem Som</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SoundTypeSelector;
