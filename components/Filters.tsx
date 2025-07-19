import { dummySpots } from "@/lib/data/dummySpots";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type FiltersProps = {
  onFilter: (filteredSpots: typeof dummySpots) => void;
};

export const Filters: React.FC<FiltersProps> = ({ onFilter }) => {
  const theme = useColorScheme() ?? "light";

  const [showFilters, setShowFilters] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");

  const countries = [
    "All",
    ...Array.from(new Set(dummySpots.map((s) => s.country))),
  ];

  const availableCities =
    selectedCountry === "All"
      ? Array.from(new Set(dummySpots.map((s) => s.city)))
      : Array.from(
          new Set(
            dummySpots
              .filter((s) => s.country === selectedCountry)
              .map((s) => s.city)
          )
        );

  const cities = ["All", ...availableCities];

  const filterSpots = (country: string, city: string) => {
    const filtered = dummySpots.filter((spot) => {
      const matchesCountry = country === "All" || spot.country === country;
      const matchesCity = city === "All" || spot.city === city;
      return matchesCountry && matchesCity;
    });

    onFilter(filtered);
  };

  useEffect(() => {
    filterSpots(selectedCountry, selectedCity);
  }, [selectedCountry, selectedCity]);

  const clearFilters = () => {
    setSelectedCountry("All");
    setSelectedCity("All");
  };

  return (
    <View style={{ marginVertical: 16 }}>
      {/* Toggle Button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowFilters((prev) => !prev)}
      >
        <Text style={styles.toggleButtonText}>
          🧭 {showFilters ? "Hide Filters" : "Show Filters"}
        </Text>
      </TouchableOpacity>

      {/* Filters Panel */}
      {showFilters && (
        <>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowCountryModal(true)}
            >
              <Text style={styles.buttonText}>🌍 Filter by country</Text>
              <Text style={{ color: "#aaa", marginTop: 4 }}>
                {selectedCountry}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowCityModal(true)}
            >
              <Text style={styles.buttonText}>🏙️ Filter by city</Text>
              <Text style={{ color: "#aaa", marginTop: 4 }}>
                {selectedCity}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>🧹 Clear Filters</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Country Modal */}
      <Modal visible={showCountryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Wybierz kraj:</Text>
            <Picker
              selectedValue={selectedCountry}
              onValueChange={(value) => {
                setSelectedCountry(value);
                setSelectedCity("All");
                setShowCountryModal(false);
              }}
            >
              {countries.map((country) => (
                <Picker.Item key={country} label={country} value={country} />
              ))}
            </Picker>
            <TouchableOpacity
              onPress={() => setShowCountryModal(false)}
              style={styles.modalCancel}
            >
              <Text style={{ color: "#007AFF", fontWeight: "600" }}>
                Anuluj
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* City Modal */}
      <Modal visible={showCityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Wybierz miasto:</Text>
            <Picker
              selectedValue={selectedCity}
              onValueChange={(value) => {
                setSelectedCity(value);
                setShowCityModal(false);
              }}
            >
              {cities.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
            <TouchableOpacity
              onPress={() => setShowCityModal(false)}
              style={styles.modalCancel}
            >
              <Text style={{ color: "#007AFF", fontWeight: "600" }}>
                Anuluj
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    marginBottom: 12,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  button: {
    flex: 1,
    padding: 14,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  clearButton: {
    marginTop: 8,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#2E2E2E",
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#ccc",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modal: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 12,
    color: "#fff",
  },
  modalCancel: {
    marginTop: 20,
    alignSelf: "flex-end",
  },
});
