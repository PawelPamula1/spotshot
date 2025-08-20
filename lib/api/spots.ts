import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_NATIVE_SERVER_URL;

export const getSpots = async (filters?: {
  country?: string;
  city?: string;
}) => {
  const params = new URLSearchParams();

  if (filters?.country) params.append("country", filters.country);
  if (filters?.city) params.append("city", filters.city);

  const queryString = params.toString();
  const url = `${BASE_URL}/api/spots${queryString ? `?${queryString}` : ""}`;

  const response = await axios.get(url);
  return response.data;
};

export const getSpotById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/api/spots/spot/${id}`);
  return response.data;
};

export const createSpot = async (data: any) => {
  const response = await axios.post(`${BASE_URL}/api/spots`, data);
  return response.data;
};

export const getCountries = async (): Promise<string[]> => {
  const response = await axios.get(`${BASE_URL}/api/spots/countries`);
  return response.data;
};

export const getCities = async (country: string): Promise<string[]> => {
  const response = await axios.get(`${BASE_URL}/api/spots/cities`, {
    params: { country },
  });
  return response.data;
};

export const getUserSpotsCount = async (userId: string): Promise<number> => {
  const response = await axios.get(`${BASE_URL}/api/spots/count/${userId}`);
  return response.data.count;
};
