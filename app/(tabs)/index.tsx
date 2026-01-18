import PlantenCard from "@/components/ui/planten/PlantenCard";
import TakenCard from "@/components/ui/planten/TakenCard";
import { supabase } from "@/lib/supabase/supabase";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import CheckIcon from "@/assets/icons/check-icon.svg";

import { colors } from "@/theme/colors";
import { typography } from "@/theme/typografie";

// Types

type PlantForm = {
  id: string;
  slug: string;
  name: string;
  species: string;
  location: string;
  image_url?: string;
  created_at: string;
  is_hidden: boolean;
};

type TaakItem = {
  task_id: string;
  user_plant_id: string;
  due_at: string;
  plant_name: string;
  plant_species: string;
  plant_image_url: string | null;
};

// Begroeting

type Begroeting = "Goedemorgen," | "Goedemiddag," | "Goedenavond,";

function getBegroeting(): Begroeting {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Goedemorgen,";
  if (hour >= 12 && hour < 18) return "Goedemiddag,";
  return "Goedenavond,";
}

export default function HomeScreen() {
  const router = useRouter();
  const begroeting = getBegroeting();

  const [plants, setPlants] = useState<PlantForm[]>([]);
  const [loading, setLoading] = useState(true);

  const [taken, setTaken] = useState<TaakItem[]>([]);
  const [takenLoading, setTakenLoading] = useState(true);

  const lastPlantsLoadTimeRef = useRef<number>(0);
  const hasPlantsLoadedRef = useRef<boolean>(false);
  const lastTakenLoadTimeRef = useRef<number>(0);
  const hasTakenLoadedRef = useRef<boolean>(false);

  function startOfTodayIso() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }

  function endOfTodayIso() {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  }

  const loadPlants = useCallback(async () => {
    const now = Date.now();
    // Alleen herladen als data nog niet geladen is, of als het meer dan 30 seconden geleden is
    if (
      hasPlantsLoadedRef.current &&
      now - lastPlantsLoadTimeRef.current < 30000
    ) {
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("is_hidden", false)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error(error);
      setPlants([]);
    } else {
      setPlants((data as PlantForm[]) ?? []);
    }

    setLoading(false);
    lastPlantsLoadTimeRef.current = now;
    hasPlantsLoadedRef.current = true;
  }, []);

  const loadTaken = useCallback(async () => {
    const now = Date.now();
    // Alleen herladen als data nog niet geladen is, of als het meer dan 30 seconden geleden is
    if (
      hasTakenLoadedRef.current &&
      now - lastTakenLoadTimeRef.current < 30000
    ) {
      return;
    }

    setTakenLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) {
      setTakenLoading(false);
      return;
    }

    const start = startOfTodayIso();
    const end = endOfTodayIso();

    const { data, error } = await supabase
      .from("care_tasks")
      .select(
        `
        id,
        due_at,
        user_plant_id,
        user_plants!inner (
          user_id,
          plants!inner (
            name,
            species,
            image_url
          )
        )
      `
      )
      .eq("status", "pending")
      .gte("due_at", start)
      .lte("due_at", end)
      .eq("user_plants.user_id", user.id)
      .order("due_at", { ascending: true });

    if (error) {
      console.log(error);
      setTaken([]);
    } else {
      const mapped =
        (data as any[])?.map((row) => ({
          task_id: row.id,
          user_plant_id: row.user_plant_id,
          due_at: row.due_at,
          plant_name: row.user_plants.plants.name,
          plant_species: row.user_plants.plants.species,
          plant_image_url: row.user_plants.plants.image_url ?? null,
        })) ?? [];

      setTaken(mapped);
    }

    setTakenLoading(false);
    lastTakenLoadTimeRef.current = now;
    hasTakenLoadedRef.current = true;
  }, []);

  const removeFromUI = (taskId: string) => {
    setTaken((prev) => prev.filter((t) => t.task_id !== taskId));
  };

  useFocusEffect(
    useCallback(() => {
      loadPlants();
      loadTaken();
    }, [loadPlants, loadTaken])
  );

  return (
    <>
      <View style={styles.container}>
        {/* Begroeting */}
        <View style={styles.begroeting}>
          <Text style={styles.begroetingTekst}>{begroeting}</Text>

          {takenLoading ? null : taken.length === 0 ? (
            <Text style={styles.subTekst}>
              Goed bezig! Al je planten zijn verzorgd.{" "}
            </Text>
          ) : (
            <Text style={styles.subTekst}>
              Je hebt {taken.length} {taken.length === 1 ? "plant" : "planten"}{" "}
              te verzorgen vandaag
            </Text>
          )}
        </View>

        {/* Taken */}
        <View style={styles.takenContainer}>
          {takenLoading ? null : taken.length === 0 ? (
            <View style={styles.centerTekst}>
              <View style={styles.checkBox}>
                <CheckIcon width={20} height={20} color={colors.primaryBg} />
              </View>

              <Text style={styles.takenTitel}>Alles is bijgewerkt</Text>
              <Text style={styles.takenSub}>
                Vandaag hebben je planten geen verzorging nodig
              </Text>
            </View>
          ) : (
            taken.map((t) => (
              <TakenCard
                key={t.task_id}
                taskId={t.task_id}
                userPlantId={t.user_plant_id}
                dueAt={t.due_at}
                naam={t.plant_name}
                latijnseNaam={t.plant_species}
                image={t.plant_image_url ?? undefined}
                onDone={() => removeFromUI(t.task_id)}
              />
            ))
          )}
        </View>

        {/* Mijn planten */}
        <View style={styles.plantenContainer}>
          <View style={styles.tekstLink}>
            <Text style={styles.sectieTitel}>Mijn planten</Text>
            <Link href="/planten" style={styles.bekijkLink}>
              Bekijk
            </Link>
          </View>

          {loading ? (
            <Text>Loading...</Text>
          ) : !plants || plants.length === 0 ? (
            <Text>Nog geen planten toegevoegd</Text>
          ) : (
            <View style={styles.plantenCard}>
              {plants.map((plant) => (
                <Pressable
                  key={plant.id}
                  onPress={() => router.push(`/planten/${plant.slug}`)}
                >
                  <PlantenCard name={plant.name} species={plant.species} />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </>
  );
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 40,
    backgroundColor: colors.primaryBg,
  },

  // Begroeting
  begroeting: {
    gap: 5,
  },

  begroetingTekst: {
    color: colors.textPrimary,
    ...typography.pageTitle,
  },

  subTekst: {
    ...typography.body,
    color: colors.textPrimary,
  },

  // Taken Container

  takenContainer: {
    width: "100%",
    padding: 30,
    backgroundColor: colors.sectieBg,
    borderRadius: 10,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  centerTekst: {
    textAlign: "center",
    alignItems: "center",
    gap: 8,
  },

  checkBox: {
    width: 30,
    height: 30,
    backgroundColor: colors.primaryGroen,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  takenTitel: {
    textAlign: "center",
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },

  takenSub: {
    textAlign: "center",
    width: 200,
    ...typography.body,
    color: colors.textPrimary,
  },

  // Mijn planten

  plantenContainer: {
    gap: 20,
  },

  sectieTitel: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },

  plantenCard: {
    gap: 10,
  },

  tekstLink: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bekijkLink: {
    color: colors.primaryGroen,
    ...typography.body,
  },
});
