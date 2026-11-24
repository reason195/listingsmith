import { SENSITIVE_PHRASES, type SensitivePhrase } from "./wordlist";

export interface Flag {
  start: number;
  end: number;
  matched: string;
  entry: SensitivePhrase;
}

/**
 * Scan text for sensitive phrases. Matching is case-insensitive substring
 * matching; when matches overlap, the longest phrase at the earliest
 * position wins (so "bachelor pad" beats "bachelor", and
 * "walking distance to church" beats "walking distance").
 */
export function scanText(text: string): Flag[] {
  const lower = text.toLowerCase();
  const candidates: Flag[] = [];
  for (const entry of SENSITIVE_PHRASES) {
    const needle = entry.phrase.toLowerCase();
    let idx = lower.indexOf(needle);
    while (idx !== -1) {
      candidates.push({
        start: idx,
        end: idx + needle.length,
        matched: text.slice(idx, idx + needle.length),
        entry,
      });
      idx = lower.indexOf(needle, idx + 1);
    }
  }
  candidates.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const accepted: Flag[] = [];
  let cursor = -1;
  for (const c of candidates) {
    if (c.start >= cursor) {
      accepted.push(c);
      cursor = c.end;
    }
  }
  return accepted;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Render text as HTML with flagged phrases wrapped in <mark>. */
export function highlightHtml(text: string, flags: Flag[]): string {
  if (flags.length === 0) return escapeHtml(text);
  let out = "";
  let pos = 0;
  for (const f of flags) {
    out += escapeHtml(text.slice(pos, f.start));
    out += `<mark title="${escapeHtml(f.entry.category)}">${escapeHtml(f.matched)}</mark>`;
    pos = f.end;
  }
  out += escapeHtml(text.slice(pos));
  return out;
}

function matchCase(original: string, replacement: string): string {
  if (!replacement) return replacement;
  if (original.charAt(0) === original.charAt(0).toUpperCase() && original.charAt(0) !== original.charAt(0).toLowerCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

/** Apply the suggested replacement for every flag, then tidy spacing/punctuation. */
export function applyFlags(text: string, flags: Flag[]): string {
  if (flags.length === 0) return text;
  let out = "";
  let pos = 0;
  for (const f of flags) {
    out += text.slice(pos, f.start);
    out += matchCase(f.matched, f.entry.replacement);
    pos = f.end;
  }
  out += text.slice(pos);
  return out
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +([.,!?;:])/g, "$1")
    .replace(/\(\s*\)/g, "")
    .replace(/\s+([—–])\s+/g, " $1 ")
    .trim();
}

/** Apply just one flag (by its start offset in the current text). */
export function applyFlag(text: string, flag: Flag): string {
  return applyFlags(text, [flag]);
}
