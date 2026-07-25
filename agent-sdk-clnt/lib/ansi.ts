export interface AnsiSegment {
  text: string;
  color?: string;
  bgColor?: string;
  bold?: boolean;
  dim?: boolean;
  underline?: boolean;
}

const ANSI_COLOR_MAP: Record<number, string> = {
  30: "#4b5563", // black / gray
  31: "#ef4444", // red
  32: "#10b981", // green
  33: "#f59e0b", // yellow
  34: "#3b82f6", // blue
  35: "#a855f7", // magenta / purple
  36: "#06b6d4", // cyan
  37: "#f3f4f6", // white
  90: "#6b7280", // bright black
  91: "#f87171", // bright red
  92: "#34d399", // bright green
  93: "#fbbf24", // bright yellow
  94: "#60a5fa", // bright blue
  95: "#c084fc", // bright magenta
  96: "#22d3ee", // bright cyan
  97: "#ffffff", // bright white
};

/**
 * Parses raw text containing ANSI escape codes into structured styled segments.
 */
export function parseAnsiText(input: string): AnsiSegment[] {
  if (!input) return [];

  const segments: AnsiSegment[] = [];
  // Regex to match ANSI escape sequences (e.g. \u001b[32m or \x1b[1;31m)
  const ansiRegex = /\u001b\[([0-9;]*)m/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  let currentStyle: Partial<AnsiSegment> = {};

  while ((match = ansiRegex.exec(input)) !== null) {
    // Add text preceding the code
    if (match.index > lastIndex) {
      const text = input.slice(lastIndex, match.index);
      if (text) {
        segments.push({ text, ...currentStyle });
      }
    }

    lastIndex = ansiRegex.lastIndex;

    const codes = match[1].split(";").map((c) => parseInt(c, 10)).filter((c) => !isNaN(c));

    if (codes.length === 0 || codes.includes(0)) {
      // Reset formatting
      currentStyle = {};
    } else {
      for (const code of codes) {
        if (code === 1) currentStyle.bold = true;
        if (code === 2) currentStyle.dim = true;
        if (code === 4) currentStyle.underline = true;
        if (ANSI_COLOR_MAP[code]) {
          currentStyle.color = ANSI_COLOR_MAP[code];
        }
      }
    }
  }

  if (lastIndex < input.length) {
    const text = input.slice(lastIndex);
    if (text) {
      segments.push({ text, ...currentStyle });
    }
  }

  return segments.length > 0 ? segments : [{ text: input }];
}
