"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RotateSecretModalProps {
  secretKey: string;
  secretId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RotateSecretModal({
  secretKey,
  secretId,
  isOpen,
  onClose,
  onSuccess,
}: RotateSecretModalProps) {
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);

  if (!secretId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) {
      toast.error("New secret value is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/secrets/${secretId}/rotate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newValue: newValue.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to rotate secret");
      }

      toast.success(`Secret '${secretKey}' rotated successfully`);
      setNewValue("");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to rotate secret");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-500" />
            <span>Rotate Secret: {secretKey}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            Rotating this secret will re-encrypt the new value and increment the rotation version counter.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              New Secret Value
            </label>
            <Input
              type="password"
              placeholder="Paste new rotated secret value..."
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="font-mono text-xs"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={loading || !newValue.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Rotation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
