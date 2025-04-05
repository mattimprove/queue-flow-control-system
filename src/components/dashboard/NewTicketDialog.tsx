
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewTicketForm from "@/components/NewTicketForm";

interface NewTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated: () => void;
}

const NewTicketDialog = ({ 
  open, 
  onOpenChange, 
  onTicketCreated 
}: NewTicketDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Chamado</DialogTitle>
        </DialogHeader>
        <NewTicketForm
          onTicketCreated={onTicketCreated}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewTicketDialog;
