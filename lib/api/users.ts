import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_NATIVE_SERVER_URL;

export const getUserById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/api/users/${id}`);
  return response.data;
};
