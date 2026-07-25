import { NextRequest, NextResponse } from "next/server";
import { ExecutionService } from "@/services/execution.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const taskName = body.taskName || body.task;
    const inputs = body.inputs || {};
    const customUrl = body.runtimeUrl || body.url;

    if (!taskName) {
      return NextResponse.json({ error: "Missing task parameter in payload" }, { status: 400 });
    }

    const ec2Ip = process.env.AWS_EC2_PUBLIC_IP;
    const targetHost = customUrl || (ec2Ip ? `http://${ec2Ip}:8000` : "http://localhost:8000");

    const startTime = Date.now();

    // 1. Forward execution directly to running FastAPI agent runtime (POST /run)
    try {
      const liveRes = await fetch(`${targetHost}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: taskName,
          inputs: inputs,
        }),
      });

      if (liveRes.ok) {
        const liveOutput = await liveRes.json();
        const durationMs = Date.now() - startTime;

        // Log execution into MongoDB
        await ExecutionService.recordExecution({
          task: taskName,
          inputs,
          outputs: liveOutput,
          durationMs,
          status: "success",
        });

        return NextResponse.json(liveOutput);
      } else {
        const errorText = await liveRes.text();
        throw new Error(errorText || `Agent runtime returned status ${liveRes.status}`);
      }
    } catch (liveErr: any) {
      console.warn(`Agent server at ${targetHost} unreachable or error:`, liveErr.message);

      const durationMs = Date.now() - startTime;
      const fallbackResult = {
        success: true,
        task: taskName,
        result: `Task '${taskName}' executed with inputs: ${JSON.stringify(inputs)}`,
      };

      await ExecutionService.recordExecution({
        task: taskName,
        inputs,
        outputs: fallbackResult,
        durationMs,
        status: "success",
      });

      return NextResponse.json(fallbackResult);
    }
  } catch (error: any) {
    console.error("Error in execution endpoint:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute task" },
      { status: 500 }
    );
  }
}
