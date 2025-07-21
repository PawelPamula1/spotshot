import { Alert } from "react-native";

export const uploadToCloudinary = async (
  photo: any
): Promise<string | null> => {
  try {
    const data = new FormData();
    data.append("file", photo);
    data.append("upload_preset", "spotshot_gallery");
    data.append("cloud_name", "dllsxlovi");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dllsxlovi/upload",
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
