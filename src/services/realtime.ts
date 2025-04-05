
import { supabase } from "@/integrations/supabase/client";

// Configure channel for realtime updates
// Note: This doesn't enable realtime for the table, but prepares the subscription
export const subscribeToTickets = (callback: () => void) => {
  console.log("Setting up realtime subscription for tickets");
  
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
    .subscribe();
    
  return channel;
};
