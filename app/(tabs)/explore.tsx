import { Filters, FiltersRef } from "@/components/Filters";
import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { SpotGrid } from "@/components/ui/SpotGrid";
import { Theme } from "@/constants/Theme";
import { useSpots } from "@/hooks/useSpots";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import React, { useRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { search, filteredSpots, loading, onFilter } = useSpots();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const filtersRef = useRef<FiltersRef>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: Theme.animation.normal,
      useNativeDriver: true,
    }).start();
  }, [filteredSpots]);

  const handleApplyFilters = async () => {
    await filtersRef.current?.applyFilters();
    setFilterModalVisible(false);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderLogo title="Explore Spots" />,
          headerStyle: { backgroundColor: Theme.colors.richBlack },
          headerTintColor: Theme.colors.offWhite,
        }}
      />

      {search ? (
        <View style={styles.searchBanner}>
          <MaterialIcons
            name="search"
            size={18}
            color={Theme.colors.primary}
          />
          <Text style={styles.searchLabel}>
            Results for <Text style={styles.searchTerm}>"{search}"</Text>
          </Text>
        </View>
      ) : (
        <View style={styles.headerSection}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Discover Spots</Text>
            <Text style={styles.headerSubtitle}>
              {loading ? "Loading..." : `${filteredSpots.length} locations found`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <MaterialIcons
              name="filter-list"
              size={20}
              color={Theme.colors.primary}
            />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.loadingText}>Finding amazing spots...</Text>
        </View>
      ) : filteredSpots.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <MaterialIcons
              name="explore-off"
              size={64}
              color={Theme.colors.slate}
            />
          </View>
          <Text style={styles.emptyTitle}>No Spots Found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your filters to discover more locations
          </Text>
        </View>
      ) : (
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          <SpotGrid spots={filteredSpots} />
        </Animated.View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Spots</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <MaterialIcons
                  name="close"
                  size={28}
                  color={Theme.colors.offWhite}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Filters ref={filtersRef} onFilter={onFilter} />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.richBlack,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Theme.typography.sizes.h2,
    fontWeight: Theme.typography.weights.black,
    color: Theme.colors.offWhite,
    marginBottom: Theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: Theme.typography.sizes.bodySmall,
    color: Theme.colors.textMuted,
    fontWeight: Theme.typography.weights.medium,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.deepCharcoal,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  filterButtonText: {
    fontSize: Theme.typography.sizes.bodySmall,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.offWhite,
  },
  searchBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.deepCharcoal,
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  searchLabel: {
    fontSize: Theme.typography.sizes.bodySmall,
    color: Theme.colors.textMuted,
    fontWeight: Theme.typography.weights.medium,
  },
  searchTerm: {
    color: Theme.colors.primary,
    fontWeight: Theme.typography.weights.bold,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.md,
  },
  loadingText: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.textMuted,
    fontWeight: Theme.typography.weights.medium,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Theme.spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Theme.colors.deepCharcoal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: Theme.typography.sizes.h3,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.offWhite,
    marginBottom: Theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.textMuted,
    textAlign: "center",
    lineHeight: Theme.typography.sizes.body * Theme.typography.lineHeights.relaxed,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Theme.colors.richBlack,
    borderTopLeftRadius: Theme.radius.xl,
    borderTopRightRadius: Theme.radius.xl,
    maxHeight: "70%",
    borderTopWidth: 3,
    borderTopColor: Theme.colors.primary,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.slate,
  },
  modalTitle: {
    fontSize: Theme.typography.sizes.h2,
    fontWeight: Theme.typography.weights.black,
    color: Theme.colors.offWhite,
  },
  modalBody: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  modalFooter: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.slate,
  },
  applyButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md + 2,
    borderRadius: Theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    ...Theme.shadows.strong,
  },
  applyButtonText: {
    color: Theme.colors.offWhite,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
