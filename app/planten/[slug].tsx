import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import type { Plant } from "@/lib/planten/plant";
import { deletePlant, getPlantBySlug } from "@/lib/planten/plant";
import { supabase } from "@/lib/supabase/supabase";

type CareFrequentieNL = "dagelijks" | "wekelijks" | "maandelijks";

export default function PlantDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [plant, setPlant] = useState<Plant | null>(null);

  const [frequentie, setFrequentie] = useState<CareFrequentieNL | null>(null);

  useEffect(() => {
    (async () => {
      if (!slug) return;

      const data = await getPlantBySlug(String(slug));
      if (!data) {
        Alert.alert("Niet gevonden", "Deze plant bestaat niet.");
        router.back();
        return;
      }
      setPlant(data);

      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) return;

      const { data: userPlant, error } = await supabase
        .from("user_plants")
        .select("frequency")
        .eq("user_id", user.id)
        .eq("plant_id", data.id)
        .single();

      if (error) return;

      if (userPlant?.frequency) {
        const nl =
          userPlant.frequency === "daily"
            ? "dagelijks"
            : userPlant.frequency === "weekly"
            ? "wekelijks"
            : "maandelijks";

        setFrequentie(nl);
      }
    })();
  }, [slug]);

  async function handleDelete() {
    if (!plant) return;

    try {
      await deletePlant(plant.id);
      Alert.alert("Verwijderd", "De plant is verwijderd.");
      router.replace("/planten");
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  }

  function openMenu() {
    if (!plant) return;

    Alert.alert("Opties", "Wat wil je doen?", [
      { text: "Annuleren", style: "cancel" },
      {
        text: "Bewerken",
        onPress: () => router.push(`/planten/bewerken?slug=${plant.slug}`),
      },
      {
        text: "Verwijderen",
        style: "destructive",
        onPress: () => {
          Alert.alert(
            "Verwijderen",
            "Weet je zeker dat je deze plant wilt verwijderen?",
            [
              { text: "Annuleren", style: "cancel" },
              {
                text: "Verwijderen",
                style: "destructive",
                onPress: handleDelete,
              },
            ]
          );
        },
      },
    ]);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Plant",
          headerRight: () => (
            <Pressable onPress={openMenu} style={styles.menuBtn}>
              <Text style={styles.menuDots}>⋯</Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Naam</Text>
          <Text style={styles.value}>{plant?.name ?? "-"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Slug</Text>
          <Text style={styles.slug}>{String(slug)}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Soort</Text>
          <Text style={styles.value}>{plant?.species ?? "-"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Locatie</Text>
          <Text style={styles.value}>{plant?.location ?? "-"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Verzorging</Text>
          <Text style={styles.value}>{`${frequentie}`}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  menuBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  menuDots: { color: "#e4e4e7", fontSize: 26, fontWeight: "900" },

  card: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "#27272a",
    margin: 16,
  },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: "700", color: "#e4e4e7" },
  slug: { fontSize: 12, color: "#93c5fd", marginTop: 2 },
  value: { color: "#fafafa", fontSize: 14 },
});
