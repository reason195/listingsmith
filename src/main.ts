import "./style.css";
import { scanText, highlightHtml, applyFlags, type Flag } from "./compliance";
import { FEATURE_OPTIONS, generateFromTemplate, type ListingOutput, type PropertyData, type Tone } from "./templates";
import { generateWithGemini } from "./gemini";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const LS_KEY = "listingsmith_gemini_key";
const LS_HISTORY = "listingsmith_history";
const LS_COUNT = "listingsmith_gen_count";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function copyText(text: string, btn: HTMLButtonElement) {
  try {
    await navigator.clipboard.writeText(text);
    const old = btn.textContent;
    btn.textContent = "Copied ✓";
    setTimeout(() => (btn.textContent = old), 1400);
  } catch {
    btn.textContent = "Copy failed — select manually";
  }
}

/* ---------------- Settings / API key ---------------- */

const apiKeyInput = $<HTMLInputElement>("apiKeyInput");
const modeBadge = $("modeBadge");

function currentKey(): string {
  return localStorage.getItem(LS_KEY) || "";
}
function refreshMode() {
  const has = Boolean(currentKey());
  modeBadge.textContent = has ? "AI mode · Gemini" : "Demo mode";
  modeBadge.classList.toggle("ai", has);
  apiKeyInput.value = has ? "••••••••••••" : "";
}
$("saveKeyBtn").addEventListener("click", () => {
  const v = apiKeyInput.value.trim();
  if (v && !v.startsWith("••")) localStorage.setItem(LS_KEY, v);
  refreshMode();
});
$("clearKeyBtn").addEventListener("click", () => {
  localStorage.removeItem(LS_KEY);
  refreshMode();
});
refreshMode();

/* ---------------- Property form ---------------- */

const checksBox = $("featureChecks");
checksBox.innerHTML = FEATURE_OPTIONS.map(
  (f) => `<label><input type="checkbox" value="${f.id}" />${escapeHtml(f.label)}</label>`
).join("");

function num(id: string): number | null {
  const v = $<HTMLInputElement>(id).value.trim();
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function gatherForm(): PropertyData {
  const features = Array.from(checksBox.querySelectorAll<HTMLInputElement>("input:checked")).map((c) => c.value);
  const tone = (document.querySelector<HTMLInputElement>('input[name="tone"]:checked')?.value || "Professional") as Tone;
  return {
    address: $<HTMLInputElement>("f_address").value.trim(),
    neighborhood: $<HTMLInputElement>("f_neighborhood").value.trim(),
    city: $<HTMLInputElement>("f_city").value.trim(),
    price: num("f_price"),
    beds: num("f_beds"),
    baths: num("f_baths"),
    sqft: num("f_sqft"),
    yearBuilt: num("f_year"),
    features,
    highlights: $<HTMLTextAreaElement>("f_highlights").value.trim(),
    tone,
  };
}

/* ---------------- Outputs ---------------- */

type BlockKey = "long" | "short" | "social" | "subjects";
const BLOCK_TITLES: Record<BlockKey, string> = {
  long: "MLS description — long",
  short: "MLS description — short",
  social: "Instagram / Facebook post",
  subjects: "Email subject lines",
};

let current: Record<BlockKey, string> | null = null;

function wordCount(s: string): number {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

function flagListHtml(flags: Flag[], scope: string): string {
  if (flags.length === 0) return "";
  return flags
    .map(
      (f, i) => `<div class="flag-item">
        <span class="cat">${escapeHtml(f.entry.category)}</span><br/>
        <span class="phrase">“${escapeHtml(f.matched)}”</span> — ${escapeHtml(f.entry.note)}<br/>
        Suggested fix: <span class="fix">${f.entry.replacement ? `“${escapeHtml(f.entry.replacement)}”` : "(delete the phrase)"}</span>
        <button type="button" class="btn small" data-apply="${scope}:${i}">Apply fix</button>
      </div>`
    )
    .join("");
}

function renderOutputs() {
  const box = $("outputs");
  if (!current) {
    box.innerHTML = "";
    return;
  }
  box.innerHTML = (Object.keys(BLOCK_TITLES) as BlockKey[])
    .map((key) => {
      const text = current![key];
      const flags = scanText(text);
      const badge =
        flags.length === 0
          ? `<span class="flag-badge ok">✓ No Fair Housing flags</span>`
          : `<span class="flag-badge bad">⚠ ${flags.length} Fair Housing flag${flags.length > 1 ? "s" : ""}</span>`;
      const meta = key === "long" || key === "short" ? ` · ${wordCount(text)} words` : "";
      return `<div class="output-block" data-block="${key}">
        <div class="output-head"><h3>${BLOCK_TITLES[key]}${meta}</h3>
        <div class="row">${badge}<button type="button" class="btn small secondary" data-copy="${key}">Copy</button></div></div>
        <div class="output-text">${escapeHtml(text)}</div>
        <div class="output-flags">${flagListHtml(flags, key)}</div>
      </div>`;
    })
    .join("");
}

$("outputs").addEventListener("click", (ev) => {
  const t = ev.target as HTMLElement;
  const copyKey = t.getAttribute("data-copy") as BlockKey | null;
  if (copyKey && current) {
    copyText(current[copyKey], t as HTMLButtonElement);
    return;
  }
  const apply = t.getAttribute("data-apply");
  if (apply && current) {
    const [scope, idxStr] = apply.split(":");
    const key = scope as BlockKey;
    const flags = scanText(current[key]);
    const flag = flags[Number(idxStr)];
    if (flag) {
      current[key] = applyFlags(current[key], [flag]);
      renderOutputs();
    }
  }
});

/* ---------------- History ---------------- */

interface HistoryEntry {
  id: number;
  ts: number;
  title: string;
  source: string;
  output: ListingOutput;
}

function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_HISTORY) || "[]");
  } catch {
    return [];
  }
}

function renderHistory() {
  const list = loadHistory();
  const box = $("historyList");
  if (list.length === 0) {
    box.innerHTML = `<p class="hint">No listings yet — generate your first one above.</p>`;
    return;
  }
  box.innerHTML = list
    .map(
      (e) => `<div class="history-item">
        <h3>${escapeHtml(e.title)}</h3>
        <div class="meta">${new Date(e.ts).toLocaleString()} · ${escapeHtml(e.source)}</div>
        <div class="row">
          <button type="button" class="btn small secondary" data-view="${e.id}">View</button>
          <button type="button" class="btn small" data-copy-long="${e.id}">Copy MLS long</button>
          <button type="button" class="btn small ghost" data-del="${e.id}">Delete</button>
        </div>
      </div>`
    )
    .join("");
}

$("historyList").addEventListener("click", (ev) => {
  const t = ev.target as HTMLElement;
  const list = loadHistory();
  const viewId = t.getAttribute("data-view");
  const copyId = t.getAttribute("data-copy-long");
  const delId = t.getAttribute("data-del");
  if (viewId) {
    const e = list.find((x) => x.id === Number(viewId));
    if (e) {
      current = { long: e.output.long, short: e.output.short, social: e.output.social, subjects: e.output.subjects.join("\n") };
      $("resultSource").textContent = e.source;
      $("resultSource").classList.toggle("ai", e.source.startsWith("AI"));
      $("resultsCard").hidden = false;
      renderOutputs();
      $("resultsCard").scrollIntoView({ behavior: "smooth" });
    }
  }
  if (copyId) {
    const e = list.find((x) => x.id === Number(copyId));
    if (e) copyText(e.output.long, t as HTMLButtonElement);
  }
  if (delId) {
    localStorage.setItem(LS_HISTORY, JSON.stringify(list.filter((x) => x.id !== Number(delId))));
    renderHistory();
  }
});
renderHistory();

/* ---------------- Generation ---------------- */

$("propForm").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const btn = $<HTMLButtonElement>("generateBtn");
  const data = gatherForm();
  btn.disabled = true;
  btn.textContent = "Generating…";
  let output: ListingOutput;
  let source = "Demo mode";
  const key = currentKey();
  if (key) {
    try {
      output = await generateWithGemini(key, data);
      source = "AI · Gemini";
    } catch (err) {
      output = generateFromTemplate(data);
      source = "Demo mode (AI call failed)";
      alert(`The Gemini call failed, so we used the built-in template engine instead.\n\n${err instanceof Error ? err.message : String(err)}`);
    }
  } else {
    output = generateFromTemplate(data);
  }
  btn.disabled = false;
  btn.textContent = "Generate listing copy";

  current = { long: output.long, short: output.short, social: output.social, subjects: output.subjects.join("\n") };
  $("resultSource").textContent = source;
  $("resultSource").classList.toggle("ai", source.startsWith("AI"));
  $("resultsCard").hidden = false;
  renderOutputs();
  $("resultsCard").scrollIntoView({ behavior: "smooth" });

  // Free-plan soft limit (MVP placeholder — generation still works).
  const count = Number(localStorage.getItem(LS_COUNT) || "0") + 1;
  localStorage.setItem(LS_COUNT, String(count));
  const notice = $("freeNotice");
  if (count > 1) {
    notice.hidden = false;
    notice.textContent = `Heads-up: the Free plan includes 1 complete listing. Pro ($19/month, unlimited) is coming soon — in this MVP build you can keep generating.`;
  } else {
    notice.hidden = true;
  }

  const title = data.address || data.neighborhood || "Untitled listing";
  const entry: HistoryEntry = { id: Date.now(), ts: Date.now(), title, source, output };
  const list = loadHistory();
  list.unshift(entry);
  localStorage.setItem(LS_HISTORY, JSON.stringify(list.slice(0, 20)));
  renderHistory();
});

/* ---------------- Standalone compliance checker ---------------- */

const checkInput = $<HTMLTextAreaElement>("checkInput");

function renderScan() {
  const text = checkInput.value;
  const flags = scanText(text);
  const summary = $("scanSummary");
  const hl = $("highlightBox");
  const applyAll = $<HTMLButtonElement>("applyAllBtn");
  if (!text.trim()) {
    summary.textContent = "";
    hl.hidden = true;
    $("flagList").innerHTML = "";
    applyAll.hidden = true;
    return;
  }
  if (flags.length === 0) {
    summary.textContent = "✓ No flagged phrases found in this text.";
    summary.className = "ok";
    hl.hidden = true;
    applyAll.hidden = true;
  } else {
    summary.textContent = `⚠ ${flags.length} phrase${flags.length > 1 ? "s" : ""} to review:`;
    summary.className = "bad";
    hl.hidden = false;
    hl.innerHTML = highlightHtml(text, flags);
    applyAll.hidden = false;
  }
  summary.id = "scanSummary";
  $("flagList").innerHTML = flagListHtml(flags, "checker");
}

$("scanBtn").addEventListener("click", renderScan);
$("applyAllBtn").addEventListener("click", () => {
  checkInput.value = applyFlags(checkInput.value, scanText(checkInput.value));
  renderScan();
});
$("flagList").addEventListener("click", (ev) => {
  const t = ev.target as HTMLElement;
  const apply = t.getAttribute("data-apply");
  if (apply) {
    const idx = Number(apply.split(":")[1]);
    const flags = scanText(checkInput.value);
    const flag = flags[idx];
    if (flag) {
      checkInput.value = applyFlags(checkInput.value, [flag]);
      renderScan();
    }
  }
});
