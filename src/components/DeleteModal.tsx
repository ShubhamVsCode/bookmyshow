import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ModalProps {
  title: string;
  description?: string;
  buttonText?: string;
  open: boolean;
  onConfirm: () => void;
  close: () => void;
}

export function DeleteModal({
  title,
  description,
  buttonText,
  open,
  onConfirm,
  close,
}: ModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid"></div>
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>

          <Button variant="destructive" type="submit" onClick={onConfirm}>
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
