"use client";

import { parseAnsiText, AnsiSegment } from "@/lib/ansi";

interface AnsiTextProps {
  text: string;
  search?: string;
  className?: string;
}

export default function AnsiText({ text, search = "", className = "" }: AnsiTextProps) {
  const segments = parseAnsiText(text);

  const renderSegmentWithHighlight = (segment: AnsiSegment, index: number) => {
    const style: React.CSSProperties = {
      color: segment.color || undefined,
      fontWeight: segment.bold ? "bold" : "normal",
      opacity: segment.dim ? 0.7 : 1,
      textDecoration: segment.underline ? "underline" : "none",
    };

    if (!search.trim()) {
      return (
        <span key={index} style={style}>
          {segment.text}
        </span>
      );
    }

    // Highlight search query occurrences
    const searchRegex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = segment.text.split(searchRegex);

    return (
      <span key={index} style={style}>
        {parts.map((part, pIdx) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark
              key={pIdx}
              className="bg-amber-400 text-zinc-950 font-bold px-0.5 rounded-xs"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <span className={`font-mono leading-relaxed ${className}`}>
      {segments.map((seg, i) => renderSegmentWithHighlight(seg, i))}
    </span>
  );
}
