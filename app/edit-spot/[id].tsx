import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { Theme } from "@/constants/Theme";
import { EditSpotFormValues, useEditSpot } from "@/hooks/useEditSpot";
import { useSpot } from "@/hooks/useSpot";
import { useAuth } from "@/provider/AuthProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
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

export default function EditSpotScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { spot, loading: spotLoading, error } = useSpot(id);
  const { userId } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditSpotFormValues>({
    defaultValues: {
      name: "",
      description: "",
      photo_tips: "",
      country: "",
      city: "",
    },
  });

  // Pre-fill form when spot data loads
  useEffect(() => {
    if (spot) {
      reset({
        name: spot.name || "",
        description: spot.description || "",
        photo_tips: spot.photo_tips || "",
        country: spot.country || "",
        city: spot.city || "",
      });
    }
  }, [spot, reset]);

  const { photo, photoDimensions, isSubmitting, pickImage, onSubmit, existingImage } =
    useEditSpot(spot, userId);

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

  // Check authorization
  const isOwner = spot && userId && spot.author_id === userId;

  if (spotLoading) {
    return (
      <View style={[styles.wrapper, { justifyContent: "center", alignItems: "center" }]}>
        <Stack.Screen
          options={{
            headerTitle: () => <HeaderLogo title="Edit Spot" />,
            headerStyle: { backgroundColor: Theme.colors.richBlack },
            headerTintColor: Theme.colors.offWhite,
            headerBackTitle: "Cancel",
          }}
        />
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  if (error || !spot) {
    return (
      <View style={[styles.wrapper, { justifyContent: "center", alignItems: "center" }]}>
        <Stack.Screen
          options={{
            headerTitle: () => <HeaderLogo title="Edit Spot" />,
            headerStyle: { backgroundColor: Theme.colors.richBlack },
            headerTintColor: Theme.colors.offWhite,
            headerBackTitle: "Back",
          }}
        />
        <Text style={styles.errorText}>Failed to load spot data</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isOwner) {
    return (
      <View style={[styles.wrapper, { justifyContent: "center", alignItems: "center" }]}>
        <Stack.Screen
          options={{
            headerTitle: () => <HeaderLogo title="Edit Spot" />,
            headerStyle: { backgroundColor: Theme.colors.richBlack },
            headerTintColor: Theme.colors.offWhite,
            headerBackTitle: "Back",
          }}
        />
        <MaterialIcons name="lock" size={64} color={Theme.colors.error} />
        <Text style={[styles.errorText, { marginTop: Theme.spacing.lg }]}>
          You are not authorized to edit this spot
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const location = {
    latitude: spot.latitude,
    longitude: spot.longitude,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}
    >
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderLogo title="Edit Spot" />,
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
              name="edit-location"
              size={28}
              color={Theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Edit Spot Details</Text>
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

          {/* CITY */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>City *</Text>
            <Controller
              control={control}
              name="city"
              rules={{ required: "City is required" }}
              render={({ field: { onChange, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    errors.city && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Paris"
                    placeholderTextColor={Theme.colors.textMuted}
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
            {typeof errors.city?.message === "string" && (
              <View style={styles.errorContainer}>
                <MaterialIcons
                  name="error-outline"
                  size={16}
                  color={Theme.colors.error}
                />
                <Text style={styles.error}>{errors.city.message}</Text>
              </View>
            )}
          </View>

          {/* COUNTRY */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Country *</Text>
            <Controller
              control={control}
              name="country"
              rules={{ required: "Country is required" }}
              render={({ field: { onChange, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    errors.country && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. France"
                    placeholderTextColor={Theme.colors.textMuted}
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
            {typeof errors.country?.message === "string" && (
              <View style={styles.errorContainer}>
                <MaterialIcons
                  name="error-outline"
                  size={16}
                  color={Theme.colors.error}
                />
                <Text style={styles.error}>{errors.country.message}</Text>
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
          <View style={styles.photoSection}>
            <View style={styles.photoLabelContainer}>
              <MaterialIcons
                name="image"
                size={20}
                color={Theme.colors.primary}
              />
              <Text style={styles.photoLabel}>
                {photo ? "New Photo" : "Current Photo"}
              </Text>
            </View>
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: photo ? photo.uri : existingImage }}
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

          {/* Map Preview (Read-only) */}
          {location && (
            <View style={styles.mapSection}>
              <View style={styles.mapLabelContainer}>
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color={Theme.colors.primary}
                />
                <Text style={styles.mapLabel}>Location (Cannot be changed)</Text>
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
                name="edit"
                size={20}
                color={Theme.colors.primary}
              />
              <Text style={styles.secondaryButtonText}>
                Change Photo
              </Text>
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
                  <Text style={styles.submitButtonText}>Updating Spot...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color={Theme.colors.offWhite}
                  />
                  <Text style={styles.submitButtonText}>Update Spot</Text>
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
    color: Theme.colors.textMuted,
  },
  mapContainer: {
    height: 200,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Theme.colors.slate,
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
  errorText: {
    color: Theme.colors.textMuted,
    fontSize: Theme.typography.sizes.body,
    textAlign: "center",
    marginTop: Theme.spacing.md,
  },
  errorButton: {
    marginTop: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: Theme.radius.md,
  },
  errorButtonText: {
    color: Theme.colors.offWhite,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
  },
});
