'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { slugify } from '@/lib/utils/slugify';
import toast from 'react-hot-toast';
import type { GlossaryTerm } from '@/types/content';

export default function EditGlossaryTermPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [term, setTerm] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEditable, setSlugEditable] = useState(false);
  const [definition, setDefinition] = useState('');
  const [category, setCategory] = useState('');
  const [relatedTerms, setRelatedTerms] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    const fetchTerm = async () => {
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        toast.error('Term not found');
        router.push('/admin/glossary');
        return;
      }

      const t = data as GlossaryTerm;
      setTerm(t.term);
      setSlug(t.slug);
      setDefinition(t.definition);
      setCategory(t.category || '');
      setRelatedTerms(t.related_terms?.join(', ') || '');
      setSortOrder(t.sort_order);
      setLoading(false);
    };
    fetchTerm();
  }, [id]);

  const handleSave = async () => {
    if (!term.trim()) {
      toast.error('Term is required');
      return;
    }
    if (!definition.trim()) {
      toast.error('Definition is required');
      return;
    }

    setSaving(true);

    const termData = {
      term: term.trim(),
      slug: slug.trim() || slugify(term),
      definition: definition.trim(),
      category: category.trim() || null,
      related_terms: relatedTerms
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/admin/glossary', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...termData }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Update failed');
      toast.success('Term updated');
      router.push('/admin/glossary');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update term');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/glossary"
          className="inline-flex items-center gap-1.5 text-sm text-mag-muted hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Glossary
        </Link>
        <h1 className="text-2xl font-display font-bold text-white">
          Edit: {term}
        </h1>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Term */}
          <div>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Term name..."
              className="w-full bg-transparent border-b border-mag-border focus:border-gold-400 text-2xl font-display text-white placeholder:text-mag-muted outline-none pb-3 transition-colors"
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-mag-muted">/glossary/</span>
              {slugEditable ? (
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  onBlur={() => setSlugEditable(false)}
                  className="text-sm text-mag-muted bg-transparent border-b border-mag-border focus:border-gold-400 outline-none"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setSlugEditable(true)}
                  className="text-sm text-mag-muted hover:text-gold-400 transition-colors"
                  title="Click to edit slug"
                >
                  {slug}
                </button>
              )}
            </div>
          </div>

          {/* Definition */}
          <div>
            <label className="block text-sm font-medium text-mag-light mb-1.5">
              Definition
            </label>
            <textarea
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="What does this term mean?"
              rows={6}
              className="w-full bg-mag-dark border border-mag-border rounded-lg p-3 text-white placeholder:text-mag-muted focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 outline-none transition-colors resize-none text-sm"
            />
          </div>

          {/* Category */}
          <Input
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Community, Lore, Philosophy, Trading"
          />

          {/* Related Terms */}
          <Input
            label="Related Terms (comma-separated)"
            value={relatedTerms}
            onChange={(e) => setRelatedTerms(e.target.value)}
            placeholder="e.g. Aeon, Cognisphere, Shape Reality"
          />

          {/* Sort Order */}
          <Input
            label="Sort Order"
            type="number"
            value={sortOrder.toString()}
            onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-6 space-y-6">
            {/* Save */}
            <div className="bg-mag-dark border border-mag-border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-medium text-white">Save</h3>
              <Button
                className="w-full"
                onClick={handleSave}
                isLoading={saving}
                disabled={saving}
              >
                Update Term
              </Button>
            </div>

            {/* Delete */}
            <div className="bg-mag-dark border border-mag-border rounded-xl p-5">
              <Button
                variant="secondary"
                className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={async () => {
                  const confirmed = window.confirm(
                    `Are you sure you want to delete "${term}"?`
                  );
                  if (!confirmed) return;
                  const res = await fetch(`/api/admin/glossary?id=${id}`, {
                    method: 'DELETE',
                  });
                  if (!res.ok) {
                    toast.error('Failed to delete');
                  } else {
                    toast.success('Term deleted');
                    router.push('/admin/glossary');
                  }
                }}
              >
                Delete Term
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
