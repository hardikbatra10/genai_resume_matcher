const BULLET_RE = /^[-*•]\s+/;
const NUMBERED_RE = /^\d+[.)]\s+/;
const HEADING_RE = /^#{1,3}\s+/;

// Turns a plain-text LLM response (markdown-ish bullets/headings) into
// renderable blocks: { type: "heading" | "list" | "paragraph", items }
export function parseSuggestions(text) {
  if (!text) return [];

  const lines = text.split("\n").map((l) => l.trim());
  const blocks = [];
  let currentList = null;

  for (const line of lines) {
    if (!line) {
      currentList = null;
      continue;
    }

    if (HEADING_RE.test(line)) {
      currentList = null;
      blocks.push({ type: "heading", text: line.replace(HEADING_RE, "").replace(/\*\*/g, "") });
      continue;
    }

    if (BULLET_RE.test(line) || NUMBERED_RE.test(line)) {
      const content = line.replace(BULLET_RE, "").replace(NUMBERED_RE, "");
      if (!currentList) {
        currentList = { type: "list", items: [] };
        blocks.push(currentList);
      }
      currentList.items.push(content);
      continue;
    }

    if (line.endsWith(":") && line.length < 80) {
      currentList = null;
      blocks.push({ type: "heading", text: line.replace(/:$/, "") });
      continue;
    }

    currentList = null;
    blocks.push({ type: "paragraph", text: line });
  }

  return blocks;
}

// Strips basic markdown bold/italic markers for inline text rendering.
export function stripInlineMarkdown(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
}
