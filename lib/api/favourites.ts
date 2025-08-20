// lib/api/favourites.ts
import { Spot } from "@/types/spot";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_NATIVE_SERVER_URL;

export const addToFavourites = async (userId: string, spotId: string) => {
  const response = await axios.post(`${BASE_URL}/api/favourites`, {
    userId,
    spotId,
  });
  return response.data;
};

export const getFavouriteSpots = async (userId: string): Promise<Spot[]> => {
  const response = await axios.get(`${BASE_URL}/api/favourites/${userId}`);
  return response.data;
};

export const checkIfFavourite = async (userId: string, spotId: string) => {
  const response = await axios.get(
    `${BASE_URL}/api/favourites/check?userId=${userId}&spotId=${spotId}`
  );
  return response.data.favorited as boolean;
};

export const getFavouriteCount = async (spotId: string): Promise<number> => {
  const response = await axios.get(
    `${BASE_URL}/api/favourites/count/${spotId}`
  );
  return response.data.count;
};
