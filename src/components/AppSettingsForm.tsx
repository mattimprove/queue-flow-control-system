
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
import { playSound, stopSound, unlockAudio, canPlayAudio } from "@/services/notificationService";
import { useEffect, useState } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";

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
  const [isMuted, setIsMuted] = useState(false);
  const [audioPermissionGranted, setAudioPermissionGranted] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  
  const form = useForm<AppSettings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...settings,
    },
  });

  // Verificar se o áudio pode ser reproduzido ao montar o componente
  useEffect(() => {
    const checkAudioPermission = () => {
      const canPlay = canPlayAudio();
      setAudioPermissionGranted(canPlay);
      return canPlay;
    };
    
    checkAudioPermission();
    
    // Tentar desbloquear o áudio também
    unlockAudio();
    
    // Adicionar listener para interações do usuário para atualizar o estado
    const handleUserInteraction = () => {
      // Desbloquear o áudio
      unlockAudio();
      // Atualizar estado de permissão
      const canPlay = canPlayAudio();
      if (canPlay && !audioPermissionGranted) {
        setAudioPermissionGranted(true);
        toast.success("Sons ativados com sucesso!");
      }
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      // Limpar quaisquer sons em reprodução quando o componente for desmontado
      stopSound();
      // Remover listeners
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [audioPermissionGranted]);

  const handleSoundPreview = (type: string, volume: number) => {
    // Tentar desbloquear o áudio primeiro
    unlockAudio();
    
    // Parar qualquer som em reprodução
    stopSound();
    
    if (isMuted) {
      toast.warning("O som está mutado. Clique no botão de volume para ativar.");
      return;
    }
    
    setIsPlayingSound(true);
    
    // Tenta reproduzir o som e fornecer feedback
    const success = playSound(type, volume);
    
    setTimeout(() => setIsPlayingSound(false), 1500);
    
    if (!success) {
      if (!audioPermissionGranted) {
        toast.warning(
          "Para permitir reprodução de áudio, interaja com a página primeiro.",
          { duration: 5000 }
        );
      } else {
        toast.error(
          "Não foi possível reproduzir o som. Verifique as configurações do seu navegador.",
          { duration: 5000 }
        );
      }
    } else {
      toast.success("Som de teste reproduzido");
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    stopSound();
    
    if (!isMuted) {
      toast.info("Som desativado");
    } else {
      toast.info("Som ativado");
      // Tenta desbloquear o áudio quando desmutado
      unlockAudio();
    }
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
          
          <div className={`p-4 rounded-md ${audioPermissionGranted ? 'bg-green-50 dark:bg-green-950/30' : 'bg-amber-50 dark:bg-amber-950/30'} mb-4`}>
            <p className={`text-sm ${audioPermissionGranted ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {audioPermissionGranted 
                ? "✓ Som ativado! Você pode testar os sons abaixo." 
                : "⚠️ Sons bloqueados pelo navegador. Clique em qualquer lugar da página para ativar."}
            </p>
          </div>
          
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
                  <div className="flex gap-2 items-center">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={toggleMute}
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
          
          <div className="pt-2 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSoundPreview(form.getValues("soundType"), form.getValues("soundVolume"))}
              disabled={isMuted || isPlayingSound}
              className="relative"
            >
              {isPlayingSound ? (
                <>Tocando... <span className="animate-ping absolute right-2">🔊</span></>
              ) : (
                <>Testar Som <Play className="h-3 w-3 ml-2" /></>
              )}
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
