
export function escapeHtml(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

function escInline(s: string): string {
  const e = escapeHtml(s);
  return e.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>");
}

type Admonition = "note"|"tip"|"warning"|"info";

export function renderSafeMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g,"\n").split("\n");
  let html = "";
  let inList = false;
  let listType: "ul"|"ol"|"check" = "ul";
  let inTable = false;
  let tableRows: string[] = [];
  let admoOpen: Admonition|"" = "";
  let h2 = 0, h3 = 0;

  function closeList() {
    if (inList) { html += listType==="check" ? "</ul>" : `</${listType}>`; inList=false; }
  }
  function flushTable() {
    if (!inTable) return;
    if (tableRows.length) {
      // parse simple GFM style table
      const rows = tableRows;
      let thead="", tbody="";
      if (rows.length>=2 && /^\s*\|?[-:\s|]+\|?\s*$/.test(rows[1])) {
        const head = splitRow(rows[0]).map(escInline);
        thead = "<thead><tr>"+head.map(c=>`<th>${c}</th>`).join("")+"</tr></thead>";
        for (let i=2;i<rows.length;i++) {
          const cells = splitRow(rows[i]).map(escInline);
          tbody += "<tr>"+cells.map(c=>`<td>${c}</td>`).join("")+"</tr>";
        }
      } else {
        for (const r of rows) {
          const cells = splitRow(r).map(escInline);
          tbody += "<tr>"+cells.map(c=>`<td>${c}</td>`).join("")+"</tr>";
        }
      }
      html += `<table>${thead}<tbody>${tbody}</tbody></table>`;
    }
    inTable=false; tableRows=[];
  }
  function closeAdmo() {
    if (admoOpen) { html += "</div>"; admoOpen=""; }
  }
  function splitRow(r:string){ return r.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(c=>c.trim()); }

  for (const raw of lines) {
    const line = raw.replace(/\t/g,"    ").trimRight();
    // blank
    if (!line.trim()) { closeList(); flushTable(); closeAdmo(); html += "<p></p>"; continue; }

    // admonitions :::note
    const admoStart = line.match(/^:::(note|tip|warning|info)\s*$/i);
    if (admoStart) { closeList(); flushTable(); closeAdmo(); admoOpen = admoStart[1].toLowerCase() as Admonition; html += `<div class="mg-callout ${admoOpen}">`; continue; }
    if (/^:::\s*$/.test(line)) { closeList(); flushTable(); closeAdmo(); continue; }
    if (admoOpen) { html += `<p>${escInline(line)}</p>`; continue; }

    // table
    if (/^\s*\|.+\|\s*$/.test(line)) { closeList(); if(!inTable){ inTable=true; tableRows=[]; } tableRows.push(line); continue; }
    if (inTable) { flushTable(); }

    // headings
    if (line.startsWith("## ")) { closeList(); h2+=1; h3=0; html += `<h2>${h2}. ${escInline(line.slice(3))}</h2>`; continue; }
    if (line.startsWith("### ")) { closeList(); if(h2===0) h2=1; h3+=1; html += `<h3>${h2}.${h3} ${escInline(line.slice(4))}</h3>`; continue; }

    // checklist
    const check = line.match(/^- \[( |x|X)\]\s+(.*)$/);
    if (check) {
      const state = check[1].toLowerCase()==="x" ? "done" : "todo";
      if (!inList || listType!=="check") { closeList(); html += "<ul>"; inList=true; listType="check"; }
      html += `<li data-check="${state}">${escInline(check[2])}</li>`;
      continue;
    }

    // unordered list
    if (line.startsWith("- ")) {
      if (!inList || listType!=="ul") { closeList(); html += "<ul>"; inList=true; listType="ul"; }
      html += `<li>${escInline(line.slice(2))}</li>`; continue;
    }

    // paragraph
    closeList();
    html += `<p>${escInline(line)}</p>`;
  }
  closeList(); flushTable(); closeAdmo();
  html = html.replace(/(<p><\/p>)+/g,"<p></p>");
  return html;
}
