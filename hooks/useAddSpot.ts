import { createSpot } from "@/lib/api/spots";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { compressImageForUpload } from "@/utils/compressImage";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Image as RNImage } from "react-native";
import uuid from "react-native-uuid";

export type AddSpotFormValues = {
  name: string;
  description: string;
  photo_tips: string;
  country: string;
  city: string;
};

export type LatLng = { latitude: number; longitude: number };

export function useAddSpot(opts: {
  userId: string | null;
  location: LatLng | null;
}) {
  const { userId, location } = opts;

  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [photoDimensions, setPhotoDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (!location) return;
    let cancelled = false;

    (async () => {
      const addr = await getAddressFromCoords(
        location.latitude,
        location.longitude
      );
      if (cancelled) return;

      if (addr) {
        setCity(addr.city);
        setCountry(addr.country);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location]);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      setPhoto(asset);
      RNImage.getSize(
        asset.uri,
        (width, height) => setPhotoDimensions({ width, height }),
        () => setPhotoDimensions(null)
      );
    }
  }, []);

  const onSubmit = useCallback(
    async (data: AddSpotFormValues) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setIsSubmitting(true);
      try {
        if (!photo) {
          Alert.alert("Błąd", "Dodaj zdjęcie.");
          return;
        }
        if (!location) {
          Alert.alert("Błąd", "Nie określono lokalizacji.");
          return;
        }
        if (!userId) {
          Alert.alert("Błąd", "Musisz być zalogowany, aby dodać spot.");
          return;
        }

        const { description, name, photo_tips } = data;

        const compressedUri = await compressImageForUpload(photo.uri);

        console.log(compressedUri);

        const source = {
          uri: compressedUri,
          type: "image/jpeg",
          name: photo.fileName || `photo-${Date.now()}.jpg`,
        } as const;

        const imageUrl = await uploadToCloudinary(source);

        const newSpot = {
          id: uuid.v4() as string,
          city,
          country,
          description,
          name,
          photo_tips,
          image: imageUrl,
          latitude: location.latitude,
          longitude: location.longitude,
          author_id: userId,
        };

        await createSpot(newSpot);
        Alert.alert("Sukces", "Lokalizacja została dodana!");
        setPhoto(null);
        router.push("/explore");
      } catch (error: any) {
        console.error("Błąd przy dodawaniu spotu:", error);
        Alert.alert("Błąd", "Coś poszło nie tak. Spróbuj ponownie.");
      } finally {
        setIsSubmitting(false);
        submittingRef.current = false;
      }
    },
    [photo, location, userId]
  );

  return {
    photo,
    photoDimensions,
    isSubmitting,
    pickImage,
    onSubmit,
  };
}
