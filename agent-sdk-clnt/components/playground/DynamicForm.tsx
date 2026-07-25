"use client";

import { useEffect } from "react";
import { InputMetadata } from "@/services/playground.service";
import InputField from "./InputField";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DynamicFormProps {
  inputs: InputMetadata[];
  formState: Record<string, any>;
  onFormChange: (name: string, value: any) => void;
  onReset: () => void;
}

export default function DynamicForm({
  inputs,
  formState,
  onFormChange,
  onReset,
}: DynamicFormProps) {
  // Initialize default values if not set
  useEffect(() => {
    inputs.forEach((input) => {
      if (formState[input.name] === undefined && input.default !== undefined) {
        onFormChange(input.name, input.default);
      }
    });
  }, [inputs]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
          Task Parameters ({inputs.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 h-7 gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset Defaults
        </Button>
      </div>

      <div className="space-y-4">
        {inputs.map((input) => (
          <InputField
            key={input.name}
            input={input}
            value={formState[input.name]}
            onChange={(val) => onFormChange(input.name, val)}
          />
        ))}
      </div>
    </div>
  );
}
