"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Download,
  Copy,
  Check,
  Star,
  Bot,
  Wrench,
  Code2,
  Rocket,
} from "lucide-react";
import { IMarketplaceAgent } from "@/models/marketplaceAgent";
import { toast } from "sonner";

interface AgentDetailModalProps {
  agent: IMarketplaceAgent | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentDetailModal({
  agent,
  isOpen,
  onClose,
}: AgentDetailModalProps) {
  const [copiedCli, setCopiedCli] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!agent) return null;

  const copyCliCommand = () => {
    navigator.clipboard.writeText(agent.cliCommand);
    setCopiedCli(true);
    toast.success("CLI clone command copied to clipboard!");
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleDownloadLocalTemplate = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/marketplace/${agent.slug}/download`);
      if (!res.ok) throw new Error("Failed to fetch template payload");

      const data = await res.json();

      // Combine template files into downloadable README / text archive file
      const zipContent = `# ${agent.name} Local Machine Template\n\n` +
        `## CLI Clone Command:\n\`\`\`bash\n${data.cliCommand}\n\`\`\`\n\n` +
        `### File: agent.py\n\`\`\`python\n${data.files["agent.py"]}\n\`\`\`\n\n` +
        `### File: pyproject.toml\n\`\`\`toml\n${data.files["pyproject.toml"]}\n\`\`\`\n\n` +
        `### File: .env.example\n\`\`\`bash\n${data.files[".env.example"]}\n\`\`\`\n`;

      const blob = new Blob([zipContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${agent.slug}-template.txt`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Template archive '${agent.slug}' downloaded for local machine setup`);
    } catch (err: any) {
      toast.error(err.message || "Failed to download template");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 mb-2">
                <Bot className="w-3.5 h-3.5" />
                <span>{agent.category}</span>
              </span>
              <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {agent.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-1">
                Authored by {agent.author} • Version {agent.version}
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span>{agent.stars}</span>
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
          {/* Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Overview
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {agent.description}
            </p>
          </div>

          {/* Local Machine Clone CLI Command */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-500" />
              <span>Clone to Local Machine</span>
            </h4>
            <div className="flex items-center justify-between p-3 border border-zinc-800 bg-zinc-950 rounded-xl text-xs font-mono text-emerald-400">
              <span>{agent.cliCommand}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCliCommand}
                className="h-7 text-xs font-mono gap-1 text-zinc-400 hover:text-white"
              >
                {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCli ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>

          {/* System Prompt */}
          {agent.systemPrompt && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-purple-500" />
                <span>System Prompt</span>
              </h4>
              <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-xs font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {agent.systemPrompt}
              </div>
            </div>
          )}

          {/* Required Tools */}
          {agent.requiredTools && agent.requiredTools.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-500" />
                <span>Required SDK Tools & Integrations</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {agent.requiredTools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadLocalTemplate}
            disabled={downloading}
            className="gap-1.5 text-xs"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Download Local Template ZIP</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              toast.success(`Deploying '${agent.name}' directly to project workspace...`);
              onClose();
            }}
            className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 gap-1.5 font-semibold"
          >
            <Rocket className="w-4 h-4" />
            <span>Deploy to DeployGent</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
