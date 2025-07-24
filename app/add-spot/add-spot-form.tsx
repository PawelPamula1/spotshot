import { uploadToCloudinary } from "@/utils/cloudinary";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions } from "react-native";
import uuid from "react-native-uuid";

import { createSpot } from "@/lib/api/spots";
import {
  Alert,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const FormData = global.FormData;

export default function AddSpotForm() {
  const { latitude, longitude } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [photoDimensions, setPhotoDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const location =
    latitude && longitude
      ? { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
      : null;

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPhoto(result.assets[0]);

      RNImage.getSize(result.assets[0].uri, (width, height) => {
        setPhotoDimensions({ width, height });
      });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (!photo) {
        Alert.alert("Błąd", "Dodaj zdjęcie.");
        return;
      }

      if (!location) {
        Alert.alert("Błąd", "Nie określono lokalizacji.");
        return;
      }

      const { city, country, description, name } = data;

      const source = {
        uri: photo.uri,
        type: photo.mimeType,
        name: photo.fileName || `photo-${Date.now()}.jpg`,
      };

      const imageUrl = await uploadToCloudinary(source);

      const newSpot = {
        id: uuid.v4() as string,
        city,
        country,
        description,
        name,
        image: imageUrl,
        latitude: location.latitude,
        longitude: location.longitude,
        author_id: "32",
      };

      const savedSpot = await createSpot(newSpot);

      Alert.alert("Sukces", "Lokalizacja została dodana!");

      router.push("/explore");

      setPhoto(null);
    } catch (error: any) {
      console.error("Błąd przy dodawaniu spotu:", error);
      Alert.alert("Błąd", "Coś poszło nie tak. Spróbuj ponownie.");
    }
  };

  const screenWidth = Dimensions.get("window").width;
  const calculatedHeight = photoDimensions
    ? screenWidth * (photoDimensions.height / photoDimensions.width)
    : 300;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Stack.Screen
        options={{ title: "Add Spot Form", headerBackTitle: "Cancel" }}
      />

      {photo && (
        <Image
          source={{ uri: photo.uri }}
          contentFit="contain"
          style={{
            width: "100%",
            height: calculatedHeight,
            borderRadius: 12,
            marginBottom: 20,
          }}
        />
      )}

      {location && (
        <View style={styles.mapContainer}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            provider={PROVIDER_GOOGLE}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            pointerEvents="none"
          >
            <Marker coordinate={location} />
          </MapView>
        </View>
      )}

      {/* NAME */}
      <Text style={styles.label}>📍 Nazwa miejsca</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: "Podaj nazwę miejsca" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nazwa"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {typeof errors.name?.message === "string" && (
        <Text style={styles.error}>{errors.name.message}</Text>
      )}

      {/* DESCRIPTION */}
      <Text style={styles.label}>📝 Opis</Text>
      <Controller
        control={control}
        name="description"
        rules={{ required: "Podaj opis" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Opis"
            value={value}
            onChangeText={onChange}
            multiline
          />
        )}
      />
      {typeof errors.description?.message === "string" && (
        <Text style={styles.error}>{errors.description.message}</Text>
      )}

      {/* COUNTRY */}
      <Text style={styles.label}>🌍 Kraj</Text>
      <Controller
        control={control}
        name="country"
        rules={{ required: "Podaj kraj" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {typeof errors.country?.message === "string" && (
        <Text style={styles.error}>{errors.country.message}</Text>
      )}

      {/* CITY */}
      <Text style={styles.label}>🏙️ Miasto</Text>
      <Controller
        control={control}
        name="city"
        rules={{ required: "Podaj miasto" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {typeof errors.city?.message === "string" && (
        <Text style={styles.error}>{errors.city.message}</Text>
      )}

      <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
        <Text style={styles.imageButtonText}>🖼️ Wybierz zdjęcie</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.submitButtonText}>➕ Add Spot</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  inner: { padding: 20 },
  label: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
    color: "#fff",
  },
  error: {
    color: "#f87171",
    marginBottom: 10,
    fontSize: 13,
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#333",
    color: "#fff",
    marginBottom: 20,
  },
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
