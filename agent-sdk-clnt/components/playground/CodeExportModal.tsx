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
import { Copy, Check, Code2, Terminal } from "lucide-react";
import { TaskMetadata } from "@/services/playground.service";

interface CodeExportModalProps {
  task: TaskMetadata;
  formState: Record<string, any>;
  isOpen: boolean;
  onClose: () => void;
}

export default function CodeExportModal({
  task,
  formState,
  isOpen,
  onClose,
}: CodeExportModalProps) {
  const [lang, setLang] = useState<"python" | "javascript" | "curl">("python");
  const [copied, setCopied] = useState(false);

  const cleanInputs = { ...formState };

  const generatePythonCode = () => {
    return `from deploygent import Agent

# Initialize DeployGent SDK
agent = Agent(name="${task.displayName}")

# Execute task with active playground parameters
result = agent.run(
    task_name="${task.name}",
    inputs=${JSON.stringify(cleanInputs, null, 4)}
)

print(result)`;
  };

  const generateJsCode = () => {
    return `import { DeployGent } from "@deploygent/sdk";

const client = new DeployGent({
  apiKey: process.env.DEPLOYGENT_API_KEY,
});

async function main() {
  const result = await client.tasks.run("${task.name}", {
    inputs: ${JSON.stringify(cleanInputs, null, 4)}
  });

  console.log(result);
}

main();`;
  };

  const generateCurlCode = () => {
    return `curl -X POST "https://api.deploygent.com/v1/tasks/run" \\
  -H "Authorization: Bearer $DEPLOYGENT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(
    {
      taskName: task.name,
      inputs: cleanInputs,
    },
    null,
    2
  )}'`;
  };

  const activeSnippet =
    lang === "python"
      ? generatePythonCode()
      : lang === "javascript"
      ? generateJsCode()
      : generateCurlCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>Export Code Snippet</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 mt-1">
            Copy production-ready code snippets with your configured parameters for task <code>{task.name}</code>.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Language Selector Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs">
              <button
                onClick={() => setLang("python")}
                className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                  lang === "python"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                Python SDK
              </button>
              <button
                onClick={() => setLang("javascript")}
                className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                  lang === "javascript"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                TypeScript / JS
              </button>
              <button
                onClick={() => setLang("curl")}
                className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                  lang === "curl"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                cURL
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </Button>
          </div>

          {/* Code Block */}
          <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-950 rounded-xl overflow-x-auto text-xs font-mono text-zinc-200 leading-relaxed max-h-[360px]">
            <pre>{activeSnippet}</pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
