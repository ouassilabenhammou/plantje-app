import React from "react";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

type DeleteButtonProps = {
  label?: string;
  onConfirm: () => void;
};

export default function DeleteButton({
  label = "Delete",
  onConfirm,
}: DeleteButtonProps) {
  function handlePress() {
    Alert.alert("Verwijderen", "Weet je zeker dat je dit wilt verwijderen?", [
      { text: "Annuleren", style: "cancel" },
      {
        text: "Verwijderen",
        style: "destructive",
        onPress: onConfirm,
      },
    ]);
  }

  return (
    <Pressable onPress={handlePress} style={styles.button}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#fca5a5",
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "600",
  },
});
