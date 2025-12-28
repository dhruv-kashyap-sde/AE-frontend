"use client";

import { memo, useMemo } from "react";
import { InlineMath, BlockMath } from "react-katex";

const BLOCK_LATEX = /\$\$(.*?)\$\$/;
const INLINE_LATEX = /\$(.*?)\$/g;

type ParsedPart = {
  type: "text" | "latex";
  value: string;
};

type ParsedResult =
  | { type: "block"; content: string }
  | { type: "inline"; content: ParsedPart[] }
  | { type: "plain"; content: string };

function parseText(text: string): ParsedResult {
  // Block LaTeX
  if (BLOCK_LATEX.test(text)) {
    return { type: "block", content: text.replace(/\$\$/g, "") };
  }

  // Inline LaTeX
  if (INLINE_LATEX.test(text)) {
    const parts: ParsedPart[] = [];
    let lastIndex = 0;
    let match;

    // Reset regex lastIndex before use
    INLINE_LATEX.lastIndex = 0;

    while ((match = INLINE_LATEX.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
      }
      parts.push({ type: "latex", value: match[1] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", value: text.slice(lastIndex) });
    }

    return { type: "inline", content: parts };
  }

  return { type: "plain", content: text };
}

type SmartTextProps = {
  text: string;
};

const SmartText = memo(function SmartText({ text }: SmartTextProps) {
  const parsed = useMemo(() => parseText(text), [text]);

  if (parsed.type === "block") {
    return <BlockMath math={parsed.content} />;
  }

  if (parsed.type === "inline") {
    return (
      <span className="leading-relaxed">
        {parsed.content.map((part, i) =>
          part.type === "latex" ? (
            <InlineMath key={i} math={part.value} />
          ) : (
            <span key={i}>{part.value}</span>
          )
        )}
      </span>
    );
  }

  return <span>{parsed.content}</span>;
});

export default SmartText;
