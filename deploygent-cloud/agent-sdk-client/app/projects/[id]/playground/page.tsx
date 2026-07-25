    "use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Loader2,
  Play,
  CheckCircle2,
  FileText,
  Image,
  Hash,
  ToggleLeft,
  Upload,
  List,
  Code2,
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
    load();
  }, []);

  async function load() {
    const res = await fetch(`${API}/deployment/${id}`);

    const data = await res.json();

    setProject(data);

    if (data.metadata.tasks.length > 0) {
      setTask(data.metadata.tasks[0]);
    }

    setLoading(false);
  }

  async function execute() {
    setRunning(true);

    setOutput(null);

    const res = await fetch(
      `${project.runtime.url}/run`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          task: task.name,
          inputs,
        }),
      }
    );

    const data = await res.json();

    setOutput(data);

    setRunning(false);
  }

  if (loading)
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <Loader2 className="animate-spin" />
      </main>
    );

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      <section className="mx-auto max-w-7xl px-8 py-10">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-bold">
              Playground
            </h1>

            <p className="mt-3 text-white/50">
              Execute tasks exposed by your deployed agent.
            </p>

          </div>

          <button
            onClick={execute}
            disabled={running}
            className="flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-semibold text-black"
          >
            {running ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Play />
            )}

            Run Task
          </button>

        </div>

        {/* Task Selector */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-2xl font-semibold">
            Tasks
          </h2>

          <div className="mt-6 flex flex-wrap gap-4">

            {project.metadata.tasks.map(
              (t: any) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setTask(t);
                    setInputs({});
                    setOutput(null);
                  }}
                  className={`rounded-xl px-6 py-3 transition ${
                    task.name === t.name
                      ? "bg-white text-black"
                      : "border border-white/10 bg-black/30"
                  }`}
                >
                  {t.name}
                </button>
              )
            )}

          </div>

        </div>

        {/* Dynamic Inputs */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-2xl font-semibold">
            Inputs
          </h2>

          <div className="mt-8 space-y-8">

            {task.inputs.map((input: any) => (

              <div key={input.name}>

                <label className="mb-3 block text-white/60">

                  {input.name}

                </label>

                {/* TEXT */}

                {input.type === "text" && (
                  <div className="relative">

                    <FileText className="absolute left-4 top-4 text-white/30" />

                    <input
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 pl-12 pr-4"
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          [input.name]:
                            e.target.value,
                        })
                      }
                    />

                  </div>
                )}

                {/* TEXTAREA */}

                {input.type === "textarea" && (
                  <textarea
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 p-4"
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        [input.name]:
                          e.target.value,
                      })
                    }
                  />
                )}

                {/* NUMBER */}

                {input.type === "number" && (
                  <div className="relative">

                    <Hash className="absolute left-4 top-4 text-white/30" />

                    <input
                      type="number"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 pl-12"
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          [input.name]:
                            Number(
                              e.target.value
                            ),
                        })
                      }
                    />

                  </div>
                )}

                {/* BOOLEAN */}

                {input.type === "boolean" && (
                  <label className="flex h-14 items-center gap-4 rounded-2xl border border-white/10 bg-black/40 px-5">

                    <ToggleLeft />

                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          [input.name]:
                            e.target.checked,
                        })
                      }
                    />

                  </label>
                )}

                {/* SELECT */}

                {input.type === "select" && (
                  <div className="relative">

                    <List className="absolute left-4 top-4 text-white/30" />

                    <select
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 pl-12"
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          [input.name]:
                            e.target.value,
                        })
                      }
                    >
                      {input.options.map(
                        (option: string) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}
                    </select>

                  </div>
                )}

                {/* FILE */}

                {(input.type === "file" ||
                  input.type === "image") && (
                  <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/40">

                    {input.type === "image" ? (
                      <Image size={40} />
                    ) : (
                      <Upload size={40} />
                    )}

                    <span className="mt-4 text-white/50">
                      Upload {input.type}
                    </span>

                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          [input.name]:
                            e.target.files?.[0],
                        })
                      }
                    />

                  </label>
                )}

              </div>

            ))}

          </div>

        </div>

        {/* Output */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <div className="flex items-center gap-3">

            <Code2 />

            <h2 className="text-2xl font-semibold">
              Output
            </h2>

          </div>

          {!output && (
            <div className="mt-8 text-white/40">
              Execute a task to see the output.
            </div>
          )}

          {output && output.type === "text" && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6">
              {output.data}
            </div>
          )}

          {output && output.type === "markdown" && (
            <article className="prose prose-invert mt-8 max-w-none rounded-2xl border border-white/10 bg-black/40 p-6">
              {output.data}
            </article>
          )}

          {output && output.type === "json" && (
            <pre className="mt-8 overflow-auto rounded-2xl border border-white/10 bg-black/40 p-6 text-sm">
              {JSON.stringify(
                output.data,
                null,
                2
              )}
            </pre>
          )}

          {output && output.type === "image" && (
            <img
              src={output.data}
              className="mt-8 rounded-2xl"
            />
          )}

          {output && output.type === "success" && (
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-green-400">
              <CheckCircle2 />
              {output.message}
            </div>
          )}

        </div>

      </section>

    </main>
  );
}