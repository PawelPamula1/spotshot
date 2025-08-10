import { getSpots } from "@/lib/api/spots";
import type { Spot } from "@/types/spot";
import { useCallback, useEffect, useState } from "react";

export type UseSpotsReturn = {
  search: string;
  setSearch: (v: string) => void;
  loading: boolean;
  error: string | null;
  allSpots: Spot[];
  filteredSpots: Spot[];
  handleSearch: (text: string) => void;
  onFilter: (filtered: Spot[]) => void;
  resetFilters: () => void;
};

export function useSpots(): UseSpotsReturn {
  const [search, setSearch] = useState("");
  const [allSpots, setAllSpots] = useState<Spot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getSpots();
        if (!mounted) return;
        setAllSpots(data);
        setFilteredSpots(data);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to fetch spots");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const baseFilter = useCallback((text: string, source: Spot[]): Spot[] => {
    const q = text.trim().toLowerCase();
    if (!q) return source;
    return source.filter((spot) =>
      [spot.name, spot.city, spot.description]
        .filter(Boolean)
        .some((f) => f!.toLowerCase().includes(q))
    );
  }, []);

  const handleSearch = useCallback(
    (text: string) => {
      setSearch(text);
      setFilteredSpots((prev) => baseFilter(text, allSpots));
    },
    [allSpots, baseFilter]
  );

  const onFilter = useCallback(
    (filtered: Spot[]) => {
      setFilteredSpots((_) => baseFilter(search, filtered));
    },
    [baseFilter, search]
  );

  const resetFilters = useCallback(() => {
    setFilteredSpots(baseFilter(search, allSpots));
  }, [allSpots, baseFilter, search]);

  return {
    search,
    setSearch,
    loading,
    error,
    allSpots,
    filteredSpots,
    handleSearch,
    onFilter,
    resetFilters,
  };
}
