import { getCities, getCountries, getSpots } from "@/lib/api/spots";
import { Spot } from "@/types/spot"; // upewnij się, że masz ten typ
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
  onFilter: (spots: Spot[]) => void;
};

export const Filters: React.FC<FiltersProps> = ({ onFilter }) => {
  const theme = useColorScheme() ?? "light";

  const [showFilters, setShowFilters] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await getCountries();
        setCountries(["All", ...countries]);
      } catch (error) {
        console.error("Błąd pobierania krajów:", error);
      }
    };
    fetchCountries();
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
        console.error("Błąd pobierania miast:", error);
      }
    };
    fetchCities();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const filters: { country?: string; city?: string } = {};
        if (selectedCountry !== "All") filters.country = selectedCountry;
        if (selectedCity !== "All") filters.city = selectedCity;

        const spots = await getSpots(filters);
        onFilter(spots);
      } catch (error) {
        console.error("Błąd filtrowania:", error);
      }
    };
    fetchSpots();
  }, [selectedCountry, selectedCity]);

  const clearFilters = () => {
    setSelectedCountry("All");
    setSelectedCity("All");
  };

  return (
    <View>
      {showFilters ? (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowFilters((prev) => !prev)}
        >
          <Text style={styles.toggleButtonText}>{"Hide Filters"}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setShowFilters((prev) => !prev)}
          style={styles.filterWrapper}
        >
          <MaterialIcons name="filter-alt" size={16} color="#fff" />
          <Text style={styles.filterText}>Filter Spots</Text>
        </TouchableOpacity>
      )}

      {showFilters && (
        <>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowCountryModal(true)}
            >
              <Text style={styles.buttonText}>Country</Text>
              <Text style={{ color: "#aaa", marginTop: 4 }}>
                {selectedCountry}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowCityModal(true)}
              disabled={selectedCountry === "All"}
            >
              <Text style={styles.buttonText}>City</Text>
              <Text style={{ color: "#aaa", marginTop: 4 }}>
                {selectedCity}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Country Modal */}
      <Modal visible={showCountryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Choose country:</Text>
            <Picker
              selectedValue={selectedCountry}
              onValueChange={(value) => {
                setSelectedCountry(value);
                setSelectedCity("All");
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
              <Text style={{ color: "#007AFF", fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* City Modal */}
      <Modal visible={showCityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Choose city:</Text>
            <Picker
              selectedValue={selectedCity}
              onValueChange={(value) => {
                setSelectedCity(value);
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
              <Text style={{ color: "#007AFF", fontWeight: "600" }}>Close</Text>
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
    marginVertical: 12,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  filterWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  filterText: { color: "#fff" },
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
