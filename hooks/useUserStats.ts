import { getUserSpotsCount } from "@/lib/api/spots";
import { useCallback, useEffect, useState } from "react";

export function useUserSpotsCount(userId?: string | null) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) {
      setCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const c = await getUserSpotsCount(userId);
      setCount(c);
    } catch (e: any) {
      setError(e?.message || "Failed to load spots count");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { count, loading, error, refetch: fetch };
}
