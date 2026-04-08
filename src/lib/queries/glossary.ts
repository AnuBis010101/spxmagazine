import { createClient } from "@/lib/supabase/server";
import type { GlossaryTerm } from "@/types/content";

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("*")
    .order("term", { ascending: true });
  if (error) return [];
  return (data as GlossaryTerm[]) || [];
}

export async function getGlossaryTermBySlug(slug: string): Promise<GlossaryTerm | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as GlossaryTerm;
}
