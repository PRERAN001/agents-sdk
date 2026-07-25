"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Copy, Check, RefreshCw, Lock } from "lucide-react";
import { toast } from "sonner";

interface TokenSettingsProps {
  settings: any;
}

export default function TokenSettings({ settings }: TokenSettingsProps) {
  const [apiToken, setApiToken] = useState(settings?.apiToken || "dgt_live_9f82a1b4c6e8d0f2a4b6c8d0e2");
  const [webhookSecret, setWebhookSecret] = useState(settings?.webhookSecret || "whsec_8f92a1b4c6e8d0f2a4b6");
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedWh, setCopiedWh] = useState(false);

  const copyToken = () => {
    navigator.clipboard.writeText(apiToken);
    setCopiedToken(true);
    toast.success("DeployGent API Token copied to clipboard");
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const copyWebhookSecret = () => {
    navigator.clipboard.writeText(webhookSecret);
    setCopiedWh(true);
    toast.success("Webhook Signing Secret copied to clipboard");
    setTimeout(() => setCopiedWh(false), 2000);
  };

  const regenerateToken = () => {
    const newToken = `dgt_live_${Math.random().toString(36).substring(2, 18)}`;
    setApiToken(newToken);
    toast.success("New API Access Token generated");
  };

  return (
    <div className="space-y-6">
      {/* API Access Tokens */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-500" />
          <span>API & SDK Tokens</span>
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            DeployGent Production Access Token
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="password"
              value={apiToken}
              readOnly
              className="font-mono text-xs bg-zinc-100 dark:bg-zinc-950 flex-1"
            />
            <Button variant="outline" size="sm" onClick={copyToken} className="h-9 gap-1 font-mono text-xs">
              {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedToken ? "Copied" : "Copy"}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={regenerateToken} className="h-9 gap-1 font-mono text-xs text-indigo-500">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </Button>
          </div>
          <p className="text-[11px] text-zinc-500">
            Use this token to authenticate SDK agents when using <code className="font-mono text-indigo-400">deploygent.Agent()</code>.
          </p>
        </div>

        {/* Webhook Secret */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>GitHub Webhook HMAC SHA-256 Signing Secret</span>
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="password"
              value={webhookSecret}
              readOnly
              className="font-mono text-xs bg-zinc-100 dark:bg-zinc-950 flex-1"
            />
            <Button variant="outline" size="sm" onClick={copyWebhookSecret} className="h-9 gap-1 font-mono text-xs">
              {copiedWh ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWh ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
