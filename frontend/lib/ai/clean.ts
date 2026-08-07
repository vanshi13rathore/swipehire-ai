export function cleanResumeText(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // Remove page numbers like "Page 1", "Page 10", "Page 1 of 2"
  cleaned = cleaned.replace(/(?:\n|^)\s*(?:Page\s+\d+(?:\s+of\s+\d+)?)\s*(?:\n|$)/gi, '\n');

  // Collapse multiple spaces into a single space (excluding newlines)
  cleaned = cleaned.replace(/[ \t]+/g, ' ');

  // Remove repeated blank lines (collapse 3 or more newlines into 2 to preserve paragraphs)
  cleaned = cleaned.replace(/\n\s*\n+/g, '\n\n');

  // Trim leading and trailing whitespace
  return cleaned.trim();
}
