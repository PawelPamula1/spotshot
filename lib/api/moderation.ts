import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_NATIVE_SERVER_URL;

export const reportSpot = async (params: {
  spotId: string;
  reporterId: string;
  reason: string;
}) => {
  await axios.post(`${BASE_URL}/api/moderation/report`, params);
};
