import PlantenCard from "@/components/ui/planten/PlantenCard";
import TakenCard from "@/components/ui/planten/TakenCard";
import { supabase } from "@/lib/supabase/supabase";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
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

type TaakItem = {
  task_id: string;
  user_plant_id: string;
  due_at: string;
  plant_name: string;
  plant_species: string;
  plant_image_url: string | null;
};

export default function PlantenScreen() {
  const router = useRouter();

  const [plants, setPlants] = useState<PlantForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const lastLoadTimeRef = useRef<number>(0);
  const hasLoadedRef = useRef<boolean>(false);

  const [taken, setTaken] = useState<TaakItem[]>([]);
  const [takenLoading, setTakenLoading] = useState(true);
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
    if (hasLoadedRef.current && now - lastLoadTimeRef.current < 30000) {
      return;
    }

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
    lastLoadTimeRef.current = now;
    hasLoadedRef.current = true;
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
      let mounted = true;

      (async () => {
        if (!mounted) return;
        await loadPlants();
        await loadTaken();
      })();

      return () => {
        mounted = false;
      };
    }, [loadPlants, loadTaken])
  );

  return (
    <ScrollView>
      <Text>Mijn planten</Text>

      {/* Taken vandaag */}
      <View>
        <Text>Taken vandaag</Text>
        {takenLoading ? (
          <Text>Loading...</Text>
        ) : taken.length === 0 ? (
          <Text>Geen taken voor vandaag 🎉</Text>
        ) : (
          <View>
            {taken.map((t) => (
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
            ))}
          </View>
        )}
      </View>

      {/* Planten lijst */}
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
