import { updateSpot } from "@/lib/api/spots";
import { Spot } from "@/types/spot";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { compressImageForUpload } from "@/utils/compressImage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Image as RNImage } from "react-native";

export type EditSpotFormValues = {
  name: string;
  description: string;
  photo_tips: string;
  country: string;
  city: string;
};

export function useEditSpot(spot: Spot | null, userId: string | null) {
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [photoDimensions, setPhotoDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // Get dimensions of existing image
  useEffect(() => {
    if (spot?.image && !photo) {
      RNImage.getSize(
        spot.image,
        (width, height) => setPhotoDimensions({ width, height }),
        () => setPhotoDimensions(null)
      );
    }
  }, [spot?.image, photo]);

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
    async (data: EditSpotFormValues) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setIsSubmitting(true);

      try {
        if (!spot) {
          Alert.alert("Error", "Spot data not found.");
          return;
        }
        if (!userId) {
          Alert.alert("Error", "You need to be logged in to edit spot.");
          return;
        }

        const { description, name, photo_tips, city, country } = data;

        let imageUrl = spot.image; // Keep existing image by default

        // Only upload new image if user selected one
        if (photo) {
          const compressedUri = await compressImageForUpload(photo.uri);

          const source = {
            uri: compressedUri,
            type: "image/jpeg",
            name: photo.fileName || `photo-${Date.now()}.jpg`,
          } as const;

          imageUrl = await uploadToCloudinary(source);
        }

        const updateData = {
          city,
          country,
          description,
          name,
          photo_tips,
          image: imageUrl,
          user_id: userId as string, // Required for authorization check (already validated above)
        };

        await updateSpot(spot.id, updateData);
        Alert.alert(
          "Success",
          "Spot updated! It will be reviewed by moderators before appearing publicly."
        );
        setPhoto(null);
        router.back();
      } catch (error: any) {
        console.error("Error updating spot", error);
        if (error.response?.status === 403) {
          Alert.alert(
            "Error",
            "You are not authorized to edit this spot. Only the author can make changes."
          );
        } else {
          Alert.alert("Error", "Failed to update spot. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
        submittingRef.current = false;
      }
    },
    [photo, spot, userId]
  );

  return {
    photo,
    photoDimensions,
    isSubmitting,
    pickImage,
    onSubmit,
    existingImage: spot?.image,
  };
}
