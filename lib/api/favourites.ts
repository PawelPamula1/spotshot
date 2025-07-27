// lib/api/favourites.ts
import { Spot } from "@/types/spot";
import axios from "axios";

const BASE_URL = "http://localhost:3000"; // zamień na produkcyjne URL w .env

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
