import "react-native-reanimated";

import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
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
