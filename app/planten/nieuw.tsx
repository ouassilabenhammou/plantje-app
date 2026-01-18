import { Stack, router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  createFirstCareTask,
  createPlants,
  createUserPlant,
} from "@/lib/planten/plant";
import { supabase } from "@/lib/supabase/supabase";

type CareFrequentie = "dagelijks" | "wekelijks" | "maandelijks";

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

export default function NieuwPlantForm() {
  const [name, setName] = useState<string>("");
  const [species, setSpecies] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [frequentie, setFrequentie] = useState<CareFrequentie>("wekelijks");

  const slug = useMemo(() => slugify(name), [name]);

  async function onSubmit() {
    if (!name.trim()) {
      Alert.alert("Naam is verplicht", "Vul een naam in.");
      return;
    }

    try {
      setSubmitting(true);

      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError) throw authError;

      const user = authData.user;
      if (!user) {
        Alert.alert("Niet ingelogd", "Log in om een plant toe te voegen.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("slug", slug);
      formData.append("species", species.trim());
      formData.append("location", location.trim());

      // 1) Plant aanmaken in jouw plants tabel
      const plant = await createPlants(formData);

      // 2) NL -> DB enum
      const frequencyDb =
        frequentie === "dagelijks"
          ? "daily"
          : frequentie === "wekelijks"
          ? "weekly"
          : "monthly";

      // 3) Koppelen aan user + voorkeur
      const userPlant = await createUserPlant({
        userId: user.id,
        plantId: plant.id,
        frequency: frequencyDb,
      });

      // 4) Eerste task aanmaken (optioneel, maar nodig voor “Vandaag” lijst)
      await createFirstCareTask(userPlant.id);

      Alert.alert("Success", `Plant is aangemaakt! Verzorging: ${frequentie}`);
      router.back();
    } catch (e: unknown) {
      const msg = getErrorMessage(e);

      // (optioneel) iets vriendelijker bij duplicates
      if (
        msg.toLowerCase().includes("duplicate") ||
        msg.toLowerCase().includes("already exists") ||
        msg.toLowerCase().includes("unique")
      ) {
        Alert.alert("Bestaat al", "Deze plant is al toegevoegd.");
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: "Nieuwe plant" }} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text
          style={{
            color: "#e4e4e7",
            fontSize: 18,
            fontWeight: "800",
            marginBottom: 12,
          }}
        >
          Nieuwe plant
        </Text>

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

          <View style={styles.field}>
            <Text style={styles.label}>Verzorging</Text>

            <View style={styles.freqRow}>
              {(
                ["dagelijks", "wekelijks", "maandelijks"] as CareFrequentie[]
              ).map((f) => {
                const active = frequentie === f;
                return (
                  <Pressable
                    key={f}
                    onPress={() => setFrequentie(f)}
                    style={({ pressed }) => [
                      styles.freqBtn,
                      active && styles.freqBtnActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[styles.freqText, active && styles.freqTextActive]}
                    >
                      {f === "dagelijks"
                        ? "Dagelijks"
                        : f === "wekelijks"
                        ? "Wekelijks"
                        : "Maandelijks"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.help}>
              Kies hoe vaak je deze plant wilt verzorgen.
            </Text>
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
                {submitting ? "Opslaan..." : "Plant toevoegen"}
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

  freqRow: { flexDirection: "row", gap: 10 },
  freqBtn: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3f3f46",
  },
  freqBtnActive: { borderColor: "#2563eb" },
  freqText: { color: "#e4e4e7", fontWeight: "800", fontSize: 13 },
  freqTextActive: { color: "#93c5fd" },
});
