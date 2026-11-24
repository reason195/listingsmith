import type { ListingOutput, PropertyData } from "./templates";
import { FEATURE_OPTIONS } from "./templates";

const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

function buildPrompt(d: PropertyData): string {
  const featureLabels = d.features
    .map((id) => FEATURE_OPTIONS.find((f) => f.id === id)?.label)
    .filter(Boolean)
    .join(", ");
  return [
    "You are an expert U.S. real-estate copywriter. Write listing copy for this property.",
    "",
    `Address: ${d.address || "(not given)"}`,
    `Neighborhood: ${d.neighborhood || "(not given)"}`,
    `City/State: ${d.city || "(not given)"}`,
    `Price: ${d.price != null ? "$" + d.price.toLocaleString("en-US") : "(not given)"}`,
    `Bedrooms: ${d.beds ?? "(not given)"}, Bathrooms: ${d.baths ?? "(not given)"}, Living area: ${d.sqft != null ? d.sqft + " sqft" : "(not given)"}, Year built: ${d.yearBuilt ?? "(not given)"}`,
    `Key features: ${featureLabels || "(none specified)"}`,
    `Extra highlights: ${d.highlights || "(none)"}`,
    `Tone: ${d.tone}`,
    "",
    "Rules: Comply with the U.S. Fair Housing Act — never reference race, color, religion, sex, familial status, national origin, or disability; describe the property and factual amenities only; never claim an area is 'safe' or 'quiet'; give distances instead of 'walking distance'.",
    "",
    "Return ONLY a JSON object with these keys:",
    '- "long": MLS listing description, 180-220 words, 2-3 paragraphs separated by \\n\\n',
    '- "short": short MLS description, about 60 words',
    '- "social": an Instagram/Facebook post with 4-6 relevant hashtags',
    '- "subjects": array of exactly 3 email subject lines',
  ].join("\n");
}

/** Generate listing copy with the user's own Gemini API key. Throws on failure. */
export async function generateWithGemini(apiKey: string, d: PropertyData): Promise<ListingOutput> {
  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(d) }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini API error ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = await res.json();
  const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");
  const parsed = JSON.parse(text);
  if (typeof parsed.long !== "string" || typeof parsed.short !== "string" || typeof parsed.social !== "string" || !Array.isArray(parsed.subjects)) {
    throw new Error("Gemini returned an unexpected format.");
  }
  return {
    long: parsed.long,
    short: parsed.short,
    social: parsed.social,
    subjects: parsed.subjects.map(String).slice(0, 3),
  };
}
