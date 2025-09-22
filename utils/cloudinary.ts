import { getCloudinarySignature } from "@/lib/api/cloudinary"; // to nowy plik z API poniżej
import { Alert } from "react-native";

export const uploadToCloudinary = async (
  photo: any
): Promise<string | null> => {
  try {
    const sig = await getCloudinarySignature();

    const data = new FormData();
    data.append("file", photo);
    data.append("timestamp", String(sig.timestamp));
    data.append("signature", sig.signature);
    data.append("api_key", sig.api_key);
    data.append("upload_preset", sig.upload_preset);
    data.append("folder", sig.folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloud_name}/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const result = await response.json();

    if (result.secure_url) return result.secure_url;

    Alert.alert("Błąd podczas uploadu zdjęcia");
    return null;
  } catch (error) {
    Alert.alert("Wystąpił błąd podczas przesyłania zdjęcia.");
    return null;
  }
};
