
import { supabase } from "@/integrations/supabase/client";

// Configure channel for realtime updates
export const subscribeToTickets = (callback: () => void) => {
  console.log("Setting up realtime subscription for tickets");
  
  // Primeiro, habilitar o recurso de realtime para a tabela tickets
  // Este canal irá rastrear todas as mudanças na tabela tickets (inserções, atualizações e remoções)
  const channel = supabase
    .channel('public:tickets')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'tickets' 
      }, 
      (payload) => {
        console.log('Novo ticket detectado!', payload);
        callback();
      }
    )
    .on('postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'tickets'
      },
      (payload) => {
        console.log('Ticket atualizado!', payload);
        callback();
      }
    )
    .on('postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'tickets'
      },
      (payload) => {
        console.log('Ticket removido!', payload);
        callback();
      }
    )
    .subscribe();
    
  // Retornar o canal para que possa ser limpo quando necessário
  return channel;
};
