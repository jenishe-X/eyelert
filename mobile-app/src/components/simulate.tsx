import NetInfo from "@react-native-community/netinfo";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Linking, Platform, Pressable, Text, View } from "react-native";

type SimulateProps = {
  onOpenFaceEnrollment: () => void;
};

export function Simulate({ onOpenFaceEnrollment }: SimulateProps) {
  const [isEyelertWifiConnected, setIsEyelertWifiConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isWifiConnected = state.isConnected && state.type === "wifi";
      const ssid = state.details && "ssid" in state.details ? state.details.ssid : null;
      const normalizedSsid = typeof ssid === "string" ? ssid.toLowerCase() : "";
      const isEyelertNetwork =
        normalizedSsid.includes("esp32") || normalizedSsid.includes("eyelert");

      setIsEyelertWifiConnected(Boolean(isWifiConnected && isEyelertNetwork));
    });

    return unsubscribe;
  }, []);

  const openWifiSettings = async () => {
    try {
      if (Platform.OS === "android") {
        await Linking.sendIntent("android.settings.WIFI_SETTINGS");
        return;
      }

      await Linking.openURL("App-Prefs:root=WIFI");
    } catch {
      await Linking.openSettings();
    }
  };

  return (
    <View className="flex-1 px-4 pt-6">
      <View className="mt-[80px]">
        <Text className="mb-4 font-sans-bold text-2xl text-ink dark:text-night-heading">
          Connection process
        </Text>

        <Pressable
          onPress={openWifiSettings}
          className="mb-4 flex-row items-center justify-between rounded-[14px] px-4 py-3.5"
          style={{ backgroundColor: "#5E0006" }}
        >
          <Text className="font-sans-bold text-base text-white">
            Connect Phone to Eyelert Wi-Fi
          </Text>
          <Text className="font-sans-bold text-lg text-white">→</Text>
        </Pressable>

        <Pressable
          onPress={onOpenFaceEnrollment}
          className="mb-4 flex-row items-center justify-between rounded-[14px] border border-divider bg-surface px-4 py-3.5 dark:border-night-border dark:bg-night-surface"
        >
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="face-retouching-natural" size={22} color="#5E0006" />
            <Text className="font-sans-bold text-base text-ink dark:text-night-heading">
              Face Enrollment
            </Text>
          </View>
          <Text className="font-sans-bold text-lg text-ink dark:text-night-heading">→</Text>
        </Pressable>

        <Text className="mb-2 font-sans-bold text-base text-ink dark:text-night-heading">
          Device Connection
        </Text>
        <View className="gap-2 rounded-[14px] border border-divider bg-surface px-3 py-2.5 dark:border-night-border dark:bg-night-surface">
          <Text className="font-sans text-[13px] text-body dark:text-night-body">
            ESP32-S3: {isEyelertWifiConnected ? "Connected" : "Not connected"}
          </Text>
          <View className="h-px bg-divider dark:bg-night-border" />
          <Text className="font-sans text-[13px] text-body dark:text-night-body">
            Camera Stream: {isEyelertWifiConnected ? "15 fps" : "Waiting for link"}
          </Text>
          <View className="h-px bg-divider dark:bg-night-border" />
          <Text className="font-sans text-[13px] text-body dark:text-night-body">
            Mic Keyword Spotter: {isEyelertWifiConnected ? "Ready" : "Offline"}
          </Text>
          <View className="h-px bg-divider dark:bg-night-border" />
          <Text className="font-sans text-[13px] text-body dark:text-night-body">
            Speaker + Buzzer: {isEyelertWifiConnected ? "Armed" : "Offline"}
          </Text>
        </View>
      </View>
    </View>
  );
}
