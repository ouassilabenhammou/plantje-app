import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

const PlantCard = () => (
  <Card style={styles.card}>
    <View style={styles.row}>
      {/* Afbeelding links */}
      <Card.Cover
        source={{ uri: "https://picsum.photos/700" }}
        style={styles.image}
      />

      {/* Content rechts */}
      <View style={styles.content}>
        <Card.Title title="Card Title" subtitle="Card Subtitle" />

        <Text variant="titleLarge">Card title</Text>
        <Text variant="bodyMedium">Card content</Text>

        <Card.Actions>
          <Button>Bekijk</Button>
        </Card.Actions>
      </View>
    </View>
  </Card>
);

export default PlantCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row", // links → rechts
  },
  image: {
    width: 120,
    height: 120,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
});
