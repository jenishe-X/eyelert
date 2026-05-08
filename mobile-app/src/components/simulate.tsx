import React from "react";
import { Text, View } from "react-native";

export function Simulate() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-center font-sans-bold text-2xl text-heading dark:text-night-heading">
        Simulate
      </Text>
      <Text className="mt-2 text-center font-sans text-base text-body dark:text-night-body">
        This is the simulation screen.
      </Text>
    </View>
  );
}
