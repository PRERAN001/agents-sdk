"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { History, ShieldCheck, Loader2 } from "lucide-react";

interface AuditLogItem {
  _id: string;
  secretKey: string;
  action: "CREATED" | "REVEALED" | "ROTATED" | "UPDATED" | "DELETED";
  user: string;
  environment: string;
  details?: string;
  createdAt: string;
}

interface SecretAuditDrawerProps {
  secretKey?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SecretAuditDrawer({
  secretKey,
  isOpen,
  onClose,
}: SecretAuditDrawerProps) {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const url = secretKey
          ? `/api/secrets/audit?key=${encodeURIComponent(secretKey)}`
          : "/api/secrets/audit";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setLogs(data.auditLogs || []);
        }
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [isOpen, secretKey]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            <span>Audit Trail {secretKey ? `for ${secretKey}` : "History"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            Immutable log of secret access, unmasking, rotation, and mutation events.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 max-h-[420px] overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-12 text-center text-zinc-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-xs">Loading audit logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs font-mono">
              No audit logs recorded yet.
            </div>
          ) : (
            logs.map((item) => (
              <div
                key={item._id}
                className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        item.action === "CREATED"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : item.action === "REVEALED"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : item.action === "ROTATED"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      }`}
                    >
                      {item.action}
                    </span>
                    <span>{item.secretKey}</span>
                  </div>
                  {item.details && (
                    <p className="text-zinc-500 text-[11px]">{item.details}</p>
                  )}
                </div>

                <div className="text-right text-[11px] text-zinc-400 font-mono flex-shrink-0">
                  <p>{item.user}</p>
                  <p>{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
