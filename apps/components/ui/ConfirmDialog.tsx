"use client";

import Modal from "./Modal";
import Button from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" renders confirm button in red/error style */
  variant?: "default" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation dialog built on top of Modal.
 * Use before irreversible actions (forfeit game, withdraw, etc.)
 *
 * @example
 * <ConfirmDialog
 *   open={showConfirm}
 *   title="Forfeit this duel?"
 *   description="You'll lose your stake. This can't be undone."
 *   variant="danger"
 *   confirmLabel="Forfeit"
 *   onConfirm={handleForfeit}
 *   onCancel={() => setShowConfirm(false)}
 * />
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="flex flex-col gap-5">
        <p className="text-text-secondary font-sans text-sm leading-relaxed">{description}</p>

        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "outline" : "primary"}
            size="sm"
            loading={loading}
            onClick={onConfirm}
            className={variant === "danger" ? "!border-error !text-error hover:!bg-error/10" : ""}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
