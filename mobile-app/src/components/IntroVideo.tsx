import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, Pressable, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ResizeMode, Video, type AVPlaybackStatus } from "expo-av";

type IntroVideoProps = {
  onDone: () => void;
};

const INTRO_TIMEOUT_MS = 12_000;

export function IntroVideo({ onDone }: IntroVideoProps) {
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video | null>(null);
  const [didFinish, setDidFinish] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const source = useMemo(() => {
    // NOTE: Ensure `mobile-app/assets/open.mp4` exists.
    // We intentionally keep this as a static require so Metro bundles it.
    return require("../../assets/open.mp4");
  }, []);

  const doneOnce = useCallback(() => {
    setDidFinish(true);
    onDone();
  }, [onDone]);

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      if (!isReady) setIsReady(true);
      if (status.didJustFinish) doneOnce();
    },
    [doneOnce, isReady],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      doneOnce();
    }, INTRO_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [doneOnce]);

  useEffect(() => {
    return () => {
      videoRef.current?.stopAsync?.().catch(() => undefined);
      videoRef.current?.unloadAsync?.().catch(() => undefined);
    };
  }, []);

  return (
    <View className="absolute inset-0 bg-black">
      <StatusBar hidden />

      <Video
        ref={(ref) => {
          videoRef.current = ref;
        }}
        source={source}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        useNativeControls={false}
      />

      <View
        pointerEvents="box-none"
        style={{
          paddingTop: Math.max(insets.top, Platform.OS === "ios" ? 10 : 12),
          paddingRight: 16,
          alignItems: "flex-end",
        }}
      >
        <Pressable
          onPress={doneOnce}
          disabled={didFinish}
          style={({ pressed }) => ({
            opacity: didFinish ? 0.4 : pressed ? 0.7 : 1,
          })}
          className="rounded-full bg-black/45 px-4 py-2"
          accessibilityRole="button"
          accessibilityLabel="Skip intro"
        >
          <Text className="font-sans-semibold text-sm text-white">{isReady ? "Skip" : "Loading…"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

