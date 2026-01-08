import { View } from "react-native";
import { Card, Text } from "react-native-paper";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Card>
        <Card.Content>
          <Text>Het werkt!</Text>
        </Card.Content>
      </Card>
    </View>
  );
}
