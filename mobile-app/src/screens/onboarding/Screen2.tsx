import React from "react";
import { Image, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronButton } from "./ChevronButton";

type Screen2Props = {
  onNext: () => void;
};

export function Screen2({ onNext }: Screen2Props) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-royal">
      <StatusBar barStyle="light-content" backgroundColor="#5E0006" />

      <View
        className="flex-1 px-9"
        style={{
          paddingTop: insets.top + 20,
          paddingBottom: Math.max(insets.bottom, 20),
          justifyContent: "space-between",
        }}
      >
        <View>
          <View
            className="flex-row items-center justify-between"
            style={{ marginBottom: 20 }}
          >
            <Text
              className="font-sans-bold text-white"
              style={{ fontSize: 50, lineHeight: 58, letterSpacing: -0.6, 
                marginTop: 20,
              }}
            >
              {"Tired? We\u2019ll\nLet You Know."}
            </Text>
          </View>

          <Text
            className="font-sans text-white"
            style={{ fontSize: 22, lineHeight: 40, maxWidth: 680, fontStyle: 'italic' }}
          >
            {
              "Our device detects the\nearliest signs of fatigue\u2014\neven before you feel them."
            }
          </Text>
        </View>

        <Image
          source={require("../../../assets/screen2.png")}
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          blurRadius={3}
          style={{ width: "165%", height: 620, alignSelf: "center", marginLeft: -200 }}
        />
      </View>

      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          right: 18,
          bottom: Math.max(insets.bottom, 20),
          zIndex: 999,
          elevation: 999,
          marginBottom: 570,
          marginRight: 20,
        }}
      >
        <ChevronButton
          onPress={onNext}
          accessibilityLabel="Continue to next onboarding step"
          size={64}
          textColor="#FFFFFF"
        />
      </View>
    </View>
  );
}
