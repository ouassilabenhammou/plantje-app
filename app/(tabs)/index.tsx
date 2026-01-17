import { getSpeciesList } from "@/lib/api/perenual";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useEffect, useState } from "react";

import PlantenCard from "@/components/ui/planten/PlantenCard";
import TakenCard from "@/components/ui/planten/TakenCard";

// Types

type Plant = {
  id: number;
  common_name: string;
  scientific_name: string[];
  default_image?: {
    regular_url?: string;
    medium_url?: string;
    small_url?: string;
    thumbnail?: string;
  };
};

type PlantResponse = {
  data: Plant[];
};

// Begroeting

type Begroeting = "Goedemorgen" | "Goedemiddag" | "Goedenavond";

function getBegroeting(): Begroeting {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Goedemorgen";
  if (hour >= 12 && hour < 18) return "Goedemiddag";
  return "Goedenavond";
}

// Thuis

export default function HomeScreen() {
  const begroeting = getBegroeting();
  const [plants, setPlants] = useState<PlantResponse | null>(null);
  useEffect(() => {
    const load = async () => {
      const data = await getSpeciesList();
      setPlants(data);
    };

    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{begroeting}</Text>
      <View style={styles.takenContainer}>
        {plants?.data.slice(0, 2).map((plant) => (
          <TakenCard
            key={plant.id}
            naam={plant.common_name}
            latijnseNaam={plant.scientific_name?.[0]}
            image={plant.default_image?.regular_url}
          />
        ))}
      </View>

      <View style={styles.plantenContainer}>
        <View style={styles.tekstLink}>
          <Text>Mijn planten</Text>
          <Link href="/planten">Bekijk</Link>
        </View>

        {plants?.data.slice(0, 3).map((plant) => (
          <PlantenCard
            key={plant.id}
            naam={plant.common_name}
            latijnseNaam={plant.scientific_name?.[0]}
            image={plant.default_image?.regular_url}
          />
        ))}
      </View>
    </View>
  );
}

// StyleSheet

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
});
