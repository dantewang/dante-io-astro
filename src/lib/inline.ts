// Tiny inline markup for the text fields in astro.config.mjs:
//   **text** -> <strong>, ==text== -> <strong class="accent">, [text](url) -> <a>
// Everything else is escaped, so the config can't inject arbitrary HTML.

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (s: string) => s.replace(/[&<>"']/g, c => ESCAPES[c]);

export function inline(text: string): string {
  return escape(text)
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/|mailto:|#)[^)\s]*)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/==(.+?)==/g, '<strong class="accent">$1</strong>');
}
