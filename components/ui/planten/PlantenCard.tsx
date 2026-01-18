import ChevronIcon from "@/assets/icons/chevron-icon.svg";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { typography } from "@/theme/typografie";

type PlantenCardProps = {
  image?: string;
  name?: string;
  species?: string;
  label?: string;
};

const PlantenCard = ({ image, name, species }: PlantenCardProps) => {
  return (
    <View style={styles.plantcard}>
      <Image
        source={
          image
            ? { uri: image }
            : { uri: "https://via.placeholder.com/70x70.png?text=Plant" }
        }
        style={styles.image}
      />

      <View style={styles.tekstBlok}>
        <Text style={styles.naam}>{name ?? "Onbekende plant"}</Text>
        <Text style={styles.latijn}>{species ?? "-"}</Text>
      </View>
      <ChevronIcon
        style={styles.icon}
        width={20}
        height={20}
        color={colors.primaryGroen}
      />
    </View>
  );
};

export default PlantenCard;

const styles = StyleSheet.create({
  plantcard: {
    width: "100%",
    backgroundColor: colors.cardBg,
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
    color: colors.textPrimary,
    ...typography.cardTitel,
  },

  latijn: {
    ...typography.subText,
    color: colors.textSecondary,
  },
});
