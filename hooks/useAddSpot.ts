import { createSpot } from "@/lib/api/spots";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { compressImageForUpload } from "@/utils/compressImage";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Image as RNImage } from "react-native";

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
          Alert.alert("Error", "Add photo.");
          return;
        }
        if (!location) {
          Alert.alert("Error", "Location not found.");
          return;
        }
        if (!userId) {
          Alert.alert("Error", "You need to be login to add spot.");
          return;
        }

        const { description, name, photo_tips } = data;

        const compressedUri = await compressImageForUpload(photo.uri);

        const source = {
          uri: compressedUri,
          type: "image/jpeg",
          name: photo.fileName || `photo-${Date.now()}.jpg`,
        } as const;

        const imageUrl = await uploadToCloudinary(source);

        const newSpot = {
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

        const response = await createSpot(newSpot);
        const spotId = response?.id; // zależnie od tego co zwraca API
        Alert.alert("Success", "Spot added!");
        setPhoto(null);
        router.push(`/spot/${spotId}`);
      } catch (error: any) {
        console.error("Error adding spot", error);
        Alert.alert("Error", "Failed to add spot. Please try again.");
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
