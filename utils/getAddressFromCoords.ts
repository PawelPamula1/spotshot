import { countryNames } from "@/constants/countryNames";
import * as Location from "expo-location";

export async function getAddressFromCoords(lat: number, lon: number) {
  try {
    const [address] = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lon,
    });

    const countryCode = address.isoCountryCode || "";
    const country = countryNames[countryCode] || address.country || "";

    return {
      country,
      city: address.city || address.subregion || "",
    };
  } catch (error) {
    console.error("Error getting address:", error);
    return { country: "", city: "" };
  }
}
