import React from "react";
import {
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Screen3Props = {
  onNext: () => void;
};

export function Screen3({ onNext }: Screen3Props) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={require("../../../assets/screen3.png")}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        />

        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: insets.top + 18,
            left: 22,
            right: 70,
          }}
        >
        </View>

        <View
          style={{
            backgroundColor: "#F1F1F3",
            borderTopLeftRadius: 44,
            borderTopRightRadius: 44,
            minHeight: 350,
            paddingTop: 32,
            paddingHorizontal: 28,
            paddingBottom: Math.max(insets.bottom, 20) + 14,
            alignItems: "center",
            borderTopWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.65)",
          }}
        >
          <Text
            className="font-sans-bold text-center text-black"
            style={{
              fontSize: 48,
              lineHeight: 54,
              letterSpacing: -0.6,
              marginBottom: 15,
              marginTop: 15,
            }}
          >
            {"EYELERT"}
          </Text>

          <Text
            className="font-sans text-center text-black"
            style={{
              fontSize: 20,
              lineHeight: 20,
              letterSpacing: -0.6,
              marginBottom: 15,
            }}
          >
            {"Stay alert on the road \nwith smart fatigue detection."}
          </Text>

          <Text
            className="font-sans text-center text-[#9C2230]"
            style={{
              fontSize: 13,
              lineHeight: 18,
              letterSpacing: 1.2,
              marginTop: 8,
              marginBottom: 30,
            }}
          >
            DRIVE SMARTER . RESPOND FASTER
          </Text>

          <View
            style={{
              width: "100%",
              borderRadius: 999,
              shadowColor: "#5E0006",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.28,
              shadowRadius: 16,
              elevation: 8,
              marginTop: 0,
            }}
          >
            <Pressable
              onPress={onNext}
              accessibilityRole="button"
              accessibilityLabel="Continue to finish onboarding"
              style={{
                width: "88%",
                backgroundColor: "#5E0006",
                borderRadius: 999,
                paddingVertical: 10,
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Text
                className="font-sans text-white"
                style={{ fontSize: 24, lineHeight: 30, letterSpacing: 0.1 }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
