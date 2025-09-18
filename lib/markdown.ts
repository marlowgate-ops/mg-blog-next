
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderSafeMarkdown(md: string): string {
  // Basic: paragraphs, headings (##), unordered lists (- ), bold/italic, line breaks
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let inList = false;

  function closeList(){ if(inList){ html += "</ul>"; inList = false; } }

  for (let raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { closeList(); html += "<p></p>"; continue; }
    if (line.startsWith("## ")) { closeList(); html += `<h3>${escapeHtml(line.slice(3))}</h3>`; continue; }
    if (line.startsWith("- ")) {
      if (!inList) { html += "<ul>"; inList = true; }
      const item = line.slice(2);
      html += `<li>${escapeInline(item)}</li>`;
      continue;
    }
    closeList();
    html += `<p>${escapeInline(line)}</p>`;
  }
  closeList();
  // merge consecutive empty <p></p>
  html = html.replace(/(<p><\/p>)+/g, '<p></p>');
  return html;
}

function escapeInline(s: string): string {
  // Escape then apply **bold** and *italic* (simple, non-greedy)
  const e = escapeHtml(s);
  return e
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
