
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { InfoIcon, Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

type FormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchMode: () => void;
  onLoginSuccess?: () => void;
}

const LoginForm = ({ onSwitchMode }: LoginFormProps) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showApprovalInfo, setShowApprovalInfo] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        // Verifica primeiro se o usuário existe e está ativo usando a função RPC
        const { data: isActive, error: checkError } = await supabase
          .rpc('check_user_active', { email: values.email }) as any;
          
        if (checkError) {
          console.error("Erro ao verificar status do usuário:", checkError);
          setErrorMessage("Erro ao verificar status da conta");
          return;
        }
        
        // Se não tiver dados ou o usuário não estiver ativo
        if (!isActive) {
          // Verifica se o usuário existe na tabela login
          const { data, error } = await supabase
            .from('login')
            .select('ativo')
            .eq('usuario', values.email)
            .single();
          
          if (error && error.code === 'PGRST116') {
            // PGRST116 significa que não encontrou nenhum registro
            setErrorMessage("Este usuário não está registrado. Por favor, crie uma conta primeiro.");
          } else {
            // Usuário existe mas não está ativo
            setErrorMessage("Sua conta está aguardando aprovação do administrador.");
            setShowApprovalInfo(true);
          }
          return;
        }
        
        // Se chegou aqui, o usuário existe e está ativo, então tenta fazer login
        await login(values.email, values.password);
      } catch (error) {
        console.error("Erro durante o login:", error);
        setErrorMessage("Credenciais inválidas. Verifique seu email e senha.");
      }
    } catch (error) {
      console.error("Erro:", error);
      setErrorMessage("Ocorreu um erro no processo de autenticação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showApprovalInfo && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <InfoIcon className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Aguardando aprovação</AlertTitle>
          <AlertDescription className="text-green-600">
            Sua conta foi criada e está aguardando aprovação do administrador. Você receberá uma notificação quando sua conta for aprovada.
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className="mb-4 bg-red-50 border-red-200">
          <InfoIcon className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-700">Erro</AlertTitle>
          <AlertDescription className="text-red-600">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="seu.email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center">
        <Button 
          variant="link" 
          onClick={onSwitchMode} 
          className="p-0"
        >
          Não tem uma conta? Cadastre-se
        </Button>
      </div>
    </>
  );
};

export default LoginForm;
