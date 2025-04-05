
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AppSettings } from "@/types";

interface VolumeControlProps {
  form: UseFormReturn<AppSettings>;
  isMuted: boolean;
  onToggleMute: () => void;
}

const VolumeControl = ({ form, isMuted, onToggleMute }: VolumeControlProps) => {
  return (
    <FormField
      control={form.control}
      name="soundVolume"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Volume ({Math.round(field.value * 100)}%)</FormLabel>
          <FormControl>
            <div className="flex gap-2 items-center">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={onToggleMute}
                className={isMuted ? "text-destructive" : ""}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <div className="flex-grow">
                <Slider
                  min={0}
                  max={1}
                  step={0.05}
                  defaultValue={[field.value]}
                  onValueChange={(vals) => field.onChange(vals[0])}
                  disabled={isMuted}
                />
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VolumeControl;
