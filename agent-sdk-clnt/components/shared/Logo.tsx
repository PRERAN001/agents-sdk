import Link from "next/link";
import { Bot } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 transition-opacity hover:opacity-80"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
        <Bot className="h-5 w-5" />
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight">
          DeployGent
        </span>

        <span className="text-xs text-muted-foreground">
          Deploy AI Agents
        </span>
      </div>
    </Link>
  );
}