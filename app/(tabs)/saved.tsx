import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";

export default function Saved() {
  return (
    <ThemedView>
      <ThemedText>My favourite spots</ThemedText>
      <View>
        <Image
          source={require("@/assets/images/hero-desktop.png")}
          style={styles.image}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  image: {
    width: "100%",
    height: 400,
    borderRadius: 6,
  },
});
