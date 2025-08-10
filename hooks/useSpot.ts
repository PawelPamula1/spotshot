import { getSpotById } from "@/lib/api/spots";
import { getUserById } from "@/lib/api/users";
import type { Profile } from "@/types/profile";
import type { Spot } from "@/types/spot";
import { useEffect, useState } from "react";
import { Image as RNImage } from "react-native";

export type UseSpotReturn = {
  spot: Spot | null;
  author: Profile | null;
  photoDimensions: { width: number; height: number } | null;
  loading: boolean;
  error: boolean;
  refetch: () => Promise<void>;
};

export function useSpot(id?: string): UseSpotReturn {
  const [spot, setSpot] = useState<Spot | null>(null);
  const [author, setAuthor] = useState<Profile | null>(null);
  const [photoDimensions, setPhotoDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refetch = async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const data = await getSpotById(id);
      setSpot(data);

      // fetch author
      if (data?.author_id) {
        const a = await getUserById(data.author_id);
        setAuthor(a ?? null);
      } else setAuthor(null);

      // pre-compute image size for hero
      if (data?.image) {
        RNImage.getSize(
          data.image,
          (width, height) => setPhotoDimensions({ width, height }),
          () => setPhotoDimensions(null)
        );
      }
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [id]);

  return { spot, author, photoDimensions, loading, error, refetch };
}
