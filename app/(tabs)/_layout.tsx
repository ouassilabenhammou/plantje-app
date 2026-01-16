import { Tabs } from "expo-router";
import * as React from "react";

import InstellingenIcon from "../../assets/icons/instellingen-icon.svg";
import PlantenIcon from "../../assets/icons/plant-icon.svg";
import ThuisIcon from "../../assets/icons/thuis-icon.svg";
import ZoekIcon from "../../assets/icons/zoeken-icon.svg";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Thuis",
          tabBarIcon: ({}) => <ThuisIcon width={22} height={22} />,
        }}
      />

      <Tabs.Screen
        name="planten"
        options={{
          title: "Planten",
          tabBarIcon: ({}) => <PlantenIcon width={22} height={22} />,
        }}
      />
      <Tabs.Screen
        name="zoeken"
        options={{
          title: "Zoeken",
          tabBarIcon: ({}) => <ZoekIcon width={22} height={22} />,
        }}
      />
      <Tabs.Screen
        name="instellingen"
        options={{
          title: "Instellingen",
          tabBarIcon: ({}) => <InstellingenIcon width={22} height={22} />,
        }}
      />
    </Tabs>
  );
}
