'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push('/admin');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mag-black">
      <div className="max-w-sm w-full mx-4 bg-mag-dark border border-mag-border rounded-xl p-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/spxlogo.png"
            alt="SPX6900 Logo"
            width={60}
            height={60}
            className="w-[60px] h-[60px]"
          />
        </div>

        {/* Heading */}
        <h1 className="font-display text-xl font-bold mt-4 text-center text-white">
          Admin Login
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@spx6900.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
