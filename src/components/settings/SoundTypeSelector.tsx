
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppSettings } from "@/types";
import { availableSoundFiles } from "@/services/sound/soundResources";

interface SoundTypeSelectorProps {
  form: UseFormReturn<AppSettings>;
  soundType: "notificationSound" | "alertSound" | "podiumSound" | "firstPlaceSound";
  label: string;
}

const SoundTypeSelector = ({ form, soundType, label }: SoundTypeSelectorProps) => {
  // Get a descriptive name for each sound file
  const getSoundDisplayName = (filename: string): string => {
    // Remove file extension
    const nameWithoutExtension = filename.replace('.mp3', '');
    
    // Make it more readable (capitalize first letter, handle special cases)
    switch(nameWithoutExtension) {
      case 'notification': return 'Som de Notificação';
      case 'alert': return 'Som de Alerta';
      case 'beep': return 'Som de Beep';
      case 'podium': return 'Som de Pódio';
      case 'firstPlace': return 'Som de Primeiro Lugar';
      case 'alerta': return 'Som de Alerta (Alt)';
      default:
        // For custom files, capitalize first letter and add spaces before uppercase letters
        return nameWithoutExtension
          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
          .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
    }
  };

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
            <SelectContent className="max-h-[200px]">
              {/* Specific named options */}
              <SelectItem value="none">Sem Som</SelectItem>
              
              {/* Standard sound options */}
              {availableSoundFiles.map((filename) => (
                <SelectItem key={filename} value={filename}>
                  {getSoundDisplayName(filename)}
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
