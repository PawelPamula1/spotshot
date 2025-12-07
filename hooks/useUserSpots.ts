import { getUserSpots } from "@/lib/api/spots";
import { Spot } from "@/types/spot";
import { useCallback, useEffect, useState } from "react";

export function useUserSpots(userId?: string | null) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) {
      setSpots([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getUserSpots(userId);
      setSpots(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load user spots");
      setSpots([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const isEmpty = spots.length === 0;

  return { spots, loading, error, isEmpty, refetch: fetch };
}
