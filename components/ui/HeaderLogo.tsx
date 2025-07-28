// components/HeaderLogo.tsx
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export const HeaderLogo = ({ title }: { title: string }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo2.png")}
        style={styles.logo}
        contentFit="contain"
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#121212",
  },
  title: {
    color: "#fff",
    fontSize: 24,
  },
  logo: {
    width: 30,
    height: 20,
  },
});
