
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AppSettings } from "@/types";
import { useSettings } from "@/contexts/SettingsContext";
import { playSound, stopSound } from "@/services/notificationService";

const settingsSchema = z.object({
  showUserNS: z.boolean(),
  phoneDisplayMode: z.enum(["full", "partial", "hidden"]),
  warningTimeMinutes: z.number().min(1).max(120),
  criticalTimeMinutes: z.number().min(1).max(240),
  fullScreenAlertMinutes: z.number().min(1).max(360),
  soundVolume: z.number().min(0).max(1),
  soundType: z.string(),
});

const AppSettingsForm = () => {
  const { settings, updateSettings } = useSettings();
  
  const form = useForm<AppSettings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...settings,
    },
  });

  const handleSoundPreview = (type: string, volume: number) => {
    stopSound();
    playSound(type, volume);
  };

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
      soundType: "notification",
    });
    toast.info("Configurações restauradas para os valores padrão");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Configurações de Som</h2>
          
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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="soundVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume ({Math.round(field.value * 100)}%)</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSoundPreview(form.getValues("soundType"), form.getValues("soundVolume"))}
            >
              Testar Som
            </Button>
          </div>
        </div>

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
