"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function PlaygroundPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [task, setTask] = useState<any>(null);
  const [inputs, setInputs] = useState<any>({});
  const [output, setOutput] = useState<any>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!id) return;
    load();
  }, [id]);

  async function load() {
    try {
      const res = await fetch(`${API}/deployment/${id}`);

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

      const data = await res.json();
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
      const res = await fetch(`${project.runtime.url}/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: task.name,
          inputs,
        }),
      });

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
              {task.inputs.map((input: any) => (
                <div key={input.name}>
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                    {input.name}
                  </label>

                  {/* TEXT */}
                  {input.type === "text" && (
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
                      <input
                        type="text"
                        className="h-12 w-full rounded-lg border border-zinc-300 bg-zinc-50/50 pl-11 pr-4 font-mono text-sm text-zinc-950 placeholder-zinc-400 outline-none transition focus:border-zinc-950 focus:bg-white"
                        onChange={(e) =>
                          setInputs({
                            ...inputs,
                            [input.name]: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  {/* TEXTAREA */}
                  {input.type === "textarea" && (
                    <textarea
                      rows={5}
                      className="w-full rounded-lg border border-zinc-300 bg-zinc-50/50 p-4 font-mono text-sm text-zinc-950 placeholder-zinc-400 outline-none transition focus:border-zinc-950 focus:bg-white"
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          [input.name]: e.target.value,
                        })
                      }
                    />
                  )}

                  {/* NUMBER */}
                  {input.type === "number" && (
                    <div className="relative">
                      <Hash className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
                      <input
                        type="number"
                        className="h-12 w-full rounded-lg border border-zinc-300 bg-zinc-50/50 pl-11 pr-4 font-mono text-sm text-zinc-950 outline-none transition focus:border-zinc-950 focus:bg-white"
                        onChange={(e) =>
                          setInputs({
                            ...inputs,
                            [input.name]: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  )}

                  {/* BOOLEAN */}
                  {input.type === "boolean" && (
                    <label className="flex h-12 cursor-pointer items-center gap-3 rounded-lg border border-zinc-300 bg-zinc-50/50 px-4 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-800">
                      <ToggleLeft size={20} className="text-zinc-600" />
                      <span className="flex-1">Toggle Option</span>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 cursor-pointer"
                        onChange={(e) =>
                          setInputs({
                            ...inputs,
                            [input.name]: e.target.checked,
                          })
                        }
                      />
                    </label>
                  )}

                  {/* SELECT */}
                  {input.type === "select" && (
                    <div className="relative">
                      <List className="absolute left-3.5 top-3.5 text-zinc-400" size={18} />
                      <select
                        className="h-12 w-full rounded-lg border border-zinc-300 bg-zinc-50/50 pl-11 pr-4 font-mono text-sm text-zinc-950 outline-none transition focus:border-zinc-950 focus:bg-white cursor-pointer"
                        onChange={(e) =>
                          setInputs({
                            ...inputs,
                            [input.name]: e.target.value,
                          })
                        }
                      >
                        {input.options?.map((option: string) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* FILE / IMAGE */}
                  {(input.type === "file" || input.type === "image") && (
                    <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 transition hover:border-zinc-950 hover:bg-zinc-50">
                      {input.type === "image" ? (
                        <ImageIcon size={32} className="text-zinc-400" />
                      ) : (
                        <Upload size={32} className="text-zinc-400" />
                      )}
                      <span className="mt-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-600">
                        Upload {input.type}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          setInputs({
                            ...inputs,
                            [input.name]: e.target.files?.[0],
                          })
                        }
                      />
                    </label>
                  )}
                </div>
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

          {output && output.type === "text" && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 font-mono text-sm text-zinc-950 leading-relaxed">
              {output.data}
            </div>
          )}

          {output && output.type === "markdown" && (
            <article className="prose prose-zinc max-w-none rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-950 leading-relaxed">
              {output.data}
            </article>
          )}

          {output && output.type === "json" && (
            <pre className="max-h-96 overflow-auto rounded-lg border border-zinc-950 bg-zinc-950 p-6 font-mono text-xs text-zinc-200 leading-relaxed shadow-inner">
              {JSON.stringify(output.data, null, 2)}
            </pre>
          )}

          {output && output.type === "image" && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <img
                src={output.data}
                alt="Task execution result"
                className="max-h-96 rounded object-contain mx-auto"
              />
            </div>
          )}

          {output && output.type === "success" && (
            <div className="flex items-center gap-3 rounded-lg border border-zinc-950 bg-zinc-950 p-5 font-mono text-xs text-white">
              <CheckCircle2 size={18} className="text-white" />
              <span>{output.message}</span>
            </div>
          )}

          {output && output.type === "error" && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 font-mono text-xs font-semibold text-rose-700">
              {output.message}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}