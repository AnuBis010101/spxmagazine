export interface Author {
  name: string;
  slug: string;
  bio: string;
  avatar?: string;
  twitter?: string;
  role: string;
}

export const AUTHORS: Record<string, Author> = {
  "SPX Magazine": {
    name: "SPX Magazine",
    slug: "spx-magazine",
    bio: "The official voice of the SPX6900 movement. Delivering news, analysis, and culture from the Cognisphere.",
    role: "Editorial Team",
    twitter: "spabormarket",
  },
  "Murad": {
    name: "Murad",
    slug: "murad",
    bio: "Memecoin supercycle advocate and SPX6900 thought leader. Spreading the gospel of digital culture assets.",
    role: "Contributor",
    twitter: "MustStopMurad",
  },
  "Based Intern": {
    name: "Based Intern",
    slug: "based-intern",
    bio: "Anonymous contributor from deep within the Cognisphere. Focused on on-chain analysis and community insights.",
    role: "Contributor",
  },
};

export function getAuthorByName(name: string): Author | null {
  return AUTHORS[name] || null;
}

export function getAuthorBySlug(slug: string): Author | null {
  return Object.values(AUTHORS).find((a) => a.slug === slug) || null;
}

export function getAllAuthors(): Author[] {
  return Object.values(AUTHORS);
}
