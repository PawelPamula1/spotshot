import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { Theme } from "@/constants/Theme";
import { AddSpotFormValues, useAddSpot } from "@/hooks/useAddSpot";
import { useAuth } from "@/provider/AuthProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function AddSpotForm() {
  const router = useRouter();
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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: Theme.animation.normal,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}
    >
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderLogo title="Add Spot" />,
          headerStyle: { backgroundColor: Theme.colors.richBlack },
          headerTintColor: Theme.colors.offWhite,
          headerBackTitle: "Cancel",
        }}
      />

      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={styles.inner}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="photo-camera"
              size={28}
              color={Theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Spot Details</Text>
          </View>

          {/* NAME */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Place Name *</Text>
            <Controller
              control={control}
              name="name"
              rules={{ required: "Place name is required" }}
              render={({ field: { onChange, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    errors.name && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Eiffel Tower Viewpoint"
                    placeholderTextColor={Theme.colors.textMuted}
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
            {typeof errors.name?.message === "string" && (
              <View style={styles.errorContainer}>
                <MaterialIcons
                  name="error-outline"
                  size={16}
                  color={Theme.colors.error}
                />
                <Text style={styles.error}>{errors.name.message}</Text>
              </View>
            )}
          </View>

          {/* PHOTO TIPS */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Photography Tips *</Text>
            <Controller
              control={control}
              name="photo_tips"
              rules={{ required: "Photography tips are required" }}
              render={({ field: { onChange, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    errors.photo_tips && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Share tips for getting the best shot..."
                    placeholderTextColor={Theme.colors.textMuted}
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              )}
            />
            {typeof errors.photo_tips?.message === "string" && (
              <View style={styles.errorContainer}>
                <MaterialIcons
                  name="error-outline"
                  size={16}
                  color={Theme.colors.error}
                />
                <Text style={styles.error}>{errors.photo_tips.message}</Text>
              </View>
            )}
          </View>

          {/* DESCRIPTION */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe the location..."
                    placeholderTextColor={Theme.colors.textMuted}
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              )}
            />
          </View>

          {/* Photo Preview */}
          {photo && (
            <View style={styles.photoSection}>
              <View style={styles.photoLabelContainer}>
                <MaterialIcons
                  name="image"
                  size={20}
                  color={Theme.colors.primary}
                />
                <Text style={styles.photoLabel}>Selected Photo</Text>
              </View>
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: photo.uri }}
                  contentFit="cover"
                  style={{
                    width: "100%",
                    height: calculatedHeight,
                    borderRadius: Theme.radius.lg,
                  }}
                />
                <View style={styles.photoOverlay} />
              </View>
            </View>
          )}

          {/* Map Preview */}
          {location && (
            <View style={styles.mapSection}>
              <View style={styles.mapLabelContainer}>
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color={Theme.colors.primary}
                />
                <Text style={styles.mapLabel}>Selected Location</Text>
              </View>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
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
                  <Marker
                    coordinate={location}
                    pinColor={Theme.colors.primary}
                  />
                </MapView>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={pickImage}
              disabled={isSubmitting}
            >
              <MaterialIcons
                name={photo ? "edit" : "add-photo-alternate"}
                size={20}
                color={Theme.colors.primary}
              />
              <Text style={styles.secondaryButtonText}>
                {photo ? "Change Photo" : "Upload Photo"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.back()}
              disabled={isSubmitting}
            >
              <MaterialIcons
                name="edit-location"
                size={20}
                color={Theme.colors.primary}
              />
              <Text style={styles.secondaryButtonText}>Change Location</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Theme.colors.primary, Theme.colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
            >
              {isSubmitting ? (
                <>
                  <MaterialIcons
                    name="hourglass-empty"
                    size={24}
                    color={Theme.colors.offWhite}
                  />
                  <Text style={styles.submitButtonText}>Adding Spot...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons
                    name="add-location"
                    size={24}
                    color={Theme.colors.offWhite}
                  />
                  <Text style={styles.submitButtonText}>Add Spot</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Theme.colors.richBlack,
  },
  container: {
    flex: 1,
  },
  inner: {
    padding: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.h2,
    fontWeight: Theme.typography.weights.black,
    color: Theme.colors.offWhite,
  },
  fieldGroup: {
    marginBottom: Theme.spacing.lg,
  },
  label: {
    fontSize: Theme.typography.sizes.bodySmall,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.offWhite,
    marginBottom: Theme.spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  inputWrapper: {
    backgroundColor: Theme.colors.darkNavy,
    borderRadius: Theme.radius.md,
    borderWidth: 2,
    borderColor: Theme.colors.slate,
  },
  inputWrapperError: {
    borderColor: Theme.colors.error,
  },
  input: {
    padding: Theme.spacing.md,
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.textLight,
    fontWeight: Theme.typography.weights.medium,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.sm,
  },
  error: {
    color: Theme.colors.error,
    fontSize: Theme.typography.sizes.caption,
    fontWeight: Theme.typography.weights.medium,
  },
  photoSection: {
    marginBottom: Theme.spacing.xl,
  },
  photoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  photoLabel: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.offWhite,
  },
  photoContainer: {
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Theme.colors.primaryGlow,
    opacity: 0.1,
  },
  mapSection: {
    marginBottom: Theme.spacing.xl,
  },
  mapLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  mapLabel: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.offWhite,
  },
  mapContainer: {
    height: 200,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    ...Theme.shadows.soft,
  },
  map: {
    flex: 1,
  },
  actionButtons: {
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.deepCharcoal,
    borderWidth: 2,
    borderColor: Theme.colors.slate,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
  },
  secondaryButtonText: {
    color: Theme.colors.offWhite,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.md + 4,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
    ...Theme.shadows.strong,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Theme.colors.offWhite,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
