import ChevronIcon from "@/assets/icons/chevron-icon.svg";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type PlantenCardProps = {
  image?: string;
  naam?: string;
  latijnseNaam?: string;
  label?: string;
};

const PlantenCard = ({ image, naam, latijnseNaam }: PlantenCardProps) => {
  return (
    <View style={styles.plantcard}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.tekstBlok}>
        <Text style={styles.naam}>{naam ?? "Onbekende plant"}</Text>
        <Text style={styles.latijn}>{latijnseNaam ?? "-"}</Text>
      </View>
      <ChevronIcon style={styles.icon} />
    </View>
  );
};

export default PlantenCard;

const styles = StyleSheet.create({
  plantcard: {
    width: "100%",
    backgroundColor: "grey",
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 10,
    flexDirection: "row",
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 7,
  },

  tekstBlok: {
    flex: 1,
    marginLeft: 12,
  },

  icon: {
    alignSelf: "center",
  },

  naam: {
    fontSize: 16,
  },

  latijn: {
    fontSize: 14,
  },
});
