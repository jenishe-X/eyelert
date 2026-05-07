import React from "react";
import { StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronButton } from "./ChevronButton";

type WelcomeScreenProps = {
  onNext: () => void;
};

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-royal">
      <StatusBar barStyle="light-content" backgroundColor="#5E0006" />

      <View
        className="flex-1 px-7"
        style={{
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 24),
          justifyContent: "flex-end",
        }}
      >
        <View
          className="flex-row items-center"
          style={{ paddingBottom: 155, paddingLeft: 10 }}
        >
          <Text
            className="font-sans-bold text-white"
            style={{
              fontSize: 44,
              lineHeight: 50,
              letterSpacing: -0.5,
              marginBottom: 20,
            }}
          >
            {"Your safety\nmatters."}
          </Text>

          <View style={{ marginLeft: 40 }}>
            <ChevronButton
              onPress={onNext}
              accessibilityLabel="Continue to next onboarding step"
              size={62}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
