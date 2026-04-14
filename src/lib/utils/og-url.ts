import { SITE_URL } from "@/lib/constants";

interface OgParams {
  title: string;
  author?: string;
  category?: string;
  type?: string;
  subtitle?: string;
}

export function buildOgImageUrl(params: OgParams): string {
  const url = new URL("/api/og", SITE_URL);
  url.searchParams.set("title", params.title);
  if (params.author) url.searchParams.set("author", params.author);
  if (params.category) url.searchParams.set("category", params.category);
  if (params.type) url.searchParams.set("type", params.type);
  if (params.subtitle) url.searchParams.set("subtitle", params.subtitle);
  return url.toString();
}
