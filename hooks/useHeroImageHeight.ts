import { useEffect, useMemo, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

export function useHeroImageHeight(
  photoDimensions: { width: number; height: number } | null,
  fallback = 300
) {
  const [window, setWindow] = useState<ScaledSize>(Dimensions.get("window"));

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) =>
      setWindow(window)
    );
    return () => sub.remove();
  }, []);

  const height = useMemo(() => {
    if (!photoDimensions) return fallback;
    const ratio = photoDimensions.height / photoDimensions.width;
    return Math.max(fallback, Math.round(window.width * ratio));
  }, [photoDimensions, window.width, fallback]);

  return height;
}
