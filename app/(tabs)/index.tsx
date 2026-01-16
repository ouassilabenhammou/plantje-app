// import { getSpeciesList } from "@/lib/api/perenual";
import { View } from "react-native";
import { Text } from "react-native-paper";

// Types

// type Plant = {
//   id: number;
//   common_name: string;
//   scientific_name: string[];
// };

// type PlantResponse = {
//   data: Plant[];
// };

type Begroeting = "Goedemorgen" | "Goedemiddag" | "Goedenavond";

function getBegroeting(): Begroeting {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Goedemorgen";
  if (hour >= 12 && hour < 18) return "Goedemiddag";
  return "Goedenavond";
}
export default function HomeScreen() {
  const Begroeting = getBegroeting();
  // const [plants, setPlants] = useState<PlantResponse | null>(null);
  // useEffect(() => {
  //   const load = async () => {
  //     // const data = await getSpeciesList();
  //     setPlants(data);
  //   };

  //   load();
  // }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* {plants?.data.map((plant) => (
        <Text key={plant.id}>{plant.common_name}</Text>
      ))} */}

      <Text>{Begroeting}</Text>
    </View>
  );
}
