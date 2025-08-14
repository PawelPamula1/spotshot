import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { AddSpotFormValues, useAddSpot } from "@/hooks/useAddSpot";
import { useAuth } from "@/provider/AuthProvider";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dimensions,
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

export default function AddSpotForm() {
  const { latitude, longitude } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
  }>();
  const location =
    latitude && longitude
      ? { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
      : null;
  const { userId } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddSpotFormValues>({
    defaultValues: {
      name: "",
      description: "",
      photo_tips: "",
      country: "",
      city: "",
    },
  });

  const { photo, photoDimensions, isSubmitting, pickImage, onSubmit } =
    useAddSpot({ userId, location });

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
              headerStyle: { backgroundColor: "#121212" },
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
          <Text style={styles.label}>Name of the place</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Write name of the place" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {typeof errors.name?.message === "string" && (
            <Text style={styles.error}>{errors.name.message}</Text>
          )}

          {/* DESCRIPTION */}
          <Text style={styles.label}>Description</Text>
          <Controller
            control={control}
            name="description"
            rules={{ required: "Write description" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Description"
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
            rules={{ required: "Write instructions" }}
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

          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
            disabled={isSubmitting}
          >
            <Text style={styles.imageButtonText}>🖼️ Upload Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Adding..." : "➕ Add Spot"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#121212" },
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  inner: { padding: 20 },
  label: { fontWeight: "600", fontSize: 16, marginBottom: 6, color: "#fff" },
  error: { color: "#f87171", marginBottom: 10, fontSize: 13 },
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
  imageButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  submitButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
