import "react-native-reanimated";

import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFonts } from "expo-font";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [loaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  if (!loaded) return null; // voorkomt flikkeren

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safe}>
        <Stack />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: 24,
  },
});
