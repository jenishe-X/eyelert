import "./global.css";

import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IntroVideo } from "./src/components/IntroVideo";
import { OnboardingFlow } from "./src/screens/onboarding/OnboardingFlow";

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Keep startup resilient if splash control is unavailable.
});

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <View className="min-h-[98px] flex-1 rounded-[14px] border border-divider bg-surface p-3 dark:border-night-border dark:bg-night-surface">
      <Text className="font-sans-semibold text-[11px] text-muted dark:text-night-muted">{label}</Text>
      <Text className="mt-1.5 font-sans-bold text-[28px] text-ink dark:text-night-heading">
        {value}
      </Text>
      <Text className="mt-1 font-sans text-[11px] text-muted dark:text-night-muted">{hint}</Text>
    </View>
  );
}

function ControlButton({
  label,
  variant = "secondary",
}: {
  label: string;
  variant?: "primary" | "danger" | "secondary";
}) {
  const base =
    "rounded-xl border py-3 px-3.5 active:opacity-90";
  const variantClass =
      variant === "primary"
      ? "border-royal bg-royal"
      : variant === "danger"
        ? "border-safety bg-safety/10 dark:bg-safety/15"
        : "border-divider bg-surface dark:border-night-border dark:bg-night-surface";
  const textClass =
    variant === "primary"
      ? "text-white"
      : variant === "danger"
        ? "text-safety"
        : "text-body dark:text-night-body";

  return (
    <TouchableOpacity activeOpacity={0.85} className={`${base} ${variantClass}`}>
      <Text className={`text-center font-sans-semibold text-sm ${textClass}`}>{label}</Text>
    </TouchableOpacity>
  );
}

function ThemeSegment({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`flex-1 rounded-lg border py-2 ${
        active
          ? "border-royal bg-royal/12 dark:bg-royal/25"
          : "border-divider bg-surface dark:border-night-border dark:bg-night-surface"
      }`}
    >
      <Text
        className={`text-center font-sans-semibold text-xs ${
          active
            ? "text-royal dark:text-royal-foreground"
            : "text-body dark:text-night-body"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useColorScheme();
  const [showIntro, setShowIntro] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  const statusBarStyle = "light-content";

  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => {
      // Ignore hide errors and continue rendering intro UI.
    });
  }, []);

  // Hard-gate the UI so only the intro video is visible first.
  if (showIntro) {
    return (
      <View className="flex-1 bg-black">
        <StatusBar hidden />
        <IntroVideo onDone={() => setShowIntro(false)} />
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View className="flex-1 bg-canvas dark:bg-night-bg">
        <StatusBar barStyle={statusBarStyle} />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <View className="flex-1 bg-canvas dark:bg-night-bg">
      <StatusBar barStyle={statusBarStyle} />
      <View
        className="bg-royal px-4 pb-4"
        style={{ paddingTop: Math.max(insets.top, Platform.OS === "ios" ? 8 : 12) }}
      >
        <Text className="font-display text-[30px] text-white" style={{ letterSpacing: 0.4 }}>
          EYELERT
        </Text>
        <Text
          className="mt-0.5 font-sans text-sm text-white/85"
          style={Platform.OS === "ios" ? { fontFamily: "System" } : undefined}
        >
          Offline Drowsiness Monitor
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3.5 px-4 pt-3.5"
        contentContainerStyle={{ paddingBottom: 28 + insets.bottom }}
      >
        <View className="flex-row items-center justify-between rounded-[14px] border border-divider bg-surface px-3.5 py-3.5 dark:border-night-border dark:bg-night-surface">
          <Text className="font-sans-semibold text-sm text-ink dark:text-night-heading">
            Driver State
          </Text>
          <View className="rounded-full bg-safety/12 px-3 py-1.5 dark:bg-safety/20">
            <Text className="font-sans-bold text-xs text-safety" style={{ letterSpacing: 0.3 }}>
              ALERT
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2.5">
          <MetricCard label="EAR" value="0.24" hint="Eye openness normal" />
          <MetricCard label="MAR" value="0.33" hint="No yawn detected" />
          <MetricCard label="PERCLOS" value="0.12" hint="Low fatigue window" />
        </View>

        <View className="mt-1">
          <Text className="mb-2 font-sans-bold text-base text-ink dark:text-night-heading">
            Device Connection
          </Text>
          <View className="gap-2 rounded-[14px] border border-divider bg-surface px-3 py-2.5 dark:border-night-border dark:bg-night-surface">
            <Text className="font-sans text-[13px] text-body dark:text-night-body">
              ESP32-S3: Connected
            </Text>
            <View className="h-px bg-divider dark:bg-night-border" />
            <Text className="font-sans text-[13px] text-body dark:text-night-body">
              Camera Stream: 15 fps
            </Text>
            <View className="h-px bg-divider dark:bg-night-border" />
            <Text className="font-sans text-[13px] text-body dark:text-night-body">
              Mic Keyword Spotter: Ready
            </Text>
            <View className="h-px bg-divider dark:bg-night-border" />
            <Text className="font-sans text-[13px] text-body dark:text-night-body">
              Speaker + Buzzer: Armed
            </Text>
          </View>
        </View>

        <View className="mt-1">
          <Text className="mb-2 font-sans-bold text-base text-ink dark:text-night-heading">
            Navigation Preview
          </Text>
          <View className="gap-2 rounded-[14px] border border-divider bg-surface px-3 py-2.5 dark:border-night-border dark:bg-night-surface">
            <Text className="font-sans text-[13px] text-body dark:text-night-body">
              Nearest rest area: Gordon Avenue Rest Spot
            </Text>
            <View className="h-px bg-divider dark:bg-night-border" />
            <Text className="font-sans text-[13px] text-body dark:text-night-body">
              Distance: 1.4 km
            </Text>
            <View className="h-px bg-divider dark:bg-night-border" />
            <Text className="font-sans text-[13px] text-body dark:text-night-body">
              Next instruction: Continue for 300 meters
            </Text>
          </View>
        </View>

        <View className="mt-1">
          <Text className="mb-2 font-sans-bold text-base text-ink dark:text-night-heading">
            Appearance
          </Text>
          <View className="mb-4 flex-row gap-2">
            <ThemeSegment
              label="System"
              active={colorScheme === undefined}
              onPress={() => setColorScheme("system")}
            />
            <ThemeSegment
              label="Light"
              active={colorScheme === "light"}
              onPress={() => setColorScheme("light")}
            />
            <ThemeSegment
              label="Dark"
              active={colorScheme === "dark"}
              onPress={() => setColorScheme("dark")}
            />
          </View>
        </View>

        <View className="mt-1">
          <Text className="mb-2 font-sans-bold text-base text-ink dark:text-night-heading">
            Controls
          </Text>
          <View className="gap-2.5">
            <ControlButton label="Start Monitoring" variant="primary" />
            <ControlButton label="Simulate Drowsy Alert" variant="danger" />
            <ControlButton label="Trigger Voice Prompt" />
            <ControlButton label="Start 15-Min Rest Timer" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
