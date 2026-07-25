import { IRuntimeProvider } from "./IRuntimeProvider";
import { ProcessRuntimeProvider } from "./ProcessRuntimeProvider";
import { DockerRuntimeProvider } from "./DockerRuntimeProvider";
import { KubernetesRuntimeProvider } from "./KubernetesRuntimeProvider";
import { RuntimeProviderType } from "@/models/agentRuntime";

export class RuntimeFactory {
  private static providers: Map<string, IRuntimeProvider> = new Map<string, IRuntimeProvider>([
    ["process", new ProcessRuntimeProvider()],
    ["docker", new DockerRuntimeProvider()],
    ["kubernetes", new KubernetesRuntimeProvider()],
  ]);

  /**
   * Returns the runtime provider instance matching the specified type.
   */
  static getProvider(type: RuntimeProviderType = "process"): IRuntimeProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      return this.providers.get("process")!;
    }
    return provider;
  }
}
