
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { AppSettings } from "@/types";
import { useSettings } from "@/contexts/SettingsContext";
import { stopSound } from "@/services/notificationService";
import { useState } from "react";

import DisplaySettings from "@/components/settings/DisplaySettings";
import TimeSettings from "@/components/settings/TimeSettings";
import SoundSettings from "@/components/settings/SoundSettings";

const settingsSchema = z.object({
  showUserNS: z.boolean(),
  phoneDisplayMode: z.enum(["full", "partial", "hidden"]),
  warningTimeMinutes: z.number().min(1).max(120),
  criticalTimeMinutes: z.number().min(1).max(240),
  fullScreenAlertMinutes: z.number().min(1).max(360),
  soundVolume: z.number().min(0).max(1),
  notificationSound: z.string(),
  alertSound: z.string(),
  podiumSound: z.string(),
  firstPlaceSound: z.string(),
});

const AppSettingsForm = () => {
  const { settings, updateSettings } = useSettings();
  const [isMuted, setIsMuted] = useState(false);
  const [audioPermissionGranted, setAudioPermissionGranted] = useState(false);
  
  const form = useForm<AppSettings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...settings,
    },
  });

  const onSubmit = (values: AppSettings) => {
    updateSettings(values);
    toast.success("Configurações atualizadas com sucesso");
  };

  const resetToDefaults = () => {
    form.reset({
      showUserNS: true,
      phoneDisplayMode: "partial",
      warningTimeMinutes: 10,
      criticalTimeMinutes: 20,
      fullScreenAlertMinutes: 30,
      soundVolume: 0.5,
      notificationSound: "notification",
      alertSound: "alert",
      podiumSound: "podium",
      firstPlaceSound: "firstPlace",
    });
    toast.info("Configurações restauradas para os valores padrão");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DisplaySettings form={form} />
        
        <TimeSettings form={form} />
        
        <SoundSettings 
          form={form} 
          isMuted={isMuted} 
          setIsMuted={setIsMuted} 
          audioPermissionGranted={audioPermissionGranted}
          setAudioPermissionGranted={setAudioPermissionGranted}
        />

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={resetToDefaults}>
            Restaurar Padrões
          </Button>
          <Button type="submit">Salvar Configurações</Button>
        </div>
      </form>
    </Form>
  );
};

export default AppSettingsForm;
