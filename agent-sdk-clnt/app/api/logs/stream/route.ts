import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendLog = (line: string) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ log: line, timestamp: new Date().toISOString() })}\n\n`));
      };

      // Initial build sequence with ANSI colors
      sendLog("\u001b[36m[DEPLOYGENT BUILD ENGINE v2.5.0]\u001b[0m Initializing deployment environment...");
      await new Promise((r) => setTimeout(r, 100));
      sendLog("\u001b[32m[SUCCESS]\u001b[0m Connected to GitHub repository: \u001b[1mPRERAN001/agents-sdk\u001b[0m");
      sendLog("\u001b[34m[INFO]\u001b[0m Fetching commit \u001b[33m9f82a1c\u001b[0m on branch \u001b[36mmain\u001b[0m");
      sendLog("Cloning repository into /workspace/agent-runtime...");

      await new Promise((r) => setTimeout(r, 200));

      sendLog("\u001b[36m[BUILD:1/4]\u001b[0m Reading pyproject.toml and dependencies...");
      sendLog("  - Installing python >= 3.10");
      sendLog("  - Installing deploygent-sdk >= 2.5.0");
      sendLog("  - Installing flask, requests, pydantic");

      for (let i = 1; i <= 15; i++) {
        sendLog(`  \u001b[2m[PIP]\u001b[0m Downloading dependency package_${i}-2.4.1-py3-none-any.whl (1.4 MB)`);
        await new Promise((r) => setTimeout(r, 40));
      }

      sendLog("\u001b[32m[SUCCESS]\u001b[0m All dependencies cached and resolved in 1.2s");
      sendLog("\u001b[36m[BUILD:2/4]\u001b[0m Compiling Agent Task Metadata schema...");
      sendLog("  - Found task: \u001b[1mgenerate_content\u001b[0m (inputs: prompt, temperature, framework)");
      sendLog("  - Found task: \u001b[1mmultimodal_image_analysis\u001b[0m (inputs: image_file, question)");
      sendLog("  - Found task: \u001b[1mvoice_audio_processing\u001b[0m (inputs: audio_file, task_type)");

      await new Promise((r) => setTimeout(r, 200));

      sendLog("\u001b[36m[BUILD:3/4]\u001b[0m Generating container image & optimizing layer cache...");
      sendLog("  - Layer 1/5: BASE alpine-python:3.11 [CACHE HIT]");
      sendLog("  - Layer 2/5: COPY /workspace /app [CACHE MISS]");
      sendLog("  - Layer 3/5: RUN python -m pip install -e .");
      sendLog("  - Layer 4/5: EXPOSE 8000");
      sendLog("  - Layer 5/5: CMD python -m deploygent serve");

      sendLog("\u001b[32m[SUCCESS]\u001b[0m Image built successfully (digest: sha256:8f92a1...)");
      sendLog("\u001b[36m[BUILD:4/4]\u001b[0m Starting isolated agent process on port \u001b[33m8000\u001b[0m...");
      
      await new Promise((r) => setTimeout(r, 200));

      sendLog("\u001b[32m[RUNNING]\u001b[0m Agent runtime process active (PID \u001b[1m41920\u001b[0m)");
      sendLog("\u001b[32m[HEALTH]\u001b[0m GET /health 200 OK (latency: 14ms)");

      // Stream ongoing runtime execution logs periodically
      let count = 1;
      const interval = setInterval(() => {
        if (count > 2000) {
          clearInterval(interval);
          controller.close();
          return;
        }

        const isWarn = count % 7 === 0;
        const isError = count % 19 === 0;

        if (isError) {
          sendLog(`\u001b[31m[ERROR]\u001b[0m Worker #${count} transient network timeout on upstream LLM API gateway (retrying in 500ms)`);
        } else if (isWarn) {
          sendLog(`\u001b[33m[WARN]\u001b[0m Worker #${count} high memory usage watermark detected (184 MB / 512 MB)`);
        } else {
          sendLog(`\u001b[34m[INFO]\u001b[0m Worker #${count} processed request task 'generate_content' (\u001b[32m200 OK\u001b[0m 142ms)`);
        }

        count++;
      }, 50);

      // Clean up when client disconnects
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
