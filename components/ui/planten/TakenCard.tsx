import CheckIcon from "@/assets/icons/check-icon.svg";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type TakenCardProps = {
  image?: string;
  naam?: string;
  latijnseNaam?: string;
};

const TakenCard = ({ image, naam, latijnseNaam }: TakenCardProps) => {
  const [checked, setChecked] = React.useState(false);

  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.tekstBlok}>
        <Text style={styles.naam}>{naam ?? "Onbekende plant"}</Text>
        <Text style={styles.latijn}>{latijnseNaam ?? "-"}</Text>
      </View>
      <View style={styles.checkBox}>
        <Pressable
          onPress={() => {
            setChecked((v) => !v);
          }}
          style={({}) => [styles.cirkel, checked && styles.cirkelChecked]}
        >
          {checked && <CheckIcon width={16} height={16} color="grey" />}
        </Pressable>
      </View>
    </View>
  );
};

export default TakenCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 70,
    backgroundColor: "white",
    borderRadius: 12,
    paddingLeft: 7,
    paddingRight: 20,
    paddingVertical: 5,
    flexDirection: "row",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
    alignItems: "center",
  },

  naam: {
    fontSize: 14,
  },

  latijn: {
    fontSize: 12,
  },

  tekstBlok: {
    flex: 1,
    marginLeft: 12,
  },

  cirkel: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#9E9E9E",
    alignItems: "center",
    justifyContent: "center",
  },

  cirkelChecked: {
    borderColor: "black",
  },

  checkBox: {
    alignItems: "flex-end",
    alignSelf: "center",
  },
});
