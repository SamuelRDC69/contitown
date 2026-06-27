// Mock data for news, discussions, votes, AMAs, marketplace
import type { Town } from "./towns";

export interface NewsItem {
  id: string;
  townSlug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: "government" | "community" | "safety" | "events" | "infrastructure";
}

export interface Discussion {
  id: string;
  townSlug: string;
  title: string;
  author: string;
  body: string;
  replies: number;
  createdAt: string;
  tags: string[];
}

export interface Vote {
  id: string;
  townSlug: string;
  question: string;
  description: string;
  status: "open" | "closed" | "upcoming";
  votesFor: number;
  votesAgainst: number;
  closesAt: string;
  category: string;
}

export interface AMA {
  id: string;
  townSlug: string;
  politicianName: string;
  politicianTitle: string;
  topic: string;
  scheduledAt: string;
  status: "upcoming" | "live" | "completed";
  questions: number;
}

export interface MarketplaceListing {
  id: string;
  townSlug: string;
  title: string;
  price: number;
  description: string;
  seller: string;
  category: "goods" | "services" | "housing" | "jobs";
  postedAt: string;
}

export interface Business {
  id: string;
  townSlug: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  website: string;
  featured: boolean;
}

export const news: NewsItem[] = [
  { id: "n1", townSlug: "springfield", title: "City Council Approves New Bike Lane Network", excerpt: "A 12-mile protected bike lane system connecting downtown to the east side was approved in a 7-2 vote Tuesday night.", author: "Sarah Chen", publishedAt: "2026-06-26", category: "government" },
  { id: "n2", townSlug: "springfield", title: "Summer Festival Returns to Central Park", excerpt: "The annual Summer Fest will feature local bands, food trucks, and a kids zone from July 14-17.", author: "Marcus Williams", publishedAt: "2026-06-25", category: "events" },
  { id: "n3", townSlug: "springfield", title: "Road Closure: Main St. Repaving This Weekend", excerpt: "Main Street between Oak and Elm will be closed Saturday 6am through Sunday 6pm for resurfacing.", author: "DOT Staff", publishedAt: "2026-06-24", category: "infrastructure" },
  { id: "n4", townSlug: "riverside", title: "New Community Garden Opens at Victoria Park", excerpt: "Twenty plots are available for residents to rent annually, with a grand opening celebration this Saturday.", author: "Elena Rodriguez", publishedAt: "2026-06-26", category: "community" },
  { id: "n5", townSlug: "riverside", title: "Police Department Launches Mental Health Co-Responder Program", excerpt: "Two licensed social workers will accompany officers on appropriate calls starting next month.", author: "Chief Thompson", publishedAt: "2026-06-23", category: "safety" },
  { id: "n6", townSlug: "maplewood", title: "Library Renovations Complete After 18 Months", excerpt: "The renovated Maplewood Public Library reopens Monday with new meeting rooms, a maker space, and expanded children's area.", author: "Library Board", publishedAt: "2026-06-22", category: "community" },
  { id: "n7", townSlug: "ashland", title: "Shakespeare Festival Announces 2027 Season Lineup", excerpt: "Next season will feature Hamlet, Twelfth Night, and a new adaptation of The Tempest set in modern Oregon.", author: "Festival PR", publishedAt: "2026-06-21", category: "events" },
];

export const discussions: Discussion[] = [
  { id: "d1", townSlug: "springfield", title: "Should we allow food trucks on residential streets?", author: "NeighborhoodWatch42", body: "I've been getting questions about whether food trucks should be permitted to operate in residential areas. Currently they're only allowed in commercial zones and special events. What does everyone think?", replies: 23, createdAt: "2026-06-26", tags: ["zoning", "business"] },
  { id: "d2", townSlug: "springfield", title: "Proposal: Free WiFi in all public parks", author: "TechAdvocate", body: "I'd like to propose the city invest in free WiFi infrastructure in our 15 public parks. Estimated cost: $180K. Benefits: digital equity, tourism, remote work spaces.", replies: 45, createdAt: "2026-06-25", tags: ["technology", "budget"] },
  { id: "d3", townSlug: "riverside", title: "How can we support small businesses on University Ave?", author: "LocalBizOwner", body: "Foot traffic has been down since the mall opened. What ideas do people have to bring customers back to University Avenue?", replies: 31, createdAt: "2026-06-24", tags: ["economy", "downtown"] },
  { id: "d4", townSlug: "maplewood", title: "Community input: What should we do with the vacant lot on Elm?", author: "ParksCommittee", body: "The city acquired the vacant lot at 420 Elm St. Options under consideration: pocket park, affordable housing, mixed-use development, or sell to private developer.", replies: 67, createdAt: "2026-06-23", tags: ["development", "housing"] },
  { id: "d5", townSlug: "ashland", title: "Ideas for reducing wildfire risk in the urban-wildland interface", author: "FireSafeAshland", body: "With fire seasons getting worse, what steps should we take as a community? Defensible space requirements? Building codes? Evacuation routes?", replies: 28, createdAt: "2026-06-22", tags: ["safety", "environment"] },
];

export const votes: Vote[] = [
  { id: "v1", townSlug: "springfield", question: "Should the city allocate $2.5M for a new aquatic center?", description: "Construction of a competition-grade aquatic facility at the recreation complex, replacing the aging pool built in 1987.", status: "open", votesFor: 342, votesAgainst: 289, closesAt: "2026-07-03", category: "Budget" },
  { id: "v2", townSlug: "springfield", question: "Approve zoning change for mixed-use development at 5th & Monroe?", description: "Rezone from R-2 Residential to MU-Mixed Use to allow a 4-story building with ground-floor retail and 60 apartments.", status: "open", votesFor: 198, votesAgainst: 215, closesAt: "2026-06-30", category: "Zoning" },
  { id: "v3", townSlug: "riverside", question: "Support ranked-choice voting for municipal elections?", description: "Switch from first-past-the-post to ranked-choice voting in all city council and mayoral elections starting 2027.", status: "open", votesFor: 1247, votesAgainst: 891, closesAt: "2026-07-10", category: "Elections" },
  { id: "v4", townSlug: "maplewood", question: "Establish a $500K annual fund for affordable housing?", description: "Create a dedicated funding stream from property tax revenue to support affordable housing development and rental assistance.", status: "upcoming", votesFor: 0, votesAgainst: 0, closesAt: "2026-07-15", category: "Housing" },
  { id: "v5", townSlug: "ashland", question: "Ban single-use plastics in city restaurants and food vendors?", description: "Prohibit plastic bags, straws, and takeout containers. Exemptions for medical and accessibility needs.", status: "closed", votesFor: 2103, votesAgainst: 1876, closesAt: "2026-06-20", category: "Environment" },
];

export const amas: AMA[] = [
  { id: "a1", townSlug: "springfield", politicianName: "Mayor Linda Hayes", politicianTitle: "Mayor of Springfield", topic: "Infrastructure & Budget Priorities", scheduledAt: "2026-06-28T18:00:00Z", status: "upcoming", questions: 34 },
  { id: "a2", townSlug: "springfield", politicianName: "Councilmember James Park", politicianTitle: "City Council, Ward 3", topic: "Affordable Housing & Development", scheduledAt: "2026-07-02T18:00:00Z", status: "upcoming", questions: 12 },
  { id: "a3", townSlug: "riverside", politicianName: "Chief Maria Gonzalez", politicianTitle: "Police Chief", topic: "Community Policing & Safety Initiatives", scheduledAt: "2026-06-29T19:00:00Z", status: "upcoming", questions: 28 },
  { id: "a4", townSlug: "maplewood", politicianName: "Rep. Sarah Lindqvist", politicianTitle: "State Representative, District 42B", topic: "State Legislative Session Recap & Local Impact", scheduledAt: "2026-06-30T17:00:00Z", status: "upcoming", questions: 19 },
  { id: "a5", townSlug: "ashland", politicianName: "Councilmember David Trujillo", politicianTitle: "City Council, Ward 2", topic: "Climate Action & Wildfire Preparedness", scheduledAt: "2026-06-25T18:00:00Z", status: "completed", questions: 41 },
];

export const marketplace: MarketplaceListing[] = [
  { id: "m1", townSlug: "springfield", title: "Vintage Mid-Century Modern Desk", price: 150, description: "Beautiful walnut desk from a local estate. 48\"x24\", excellent condition.", seller: "FindsAndGoods", category: "goods", postedAt: "2026-06-26" },
  { id: "m2", townSlug: "springfield", title: "Lawn Mowing Service - Weekly or Biweekly", price: 45, description: "Reliable lawn care, fully insured. Weekly $45/visit, biweekly $55/visit. Free estimates.", seller: "GreenThumbCo", category: "services", postedAt: "2026-06-25" },
  { id: "m3", townSlug: "riverside", title: "2BR/1BA Apartment Near UCR - $1,400/mo", price: 1400, description: "Spacious upstairs unit in quiet complex. In-unit laundry, parking, pet-friendly. Available Aug 1.", seller: "PropMgmtPlus", category: "housing", postedAt: "2026-06-26" },
  { id: "m4", townSlug: "maplewood", title: "Part-Time Bookkeeper Needed - Local Nonprofit", price: 0, description: "10 hrs/week, flexible schedule. QuickBooks experience required. Great for retirees or students.", seller: "MaplewoodCommunityFdn", category: "jobs", postedAt: "2026-06-24" },
  { id: "m5", townSlug: "ashland", title: "Handmade Pottery - Bowls, Mugs, Vases", price: 35, description: "Locally made stoneware pottery. Microwave and dishwasher safe. Prices $18-$65. Pickup in Ashland.", seller: "ClayFireStudio", category: "goods", postedAt: "2026-06-23" },
  { id: "m6", townSlug: "springfield", title: "Math Tutoring - Middle & High School", price: 50, description: "Certified math teacher offering tutoring. $50/hr. In-person or virtual. Algebra through Calculus.", seller: "TutorTom", category: "services", postedAt: "2026-06-22" },
];

export const businesses: Business[] = [
  { id: "b1", townSlug: "springfield", name: "Cornerstone Coffee Roasters", category: "Food & Drink", description: "Locally roasted specialty coffee, pastries, and light lunch. Free WiFi and community event space.", phone: "(555) 234-5678", website: "cornercoffeespringfield.com", featured: true },
  { id: "b2", townSlug: "springfield", name: "Prairie Home Hardware", category: "Retail", description: "Family-owned hardware store since 1952. Key cutting, screen repair, paint mixing, and expert advice.", phone: "(555) 345-6789", website: "prairiehomehardware.com", featured: false },
  { id: "b3", townSlug: "springfield", name: "Springfield Family Dental", category: "Healthcare", description: "General and cosmetic dentistry for all ages. Accepts most insurance. New patients welcome.", phone: "(555) 456-7890", website: "springfieldfamilydental.com", featured: true },
  { id: "b4", townSlug: "riverside", name: "University Avenue Books", category: "Retail", description: "Independent bookstore with 30,000+ titles. Author events every Thursday. Cafe on-site.", phone: "(555) 567-8901", website: "uavebooks.com", featured: true },
  { id: "b5", townSlug: "maplewood", name: "The Maple Table", category: "Food & Drink", description: "Farm-to-table restaurant featuring local ingredients. Brunch daily, dinner Wed-Sun. Reservations recommended.", phone: "(555) 678-9012", website: "themapletable.com", featured: true },
  { id: "b6", townSlug: "ashland", name: "Rogue Valley Bicycles", category: "Recreation", description: "Full-service bike shop. Sales, repairs, rentals. E-bike specialists. Trail maps and local ride group info.", phone: "(555) 789-0123", website: "rogvalleybikes.com", featured: false },
];

export function getNewsForTown(townSlug: string) {
  return news.filter((n) => n.townSlug === townSlug);
}

export function getDiscussionsForTown(townSlug: string) {
  return discussions.filter((d) => d.townSlug === townSlug);
}

export function getVotesForTown(townSlug: string) {
  return votes.filter((v) => v.townSlug === townSlug);
}

export function getAMAsForTown(townSlug: string) {
  return amas.filter((a) => a.townSlug === townSlug);
}

export function getMarketplaceForTown(townSlug: string) {
  return marketplace.filter((m) => m.townSlug === townSlug);
}

export function getBusinessesForTown(townSlug: string) {
  return businesses.filter((b) => b.townSlug === townSlug);
}

// ── Alcudia (launch town) content ──

export const alcudiaNews: NewsItem[] = [
  { id: "an1", townSlug: "alcudia", title: "Ajuntament Approves Beach Accessibility Upgrades", excerpt: "Ramps, accessible walkways, and amphibious chairs will be installed at Platja d'Alcudia and Muro Beach before summer peak.", author: "Maria Ferrer", publishedAt: "2026-06-26", category: "government" },
  { id: "an2", townSlug: "alcudia", title: "Summer Concert Series Returns to the Roman Walls", excerpt: "Every Friday in July and August, free concerts inside the historic Roman walls. Jazz, classical, and Mallorquín folk.", author: "Cultura Alcudia", publishedAt: "2026-06-25", category: "events" },
  { id: "an3", townSlug: "alcudia", title: "New Pedestrian Zone on Carrer de la Marina", excerpt: "Starting July 1, the stretch between Plaça de la Vila and the market will be fully pedestrianised from 10am to 2am.", author: "Ajuntament", publishedAt: "2026-06-24", category: "infrastructure" },
  { id: "an4", townSlug: "alcudia", title: "Roman Ruins Night Tours Launch This Weekend", excerpt: "The Alcúdia archaeological site will offer guided night tours every Saturday in July, with projection mapping on the Roman theatre.", author: "Museu Alcúdia", publishedAt: "2026-06-23", category: "events" },
  { id: "an5", townSlug: "alcudia", title: "Weekly Market Expands — 30 New Local Vendors", excerpt: "The Tuesday and Sunday market adds a new 'artisans' section featuring local pottery, leather, and sobrassada producers.", author: "Market Board", publishedAt: "2026-06-22", category: "community" },
];

export const alcudiaDiscussions: Discussion[] = [
  { id: "ad1", townSlug: "alcudia", title: "Should we limit tourist rental licenses in the old town?", author: "VecinaDelCentro", body: "The number of tourist rentals in the walled town has tripled in 5 years. Many residents feel the character is changing. Should the ajuntament cap new licenses?", replies: 89, createdAt: "2026-06-26", tags: ["tourism", "housing", "old-town"] },
  { id: "ad2", townSlug: "alcudia", title: "Proposal: Free Spanish/Mallorquín classes for newcomers", author: "IntegracioAlcudia", body: "Many expats and seasonal workers want to learn the local language. I propose free weekly classes at the biblioteca funded by the cultural budget.", replies: 56, createdAt: "2026-06-25", tags: ["culture", "integration", "education"] },
  { id: "ad3", townSlug: "alcudia", title: "Bike lane from Alcudia Port to Platja d'Alcudia?", author: "CiclistaMallorquin", body: "The road to the port gets dangerous in summer with all the rental bikes. A protected 2km lane would make it safe for families.", replies: 112, createdAt: "2026-06-24", tags: ["cycling", "safety", "tourism"] },
  { id: "ad4", townSlug: "alcudia", title: "How can we reduce plastic waste on the beach?", author: "PlatjaNet", body: "After busy weekends the beach is covered in plastic. Ideas: free refill stations, deposit-return for cups, volunteer clean-up days?", replies: 43, createdAt: "2026-06-23", tags: ["environment", "beach", "waste"] },
];

export const alcudiaVotes: Vote[] = [
  { id: "av1", townSlug: "alcudia", question: "Should the town invest €150K in a new covered market pavilion?", description: "Build a modern open-air pavilion next to the existing market for year-round vendor space, events, and shelter from rain/heat.", status: "open", votesFor: 423, votesAgainst: 198, closesAt: "2026-07-05", category: "Infrastructure" },
  { id: "av2", townSlug: "alcudia", question: "Ban motorboats within 200m of Platja d'Alcudia swimming area?", description: "Create a no-wake / no-entry zone for motorboats within 200m of the marked swimming buoys during summer months (May–October).", status: "open", votesFor: 612, votesAgainst: 344, closesAt: "2026-07-08", category: "Safety" },
  { id: "av3", townSlug: "alcudia", question: "Support a weekly 'car-free Sunday' in the old town?", description: "Close all vehicle traffic to the walled old town every Sunday from 9am to 3pm, encouraging walking, cycling, and outdoor dining.", status: "upcoming", votesFor: 0, votesAgainst: 0, closesAt: "2026-07-15", category: "Transport" },
];

export const alcudiaAMAs: AMA[] = [
  { id: "aa1", townSlug: "alcudia", politicianName: "Antònia Martín", politicianTitle: "Alcaldessa d'Alcúdia", topic: "Tourism Strategy & Sustainable Growth", scheduledAt: "2026-06-29T19:00:00Z", status: "upcoming", questions: 67 },
  { id: "aa2", townSlug: "alcudia", politicianName: "Pere Ferrer", politicianTitle: "Regidor de Cultura", topic: "Cultural Heritage & Summer Events Programme", scheduledAt: "2026-07-03T18:00:00Z", status: "upcoming", questions: 23 },
  { id: "aa3", townSlug: "alcudia", politicianName: "Cati Aguiló", politicianTitle: "Regidora de Medi Ambient", topic: "Beach Conservation & Plastic Reduction Plan", scheduledAt: "2026-06-20T18:00:00Z", status: "completed", questions: 38 },
];

export const alcudiaMarketplace: MarketplaceListing[] = [
  { id: "am1", townSlug: "alcudia", title: "Apartment near Old Town — 2BR, rooftop terrace", price: 1200, description: "Bright 2-bedroom apartment 5min walk from Plaça de la Vila. Rooftop terrace with views. Available long-term.", seller: "ViuAlcudia", category: "housing", postedAt: "2026-06-26" },
  { id: "am2", townSlug: "alcudia", title: "Handmade Mallorcan Leather Sandals", price: 45, description: "Genuine leather, hand-stitched in Alcudia old town. All sizes. Custom colours available.", seller: "SabateriaMallorquina", category: "goods", postedAt: "2026-06-25" },
  { id: "am3", townSlug: "alcudia", title: "Private Spanish Tutor — All Levels", price: 25, description: "Native speaker, certified DELE examiner. In-person or online. Kids and adults welcome.", seller: "ProfeLaura", category: "services", postedAt: "2026-06-24" },
  { id: "am4", townSlug: "alcudia", title: "Bartender Needed — Beach Bar, Summer Season", price: 0, description: "Full-time June–September. English + Spanish required. Accommodation possible. Start ASAP.", seller: "BarCalaBarques", category: "jobs", postedAt: "2026-06-23" },
  { id: "am5", townSlug: "alcudia", title: "Local Sobrassada & Cheese Box — Gift Hampers", price: 32, description: "Artisan sobrassada, Formatge de Maó, and local olive oil. Beautiful packaging. Free delivery in Alcudia.", seller: "SaborsDeMallorca", category: "goods", postedAt: "2026-06-22" },
];

export const alcudiaBusinesses: Business[] = [
  { id: "ab1", townSlug: "alcudia", name: "Café Romeu", category: "Food & Drink", description: "Historic café inside the walls. Breakfast, tapas, and the best granissat in town since 1923.", phone: "+34 971 54 82 73", website: "caferomeu.com", featured: true },
  { id: "ab2", townSlug: "alcudia", name: "Bodega Sananda", category: "Food & Drink", description: "Natural wine bar & tapas in a 600-year-old cellar. Local and Spanish natural wines, organic small plates.", phone: "+34 971 54 91 17", website: "bodegasananda.com", featured: true },
  { id: "ab3", townSlug: "alcudia", name: "Farmàcia Alcúdia", category: "Healthcare", description: "Full-service pharmacy. Open Mon-Sat. English and German spoken. Tourist health advice available.", phone: "+34 971 54 80 12", website: "", featured: false },
  { id: "ab4", townSlug: "alcudia", name: "Cicles Alcúdia", category: "Recreation", description: "Bike sales, repairs, and rentals. E-bikes, road, and MTB. Guided group rides every Wednesday.", phone: "+34 971 54 73 55", website: "ciclesalcudia.com", featured: true },
  { id: "ab5", townSlug: "alcudia", name: "Llibreria de la Vila", category: "Retail", description: "Independent bookshop. Catalan, Spanish, English, and German titles. Local history section.", phone: "+34 971 54 88 21", website: "", featured: false },
];

// Merge alcudia content into the main arrays
news.push(...alcudiaNews);
discussions.push(...alcudiaDiscussions);
votes.push(...alcudiaVotes);
amas.push(...alcudiaAMAs);
marketplace.push(...alcudiaMarketplace);
businesses.push(...alcudiaBusinesses);
