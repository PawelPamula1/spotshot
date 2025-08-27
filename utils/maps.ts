import { Linking, Platform } from "react-native";

export type TravelMode = "driving" | "walking" | "bicycling" | "transit";

export function openInMaps(
  lat: number,
  lng: number,
  mode: TravelMode = "driving"
) {
  const destination = `${lat},${lng}`;
  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destination
  )}&travelmode=${mode}`;

  const url = Platform.select({ ios: gmaps, default: gmaps })!;
  return Linking.openURL(url);
}

function modeFlag(mode: TravelMode) {
  switch (mode) {
    case "walking":
      return "w";
    case "transit":
      return "r";
    case "bicycling":
      return "b";
    default:
      return "d"; // driving
  }
}
