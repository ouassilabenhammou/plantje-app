// import { getSpeciesList } from "@/lib/api/perenual";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";

// Types

// type Plant = {
//   id: number;
//   common_name: string;
//   scientific_name: string[];
// };

// type PlantResponse = {
//   data: Plant[];
// };

export default function HomeScreen() {
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
      <Card>
        <Card.Content>
          <Text>Het werkt!</Text>
        </Card.Content>
      </Card>

      {/* {plants?.data.map((plant) => (
        <Text key={plant.id}>{plant.common_name}</Text>
      ))} */}
    </View>
  );
}
