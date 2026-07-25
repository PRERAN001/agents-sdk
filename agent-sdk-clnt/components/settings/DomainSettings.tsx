"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, ShieldCheck, ExternalLink, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DomainSettingsProps {
  settings: any;
  onUpdate: (updated: any) => Promise<void>;
}

export default function DomainSettings({ settings, onUpdate }: DomainSettingsProps) {
  const [customDomain, setCustomDomain] = useState(settings?.customDomain || "agent.deploygent.dev");
  const [healthEndpoint, setHealthEndpoint] = useState(settings?.healthEndpoint || "/health");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({
        ...settings,
        customDomain,
        healthEndpoint,
      });
      toast.success("Domain settings saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save domain settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Production Domain */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-500" />
          <span>Domains & Networking</span>
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            System Assigned Production Domain
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={settings?.productionUrl || "https://deploygent-agent-core.deploygent.app"}
              disabled
              className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex-1"
            />
            <a
              href={settings?.productionUrl || "https://deploygent-agent-core.deploygent.app"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Custom Domain (CNAME)
          </label>
          <Input
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="api.yourdomain.com"
            className="font-mono text-xs"
          />
          <p className="text-[11px] text-zinc-500">
            Set a CNAME DNS record pointing <code className="font-mono text-indigo-400">{customDomain}</code> to <code className="font-mono text-indigo-400">cname.deploygent.net</code>.
          </p>
        </div>

        <div className="flex items-center justify-between p-3 border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg text-xs">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>SSL Certificate: Active (TLS 1.3 / Let's Encrypt)</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-600">AUTO-RENEWS IN 82 DAYS</span>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Health Check Probe Endpoint
          </label>
          <Input
            value={healthEndpoint}
            onChange={(e) => setHealthEndpoint(e.target.value)}
            className="font-mono text-xs"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 font-semibold">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Domain Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
