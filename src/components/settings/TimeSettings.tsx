
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AppSettings } from "@/types";

interface TimeSettingsProps {
  form: UseFormReturn<AppSettings>;
}

const TimeSettings = ({ form }: TimeSettingsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Alertas de Tempo</h2>
      
      <FormField
        control={form.control}
        name="warningTimeMinutes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tempo para Alerta Amarelo (min)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="criticalTimeMinutes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tempo para Alerta Vermelho (min)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="fullScreenAlertMinutes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tempo para Alerta em Tela Cheia (min)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TimeSettings;
