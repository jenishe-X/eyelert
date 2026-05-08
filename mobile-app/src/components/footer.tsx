import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type FooterItem = {
  key: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
};

const FOOTER_ITEMS: FooterItem[] = [
  { key: "dashboard", icon: "home", label: "Home" },
  { key: "start-alert", icon: "remove-red-eye", label: "Simulate" },
  { key: "trips", icon: "history", label: "Trips" },
  { key: "profile", icon: "person", label: "Profile" },
];

export function Footer() {
  return (
    <View className="border-t border-divider bg-surface px-4 py-3 dark:border-night-border dark:bg-night-surface">
      <View className="flex-row items-center justify-between">
        {FOOTER_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.8}
            className="min-w-[72px] items-center justify-center py-1"
          >
            <MaterialIcons name={item.icon} size={24} color="#5E0006" />
            <Text className="mt-1 text-center font-sans-semibold text-[11px] text-body dark:text-night-body">
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
