
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { AppSettings } from "@/types";

interface DisplaySettingsProps {
  form: UseFormReturn<AppSettings>;
}

const DisplaySettings = ({ form }: DisplaySettingsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Exibição de Dados</h2>
      
      <FormField
        control={form.control}
        name="showUserNS"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Mostrar ID do Usuário</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phoneDisplayMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exibição do Número de Telefone</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="phone-full" />
                  <label htmlFor="phone-full">Completo</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partial" id="phone-partial" />
                  <label htmlFor="phone-partial">Últimos 4 dígitos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hidden" id="phone-hidden" />
                  <label htmlFor="phone-hidden">Oculto</label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DisplaySettings;
