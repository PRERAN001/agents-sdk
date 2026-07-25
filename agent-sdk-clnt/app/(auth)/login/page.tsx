"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Loader2, Lock } from "lucide-react";

function GitHubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGitHubSignIn = () => {
    setLoading(true);
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between p-6 relative font-sans antialiased selection:bg-black selection:text-white">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header Logo */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-extrabold text-base tracking-tight shadow-xs group-hover:scale-105 transition-transform">
            D
          </div>
          <span className="font-bold text-lg tracking-tight text-black">
            DeployGent
          </span>
        </Link>
      </div>

      {/* Main Auth Container */}
      <div className="max-w-md w-full mx-auto z-10 py-12">
        <div className="border border-zinc-200 bg-white rounded-2xl p-8 shadow-xs hover:border-zinc-400 transition-colors space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono">
              <Lock className="w-3 h-3 text-zinc-600" />
              <span>Authentication</span>
            </div>
            <h1 className="text-2xl font-extrabold text-black tracking-tight">
              Sign in to DeployGent
            </h1>
            <p className="text-xs text-zinc-600 max-w-sm mx-auto leading-relaxed">
              Access your repositories, agent runtimes, and deployment pipelines with your GitHub account.
            </p>
          </div>

          {/* Corrected GitHub OAuth Button */}
          <div className="pt-2">
            <button
              onClick={handleGitHubSignIn}
              disabled={loading}
              className="relative w-full h-11 px-4 bg-black hover:bg-zinc-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2.5">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <GitHubIcon className="w-5 h-5" />
                )}
                <span>{loading ? "Connecting to GitHub..." : "Continue with GitHub"}</span>
              </div>

              {!loading && (
                <ArrowRight className="absolute right-4 w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>

          {/* Security Assurance */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
            <span>OAuth 2.0 • Fine-grained Permissions</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-zinc-500 font-medium z-10">
        &copy; {new Date().getFullYear()} DeployGent Inc.
      </div>
    </div>
  );
}