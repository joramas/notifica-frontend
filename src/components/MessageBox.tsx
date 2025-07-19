import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MessageBoxProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: string;
  question?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function MessageBox({
  open,
  setOpen,
  title,
  description,
  question,
  onConfirm,
  onCancel,
  confirmLabel = "OK",
  cancelLabel,
  loading = false,
}: MessageBoxProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {question && (
          <p className="text-sm text-muted-foreground mt-2">{question}</p>
        )}
        <DialogFooter className="mt-4 flex justify-end gap-2">
          {cancelLabel && (
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                onCancel?.();
              }}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
            disabled={loading}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
