"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GeneralSettingsProps {
  settings: any;
  onUpdate: (updated: any) => Promise<void>;
}

export default function GeneralSettings({ settings, onUpdate }: GeneralSettingsProps) {
  const [name, setName] = useState(settings?.projectName || "deploygent-agent-core");
  const [description, setDescription] = useState(settings?.description || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({
        ...settings,
        projectName: name,
        description,
      });
      toast.success("General settings saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = () => {
    if (confirm(`Are you sure you want to delete project '${name}'? This action cannot be undone.`)) {
      toast.success(`Project '${name}' scheduled for deletion.`);
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="space-y-6">
      {/* General Settings Section */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          General Project Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Project Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Project Slug
            </label>
            <Input
              value={settings?.slug || "deploygent-agent-core"}
              disabled
              className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Description
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Workspace ID
          </label>
          <Input
            value={settings?.workspaceId || "ws_prod_9901a8f"}
            disabled
            className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 font-semibold">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-base font-bold">Danger Zone</h3>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Permanently delete this project, all deployments, runtime containers, and secret configurations. This action cannot be reversed.
        </p>

        <div className="pt-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteProject}
            className="gap-1.5 font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Project</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
