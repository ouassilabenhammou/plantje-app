import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function PlantDetail() {
  const { slug } = useLocalSearchParams();

  return (
    <View>
      <Text>{slug}</Text>
    </View>
  );
}
