"use client";

import { memo, useMemo } from "react";
import { BlockMath, InlineMath } from "react-katex";

type ParsedPart = {
  type: "text" | "latex";
  value: string;
};

type ParsedResult =
  | { type: "block"; content: string }
  | { type: "inline"; content: ParsedPart[] }
  | { type: "plain"; content: string };

function parseText(text: string): ParsedResult {
  const blockRegex = /^\$\$(.*?)\$\$$/s;
  const blockMatch = text.match(blockRegex);

  if (blockMatch) {
    return { type: "block", content: blockMatch[1] };
  }

  const inlineRegex = /\$(.*?)\$/g;
  const matches = [...text.matchAll(inlineRegex)];

  if (matches.length > 0) {
    const parts: ParsedPart[] = [];
    let lastIndex = 0;

    for (const match of matches) {
      const startIndex = match.index ?? 0;
      const fullMatch = match[0];
      const latexValue = match[1] ?? "";

      if (startIndex > lastIndex) {
        parts.push({
          type: "text",
          value: text.slice(lastIndex, startIndex),
        });
      }

      parts.push({
        type: "latex",
        value: latexValue,
      });

      lastIndex = startIndex + fullMatch.length;
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
  className?: string;
};

const SmartText = memo(function SmartText({ text, className }: SmartTextProps) {
  const parsed = useMemo(() => parseText(text), [text]);

  if (parsed.type === "block") {
    return (
      <span className={className}>
        <BlockMath math={parsed.content} />
      </span>
    );
  }

  if (parsed.type === "inline") {
    return (
      <span className={className}>
        {parsed.content.map((part, index) =>
          part.type === "latex" ? (
            <InlineMath key={index} math={part.value} />
          ) : (
            <span key={index}>{part.value}</span>
          )
        )}
      </span>
    );
  }

  return <span className={className}>{parsed.content}</span>;
});

export default SmartText;
