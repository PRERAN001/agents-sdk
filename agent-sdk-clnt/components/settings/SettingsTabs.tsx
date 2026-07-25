"use client";

import { useState, useEffect } from "react";
import { Sliders, GitBranch, Globe, Key, Loader2 } from "lucide-react";
import GeneralSettings from "./GeneralSettings";
import GitBuildSettings from "./GitBuildSettings";
import DomainSettings from "./DomainSettings";
import TokenSettings from "./TokenSettings";
import { toast } from "sonner";

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState<"general" | "git" | "domains" | "tokens">("general");
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (e) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async (updated: any) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to update settings");
    }

    setSettings(updated);
  };

  if (loading) {
    return (
      <div className="py-20 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400 mb-3" />
        <p className="text-sm text-zinc-500">Loading Project Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800 pb-px text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "general"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>General</span>
        </button>

        <button
          onClick={() => setActiveTab("git")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "git"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Git & Build</span>
        </button>

        <button
          onClick={() => setActiveTab("domains")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "domains"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Domains & Health</span>
        </button>

        <button
          onClick={() => setActiveTab("tokens")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "tokens"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Tokens & Secrets</span>
        </button>
      </div>

      {/* Active Tab Panel */}
      {activeTab === "general" && <GeneralSettings settings={settings} onUpdate={handleUpdate} />}
      {activeTab === "git" && <GitBuildSettings settings={settings} onUpdate={handleUpdate} />}
      {activeTab === "domains" && <DomainSettings settings={settings} onUpdate={handleUpdate} />}
      {activeTab === "tokens" && <TokenSettings settings={settings} />}
    </div>
  );
}
