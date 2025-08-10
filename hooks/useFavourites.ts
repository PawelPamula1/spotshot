import {
  addToFavourites,
  checkIfFavourite,
  getFavouriteCount,
  getFavouriteSpots,
} from "@/lib/api/favourites";
import { useAuth } from "@/provider/AuthProvider";
import type { Spot } from "@/types/spot";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

/** ---------- MINI EVENT BUS ---------- */
type FavEvent = { type: "added" | "removed"; spotId: string };
const favListeners = new Set<(e: FavEvent) => void>();

function onFavouritesChange(cb: (e: FavEvent) => void) {
  favListeners.add(cb);
  return () => {
    favListeners.delete(cb);
  };
}
function emitFavouritesChanged(e: FavEvent) {
  favListeners.forEach((fn) => fn(e));
}
/** -------------------------------------------------------- */

export type UseFavouritesReturn = {
  loading: boolean;
  error: string | null;
  favourites: Spot[];
  refetch: () => Promise<void>;
  isEmpty: boolean;
};

export function useFavourites(): UseFavouritesReturn {
  const { userId } = useAuth();
  const [favourites, setFavourites] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) {
      setFavourites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getFavouriteSpots(userId);
      setFavourites(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load favourites");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useFocusEffect(
    useCallback(() => {
      fetch();
    }, [fetch])
  );

  useEffect(() => {
    return onFavouritesChange((e) => {
      if (!userId) return;
      if (e.type === "added" || e.type === "removed") {
        fetch();
      }
    });
  }, [fetch, userId]);

  const isEmpty = useMemo(
    () => !loading && favourites.length === 0,
    [loading, favourites]
  );

  return { loading, error, favourites, refetch: fetch, isEmpty };
}

export type UseFavouriteSpotReturn = {
  isSaved: boolean;
  likesCount: number;
  toggleSave: () => Promise<void>;
  loading: boolean;
};

export function useFavouriteSpot(spotId?: string): UseFavouriteSpotReturn {
  const { userId } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    if (!spotId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [count, saved] = await Promise.all([
        getFavouriteCount(spotId),
        userId ? checkIfFavourite(userId, spotId) : Promise.resolve(false),
      ]);
      setLikesCount(count);
      setIsSaved(!!saved);
    } finally {
      setLoading(false);
    }
  }, [spotId, userId]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const toggleSave = useCallback(async () => {
    if (!userId || !spotId || isSaved) return;
    setIsSaved(true);
    setLikesCount((c) => c + 1);
    try {
      await addToFavourites(userId, spotId);
      emitFavouritesChanged({ type: "added", spotId });
    } catch (e) {
      setIsSaved(false);
      setLikesCount((c) => Math.max(0, c - 1));
      throw e;
    }
  }, [userId, spotId, isSaved]);

  return { isSaved, likesCount, toggleSave, loading };
}
