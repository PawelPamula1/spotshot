import * as ImageManipulator from "expo-image-manipulator";

export async function compressImageForUpload(uri: string) {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1600 } }],
    {
      compress: 0.75, // 0..1
      format: ImageManipulator.SaveFormat.JPEG, // konwersja z HEIC/PNG
      base64: false,
    }
  );
  return result.uri;
}
