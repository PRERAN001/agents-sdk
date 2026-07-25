"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Lock,
  History,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddSecretModal from "./AddSecretModal";
import RotateSecretModal from "./RotateSecretModal";
import SecretAuditDrawer from "./SecretAuditDrawer";
import { toast } from "sonner";

interface SecretItem {
  _id: string;
  key: string;
  maskedValue: string;
  environment: "production" | "preview" | "development";
  category: string;
  lastRotatedAt: string;
  rotationCount: number;
}

export default function SecretTable() {
  const [secrets, setSecrets] = useState<SecretItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [environmentTab, setEnvironmentTab] = useState("all");

  // State for unmasked values map { [id]: unmaskedString }
  const [unmaskedMap, setUnmaskedMap] = useState<Record<string, string>>({});
  const [unmaskingId, setUnmaskingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [rotateTarget, setRotateTarget] = useState<{ id: string; key: string } | null>(null);
  const [auditTargetKey, setAuditTargetKey] = useState<string | undefined>(undefined);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  const fetchSecrets = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        environment: environmentTab,
        search,
      });
      const res = await fetch(`/api/secrets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSecrets(data.secrets || []);
      }
    } catch (err) {
      toast.error("Failed to load secrets");
    } finally {
      setLoading(false);
    }
  }, [environmentTab, search]);

  useEffect(() => {
    fetchSecrets();
  }, [fetchSecrets]);

  const handleToggleUnmask = async (id: string) => {
    if (unmaskedMap[id]) {
      // Hide
      const updated = { ...unmaskedMap };
      delete updated[id];
      setUnmaskedMap(updated);
      return;
    }

    setUnmaskingId(id);
    try {
      const res = await fetch(`/api/secrets/${id}`);
      if (!res.ok) throw new Error("Failed to unmask secret");
      const data = await res.json();
      setUnmaskedMap((prev) => ({ ...prev, [id]: data.value }));
      toast.success("Secret unmasked (event logged in audit trail)");
    } catch (err: any) {
      toast.error(err.message || "Failed to unmask secret");
    } finally {
      setUnmaskingId(null);
    }
  };

  const handleCopy = async (id: string, maskedValue: string) => {
    let textToCopy = unmaskedMap[id];

    if (!textToCopy) {
      try {
        const res = await fetch(`/api/secrets/${id}`);
        if (res.ok) {
          const data = await res.json();
          textToCopy = data.value;
        }
      } catch (e) {
        // Fallback
      }
    }

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      toast.success("Decrypted secret copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDelete = async (id: string, key: string) => {
    if (!confirm(`Are you sure you want to delete secret '${key}'?`)) return;

    try {
      const res = await fetch(`/api/secrets/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(`Secret '${key}' deleted`);
        fetchSecrets();
      }
    } catch (err) {
      toast.error("Failed to delete secret");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Tabs & Add CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Environment Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg text-xs w-full sm:w-auto">
          {["all", "production", "preview", "development"].map((tab) => (
            <button
              key={tab}
              onClick={() => setEnvironmentTab(tab)}
              className={`px-3 py-1 font-medium capitalize rounded-md transition-all ${
                environmentTab === tab
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Add Secret */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Filter by key name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="h-9 gap-1.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Secret</span>
          </Button>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="py-20 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400 mb-3" />
          <p className="text-sm text-zinc-500">Fetching encrypted secrets...</p>
        </div>
      ) : secrets.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-8 space-y-3">
          <Lock className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
            No secrets found
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            Add environment variables to encrypt and inject into your agent runtimes.
          </p>
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-500 uppercase tracking-wider font-semibold font-mono">
                  <th className="py-3 px-4">Key Name</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Environment</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {secrets.map((sec) => (
                  <tr key={sec._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    {/* Key */}
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {sec.key}
                    </td>

                    {/* Value */}
                    <td className="py-3.5 px-4 font-mono text-zinc-500 dark:text-zinc-400">
                      {unmaskedMap[sec._id] ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {unmaskedMap[sec._id]}
                        </span>
                      ) : (
                        <span>{sec.maskedValue}</span>
                      )}
                    </td>

                    {/* Environment */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase font-mono ${
                          sec.environment === "production"
                            ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-900"
                            : sec.environment === "preview"
                            ? "bg-purple-50 dark:bg-purple-950 text-purple-600 border border-purple-200 dark:border-purple-900"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600"
                        }`}
                      >
                        {sec.environment}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 font-medium">
                      {sec.category}
                    </td>

                    {/* Version / Rotation Count */}
                    <td className="py-3.5 px-4 font-mono text-zinc-500">
                      v{sec.rotationCount}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Eye Unmask Toggle */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleUnmask(sec._id)}
                          className="h-7 w-7 p-0"
                          title={unmaskedMap[sec._id] ? "Mask value" : "Reveal decrypted value"}
                        >
                          {unmaskingId === sec._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                          ) : unmaskedMap[sec._id] ? (
                            <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <Eye className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-900" />
                          )}
                        </Button>

                        {/* Copy Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(sec._id, sec.maskedValue)}
                          className="h-7 w-7 p-0"
                          title="Copy decrypted secret to clipboard"
                        >
                          {copiedId === sec._id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-900" />
                          )}
                        </Button>

                        {/* Rotate Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRotateTarget({ id: sec._id, key: sec.key })}
                          className="h-7 w-7 p-0"
                          title="Rotate secret value"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
                        </Button>

                        {/* Audit Trail Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAuditTargetKey(sec.key);
                            setIsAuditOpen(true);
                          }}
                          className="h-7 w-7 p-0"
                          title="View secret audit history"
                        >
                          <History className="w-3.5 h-3.5 text-purple-500" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(sec._id, sec.key)}
                          className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                          title="Delete secret"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Secret Modal */}
      <AddSecretModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchSecrets}
      />

      {/* Rotate Secret Modal */}
      <RotateSecretModal
        secretKey={rotateTarget?.key || ""}
        secretId={rotateTarget?.id || null}
        isOpen={!!rotateTarget}
        onClose={() => setRotateTarget(null)}
        onSuccess={fetchSecrets}
      />

      {/* Secret Audit Trail Drawer */}
      <SecretAuditDrawer
        secretKey={auditTargetKey}
        isOpen={isAuditOpen}
        onClose={() => {
          setIsAuditOpen(false);
          setAuditTargetKey(undefined);
        }}
      />
    </div>
  );
}
