import React from "react";
import { Pressable, Text } from "react-native";

type ChevronButtonProps = {
  onPress: () => void;
  accessibilityLabel?: string;
  size?: number;
};

/**
 * Simple white double-chevron advance affordance for the onboarding screens.
 * Rendered as a bold Unicode `»` so it's guaranteed to display across
 * iOS, Android, and Expo Go without layout/clipping concerns.
 */
export function ChevronButton({
  onPress,
  accessibilityLabel = "Continue",
  size = 56,
}: ChevronButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={16}
      style={({ pressed }) => ({
        paddingHorizontal: 8,
        paddingVertical: 4,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text
        allowFontScaling={false}
        style={{
          color: "#FFFFFF",
          fontSize: size,
          lineHeight: size,
          fontWeight: "900",
          includeFontPadding: false,
        }}
      >
        {"\u00BB"}
      </Text>
    </Pressable>
  );
}
