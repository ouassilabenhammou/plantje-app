import "react-native-reanimated";

import { useFonts } from "expo-font";
import { Stack, router, usePathname } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import AddButton from "@/assets/icons/toevoegen-icon.svg";
import { colors } from "@/theme/colors";

export default function RootLayout() {
  const pathname = usePathname();

  const [loaded] = useFonts({
    "Roboto-Regular": require("@/assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
    "Roboto-SemiBold": require("@/assets/fonts/Roboto-SemiBold.ttf"),
    "Roboto-Bold": require("@/assets/fonts/Roboto-Bold.ttf"),
  });

  if (!loaded) return null;

  const showAddButton = pathname === "/" || pathname.startsWith("/planten");

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Stack
          screenOptions={{
            headerShown: true,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.primaryBg },
            headerTintColor: colors.textPrimary,
            contentStyle: { backgroundColor: colors.primaryBg },
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              title: "",
              headerRight: () =>
                showAddButton ? (
                  <Pressable
                    onPress={() => router.push("/planten/nieuw")}
                    style={styles.headerBtn}
                  >
                    <AddButton
                      width={22}
                      height={22}
                      color={colors.primaryGroen}
                    />
                  </Pressable>
                ) : null,
            }}
          />
        </Stack>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  headerBtn: {
    padding: 8,
  },
});
