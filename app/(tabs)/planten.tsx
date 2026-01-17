import PlantenCard from "@/components/ui/planten/PlantenCard";
import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { ScrollView, Text, View } from "react-native";

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

  useEffect(() => {
    let mounted = true;

    async function loadPlants() {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("plants")
        .select("*")
        .eq("is_hidden", false)
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (error) {
        console.error(error);
        setPlants([]);
      } else {
        setPlants((data as PlantForm[]) ?? []);
      }
      setLoading(false);
    }

    loadPlants();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView>
      <Text>Mijn planten</Text>

      <View>
        {!plants || plants.length === 0 ? (
          <Text>Nog geen planten toegevoegd</Text>
        ) : (
          <View>
            {plants.map((plants) => (
              <PlantenCard
                key={plants.id}
                name={plants.name}
                species={plants.species}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
