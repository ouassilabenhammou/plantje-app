import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { Plant } from "@/lib/planten/plant";
import { getPlantBySlug, updatePlant } from "@/lib/planten/plant";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Er ging iets mis.";
}

export default function BewerkPlantForm() {
  const { slug: routeSlug } = useLocalSearchParams<{ slug: string }>();

  const [plant, setPlant] = useState<Plant | null>(null);

  const [name, setName] = useState<string>("");
  const [species, setSpecies] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const slug = useMemo(() => slugify(name), [name]);

  useEffect(() => {
    (async () => {
      if (!routeSlug) return;

      const data = await getPlantBySlug(String(routeSlug));
      if (!data) {
        Alert.alert("Niet gevonden", "Deze plant bestaat niet.");
        router.back();
        return;
      }

      setPlant(data);
      setName(data.name ?? "");
      setSpecies(data.species ?? "");
      setLocation(data.location ?? "");
    })();
  }, [routeSlug]);

  async function onSubmit() {
    if (!name.trim()) {
      Alert.alert("Naam is verplicht", "Vul een naam in.");
      return;
    }
    if (!plant) return;

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("slug", slug);
      formData.append("species", species.trim());
      formData.append("location", location.trim());

      await updatePlant(plant.id, formData);

      Alert.alert("Success", "Plant is bijgewerkt!");
      // terug naar detail van (mogelijk) nieuwe slug
      router.replace(`/planten/${slug}`);
    } catch (e: unknown) {
      Alert.alert("Error", getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: "Plant bewerken" }} />

      <ScrollView>
        <Text>Plant bewerken</Text>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Naam *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Plant naam"
              placeholderTextColor="#71717a"
              style={styles.input}
              autoCapitalize="sentences"
              returnKeyType="next"
            />
            <Text style={styles.help}>Slug wordt automatisch gemaakt</Text>
            {!!name.trim() && <Text style={styles.slug}>Slug: {slug}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Soort</Text>
            <TextInput
              value={species}
              onChangeText={setSpecies}
              placeholder="Soort"
              placeholderTextColor="#71717a"
              style={styles.input}
              autoCapitalize="sentences"
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Locatie</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Bijv woonkamer"
              placeholderTextColor="#71717a"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={onSubmit}
              disabled={submitting}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.pressed,
                submitting && styles.disabled,
              ]}
            >
              <Text style={styles.primaryBtnText}>
                {submitting ? "Opslaan..." : "Opslaan"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.secondaryBtnText}>Annuleren</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: "700", color: "#e4e4e7" },
  help: { fontSize: 12, color: "#a1a1aa" },
  slug: { fontSize: 12, color: "#93c5fd", marginTop: 2 },
  input: {
    borderWidth: 1,
    borderColor: "#3f3f46",
    backgroundColor: "#0f172a",
    color: "#fafafa",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textareaSm: { minHeight: 90 },
  textareaLg: { minHeight: 180 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 2 },
  rowLabel: { fontSize: 14, color: "#e4e4e7" },
  actions: { flexDirection: "row", gap: 10, paddingTop: 8 },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "800", fontSize: 14 },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3f3f46",
  },
  secondaryBtnText: { color: "#e4e4e7", fontWeight: "800", fontSize: 14 },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.6 },
});
