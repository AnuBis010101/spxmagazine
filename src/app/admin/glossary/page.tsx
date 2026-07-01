'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import type { GlossaryTerm } from '@/types/content';

export default function AdminGlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchTerms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('glossary_terms')
      .select('*')
      .order('term', { ascending: true });

    if (error) {
      toast.error('Failed to load glossary terms');
      console.error(error);
    } else {
      setTerms((data as GlossaryTerm[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleDelete = async (id: string, term: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${term}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    const res = await fetch(`/api/admin/glossary?id=${id}`, { method: 'DELETE' });

    if (!res.ok) {
      toast.error('Failed to delete term');
      console.error(await res.text());
    } else {
      toast.success('Term deleted');
      setTerms((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Glossary</h1>
        <Link href="/admin/glossary/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Term
          </Button>
        </Link>
      </div>

      {/* Terms Table */}
      <div className="bg-mag-dark border border-mag-border rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-[1fr_120px_1fr_80px] gap-4 px-6 py-3 border-b border-mag-border text-xs font-medium text-mag-muted uppercase tracking-wider">
          <span>Term</span>
          <span>Category</span>
          <span>Definition</span>
          <span className="text-right">Actions</span>
        </div>

        {loading && (
          <div className="divide-y divide-mag-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16 ml-auto" />
              </div>
            ))}
          </div>
        )}

        {!loading && terms.length === 0 && (
          <div className="px-6 py-16 text-center">
            <BookOpen className="w-10 h-10 text-mag-muted mx-auto mb-3" />
            <p className="text-mag-muted text-sm">No glossary terms found.</p>
            <Link href="/admin/glossary/new" className="mt-3 inline-block">
              <Button variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add your first term
              </Button>
            </Link>
          </div>
        )}

        {!loading && terms.length > 0 && (
          <div className="divide-y divide-mag-border">
            {terms.map((term) => (
              <div
                key={term.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_120px_1fr_80px] gap-2 md:gap-4 px-6 py-4 items-center hover:bg-mag-black/30 transition-colors"
              >
                {/* Term */}
                <div>
                  <Link
                    href={`/admin/glossary/${term.id}/edit`}
                    className="text-sm font-medium text-white hover:text-gold-400 transition-colors"
                  >
                    {term.term}
                  </Link>
                </div>

                {/* Category */}
                <div>
                  {term.category ? (
                    <Badge variant="gold">{term.category}</Badge>
                  ) : (
                    <span className="text-xs text-mag-muted">--</span>
                  )}
                </div>

                {/* Definition preview */}
                <div className="text-xs text-mag-muted truncate">
                  {term.definition}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/glossary/${term.id}/edit`}>
                    <button
                      className="p-2 text-mag-muted hover:text-white transition-colors rounded-md hover:bg-mag-border/30"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(term.id, term.term)}
                    className="p-2 text-mag-muted hover:text-red-400 transition-colors rounded-md hover:bg-red-500/10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
