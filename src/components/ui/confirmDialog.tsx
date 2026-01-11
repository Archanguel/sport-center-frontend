import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Button } from "./button"
import { cn } from "../../lib/utils"

type ConfirmDialogProps = {
  open: boolean
  title: string
  description?: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={v => !v && onCancel()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out"
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 left-1/2 top-1/2 w-[320px]",
            "-translate-x-1/2 -translate-y-1/2",
            "rounded-md bg-card p-4 shadow-lg",
            "text-foreground"
          )}
        >
          <DialogPrimitive.Title className="font-bold mb-2">
            {title}
          </DialogPrimitive.Title>

          {description && (
            <DialogPrimitive.Description className="mb-4 text-sm text-muted-foreground">
              {description}
            </DialogPrimitive.Description>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onCancel}>
              {cancelText}
            </Button>
            <Button onClick={onConfirm}>{confirmText}</Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
