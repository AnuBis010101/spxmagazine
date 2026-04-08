'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Trash2,
  Copy,
  ImageIcon,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils/format-date';
import toast from 'react-hot-toast';
import type { MediaItem } from '@/types/content';

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '--';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();

  const fetchMedia = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load media');
      console.error(error);
    } else {
      setMedia((data as MediaItem[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);
      let successCount = 0;

      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) {
          toast.error(`Failed to upload ${file.name}`);
          console.error(uploadError);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('images').getPublicUrl(filePath);

        // Create media record
        const mediaData = {
          filename: fileName,
          original_name: file.name,
          storage_path: filePath,
          url: publicUrl,
          mime_type: file.type,
          size_bytes: file.size,
        };

        const { data: inserted, error: insertError } = await supabase
          .from('media')
          .insert(mediaData)
          .select()
          .single();

        if (insertError) {
          toast.error(`Failed to save record for ${file.name}`);
          console.error(insertError);
        } else {
          setMedia((prev) => [inserted as MediaItem, ...prev]);
          successCount++;
        }
      }

      if (successCount > 0) {
        toast.success(
          `${successCount} file${successCount > 1 ? 's' : ''} uploaded`
        );
      }
      setUploading(false);
      setShowUpload(false);
    },
    [supabase]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    },
    multiple: true,
  });

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  const handleDelete = async (item: MediaItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.original_name}"?`
    );
    if (!confirmed) return;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('images')
      .remove([item.storage_path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
      // Continue to delete record even if storage fails
    }

    // Delete record
    const { error } = await supabase.from('media').delete().eq('id', item.id);

    if (error) {
      toast.error('Failed to delete media');
      console.error(error);
    } else {
      toast.success('Media deleted');
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-white">
          Media Library
        </h1>
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* Upload Zone */}
      {showUpload && (
        <div className="mb-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-gold-400 bg-gold-400/5'
                : 'border-mag-border hover:border-mag-muted bg-mag-dark'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div>
                <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-mag-muted">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-mag-muted mx-auto mb-3" />
                <p className="text-white font-medium mb-1">
                  Drop images here or click to browse
                </p>
                <p className="text-sm text-mag-muted">
                  Accepts JPG, PNG, GIF, WebP
                </p>
              </>
            )}
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setShowUpload(false)}
              className="text-sm text-mag-muted hover:text-white transition-colors"
            >
              Close upload area
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && media.length === 0 && (
        <div className="bg-mag-dark border border-mag-border rounded-xl py-16 text-center">
          <ImageIcon className="w-12 h-12 text-mag-muted mx-auto mb-3" />
          <p className="text-mag-muted text-sm mb-3">
            No media files uploaded yet.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowUpload(true)}
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload your first image
          </Button>
        </div>
      )}

      {/* Media Grid */}
      {!loading && media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group bg-mag-dark border border-mag-border rounded-lg overflow-hidden hover:border-mag-muted transition-colors"
            >
              {/* Image */}
              <div className="relative aspect-square">
                <Image
                  src={item.url}
                  alt={item.alt_text || item.original_name}
                  fill
                  className="object-cover"
                />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(item.url)}
                    className="p-2 bg-mag-dark/90 rounded-lg text-white hover:bg-gold-400 hover:text-mag-black transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 bg-mag-dark/90 rounded-lg text-white hover:bg-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs text-white truncate" title={item.original_name}>
                  {item.original_name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-mag-muted">
                    {formatFileSize(item.size_bytes)}
                  </span>
                  <span className="text-xs text-mag-muted">
                    {formatDate(item.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
