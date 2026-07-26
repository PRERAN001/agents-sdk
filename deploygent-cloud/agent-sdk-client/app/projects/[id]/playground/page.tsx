"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Play,
  CheckCircle2,
  FileText,
  ImageIcon,
  Hash,
  ToggleLeft,
  Upload,
  List,
  Code2,
  ArrowLeft,
  Sparkles,
  Lock,
  Mail,
  Link2,
  Calendar,
  Clock,
  CalendarClock,
  Music,
  Video,
  Braces,
  Download,
  Search,
  Table as TableIcon,
  FileArchive,
  FileSpreadsheet,
  FileType,
  File as FileIcon,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckSquare,
  Square,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL!;

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type InputType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "password"
  | "email"
  | "url"
  | "date"
  | "time"
  | "datetime"
  | "file"
  | "image"
  | "audio"
  | "video"
  | "select"
  | "multiselect"
  | "json";

interface TaskInput {
  name: string;
  type: InputType;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  default?: any;
  disabled?: boolean;
  hidden?: boolean;
  // type-specific
  rows?: number;
  min?: number | string;
  max?: number | string;
  step?: number;
  accept?: string[];
  multiple?: boolean;
  max_size?: number;
  options?: string[];
  searchable?: boolean;
  schema?: any;
}

type OutputType =
  | "text"
  | "markdown"
  | "json"
  | "image"
  | "file"
  | "audio"
  | "video"
  | "html"
  | "table"
  | "pdf"
  | "csv"
  | "zip"
  | "success"
  | "error";

interface TaskOutput {
  type: OutputType;
  title?: string;
  description?: string;
  downloadable?: boolean;
  preview?: boolean;
  data?: any;
  message?: string;
  // type-specific
  pretty?: boolean;
  collapsible?: boolean;
  format?: string;
  extension?: string;
  sortable?: boolean;
  searchable?: boolean;
  pagination?: boolean;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function labelFor(input: TaskInput) {
  return input.label || input.name;
}

function iconForInput(type: InputType) {
  switch (type) {
    case "text":
      return FileText;
    case "textarea":
      return FileText;
    case "number":
      return Hash;
    case "password":
      return Lock;
    case "email":
      return Mail;
    case "url":
      return Link2;
    case "date":
      return Calendar;
    case "time":
      return Clock;
    case "datetime":
      return CalendarClock;
    case "file":
      return Upload;
    case "image":
      return ImageIcon;
    case "audio":
      return Music;
    case "video":
      return Video;
    case "select":
    case "multiselect":
      return List;
    case "json":
      return Braces;
    default:
      return FileText;
  }
}

function iconForOutput(type: OutputType) {
  switch (type) {
    case "image":
      return ImageIcon;
    case "audio":
      return Music;
    case "video":
      return Video;
    case "table":
      return TableIcon;
    case "zip":
      return FileArchive;
    case "csv":
      return FileSpreadsheet;
    case "pdf":
      return FileType;
    case "file":
      return FileIcon;
    case "json":
      return Braces;
    case "success":
      return CheckCircle2;
    case "error":
      return AlertCircle;
    default:
      return Code2;
  }
}

function baseInputClass(disabled?: boolean) {
  return `h-12 w-full rounded-lg border border-zinc-300 bg-zinc-50/50 pl-11 pr-4 font-mono text-sm text-zinc-950 placeholder-zinc-400 outline-none transition focus:border-zinc-950 focus:bg-white ${
    disabled ? "cursor-not-allowed opacity-50" : ""
  }`;
}

function downloadHref(data: any): string | null {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (data.url) return data.url;
  if (data.base64) return data.base64;
  return null;
}

/* ------------------------------------------------------------------ */
/* Tag Input (fallback for select/multiselect with no options)         */
/* ------------------------------------------------------------------ */

function TagInput({
  value,
  onChange,
  disabled,
  placeholder,
}: {
  value: string[];
  onChange: (val: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (!value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft("");
  }

  return (
    <div>
      <div
        className={`flex min-h-12 w-full flex-wrap items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50/50 p-2.5 transition focus-within:border-zinc-950 focus-within:bg-white ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 rounded-md bg-zinc-950 px-2.5 py-1 font-mono text-xs text-white"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                className="text-zinc-400 hover:text-white"
              >
                ×
              </button>
            )}
          </span>
        ))}
        <input
          type="text"
          disabled={disabled}
          value={draft}
          placeholder={value.length === 0 ? placeholder : "Add another..."}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={commit}
          className="min-w-[120px] flex-1 bg-transparent font-mono text-sm text-zinc-950 placeholder-zinc-400 outline-none"
        />
      </div>
      <p className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-amber-600">
        <AlertCircle size={12} />
        No options provided for this field — press Enter to add tags.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Input Field Component                                               */
/* ------------------------------------------------------------------ */

function InputField({
  input,
  value,
  onChange,
}: {
  input: TaskInput;
  value: any;
  onChange: (val: any) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState(
    value !== undefined ? JSON.stringify(value, null, 2) : ""
  );

  if (input.hidden) return null;

  const Icon = iconForInput(input.type);
  const disabled = !!input.disabled;

  const filteredOptions =
    input.type === "select" || input.type === "multiselect"
      ? (input.options || []).filter((o) =>
          o.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="block font-mono text-xs font-bold uppercase tracking-wider text-zinc-600">
          {labelFor(input)}
          {input.required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      </div>

      {input.description && (
        <p className="mb-2 text-xs text-zinc-500">{input.description}</p>
      )}

      {/* TEXT */}
      {input.type === "text" && (
        <div className="relative">
          <Icon className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
          <input
            type="text"
            disabled={disabled}
            placeholder={input.placeholder}
            defaultValue={input.default ?? ""}
            className={baseInputClass(disabled)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {/* TEXTAREA */}
      {input.type === "textarea" && (
        <textarea
          rows={input.rows || 5}
          disabled={disabled}
          placeholder={input.placeholder}
          defaultValue={input.default ?? ""}
          className={`w-full rounded-lg border border-zinc-300 bg-zinc-50/50 p-4 font-mono text-sm text-zinc-950 placeholder-zinc-400 outline-none transition focus:border-zinc-950 focus:bg-white ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          }`}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {/* NUMBER */}
      {input.type === "number" && (
        <div className="relative">
          <Icon className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
          <input
            type="number"
            disabled={disabled}
            placeholder={input.placeholder}
            defaultValue={input.default ?? ""}
            min={input.min}
            max={input.max}
            step={input.step ?? 1}
            className={baseInputClass(disabled)}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
      )}

      {/* BOOLEAN */}
      {input.type === "boolean" && (
        <label
          className={`flex h-12 items-center gap-3 rounded-lg border border-zinc-300 bg-zinc-50/50 px-4 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-800 ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          <ToggleLeft size={20} className="text-zinc-600" />
          <span className="flex-1">Toggle Option</span>
          <input
            type="checkbox"
            disabled={disabled}
            defaultChecked={!!input.default}
            className="h-4 w-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 cursor-pointer"
            onChange={(e) => onChange(e.target.checked)}
          />
        </label>
      )}

      {/* PASSWORD */}
      {input.type === "password" && (
        <div className="relative">
          <Icon className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
          <input
            type="password"
            disabled={disabled}
            placeholder={input.placeholder}
            defaultValue={input.default ?? ""}
            className={baseInputClass(disabled)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {/* EMAIL */}
      {input.type === "email" && (
        <div className="relative">
          <Icon className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
          <input
            type="email"
            disabled={disabled}
            placeholder={input.placeholder}
            defaultValue={input.default ?? ""}
            className={baseInputClass(disabled)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {/* URL */}
      {input.type === "url" && (
        <div className="relative">
          <Icon className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
          <input
            type="url"
            disabled={disabled}
            placeholder={input.placeholder}
            defaultValue={input.default ?? ""}
            className={baseInputClass(disabled)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {/* DATE */}
      {input.type === "date" && (
        <div className="relative">
          <Icon className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
          <input
            type="date"
            disabled={disabled}
            defaultValue={input.default ?? ""}
            min={input.min as string}
            max={input.max as string}
            className={baseInputClass(disabled)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {/* TIME */}
      {input.type === "time" && (
        <div className="relative">
          <Icon className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
          <input
            type="time"
            disabled={disabled}
            defaultValue={input.default ?? ""}
            className={baseInputClass(disabled)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {/* DATETIME */}
      {input.type === "datetime" && (
        <div className="relative">
          <Icon className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
          <input
            type="datetime-local"
            disabled={disabled}
            defaultValue={input.default ?? ""}
            className={baseInputClass(disabled)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {/* FILE / IMAGE / AUDIO / VIDEO */}
      {(input.type === "file" ||
        input.type === "image" ||
        input.type === "audio" ||
        input.type === "video") && (
        <label
          className={`flex h-36 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 transition ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:border-zinc-950 hover:bg-zinc-50"
          }`}
        >
          <Icon size={32} className="text-zinc-400" />
          <span className="mt-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-600">
            Upload {input.type}
            {input.multiple ? "s" : ""}
          </span>
          {value && (
            <span className="mt-1 max-w-[80%] truncate font-mono text-[11px] text-zinc-500">
              {input.multiple
                ? `${(value as FileList).length ?? value.length} file(s) selected`
                : value?.name}
            </span>
          )}
          <input
            type="file"
            className="hidden"
            disabled={disabled}
            multiple={!!input.multiple}
            accept={input.accept?.join(",")}
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              if (input.multiple) {
                onChange(Array.from(files));
              } else {
                onChange(files[0]);
              }
            }}
          />
        </label>
      )}

      {/* SELECT */}
      {input.type === "select" && (
        <>
          {input.options && input.options.length > 0 ? (
            <div>
              {input.searchable && (
                <div className="relative mb-2">
                  <Search className="absolute left-3.5 top-3.5 text-zinc-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 w-full rounded-lg border border-zinc-300 bg-zinc-50/50 pl-10 pr-4 font-mono text-xs text-zinc-950 outline-none transition focus:border-zinc-950 focus:bg-white"
                  />
                </div>
              )}
              <div className="relative">
                <List className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
                <select
                  disabled={disabled}
                  defaultValue={input.default ?? ""}
                  className={`${baseInputClass(disabled)} cursor-pointer`}
                  onChange={(e) => onChange(e.target.value)}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {(input.searchable ? filteredOptions : input.options).map(
                    (option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          ) : (
            // Fallback: no options provided by the backend — behave like a
            // plain text field instead of rendering a dead-end dropdown.
            <div>
              <div className="relative">
                <List className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
                <input
                  type="text"
                  disabled={disabled}
                  placeholder={input.placeholder || "Type a value..."}
                  defaultValue={input.default ?? ""}
                  className={baseInputClass(disabled)}
                  onChange={(e) => onChange(e.target.value)}
                />
              </div>
              <p className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-amber-600">
                <AlertCircle size={12} />
                No options provided for this field — using free text input.
              </p>
            </div>
          )}
        </>
      )}

      {/* MULTISELECT */}
      {input.type === "multiselect" && (
        <>
          {input.options && input.options.length > 0 ? (
            <div className="rounded-lg border border-zinc-300 bg-zinc-50/50 p-3">
              {input.searchable && (
                <div className="relative mb-3">
                  <Search className="absolute left-3.5 top-3.5 text-zinc-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-4 font-mono text-xs text-zinc-950 outline-none transition focus:border-zinc-950"
                  />
                </div>
              )}
              <div className="flex max-h-48 flex-col gap-1 overflow-auto">
                {(input.searchable ? filteredOptions : input.options).map(
                  (option) => {
                    const selected: string[] = Array.isArray(value) ? value : [];
                    const checked = selected.includes(option);
                    return (
                      <button
                        type="button"
                        key={option}
                        disabled={disabled}
                        onClick={() => {
                          const next = checked
                            ? selected.filter((v) => v !== option)
                            : [...selected, option];
                          onChange(next);
                        }}
                        className="flex items-center gap-2 rounded-md px-2 py-2 text-left font-mono text-xs text-zinc-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {checked ? (
                          <CheckSquare size={16} className="text-zinc-950" />
                        ) : (
                          <Square size={16} className="text-zinc-400" />
                        )}
                        {option}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            // Fallback: no options provided — free-form tag input.
            // Type a value and press Enter or "," to add it as a chip.
            <TagInput
              value={Array.isArray(value) ? value : []}
              onChange={onChange}
              disabled={disabled}
              placeholder={input.placeholder || "Type a value and press Enter..."}
            />
          )}
        </>
      )}

      {/* JSON */}
      {input.type === "json" && (
        <div>
          <textarea
            rows={6}
            disabled={disabled}
            placeholder={input.placeholder || "{ }"}
            defaultValue={jsonText}
            className={`w-full rounded-lg border ${
              jsonError ? "border-rose-400" : "border-zinc-300"
            } bg-zinc-50/50 p-4 font-mono text-sm text-zinc-950 placeholder-zinc-400 outline-none transition focus:border-zinc-950 focus:bg-white ${
              disabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            onChange={(e) => {
              const text = e.target.value;
              setJsonText(text);
              try {
                const parsed = text.trim() === "" ? undefined : JSON.parse(text);
                setJsonError(null);
                onChange(parsed);
              } catch {
                setJsonError("Invalid JSON");
              }
            }}
          />
          {jsonError && (
            <p className="mt-1.5 flex items-center gap-1 font-mono text-[11px] font-semibold text-rose-600">
              <AlertCircle size={12} />
              {jsonError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Output Renderer Component                                           */
/* ------------------------------------------------------------------ */

function OutputPanel({ output }: { output: TaskOutput }) {
  const [expanded, setExpanded] = useState(true);
  const [tableSearch, setTableSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const Icon = iconForOutput(output.type);
  const href = downloadHref(output.data);

  const header = (output.title || output.description) && (
    <div className="mb-4">
      {output.title && (
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-800">
          {output.title}
        </h3>
      )}
      {output.description && (
        <p className="mt-1 text-xs text-zinc-500">{output.description}</p>
      )}
    </div>
  );

  const downloadButton = output.downloadable && href && (
    <a
      href={href}
      download
      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
    >
      <Download size={14} />
      Download
    </a>
  );

  return (
    <div>
      {header}

      {/* TEXT */}
      {output.type === "text" && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 font-mono text-sm text-zinc-950 leading-relaxed whitespace-pre-wrap">
          {output.data}
        </div>
      )}

      {/* MARKDOWN */}
      {output.type === "markdown" && (
        <article className="prose prose-zinc max-w-none rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-950 leading-relaxed whitespace-pre-wrap">
          {output.data}
        </article>
      )}

      {/* HTML */}
      {output.type === "html" && (
        <div
          className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-950 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: output.data }}
        />
      )}

      {/* JSON */}
      {output.type === "json" && (
        <div className="rounded-lg border border-zinc-950 bg-zinc-950 shadow-inner overflow-hidden">
          {output.collapsible && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex w-full items-center justify-between px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-200"
            >
              JSON Payload
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
          {(!output.collapsible || expanded) && (
            <pre className="max-h-96 overflow-auto p-6 pt-0 font-mono text-xs text-zinc-200 leading-relaxed">
              {output.pretty === false
                ? JSON.stringify(output.data)
                : JSON.stringify(output.data, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* IMAGE */}
      {output.type === "image" && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          {output.preview !== false && (
            <img
              src={output.data}
              alt={output.title || "Task execution result"}
              className="max-h-96 rounded object-contain mx-auto"
            />
          )}
          {downloadButton}
        </div>
      )}

      {/* AUDIO */}
      {output.type === "audio" && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
          {output.preview !== false && (
            <audio controls src={output.data} className="w-full" />
          )}
          {downloadButton}
        </div>
      )}

      {/* VIDEO */}
      {output.type === "video" && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          {output.preview !== false && (
            <video
              controls
              src={output.data}
              className="max-h-96 w-full rounded object-contain"
            />
          )}
          {downloadButton}
        </div>
      )}

      {/* TABLE */}
      {output.type === "table" && Array.isArray(output.data) && (
        <TableOutputView
          rows={output.data}
          searchable={output.searchable}
          sortable={output.sortable}
          pagination={output.pagination}
        />
      )}

      {/* FILE / PDF / CSV / ZIP -- generic downloadable file card */}
      {(output.type === "file" ||
        output.type === "pdf" ||
        output.type === "csv" ||
        output.type === "zip") && (
        <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-6">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <Icon size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-sm font-semibold text-zinc-900">
              {output.title ||
                (output.type === "file" && output.extension
                  ? `output.${output.extension}`
                  : `output.${output.type}`)}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
              {output.type}
              {output.type === "file" && output.extension
                ? ` · .${output.extension}`
                : ""}
            </p>
          </div>
          {output.downloadable && href && (
            <a
              href={href}
              download
              className="flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800"
            >
              <Download size={14} />
              Download
            </a>
          )}
        </div>
      )}

      {/* SUCCESS */}
      {output.type === "success" && (
        <div className="flex items-center gap-3 rounded-lg border border-zinc-950 bg-zinc-950 p-5 font-mono text-xs text-white">
          <CheckCircle2 size={18} className="text-white" />
          <span>{output.message}</span>
        </div>
      )}

      {/* ERROR */}
      {output.type === "error" && (
        <div className="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-5 font-mono text-xs font-semibold text-rose-700">
          <AlertCircle size={16} />
          <span>{output.message}</span>
        </div>
      )}

      {output.type !== "image" &&
        output.type !== "audio" &&
        output.type !== "video" &&
        downloadButton}
    </div>
  );

  function TableOutputView({
    rows,
    searchable,
    sortable,
    pagination,
  }: {
    rows: any[];
    searchable?: boolean;
    sortable?: boolean;
    pagination?: boolean;
  }) {
    const columns = useMemo(
      () => (rows[0] ? Object.keys(rows[0]) : []),
      [rows]
    );

    const filtered = useMemo(() => {
      let r = rows;
      if (searchable && tableSearch) {
        const q = tableSearch.toLowerCase();
        r = r.filter((row) =>
          columns.some((c) =>
            String(row[c] ?? "").toLowerCase().includes(q)
          )
        );
      }
      if (sortable && sortKey) {
        r = [...r].sort((a, b) => {
          const av = a[sortKey];
          const bv = b[sortKey];
          if (av === bv) return 0;
          const cmp = av > bv ? 1 : -1;
          return sortAsc ? cmp : -cmp;
        });
      }
      return r;
    }, [rows, tableSearch, sortKey, sortAsc, columns, searchable, sortable]);

    const pageCount = pagination
      ? Math.max(1, Math.ceil(filtered.length / pageSize))
      : 1;
    const pageRows = pagination
      ? filtered.slice(page * pageSize, page * pageSize + pageSize)
      : filtered;

    return (
      <div className="overflow-hidden rounded-lg border border-zinc-200">
        {searchable && (
          <div className="relative border-b border-zinc-200 bg-zinc-50 p-3">
            <Search className="absolute left-6 top-6 text-zinc-400" size={14} />
            <input
              type="text"
              placeholder="Search table..."
              value={tableSearch}
              onChange={(e) => {
                setTableSearch(e.target.value);
                setPage(0);
              }}
              className="h-9 w-full max-w-xs rounded-md border border-zinc-300 bg-white pl-8 pr-3 font-mono text-xs outline-none focus:border-zinc-950"
            />
          </div>
        )}
        <div className="overflow-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-zinc-950">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c}
                    onClick={() => {
                      if (!sortable) return;
                      if (sortKey === c) setSortAsc(!sortAsc);
                      else {
                        setSortKey(c);
                        setSortAsc(true);
                      }
                    }}
                    className={`px-4 py-3 font-mono font-bold uppercase tracking-wider text-white ${
                      sortable ? "cursor-pointer select-none" : ""
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c}
                      {sortable && sortKey === c && (
                        sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-100 font-mono text-zinc-700 last:border-0 hover:bg-zinc-50"
                >
                  {columns.map((c) => (
                    <td key={c} className="px-4 py-3">
                      {String(row[c] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination && pageCount > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-2.5 font-mono text-[11px] text-zinc-500">
            <span>
              Page {page + 1} of {pageCount}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-md border border-zinc-300 bg-white px-2.5 py-1 font-semibold uppercase tracking-wider hover:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                className="rounded-md border border-zinc-300 bg-white px-2.5 py-1 font-semibold uppercase tracking-wider hover:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

/* ------------------------------------------------------------------ */
/* Main Page                                                           */
/* ------------------------------------------------------------------ */

export default function PlaygroundPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [task, setTask] = useState<any>(null);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [output, setOutput] = useState<TaskOutput | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    try {
      const res = await fetch(`${API}/deployment/${id}`);

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

      const data = await res.json();
      console.log("projectt dataaaaaaaa",data)
      setProject(data);

      if (data.metadata?.tasks?.length > 0) {
        setTask(data.metadata.tasks[0]);
      }
    } catch (error) {
      console.error("Failed to load project playground:", error);
    } finally {
      setLoading(false);
    }
  }

  async function execute() {
    if (!task || !project?.runtime?.url) return;

    setRunning(true);
    setOutput(null);

    try {
      const formHasFiles = Object.values(inputs).some(
        (v) => v instanceof File || (Array.isArray(v) && v[0] instanceof File)
      );

      let res: Response;

      if (formHasFiles) {
        const form = new FormData();
        form.append("task", task.name);
        Object.entries(inputs).forEach(([key, val]) => {
          if (val instanceof File) {
            form.append(key, val);
          } else if (Array.isArray(val) && val[0] instanceof File) {
            val.forEach((f: File) => form.append(key, f));
          } else if (val !== undefined) {
            form.append(
              key,
              typeof val === "object" ? JSON.stringify(val) : String(val)
            );
          }
        });

        res = await fetch(`${project.runtime.url}/run`, {
          method: "POST",
          body: form,
        });
      } else {
        res = await fetch(`${project.runtime.url}/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task: task.name,
            inputs,
          }),
        });
      }

      const data = await res.json();
      setOutput(data);
    } catch (error: any) {
      setOutput({
        type: "error",
        message: error.message || "Execution request failed.",
      });
    } finally {
      setRunning(false);
    }
  }

  if (loading)
    return (
      <main className="min-h-screen bg-white text-zinc-950 flex flex-col items-center justify-center gap-3 font-sans">
        <Loader2 className="animate-spin text-zinc-950" size={32} />
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Initializing Playground...
        </span>
      </main>
    );

  return (
    <main className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-950 selection:text-white antialiased pb-24">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: `24px 24px`,
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div>
            <Link
              href={`/projects/${id}`}
              className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 transition hover:text-zinc-950"
            >
              <ArrowLeft size={14} />
              Back to Overview
            </Link>

            <h1 className="text-3xl font-black tracking-tight text-zinc-950 uppercase">
              Playground
            </h1>

            <p className="mt-1 text-sm text-zinc-500 font-normal">
              Execute dynamic agent tasks with custom parameters.
            </p>
          </div>

          <button
            onClick={execute}
            disabled={running || !task}
            className="flex items-center gap-2 rounded-lg bg-zinc-950 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            {running ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Play size={16} />
            )}
            Run Task
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-8 pt-10 space-y-8">
        {/* Task Selector */}
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
              Select Task
            </h2>
            <span className="font-mono text-xs font-semibold text-zinc-400 uppercase">
              {project?.metadata?.tasks?.length ?? 0} TASKS REGISTERED
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {project?.metadata?.tasks?.map((t: any) => (
              <button
                key={t.name}
                onClick={() => {
                  setTask(t);
                  setInputs({});
                  setOutput(null);
                }}
                className={`rounded-lg px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                  task?.name === t.name
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "border border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:border-zinc-300 hover:bg-white"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Inputs Form */}
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950 tracking-tight mb-6">
            Task Inputs
          </h2>

          {!task?.inputs || task.inputs.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs uppercase tracking-widest text-zinc-400">
              No input parameters required for this task.
            </div>
          ) : (
            <div className="space-y-6">
              {task.inputs.map((input: TaskInput) => (
                <InputField
                  key={input.name}
                  input={input}
                  value={inputs[input.name]}
                  onChange={(val) =>
                    setInputs((prev) => ({ ...prev, [input.name]: val }))
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Task Output Section */}
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <Code2 size={20} className="text-zinc-950" />
            <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
              Task Output
            </h2>
          </div>

          {!output && (
            <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 font-mono text-xs uppercase tracking-widest text-zinc-400">
              <Sparkles size={20} className="mb-2 text-zinc-300" />
              Execute a task to view output payload.
            </div>
          )}

          {output && <OutputPanel output={output} />}
        </div>
      </section>
    </main>
  );
}