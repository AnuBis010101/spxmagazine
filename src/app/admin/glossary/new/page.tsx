'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { slugify } from '@/lib/utils/slugify';
import toast from 'react-hot-toast';

export default function NewGlossaryTermPage() {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);

  const [term, setTerm] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEditable, setSlugEditable] = useState(false);
  const [definition, setDefinition] = useState('');
  const [category, setCategory] = useState('');
  const [relatedTerms, setRelatedTerms] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  const handleTermChange = (value: string) => {
    setTerm(value);
    if (!slugEditable) {
      setSlug(slugify(value));
    }
  };

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
    };

    try {
      const { error } = await supabase.from('glossary_terms').insert(termData);
      if (error) throw error;
      toast.success('Term created');
      router.push('/admin/glossary');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save term');
    } finally {
      setSaving(false);
    }
  };

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
          Add Glossary Term
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
              onChange={(e) => handleTermChange(e.target.value)}
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
                  {slug || 'auto-generated-slug'}
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
                Save Term
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
