import CheckIcon from "@/assets/icons/check-icon.svg";
import { supabase } from "@/lib/supabase/supabase";

import React from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { typography } from "@/theme/typografie";

type TakenCardProps = {
  image?: string;
  naam?: string;
  latijnseNaam?: string;

  taskId: string;
  userPlantId: string;
  dueAt: string;

  onDone?: () => void;
};

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d;
}

function computeNextDueAt(
  currentDueAtIso: string,
  frequency: "daily" | "weekly" | "monthly"
) {
  const base = new Date(currentDueAtIso);
  if (frequency === "daily") return addDays(base, 1).toISOString();
  if (frequency === "weekly") return addDays(base, 7).toISOString();
  return addMonths(base, 1).toISOString();
}

const TakenCard = ({
  image,
  naam,
  latijnseNaam,
  taskId,
  userPlantId,
  dueAt,
  onDone,
}: TakenCardProps) => {
  const [checked, setChecked] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  async function handleDone() {
    if (saving || checked) return;

    try {
      setSaving(true);

      // 1) markeer task als done
      const { error: updateError } = await supabase
        .from("care_tasks")
        .update({ status: "done", done_at: new Date().toISOString() })
        .eq("id", taskId);

      if (updateError) {
        console.error("updateError", updateError);
        throw updateError;
      }

      // 2) haal frequency op uit user_plants
      const { data: up, error: upError } = await supabase
        .from("user_plants")
        .select("frequency")
        .eq("id", userPlantId)
        .single();

      if (upError) {
        console.error("upError", upError);
        throw upError;
      }

      const frequency = up?.frequency as
        | "daily"
        | "weekly"
        | "monthly"
        | undefined;
      if (!frequency)
        throw new Error("Geen frequentie gevonden voor deze plant.");

      // 3) maak volgende task aan
      const nextDueAt = computeNextDueAt(dueAt, frequency);

      const { error: insertError } = await supabase.from("care_tasks").insert({
        user_plant_id: userPlantId,
        due_at: nextDueAt,
        status: "pending",
      });

      if (insertError) {
        console.error("insertError", insertError);
        throw insertError;
      }

      setChecked(true);

      // 4) laat HomeScreen hem verwijderen + refresh
      onDone?.();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.card}>
      <Image
        source={
          image
            ? { uri: image }
            : { uri: "https://via.placeholder.com/60x60.png?text=Plant" }
        }
        style={styles.image}
      />
      <View style={styles.tekstBlok}>
        <Text style={styles.naam}>{naam ?? "Onbekende plant"}</Text>
        <Text style={styles.latijn}>{latijnseNaam ?? "-"}</Text>
      </View>
      <View style={styles.checkBox}>
        <Pressable
          onPress={handleDone}
          disabled={saving || checked}
          style={({}) => [
            styles.cirkel,
            (checked || saving) && styles.cirkelChecked,
          ]}
        >
          {(checked || saving) && (
            <CheckIcon width={16} height={16} color="white" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default TakenCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 70,
    backgroundColor: "white",
    borderRadius: 12,
    paddingLeft: 7,
    paddingRight: 20,
    paddingVertical: 5,
    flexDirection: "row",

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
    alignItems: "center",
  },

  naam: {
    ...typography.cardTitel,
    color: colors.textPrimary,
  },

  latijn: {
    ...typography.subText,
    color: colors.textSecondary,
  },

  tekstBlok: {
    flex: 1,
    marginLeft: 12,
  },

  cirkel: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.primaryGroen,
    alignItems: "center",
    justifyContent: "center",
  },

  cirkelChecked: {
    backgroundColor: colors.primaryGroen,
  },

  checkBox: {
    alignItems: "flex-end",
    alignSelf: "center",
  },
});
