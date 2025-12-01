import { getCities, getCountries, getSpots } from "@/lib/api/spots";
import { Spot } from "@/types/spot";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Theme } from "@/constants/Theme";

type FiltersProps = {
  onFilter: (spots: Spot[]) => void;
};

export type FiltersRef = {
  applyFilters: () => Promise<void>;
};

export const Filters = forwardRef<FiltersRef, FiltersProps>(({ onFilter }, ref) => {
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Draft state - only applied when user clicks Apply
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await getCountries();
        setCountries(["All", ...countries]);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();

    // Load all spots initially
    const loadAllSpots = async () => {
      try {
        const spots = await getSpots({});
        onFilter(spots);
      } catch (error) {
        console.error("Error loading initial spots:", error);
      }
    };
    loadAllSpots();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedCountry === "All") {
        setCities([]);
        return;
      }

      try {
        const cities = await getCities(selectedCountry);
        setCities(["All", ...cities]);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, [selectedCountry]);

  // Expose applyFilters method to parent via ref
  useImperativeHandle(ref, () => ({
    applyFilters: async () => {
      try {
        const filters: { country?: string; city?: string } = {};
        if (selectedCountry !== "All") filters.country = selectedCountry;
        if (selectedCity !== "All") filters.city = selectedCity;

        const spots = await getSpots(filters);
        onFilter(spots);
      } catch (error) {
        console.error("Error applying filters:", error);
      }
    },
  }));

  const clearFilters = () => {
    setSelectedCountry("All");
    setSelectedCity("All");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Active Filters Indicator */}
        {(selectedCountry !== "All" || selectedCity !== "All") && (
          <View style={styles.activeFiltersCard}>
            <MaterialIcons
              name="filter-alt"
              size={18}
              color={Theme.colors.primary}
            />
            <Text style={styles.activeFiltersText}>
              {selectedCountry !== "All" && selectedCity !== "All"
                ? `${selectedCountry}, ${selectedCity}`
                : selectedCountry !== "All"
                ? selectedCountry
                : selectedCity}
            </Text>
            <TouchableOpacity
              onPress={clearFilters}
              style={styles.clearIconButton}
            >
              <MaterialIcons
                name="close"
                size={18}
                color={Theme.colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Filter Cards */}
        <View style={styles.filterCardsContainer}>
          {/* Country Filter */}
          <TouchableOpacity
            style={[
              styles.filterCard,
              selectedCountry !== "All" && styles.filterCardActive,
            ]}
            onPress={() => setShowCountryModal(true)}
          >
            <View style={styles.filterIconContainer}>
              <MaterialIcons
                name="public"
                size={24}
                color={
                  selectedCountry !== "All"
                    ? Theme.colors.primary
                    : Theme.colors.textMuted
                }
              />
            </View>
            <View style={styles.filterContent}>
              <Text style={styles.filterLabel}>Country</Text>
              <Text style={styles.filterValue}>
                {selectedCountry === "All" ? "All Countries" : selectedCountry}
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={Theme.colors.textMuted}
            />
          </TouchableOpacity>

          {/* City Filter */}
          <TouchableOpacity
            style={[
              styles.filterCard,
              selectedCity !== "All" && styles.filterCardActive,
              selectedCountry === "All" && styles.filterCardDisabled,
            ]}
            onPress={() => setShowCityModal(true)}
            disabled={selectedCountry === "All"}
          >
            <View style={styles.filterIconContainer}>
              <MaterialIcons
                name="location-city"
                size={24}
                color={
                  selectedCity !== "All"
                    ? Theme.colors.primary
                    : selectedCountry === "All"
                    ? Theme.colors.slate
                    : Theme.colors.textMuted
                }
              />
            </View>
            <View style={styles.filterContent}>
              <Text
                style={[
                  styles.filterLabel,
                  selectedCountry === "All" && styles.filterLabelDisabled,
                ]}
              >
                City
              </Text>
              <Text
                style={[
                  styles.filterValue,
                  selectedCountry === "All" && styles.filterValueDisabled,
                ]}
              >
                {selectedCountry === "All"
                  ? "Select country first"
                  : selectedCity === "All"
                  ? "All Cities"
                  : selectedCity}
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={
                selectedCountry === "All"
                  ? Theme.colors.slate
                  : Theme.colors.textMuted
              }
            />
          </TouchableOpacity>
        </View>

        {/* Clear All Button */}
        {(selectedCountry !== "All" || selectedCity !== "All") && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <MaterialIcons
              name="clear-all"
              size={20}
              color={Theme.colors.error}
            />
            <Text style={styles.clearButtonText}>Clear All Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Country Modal */}
      <Modal visible={showCountryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <View style={styles.pickerModalHeader}>
              <MaterialIcons
                name="public"
                size={24}
                color={Theme.colors.primary}
              />
              <Text style={styles.pickerModalTitle}>Choose Country</Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCountry}
                onValueChange={(value) => {
                  setSelectedCountry(value);
                  setSelectedCity("All");
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {countries.map((country) => (
                  <Picker.Item
                    key={country}
                    label={country}
                    value={country}
                    color={Theme.colors.offWhite}
                  />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              onPress={() => setShowCountryModal(false)}
              style={styles.pickerModalButton}
            >
              <Text style={styles.pickerModalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* City Modal */}
      <Modal visible={showCityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <View style={styles.pickerModalHeader}>
              <MaterialIcons
                name="location-city"
                size={24}
                color={Theme.colors.primary}
              />
              <Text style={styles.pickerModalTitle}>Choose City</Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCity}
                onValueChange={(value) => {
                  setSelectedCity(value);
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {cities.map((city) => (
                  <Picker.Item
                    key={city}
                    label={city}
                    value={city}
                    color={Theme.colors.offWhite}
                  />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              onPress={() => setShowCityModal(false)}
              style={styles.pickerModalButton}
            >
              <Text style={styles.pickerModalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
});

Filters.displayName = "Filters";

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.md,
  },
  activeFiltersCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.deepCharcoal,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  activeFiltersText: {
    flex: 1,
    fontSize: Theme.typography.sizes.bodySmall,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.offWhite,
  },
  clearIconButton: {
    padding: Theme.spacing.xs,
  },
  filterCardsContainer: {
    gap: Theme.spacing.md,
  },
  filterCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    backgroundColor: Theme.colors.deepCharcoal,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    borderWidth: 2,
    borderColor: Theme.colors.slate,
    ...Theme.shadows.soft,
  },
  filterCardActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.darkNavy,
  },
  filterCardDisabled: {
    opacity: 0.5,
  },
  filterIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.richBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  filterContent: {
    flex: 1,
    gap: Theme.spacing.xs,
  },
  filterLabel: {
    fontSize: Theme.typography.sizes.caption,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  filterLabelDisabled: {
    color: Theme.colors.slate,
  },
  filterValue: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.offWhite,
  },
  filterValueDisabled: {
    color: Theme.colors.slate,
    fontSize: Theme.typography.sizes.bodySmall,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.deepCharcoal,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
    borderWidth: 2,
    borderColor: Theme.colors.error,
    marginTop: Theme.spacing.sm,
  },
  clearButtonText: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.error,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  pickerModal: {
    backgroundColor: Theme.colors.richBlack,
    borderTopLeftRadius: Theme.radius.xl,
    borderTopRightRadius: Theme.radius.xl,
    borderTopWidth: 3,
    borderTopColor: Theme.colors.primary,
    paddingBottom: Theme.spacing.xl,
  },
  pickerModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.slate,
  },
  pickerModalTitle: {
    fontSize: Theme.typography.sizes.h3,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.offWhite,
  },
  pickerContainer: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  picker: {
    color: Theme.colors.offWhite,
  },
  pickerItem: {
    color: Theme.colors.offWhite,
    fontSize: Theme.typography.sizes.body,
  },
  pickerModalButton: {
    marginHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    alignItems: "center",
    ...Theme.shadows.strong,
  },
  pickerModalButtonText: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.offWhite,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
