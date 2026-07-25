"use client";

import { useState } from "react";
import { InputMetadata } from "@/services/playground.service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Eye,
  EyeOff,
  Upload,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Code2,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
} from "lucide-react";

interface InputFieldProps {
  input: InputMetadata;
  value: any;
  onChange: (val: any) => void;
}

export default function InputField({ input, value, onChange }: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Helper for JSON validation & formatting
  const handleJsonChange = (rawText: string) => {
    onChange(rawText);
    if (!rawText.trim()) {
      setJsonError(null);
      return;
    }
    try {
      JSON.parse(rawText);
      setJsonError(null);
    } catch (e: any) {
      setJsonError("Invalid JSON syntax: " + e.message);
    }
  };

  const handleFormatJson = () => {
    try {
      if (typeof value === "string" && value.trim()) {
        const parsed = JSON.parse(value);
        onChange(JSON.stringify(parsed, null, 2));
        setJsonError(null);
      }
    } catch (e) {
      // Keep as is if invalid
    }
  };

  // Helper for File/Image/Audio/Video uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, mediaType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange({
        name: file.name,
        size: file.size,
        type: file.type,
        url: event.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {/* Label and badges */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
          <span>{input.label}</span>
          {input.required ? (
            <span className="text-[10px] text-red-500 font-bold">*Required</span>
          ) : (
            <span className="text-[10px] text-zinc-400 font-normal">(Optional)</span>
          )}
        </label>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
          {input.type}
        </span>
      </div>

      {input.description && (
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{input.description}</p>
      )}

      {/* Render input control based on type */}
      {(() => {
        switch (input.type) {
          case "text":
            return (
              <Input
                type="text"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={input.placeholder || `Enter ${input.label.toLowerCase()}...`}
                className="bg-white dark:bg-zinc-950 text-xs"
              />
            );

          case "textarea":
            return (
              <div className="space-y-1">
                <Textarea
                  value={value ?? ""}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={input.placeholder || "Enter content..."}
                  rows={4}
                  className="bg-white dark:bg-zinc-950 text-xs font-mono resize-y"
                />
                <div className="text-[10px] text-zinc-400 text-right font-mono">
                  {(value ?? "").length} characters
                </div>
              </div>
            );

          case "number":
            return (
              <Input
                type="number"
                step="any"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder={input.placeholder || "0"}
                className="bg-white dark:bg-zinc-950 text-xs font-mono"
              />
            );

          case "boolean":
            return (
              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                  {value ? "Enabled (True)" : "Disabled (False)"}
                </span>
                <Switch
                  checked={!!value}
                  onCheckedChange={(checked) => onChange(checked)}
                />
              </div>
            );

          case "password":
            return (
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={value ?? ""}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={input.placeholder || "••••••••••••"}
                  className="bg-white dark:bg-zinc-950 text-xs pr-9 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            );

          case "file":
          case "image":
          case "audio":
          case "video": {
            const mediaIcon =
              input.type === "image" ? (
                <ImageIcon className="w-6 h-6 text-indigo-500" />
              ) : input.type === "audio" ? (
                <Music className="w-6 h-6 text-purple-500" />
              ) : input.type === "video" ? (
                <Video className="w-6 h-6 text-rose-500" />
              ) : (
                <FileText className="w-6 h-6 text-blue-500" />
              );

            const hasFile = typeof value === "object" && value?.name;

            return (
              <div className="space-y-2">
                {hasFile ? (
                  <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {input.type === "image" && value.url ? (
                        <img
                          src={value.url}
                          alt="preview"
                          className="w-10 h-10 object-cover rounded-md border"
                        />
                      ) : (
                        mediaIcon
                      )}
                      <div className="min-w-0 text-xs">
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                          {value.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-mono">
                          {(value.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onChange(null)}
                      className="p-1 text-zinc-400 hover:text-red-500 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                    <input
                      type="file"
                      accept={input.accept}
                      onChange={(e) => handleFileUpload(e, input.type)}
                      className="hidden"
                    />
                    <Upload className="w-5 h-5 text-zinc-400 mb-1.5" />
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Upload {input.type.toUpperCase()} file
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">
                      Click to browse or drag & drop file
                    </span>
                  </label>
                )}
              </div>
            );
          }

          case "json":
            return (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                    {jsonError ? (
                      <span className="text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Syntax Error
                      </span>
                    ) : (
                      <span className="text-emerald-500 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Valid JSON
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleFormatJson}
                    className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Format JSON
                  </button>
                </div>

                <Textarea
                  value={value ?? ""}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  placeholder='{\n  "key": "value"\n}'
                  rows={5}
                  className={`bg-white dark:bg-zinc-950 font-mono text-xs ${
                    jsonError ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />

                {jsonError && (
                  <p className="text-[10px] text-red-500 font-mono">{jsonError}</p>
                )}
              </div>
            );

          case "select":
            return (
              <select
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-500 cursor-pointer"
              >
                <option value="">Select option...</option>
                {(input.options || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            );

          case "multiselect": {
            const selectedValues: string[] = Array.isArray(value) ? value : [];

            const toggleOption = (opt: string) => {
              if (selectedValues.includes(opt)) {
                onChange(selectedValues.filter((v) => v !== opt));
              } else {
                onChange([...selectedValues, opt]);
              }
            };

            return (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {(input.options || []).map((opt) => {
                    const isSelected = selectedValues.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleOption(opt)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                          isSelected
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                            : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected ? <X className="w-3 h-3 ml-0.5" /> : <Plus className="w-3 h-3 opacity-60" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          default:
            return (
              <Input
                type="text"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="bg-white dark:bg-zinc-950 text-xs"
              />
            );
        }
      })()}
    </div>
  );
}
