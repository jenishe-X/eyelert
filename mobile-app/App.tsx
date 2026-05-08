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
import React, { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { IntroVideo } from "./src/components/IntroVideo";
import { Cotent } from "./src/components/cotent";
import { Footer } from "./src/components/footer";
import { Profile } from "./src/components/profile";
import { Simulate } from "./src/components/simulate";
import { Trips } from "./src/components/trips";
import { OnboardingFlow } from "./src/screens/onboarding/OnboardingFlow";

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Keep startup resilient if splash control is unavailable.
});

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [driverNickname, setDriverNickname] = useState("Driver");
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
      {activeTab === "start-alert" && <Simulate />}
      {activeTab === "trips" && <Trips />}
      {activeTab === "profile" && <Profile onNicknameChange={setDriverNickname} />}
      {activeTab === "dashboard" && (
        <Cotent statusBarStyle={statusBarStyle} driverNickname={driverNickname} />
      )}
      <Footer onItemPress={setActiveTab} />
    </View>
  );
}
