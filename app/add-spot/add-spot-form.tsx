import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { createSpot } from "@/lib/api/spots";
import { useAuth } from "@/provider/AuthProvider";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Dimensions,
  Image as RNImage,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import uuid from "react-native-uuid";

export default function AddSpotForm() {
  const { latitude, longitude } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
  }>();
  const { userId } = useAuth();

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

      const { city, country, description, name, photo_tips } = data;

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
        photo_tips,
        image: imageUrl,
        latitude: location.latitude,
        longitude: location.longitude,
        author_id: userId,
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.wrapper}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.inner}
        >
          <Stack.Screen
            options={{
              headerTitle: () => <HeaderLogo title="Add Spot" />,
              headerStyle: {
                backgroundColor: "#121212",
              },
              headerTintColor: "#fff",
              headerBackTitle: "Cancel",
            }}
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
          <Text style={styles.label}>Nazwa miejsca</Text>
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
          <Text style={styles.label}>Opis</Text>
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

          {/* photo_tips */}
          <Text style={styles.label}>Instruction for taking photo</Text>
          <Controller
            control={control}
            name="photo_tips"
            rules={{ required: "Podaj opis" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Write your instructions"
                value={value}
                onChangeText={onChange}
                multiline
              />
            )}
          />
          {typeof errors.photo_tips?.message === "string" && (
            <Text style={styles.error}>{errors.photo_tips.message}</Text>
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

          <TouchableOpacity style={styles.button} onPress={handlePickImage}>
            <Text style={styles.imageButtonText}>🖼️ Wybierz zdjęcie</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.submitButtonText}>➕ Add Spot</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#121212",
  },
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
  button: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3c3b3b",
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
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
