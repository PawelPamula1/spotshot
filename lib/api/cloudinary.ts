import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_NATIVE_SERVER_URL;

export type CloudinarySignatureResponse = {
  timestamp: number;
  folder: string;
  upload_preset: string;
  signature: string;
  api_key: string;
  cloud_name: string;
};

export const getCloudinarySignature =
  async (): Promise<CloudinarySignatureResponse> => {
    const response = await axios.get(`${BASE_URL}/api/cloudinary/sign`);
    return response.data;
  };
