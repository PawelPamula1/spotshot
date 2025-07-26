import { Spot } from "@/types/spot";
import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { SpotCard } from "./SpotCard";

const CARD_MARGIN = 8;

type SpotGridProps = {
  spots: Spot[];
};

export const SpotGrid = ({ spots }: SpotGridProps) => {
  if (!spots || spots.length === 0) {
    return <Text style={styles.emptyText}>No results found</Text>;
  }

  return (
    <FlatList
      data={spots}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SpotCard spot={item} />}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: "space-between",
        paddingHorizontal: CARD_MARGIN,
      }}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 16,
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
    color: "#ccc",
  },
});
