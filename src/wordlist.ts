/**
 * Fair Housing screening wordlist.
 *
 * Compiled from publicly available U.S. Fair Housing guidance (HUD advertising
 * guidance, NAR fair-housing resources, state fair-housing word lists).
 * Each entry: the risky phrase, the protected-class category it can implicate,
 * a literal `replacement` that can be applied to the text in one click
 * (empty string = delete the phrase), and a short `note` explaining the risk.
 *
 * This is a screening aid only — not legal advice, and not exhaustive.
 */
export interface SensitivePhrase {
  phrase: string;
  category: string;
  replacement: string;
  note: string;
}

export const SENSITIVE_PHRASES: SensitivePhrase[] = [
  // ---- Race / Color ----
  { phrase: "white neighborhood", category: "Race / Color", replacement: "", note: "Describes the racial makeup of an area — a classic steering signal. Describe the property and its amenities instead." },
  { phrase: "black neighborhood", category: "Race / Color", replacement: "", note: "Describes the racial makeup of an area. Name the neighborhood and describe factual features instead." },
  { phrase: "minority neighborhood", category: "Race / Color", replacement: "", note: "References the racial composition of an area. Use the neighborhood name and factual amenities." },
  { phrase: "racially diverse", category: "Race / Color", replacement: "", note: "Comments on residents' race. Market the property, not the people who live nearby." },
  { phrase: "ethnic neighborhood", category: "Race / Color", replacement: "", note: "Implies the area is defined by an ethnic group. Use the neighborhood name and factual features." },
  { phrase: "ethnic enclave", category: "Race / Color", replacement: "", note: "Implies the area is defined by an ethnic group. Use the neighborhood name instead." },
  { phrase: "integrated neighborhood", category: "Race / Color", replacement: "", note: "Comments on the racial mix of residents. Describe the property itself." },
  { phrase: "segregated", category: "Race / Color", replacement: "", note: "Directly references racial segregation. Remove it." },
  { phrase: "ghetto", category: "Race / Color", replacement: "", note: "A slur-like term associated with race and national origin. Remove it." },
  { phrase: "exotic neighborhood", category: "Race / Color", replacement: "", note: "'Exotic' applied to an area reads as a comment on its residents' origin. Describe architecture or amenities instead." },
  { phrase: "melting pot", category: "Race / Color", replacement: "", note: "Comments on the ethnic mix of residents. Describe the property and amenities." },
  { phrase: "up-and-coming neighborhood", category: "Race / Color", replacement: "area with new shops and restaurants opening nearby", note: "Often read as coded language about demographic change. Point to specific, factual new amenities instead." },

  // ---- National Origin ----
  { phrase: "english-speaking", category: "National Origin", replacement: "", note: "Signals a preference based on language/national origin. Remove it." },
  { phrase: "english only", category: "National Origin", replacement: "", note: "Signals exclusion by language/national origin. Remove it." },
  { phrase: "no foreigners", category: "National Origin", replacement: "", note: "Direct national-origin exclusion. Remove it." },
  { phrase: "foreigners welcome", category: "National Origin", replacement: "", note: "Even 'welcome' phrasing singles out national origin. Market the property to everyone by describing it, not its buyers." },
  { phrase: "immigrant neighborhood", category: "National Origin", replacement: "", note: "Describes residents by immigration origin. Use the neighborhood name and factual amenities." },
  { phrase: "american neighborhood", category: "National Origin", replacement: "", note: "Implies a national-origin character for the area. Use the neighborhood name instead." },
  { phrase: "hispanic area", category: "National Origin", replacement: "", note: "Describes an area by ethnicity/national origin. Use the neighborhood name instead." },
  { phrase: "asian community", category: "National Origin", replacement: "", note: "Describes an area by ethnicity/national origin. Use the neighborhood name instead." },

  // ---- Religion ----
  { phrase: "walking distance to church", category: "Religion", replacement: "a short distance from local amenities", note: "Highlighting proximity to a specific faith's house of worship can signal a religious preference. Give distances to neutral landmarks or amenities." },
  { phrase: "near the church", category: "Religion", replacement: "near local amenities", note: "Singling out a church signals a religious preference. Use neutral landmarks instead." },
  { phrase: "near a synagogue", category: "Religion", replacement: "near local amenities", note: "Singling out a house of worship signals a religious preference. Use neutral landmarks instead." },
  { phrase: "near the mosque", category: "Religion", replacement: "near local amenities", note: "Singling out a house of worship signals a religious preference. Use neutral landmarks instead." },
  { phrase: "close to houses of worship", category: "Religion", replacement: "close to local amenities", note: "Proximity to worship sites is a known fair-housing flag. Use neutral amenities instead." },
  { phrase: "christian neighborhood", category: "Religion", replacement: "", note: "Describes an area by religion. Use the neighborhood name and factual features." },
  { phrase: "jewish community", category: "Religion", replacement: "", note: "Describes an area by religion/ethnicity. Use the neighborhood name instead." },
  { phrase: "muslim area", category: "Religion", replacement: "", note: "Describes an area by religion. Use the neighborhood name instead." },
  { phrase: "church-going", category: "Religion", replacement: "", note: "Describes desired residents by religious practice. Remove it." },
  { phrase: "faith community", category: "Religion", replacement: "community", note: "Frames the area around religion. Keep descriptions secular and factual." },
  { phrase: "kosher neighborhood", category: "Religion", replacement: "", note: "Describes an area by religious practice. If relevant, describe the kitchen itself (e.g. double ovens), not the neighborhood." },

  // ---- Sex / Gender ----
  { phrase: "bachelor pad", category: "Sex / Gender", replacement: "stylish one-bedroom home", note: "Gendered and implies a single male occupant. Describe the home, not the imagined buyer." },
  { phrase: "bachelor", category: "Sex / Gender", replacement: "low-maintenance", note: "Gendered term for the imagined occupant. Describe the property's features instead." },
  { phrase: "man cave", category: "Sex / Gender", replacement: "bonus media room", note: "Gendered room label. Use a neutral room name." },
  { phrase: "she shed", category: "Sex / Gender", replacement: "garden studio", note: "Gendered room label. Use a neutral room name." },
  { phrase: "his and hers", category: "Sex / Gender", replacement: "dual", note: "Gendered phrasing. 'Dual sinks' / 'dual closets' says the same thing neutrally." },
  { phrase: "mother-in-law suite", category: "Sex / Gender", replacement: "guest suite", note: "Gendered and family-status loaded. 'Guest suite' or 'accessory dwelling unit' is neutral." },
  { phrase: "ladies will love", category: "Sex / Gender", replacement: "", note: "Addresses one gender directly. Describe the feature itself." },
  { phrase: "perfect for a single woman", category: "Sex / Gender", replacement: "", note: "Targets a buyer by sex and marital status. Remove it." },
  { phrase: "gentleman's farm", category: "Sex / Gender", replacement: "small farm property", note: "Gendered label. Describe the acreage and outbuildings instead." },
  { phrase: "female roommate", category: "Sex / Gender", replacement: "", note: "States a sex preference. Remove it." },
  { phrase: "male roommate", category: "Sex / Gender", replacement: "", note: "States a sex preference. Remove it." },

  // ---- Familial Status ----
  { phrase: "perfect for families", category: "Familial Status", replacement: "with a spacious, flexible layout", note: "Naming families as the ideal buyer can discourage other households. Describe the space itself — size, layout, yard." },
  { phrase: "great for families", category: "Familial Status", replacement: "with room to spread out", note: "Same issue as 'perfect for families'. Describe features, not the household type." },
  { phrase: "family-friendly", category: "Familial Status", replacement: "", note: "Implies households without children are less welcome. Describe the concrete features (yard, parks nearby) instead." },
  { phrase: "ideal for families", category: "Familial Status", replacement: "with a flexible, open layout", note: "Describe the layout, not the household type." },
  { phrase: "no children", category: "Familial Status", replacement: "", note: "Direct exclusion of families with children — prohibited unless the property qualifies as 55+ housing for older persons." },
  { phrase: "no kids", category: "Familial Status", replacement: "", note: "Direct exclusion of families with children. Remove it." },
  { phrase: "children not allowed", category: "Familial Status", replacement: "", note: "Direct exclusion of families with children. Remove it." },
  { phrase: "adults only", category: "Familial Status", replacement: "", note: "Excludes families with children — only lawful for qualifying 55+ communities." },
  { phrase: "adults preferred", category: "Familial Status", replacement: "", note: "States a preference against families with children. Remove it." },
  { phrase: "child-free", category: "Familial Status", replacement: "", note: "Signals children are unwelcome. Remove it." },
  { phrase: "quiet neighborhood", category: "Familial Status", replacement: "low-traffic residential street", note: "'Quiet' is a well-known code word that can discourage families with children. Describe the street factually instead." },
  { phrase: "quiet community", category: "Familial Status", replacement: "low-traffic residential setting", note: "Same concern as 'quiet neighborhood'. Use factual descriptions." },
  { phrase: "safe neighborhood", category: "Familial Status", replacement: "well-lit street", note: "Safety claims are unverifiable and a known steering flag. Describe factual features (lighting, sidewalks) and let buyers check local data." },
  { phrase: "safe community", category: "Familial Status", replacement: "gated, well-lit setting", note: "Unverifiable safety claim and a known steering flag. Stick to factual features." },
  { phrase: "mature community", category: "Familial Status", replacement: "", note: "Implies children are unwelcome unless it is a qualifying 55+ community." },
  { phrase: "empty nesters", category: "Familial Status", replacement: "anyone seeking low-maintenance living", note: "Names a preferred household type. Describe the low-maintenance features instead." },
  { phrase: "perfect for retirees", category: "Familial Status", replacement: "with single-level living", note: "Targets a household type. Describe the single-level layout and low upkeep instead (unless 55+ housing)." },
  { phrase: "young professionals", category: "Familial Status", replacement: "commuters", note: "Names a preferred demographic. Describe commute times and transit access instead." },
  { phrase: "ideal for couples", category: "Familial Status", replacement: "with a comfortable, open layout", note: "Names a preferred household type. Describe the layout." },
  { phrase: "couples only", category: "Familial Status", replacement: "", note: "Excludes other household types. Remove it." },
  { phrase: "singles only", category: "Familial Status", replacement: "", note: "Excludes other household types. Remove it." },
  { phrase: "good schools", category: "Familial Status", replacement: "assigned schools", note: "'Good schools' is subjective and a known steering phrase. Name the assigned schools factually and let buyers verify ratings and eligibility." },

  // ---- Disability ----
  { phrase: "walking distance to church", category: "Religion", replacement: "a short distance from local amenities", note: "Combines two flags: it highlights a specific faith's house of worship and assumes the reader walks. Give a distance to a neutral amenity instead." },
  { phrase: "walking distance", category: "Disability", replacement: "a short distance", note: "Assumes the reader walks. Give the actual distance instead (e.g. '0.3 miles to the station')." },
  { phrase: "walk to", category: "Disability", replacement: "close to", note: "Assumes mobility. State the distance or travel time instead." },
  { phrase: "no wheelchairs", category: "Disability", replacement: "", note: "Direct disability exclusion. Remove it." },
  { phrase: "able-bodied", category: "Disability", replacement: "", note: "States a physical-ability preference. Remove it." },
  { phrase: "handicapped", category: "Disability", replacement: "accessible", note: "Outdated term. Use 'accessible' to describe features (e.g. 'accessible entry')." },
  { phrase: "must be able to climb stairs", category: "Disability", replacement: "note: entry is up one flight of stairs", note: "States an ability requirement. Describe the physical layout factually instead." },
  { phrase: "independent living required", category: "Disability", replacement: "", note: "Screens out people who use support services. Remove it." },
  { phrase: "drug-free community", category: "Disability", replacement: "", note: "Can discriminate against people in recovery, who are protected as persons with disabilities. Remove it." },
  { phrase: "no service animals", category: "Disability", replacement: "", note: "Service animals are not pets and cannot be barred. Remove it." },

  // ---- General steering / other protected classes ----
  { phrase: "exclusive community", category: "General steering", replacement: "amenity-rich community", note: "'Exclusive' signals that some buyers are unwelcome. List the actual amenities instead." },
  { phrase: "exclusive neighborhood", category: "General steering", replacement: "", note: "'Exclusive' signals exclusion. Name the neighborhood and its factual features." },
  { phrase: "prestigious neighborhood", category: "General steering", replacement: "", note: "Coded status language that can steer buyers. Name the neighborhood and describe factual features." },
  { phrase: "restricted community", category: "General steering", replacement: "", note: "Implies restricted access by buyer type. If an HOA applies, say 'HOA community' factually." },
  { phrase: "no section 8", category: "Source of income", replacement: "", note: "Source-of-income discrimination is banned in many states and cities. Remove it." },
  { phrase: "perfect for executives", category: "General steering", replacement: "with a dedicated home office", note: "Targets a buyer class. Describe the office space and commute instead." },
  { phrase: "traditional neighborhood", category: "General steering", replacement: "", note: "Can read as coded language about who belongs. Describe architecture and amenities factually." },
];
