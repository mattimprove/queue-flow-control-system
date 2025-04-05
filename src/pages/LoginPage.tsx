
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

type FormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showApprovalInfo, setShowApprovalInfo] = useState(false);
  const navigate = useNavigate();

  // Se o usuário já estiver autenticado, redirecione para o dashboard
  if (isAuthenticated) {
    navigate("/dashboard");
  }

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
      
      if (isSigningUp) {
        // Criar conta
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });

        if (error) {
          toast.error(error.message || "Erro ao criar conta");
          return;
        }

        if (data) {
          // Tentamos criar o registro na tabela login caso ainda não exista
          const { error: loginError } = await supabase
            .from('login')
            .insert([
              { 
                usuario: values.email,
                senha: 'hash-não-usado', // A senha real é gerenciada pelo Supabase Auth
                ativo: false // Novo usuário começa como inativo
              }
            ])
            .select();
          
          if (loginError && !loginError.message.includes('duplicate')) {
            console.error("Erro ao adicionar usuário à tabela login:", loginError);
          }

          toast.success("Conta criada com sucesso! Aguardando aprovação do administrador.");
          setShowApprovalInfo(true);
          setIsSigningUp(false);
        }
      } else {
        // Login
        await login(values.email, values.password);
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Ocorreu um erro no processo de autenticação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/4c7404d8-ef38-4ae1-b736-66ac06729fc0.png" 
            alt="Sling Logo" 
            className="h-16" 
          />
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isSigningUp ? "Criar Nova Conta" : "Sistema de Fila de Atendimento"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showApprovalInfo && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <InfoIcon className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">Aguardando aprovação</AlertTitle>
                <AlertDescription className="text-green-600">
                  Sua conta foi criada e está aguardando aprovação do administrador. Você receberá uma notificação quando sua conta for aprovada.
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
                  {isLoading 
                    ? (isSigningUp ? "Criando conta..." : "Entrando...") 
                    : (isSigningUp ? "Criar Conta" : "Entrar")}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                onClick={() => {
                  setIsSigningUp(!isSigningUp);
                  setShowApprovalInfo(false);
                }} 
                className="p-0"
              >
                {isSigningUp 
                  ? "Já possui uma conta? Faça login" 
                  : "Não tem uma conta? Cadastre-se"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t text-center text-sm px-6 py-4 flex-col gap-2">
            <p className="text-muted-foreground w-full">Sistema de Gerenciamento de Filas v1.0</p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Produzido pela Sling Soluções de Mercado</span>
              <a href="https://www.slingbr.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <i className="fas fa-globe text-sm"></i>
              </a>
              <a href="https://www.instagram.com/slingbr_" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <i className="fab fa-instagram text-sm"></i>
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
