import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Dimensions } from "react-native";

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
import { v4 as uuidv4 } from "uuid";

const FormData = global.FormData;

export default function AddSpotForm() {
  const { latitude, longitude } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
  }>();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
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

      RNImage.getSize(photo!.uri, (width, height) => {
        console.log("height", height);
        setPhotoDimensions({ width, height });
      });
    }
    console.log("calculatedHeight", calculatedHeight);
  };

  const handleAddSpot = async () => {
    if (!photo || !location) return;

    const source = {
      uri: photo.uri,
      type: photo.mimeType,
      name: photo.fileName,
    };

    const imageUrl = await cloudinaryUpload(source);

    const newSpot = {
      id: uuidv4(),
      name,
      city,
      country,
      image: imageUrl,
      description,
      latitude: location.latitude,
      longitude: location.longitude,
      author: {
        userId: 7,
        authorName: "Paul Projects",
      },
    };

    console.log("Adding spot:", newSpot);
  };

  const cloudinaryUpload = async (photo: any) => {
    try {
      const data = new FormData();
      data.append("file", photo);
      data.append("upload_preset", "spotshot_gallery");
      data.append("cloud_name", "dllsxlovi");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dllsxlovi/upload",
        {
          method: "post",
          body: data,
        }
      );
      const result = await response.json();
      if (result.secure_url) {
        return result.secure_url;
      } else {
        Alert.alert("Błąd podczas uploadu zdjęcia");
        return null;
      }
    } catch (error) {
      Alert.alert("Wystąpił błąd podczas przesyłania zdjęcia.");
      return null;
    }
  };

  const screenWidth = Dimensions.get("window").width;

  let calculatedHeight = 300; // fallback
  if (photoDimensions) {
    const ratio = photoDimensions.height / photoDimensions.width;
    calculatedHeight = screenWidth * ratio;
  }

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

      <Text style={styles.label}>📍 Nazwa miejsca</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nazwa"
        style={styles.input}
      />

      <Text style={styles.label}>📝 Opis</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Opis"
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <Text style={styles.label}>🌍 Kraj</Text>
      <TextInput
        value={country}
        onChangeText={setCountry}
        style={styles.input}
      />

      <Text style={styles.label}>🏙️ Miasto</Text>
      <TextInput value={city} onChangeText={setCity} style={styles.input} />

      <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
        <Text style={styles.imageButtonText}>🖼️ Wybierz zdjęcie</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleAddSpot}>
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
