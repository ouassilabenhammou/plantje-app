import { supabase } from "@/lib/supabase/supabase";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

type PlantForm = {
  id: string;
  name: string;
  species: string;
  location?: string | null;
  image_url?: string | null;
  is_hidden: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

export default function TestPage() {
  const [plants, setPlants] = useState<PlantForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from("plants").select("*");

    if (error) {
      setError(error.message);
      setPlants([]);
    } else {
      setPlants((data as PlantForm[]) || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        Database Connection Test
      </Text>

      {loading ? (
        <View
          style={{
            backgroundColor: "#eef2ff",
            borderWidth: 1,
            borderColor: "#c7d2fe",
            padding: 12,
            borderRadius: 10,
          }}
        >
          <Text>Loading...</Text>
        </View>
      ) : error ? (
        <View
          style={{
            backgroundColor: "#fee2e2",
            borderWidth: 1,
            borderColor: "#fca5a5",
            padding: 12,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#b91c1c", fontWeight: "700" }}>
            Error: {error}
          </Text>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: "#dcfce7",
            borderWidth: 1,
            borderColor: "#86efac",
            padding: 12,
            borderRadius: 10,
            gap: 6,
          }}
        >
          <Text style={{ color: "#166534", fontWeight: "700" }}>
            ✓ Connection successful!
          </Text>
          <Text style={{ color: "#166534" }}>
            Planten in database: {plants.length}
          </Text>
        </View>
      )}

      {/* Optioneel: laat ook de items zien */}
      {plants.map((p) => (
        <View
          key={p.id}
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 12,
            borderRadius: 10,
            gap: 4,
          }}
        >
          <Text style={{ fontWeight: "700" }}>{p.name}</Text>
          <Text>{p.species}</Text>
          {p.location ? <Text>📍 {p.location}</Text> : null}
        </View>
      ))}
    </ScrollView>
  );
}
