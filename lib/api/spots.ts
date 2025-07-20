import axios from "axios";

const BASE_URL = "http://localhost:3000"; // Zmienisz na produkcyjny adres, np. przez .env

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
  const response = await axios.get(`${BASE_URL}/api/spots/${id}`);
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
