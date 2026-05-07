import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, Text } from "react-native";

type ChevronButtonProps = {
  onPress: () => void;
  accessibilityLabel?: string;
  size?: number;
  textColor?: string;
  backgroundColor?: string;
  circular?: boolean;
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
  textColor = "#FFFFFF",
  backgroundColor = "transparent",
  circular = false,
}: ChevronButtonProps) {
  const diameter = size;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: pulse }],
        opacity: pulse.interpolate({
          inputRange: [1, 1.08],
          outputRange: [1, 0.82],
        }),
      }}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={16}
        style={({ pressed }) => ({
          width: circular ? diameter : undefined,
          height: circular ? diameter : undefined,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: circular ? 0 : 8,
          paddingVertical: circular ? 0 : 4,
          borderRadius: circular ? diameter / 2 : 0,
          backgroundColor,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Text
          allowFontScaling={false}
          style={{
            color: textColor,
            fontSize: circular ? size * 0.62 : size,
            lineHeight: circular ? size * 0.62 : size,
            fontWeight: "900",
            includeFontPadding: false,
          }}
        >
          {"\u00BB"}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
