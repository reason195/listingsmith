export type Tone = "Professional" | "Warm" | "Luxury";

export interface PropertyData {
  address: string;
  neighborhood: string;
  city: string;
  price: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  yearBuilt: number | null;
  features: string[];
  highlights: string;
  tone: Tone;
}

export interface ListingOutput {
  long: string;
  short: string;
  social: string;
  subjects: string[];
}

export const FEATURE_OPTIONS: { id: string; label: string; sentence: string }[] = [
  { id: "kitchen", label: "Chef's kitchen", sentence: "The chef's kitchen pairs stone countertops with stainless appliances and generous prep space" },
  { id: "hardwood", label: "Hardwood floors", sentence: "Hardwood floors run through the main living areas" },
  { id: "openplan", label: "Open floor plan", sentence: "An open floor plan connects the living, dining, and kitchen areas for easy everyday flow" },
  { id: "backyard", label: "Large backyard", sentence: "Outside, a large backyard offers room for gardening, play, and outdoor dining" },
  { id: "office", label: "Home office", sentence: "A dedicated home office provides a quiet, door-closed workspace" },
  { id: "primary", label: "Spacious primary suite", sentence: "The primary suite is a comfortable retreat with an en-suite bath" },
  { id: "closets", label: "Walk-in closets", sentence: "Walk-in closets add everyday storage where it matters" },
  { id: "fireplace", label: "Fireplace", sentence: "A fireplace anchors the living room on cooler evenings" },
  { id: "garage", label: "Two-car garage", sentence: "An attached two-car garage adds parking and storage" },
  { id: "pool", label: "Pool", sentence: "The private pool is ready for warm-weather weekends" },
  { id: "bathsreno", label: "Renovated bathrooms", sentence: "Renovated bathrooms feature updated tile, fixtures, and lighting" },
  { id: "smart", label: "Smart home system", sentence: "Smart-home controls cover lighting, climate, and security" },
  { id: "patio", label: "Covered patio", sentence: "A covered patio extends living space outdoors in any season" },
  { id: "views", label: "Scenic views", sentence: "Large windows frame scenic views from the main rooms" },
  { id: "basement", label: "Finished basement", sentence: "A finished basement adds flexible space for media, guests, or hobbies" },
  { id: "windows", label: "Energy-efficient windows", sentence: "Energy-efficient windows help keep utility costs in check" },
];

const fmtPrice = (n: number) => "$" + n.toLocaleString("en-US");
const fmtNum = (n: number) => n.toLocaleString("en-US");

function facts(d: PropertyData): string {
  const bits: string[] = [];
  if (d.beds != null) bits.push(`${d.beds} bed`);
  if (d.baths != null) bits.push(`${d.baths} bath`);
  if (d.sqft != null) bits.push(`${fmtNum(d.sqft)} sqft`);
  return bits.join(" · ");
}

const OPENERS: Record<Tone, (d: PropertyData) => string> = {
  Professional: (d) =>
    `Now offered in ${d.neighborhood || "a well-kept residential area"}${d.city ? `, ${d.city}` : ""}: a ${facts(d)} home${d.yearBuilt ? ` built in ${d.yearBuilt}` : ""} that checks the boxes buyers ask about most.`,
  Warm: (d) =>
    `Welcome home to ${d.neighborhood || "a friendly corner of town"}${d.city ? ` in ${d.city}` : ""} — a ${facts(d)} home${d.yearBuilt ? ` built in ${d.yearBuilt}` : ""} that feels as good as it looks, from the front porch to the back fence.`,
  Luxury: (d) =>
    `Presenting a distinguished residence in ${d.neighborhood || "one of the area's most coveted settings"}${d.city ? `, ${d.city}` : ""}: ${facts(d)} of refined living${d.yearBuilt ? `, built in ${d.yearBuilt}` : ""}, composed for those who appreciate detail.`,
};

const CLOSERS: Record<Tone, (d: PropertyData) => string> = {
  Professional: (d) =>
    `${d.address ? `${d.address} is ` : "This home is "}offered at ${d.price != null ? fmtPrice(d.price) : "a competitive price"}. Schedule a private showing to see the layout, light, and location in person.`,
  Warm: (d) =>
    `Offered at ${d.price != null ? fmtPrice(d.price) : "a price that invites a look"}${d.address ? ` — ${d.address}` : ""}. Come stand in the kitchen, step into the yard, and picture your life here. Showings are easy to arrange.`,
  Luxury: (d) =>
    `Offered at ${d.price != null ? fmtPrice(d.price) : "private treaty"}${d.address ? ` — ${d.address}` : ""}. Private appointments are available for qualified buyers; experience the residence in person to appreciate it fully.`,
};

const MIDDLES: Record<Tone, string> = {
  Professional: "Inside, the layout is practical and low-maintenance, with the main living spaces arranged for daily life as much as for guests. Ceiling height, natural light, and storage have all been thought through.",
  Warm: "Inside, every room invites you to slow down — sunny corners for morning coffee, gathering space for the people you love, and quiet spots to recharge. Room to host, room to work, and room to simply be.",
  Luxury: "Inside, finishes and proportions are considered at every turn, with principal rooms scaled for both grand entertaining and private retreat. Sightlines, light, and materials are composed with care throughout.",
};

const LOCATIONS: Record<Tone, (d: PropertyData) => string> = {
  Professional: (d) =>
    `Set in ${d.neighborhood || "its neighborhood"}${d.city ? ` (${d.city})` : ""}, the location keeps daily life convenient: shopping, dining, parks, and commuter routes are all within easy reach.`,
  Warm: (d) =>
    `Life in ${d.neighborhood || "this neighborhood"}${d.city ? `, ${d.city}` : ""} is easy to love — neighbors out for evening strolls, local shops and parks close at hand, and the everyday essentials of groceries, coffee, and schools just minutes away.`,
  Luxury: (d) =>
    `The setting in ${d.neighborhood || "this coveted enclave"}${d.city ? `, ${d.city}` : ""} completes the offering: an established residential street, fine dining and shopping within a short drive, and the privacy that comes with a well-chosen address.`,
};

/** Built-in template engine used in Demo mode (no API key). */
export function generateFromTemplate(d: PropertyData): ListingOutput {
  const featureSentences = d.features
    .map((id) => FEATURE_OPTIONS.find((f) => f.id === id)?.sentence)
    .filter((s): s is string => Boolean(s));

  const p1 = OPENERS[d.tone](d);
  const p2parts = [MIDDLES[d.tone], ...featureSentences.map((s) => s + ".")];
  const p2 = p2parts.join(" ");
  const p3parts: string[] = [];
  if (d.highlights.trim()) p3parts.push(d.highlights.trim().replace(/\.*$/, "."));
  if (d.sqft != null && d.yearBuilt != null) {
    const age = new Date().getFullYear() - d.yearBuilt;
    p3parts.push(`With ${fmtNum(d.sqft)} square feet and ${age <= 5 ? "nearly-new construction" : "the solid bones of an established home"}, it offers space that adapts as needs change.`);
  }
  p3parts.push(CLOSERS[d.tone](d));
  const long = [p1, p2, LOCATIONS[d.tone](d), p3parts.join(" ")].filter(Boolean).join("\n\n");

  const short =
    `${facts(d)} in ${d.neighborhood || d.city || "town"}${d.price != null ? ` — ${fmtPrice(d.price)}` : ""}. ` +
    `${featureSentences.slice(0, 3).join("; ")}. ` +
    `${d.highlights.trim() ? d.highlights.trim().replace(/\.*$/, ".") + " " : ""}Close to shopping, dining, and parks. Book your showing today.`;

  const tag = (s: string) => "#" + s.replace(/[^A-Za-z0-9]/g, "");
  const hashtags = ["#JustListed", "#RealEstate", d.city ? tag(d.city.split(",")[0]) + "RealEstate" : "#NewListing", d.neighborhood ? tag(d.neighborhood) : "#HomeForSale", "#OpenHouse"]
    .filter(Boolean)
    .join(" ");
  const social =
    `🏡 Just listed in ${d.neighborhood || d.city || "town"}! ${facts(d)}${d.price != null ? ` at ${fmtPrice(d.price)}` : ""}.\n` +
    `${featureSentences.slice(0, 3).map((s) => "✨ " + s).join("\n")}\n` +
    `📍 ${d.address || ""}${d.city ? `, ${d.city}` : ""} — DM for a private tour!\n${hashtags}`;

  const subjects = [
    d.price != null ? `Just Listed: ${facts(d)} in ${d.neighborhood || d.city} — ${fmtPrice(d.price)}` : `Just Listed: ${facts(d)} in ${d.neighborhood || d.city}`,
    `${d.address || "New listing"}: ${featureSentences[0] ? featureSentences[0].split(" ").slice(0, 6).join(" ") + "…" : "see inside"}`,
    `Open House This Weekend — ${d.beds ?? ""} Bed Home in ${d.neighborhood || d.city}`,
  ];

  return { long, short, social, subjects };
}
