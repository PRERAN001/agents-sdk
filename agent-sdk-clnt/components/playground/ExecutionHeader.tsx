"use client";

import { TaskMetadata } from "@/services/playground.service";
import { Sparkles, Code2, Trash2, Sliders, Play } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface ExecutionHeaderProps {
  tasks: TaskMetadata[];
  selectedTask: TaskMetadata;
  onSelectTask: (task: TaskMetadata) => void;
  streamMode: boolean;
  onStreamModeChange: (stream: boolean) => void;
  onClearOutput: () => void;
  onExportCode: () => void;
}

export default function ExecutionHeader({
  tasks,
  selectedTask,
  onSelectTask,
  streamMode,
  onStreamModeChange,
  onClearOutput,
  onExportCode,
}: ExecutionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      {/* Left: Task Selector */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500 text-white rounded-lg shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Active SDK Task
          </label>
          <select
            value={selectedTask.name}
            onChange={(e) => {
              const found = tasks.find((t) => t.name === e.target.value);
              if (found) onSelectTask(found);
            }}
            className="bg-transparent text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer p-0 border-none pr-4"
          >
            {tasks.map((t) => (
              <option key={t.name} value={t.name} className="bg-white dark:bg-zinc-900">
                {t.displayName} ({t.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Stream Toggle */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs">
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">Streaming</span>
          <Switch checked={streamMode} onCheckedChange={onStreamModeChange} />
        </div>

        {/* Clear Output */}
        <Button
          variant="outline"
          size="sm"
          onClick={onClearOutput}
          className="text-xs gap-1.5 h-8 text-zinc-600 dark:text-zinc-300"
          title="Clear output"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Clear</span>
        </Button>

        {/* Code Snippet Export */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExportCode}
          className="text-xs gap-1.5 h-8 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
        >
          <Code2 className="w-3.5 h-3.5 text-indigo-500" />
          <span>Export Code</span>
        </Button>
      </div>
    </div>
  );
}
