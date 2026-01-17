import PlantenCard from "@/components/ui/planten/PlantenCard";
import { supabase } from "@/lib/supabase/supabase";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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

// Begroeting
type Begroeting = "Goedemorgen" | "Goedemiddag" | "Goedenavond";

function getBegroeting(): Begroeting {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Goedemorgen";
  if (hour >= 12 && hour < 18) return "Goedemiddag";
  return "Goedenavond";
}

export default function HomeScreen() {
  const router = useRouter();
  const begroeting = getBegroeting();

  const [plants, setPlants] = useState<PlantForm[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlants = useCallback(async () => {
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
  }, []);

  // ✅ refresh bij terugkomen
  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      (async () => {
        if (!mounted) return;
        await loadPlants();
      })();

      return () => {
        mounted = false;
      };
    }, [loadPlants])
  );

  return (
    <View style={styles.container}>
      <Text>{begroeting}</Text>

      <View style={styles.takenContainer}>{/* taken */}</View>

      <View style={styles.plantenContainer}>
        <View style={styles.tekstLink}>
          <Text>Mijn planten</Text>
          <Link href="/planten">Bekijk</Link>
        </View>

        {loading ? (
          <Text>Loading...</Text>
        ) : !plants || plants.length === 0 ? (
          <Text>Nog geen planten toegevoegd</Text>
        ) : (
          <View>
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

        {/* ➕ TOEVOEG KNOP */}
        <Pressable
          onPress={() => router.push("/planten/nieuw")}
          style={styles.addBtn}
        >
          <Text style={styles.addText}>+ Plant toevoegen</Text>
        </Pressable>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
  },

  takenContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "grey",
    borderRadius: 10,
    gap: 10,
    justifyContent: "center",
    marginBottom: 30,
  },

  plantenContainer: {
    gap: 10,
  },

  tekstLink: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  addBtn: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3f3f46",
    alignItems: "center",
  },

  addText: {
    fontWeight: "700",
  },
});
