"use client";

import { useState, useEffect, useCallback } from "react";

interface PriceData {
  price: number;
  change24h: number;
  marketCap: number;
  sp500MarketCap: number;
}

interface UsePriceReturn extends PriceData {
  loading: boolean;
  error: string | null;
}

const POLL_INTERVAL_MS = 60_000; // 60 seconds

export function usePrice(): UsePriceReturn {
  const [data, setData] = useState<PriceData>({
    price: 0,
    change24h: 0,
    marketCap: 0,
    sp500MarketCap: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/price");

      if (!res.ok) {
        throw new Error(`Price API returned ${res.status}`);
      }

      const json = await res.json();

      setData({
        price: json.price,
        change24h: json.change24h,
        marketCap: json.spx6900MarketCap ?? json.marketCap,
        sp500MarketCap: json.sp500MarketCap,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch price");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchData]);

  return { ...data, loading, error };
}
