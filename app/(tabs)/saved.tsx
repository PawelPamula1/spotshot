import { StyleSheet, View } from "react-native";

import { SpotGrid } from "@/components/ui/SpotGrid";
import { dummySpots } from "@/lib/data/dummySpots";

export default function Saved() {
  const savedSpots = dummySpots;

  return (
    <View style={styles.container}>
      <SpotGrid spots={savedSpots} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
});
