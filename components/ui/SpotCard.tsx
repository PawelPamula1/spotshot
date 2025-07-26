import { Spot } from "@/types/spot";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CARD_MARGIN = 8;
const CARD_WIDTH = (Dimensions.get("window").width - CARD_MARGIN * 3) / 2;

export const SpotCard = ({ spot }: { spot: Spot }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH }]}
      onPress={() => router.push(`/spot/${spot.id}`)}
    >
      <Image source={{ uri: spot.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{spot.name}</Text>
        <Text style={styles.city}>{spot.city}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {spot.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  textContainer: {
    padding: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
    color: "#fff",
  },
  city: {
    fontSize: 13,
    color: "#bbb",
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: "#ccc",
    lineHeight: 16,
  },
});
