// Town data - in production this comes from the database
export interface Town {
  slug: string;
  name: string;
  state: string;
  population: number;
  description: string;
  heroImage: string;
}

export const towns: Town[] = [
  {
    slug: "alcudia",
    name: "Alcudia",
    state: "Mallorca, Spain",
    population: 20806,
    description: "A historic walled town in northern Mallorca known for its medieval streets, Roman ruins, beautiful beaches, and vibrant local markets.",
    heroImage: "/towns/alcudia.svg",
  },
  {
    slug: "springfield",
    name: "Springfield",
    state: "Illinois",
    population: 114394,
    description: "A vibrant midwestern community known for its historic downtown, family-friendly events, and active civic engagement.",
    heroImage: "/towns/springfield.svg",
  },
  {
    slug: "riverside",
    name: "Riverside",
    state: "California",
    population: 314998,
    description: "A diverse Southern California city with a rich citrus heritage, thriving arts scene, and strong neighborhood associations.",
    heroImage: "/towns/riverside.svg",
  },
  {
    slug: "maplewood",
    name: "Maplewood",
    state: "Minnesota",
    population: 42342,
    description: "A charming St. Paul suburb with local boutiques, community gardens, and an engaged citizenry that values transparency.",
    heroImage: "/towns/maplewood.svg",
  },
  {
    slug: "ashland",
    name: "Ashland",
    state: "Oregon",
    population: 21360,
    description: "A progressive Southern Oregon city home to the Shakespeare Festival, outdoor recreation, and passionate local activism.",
    heroImage: "/towns/ashland.svg",
  },
];

export function getTown(slug: string): Town | undefined {
  return towns.find((t) => t.slug === slug);
}
