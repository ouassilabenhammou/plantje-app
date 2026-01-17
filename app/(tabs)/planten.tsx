import PlantenCard from "@/components/ui/planten/PlantenCard";
import { supabase } from "@/lib/supabase/supabase";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

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

export default function PlantenScreen() {
  const router = useRouter();

  const [plants, setPlants] = useState<PlantForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPlants = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("is_hidden", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMsg(error.message ?? "Er ging iets mis.");
      setPlants([]);
    } else {
      setPlants((data as PlantForm[]) ?? []);
    }

    setLoading(false);
  }, []);

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
    <ScrollView>
      <Text>Mijn planten</Text>

      <View>
        {loading ? (
          <Text>Loading...</Text>
        ) : errorMsg ? (
          <Text>{errorMsg}</Text>
        ) : !plants || plants.length === 0 ? (
          <Text>Nog geen planten toegevoegd</Text>
        ) : (
          <View>
            {plants.map((plant) => (
              <Pressable
                onPress={() => router.push(`/planten/${plant.slug}`)}
                key={plant.id}
              >
                <PlantenCard name={plant.name} species={plant.species} />
              </Pressable>
            ))}
          </View>
        )}

        <Pressable onPress={() => router.push(`/planten/nieuw`)}>
          <Text>+ Plant toevoegen</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
