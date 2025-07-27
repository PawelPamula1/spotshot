import axios from "axios";

const BASE_URL = "http://localhost:3000"; // Zmienisz na produkcyjny adres, np. przez .env
// const BASE_URL = "https://spotshot-api.onrender.com";

export const getUserById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/api/users/${id}`);
  return response.data;
};
