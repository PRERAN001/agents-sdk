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
import { Key, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddSecretModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddSecretModal({
  isOpen,
  onClose,
  onSuccess,
}: AddSecretModalProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [category, setCategory] = useState("API Key");
  const [loading, setLoading] = useState(false);

  // Validate UPPERCASE_SNAKE_CASE regex
  const isValidKey = /^[A-Z][A-Z0-9_]*$/.test(key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidKey) {
      toast.error("Key must use UPPERCASE_SNAKE_CASE (e.g. AWS_SECRET_ACCESS_KEY)");
      return;
    }

    if (!value.trim()) {
      toast.error("Secret value is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: key.trim(),
          value: value.trim(),
          environment,
          category,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create secret");
      }

      toast.success(`Secret '${key}' created and encrypted`);
      setKey("");
      setValue("");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create secret");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-500" />
            <span>Add Environment Secret</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            Values are encrypted with AES-256-GCM symmetric encryption before storage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Key Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Variable Key
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="e.g. OPENAI_API_KEY"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase().replace(/\s+/g, "_"))}
                className="font-mono text-xs uppercase"
                required
              />
              {key && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValidKey ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-500">
              Must be UPPERCASE_SNAKE_CASE format.
            </p>
          </div>

          {/* Value Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Secret Value
            </label>
            <Input
              type="password"
              placeholder="Paste secret value..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="font-mono text-xs"
              required
            />
          </div>

          {/* Environment Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Target Environment
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs px-2.5 text-zinc-900 dark:text-zinc-100"
              >
                <option value="production">Production</option>
                <option value="preview">Preview</option>
                <option value="development">Development</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs px-2.5 text-zinc-900 dark:text-zinc-100"
              >
                <option value="API Key">API Key</option>
                <option value="Database">Database</option>
                <option value="Auth Provider">Auth Provider</option>
                <option value="Payments">Payments</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={loading || !isValidKey || !value.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Secret"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
