"use client";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Shell: "#89e051",
  Docker: "#384d54",
};

interface LanguageBadgeProps {
  language?: string;
  className?: string;
}

export default function LanguageBadge({ language, className = "" }: LanguageBadgeProps) {
  if (!language) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs text-zinc-500 ${className}`}>
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-600 inline-block flex-shrink-0" />
        <span>Unknown</span>
      </div>
    );
  }

  const color = LANGUAGE_COLORS[language] || "#8b949e";

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium ${className}`}>
      <span
        className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span>{language}</span>
    </div>
  );
}
