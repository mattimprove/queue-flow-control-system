
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppSettings } from "@/types";
import { availableSoundFiles, getSoundDisplayName } from "@/services/sound/soundResources";

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
                <SelectValue placeholder="Selecione um som">
                  {field.value === 'none' ? 'Sem Som' : 
                   getSoundDisplayName(field.value) + ` (${field.value})`}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[200px]">
              {/* Specific named options */}
              <SelectItem value="none">Sem Som</SelectItem>
              
              {/* Standard sound options */}
              {availableSoundFiles.map((filename) => (
                <SelectItem key={filename} value={filename}>
                  {getSoundDisplayName(filename)} ({filename})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SoundTypeSelector;
