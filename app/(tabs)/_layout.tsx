import { Tabs } from "expo-router";
import * as React from "react";

import InstellingenIcon from "@/assets/icons/instellingen-icon.svg";
import PlantenIcon from "@/assets/icons/plant-icon.svg";
import ThuisIcon from "@/assets/icons/thuis-icon.svg";
import ZoekIcon from "@/assets/icons/zoeken-icon.svg";

import { colors } from "@/theme/colors";
import { typography } from "@/theme/typografie";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // ✅ BELANGRIJK: anders krijg je dubbele headers
        tabBarActiveTintColor: colors.primaryGroen,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarActiveBackgroundColor: colors.sectieBg,

        tabBarLabelStyle: {
          fontFamily: typography.navbar.fontFamily,
          fontSize: typography.navbar.fontSize,
        },

        tabBarItemStyle: {
          borderRadius: 100,
          overflow: "hidden",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Thuis",
          tabBarIcon: ({ color }) => (
            <ThuisIcon width={22} height={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="planten"
        options={{
          title: "Planten",
          tabBarIcon: ({ color }) => (
            <PlantenIcon width={22} height={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="zoeken"
        options={{
          title: "Zoeken",
          tabBarIcon: ({ color }) => (
            <ZoekIcon width={22} height={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="instellingen"
        options={{
          title: "Instellingen",
          tabBarIcon: ({ color }) => (
            <InstellingenIcon width={22} height={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.cardBg,
    height: 60,
    width: 356,

    borderRadius: 100,
    paddingBottom: 5,
    paddingTop: 5,
    paddingHorizontal: 5,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,

    alignSelf: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bottom: 16,
  },
});
