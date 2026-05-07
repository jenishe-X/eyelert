import React, { useCallback, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { Screen2 } from "./Screen2";
import { Screen3 } from "./Screen3";
import { WelcomeScreen } from "./WelcomeScreen";

type OnboardingFlowProps = {
  onComplete: () => void;
};

/**
 * Multi-step onboarding container. Owns the step index and renders the
 * current screen. Add new screens here as the flow grows (screen 2 / 3).
 */
export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalSteps = 3;
  const transitionOpacity = useRef(new Animated.Value(1)).current;
  const transitionTranslateX = useRef(new Animated.Value(0)).current;

  const goNext = useCallback(() => {
    if (isTransitioning) return;

    const next = step + 1;
    if (next >= totalSteps) {
      onComplete();
      return;
    }

    setIsTransitioning(true);
    Animated.parallel([
      Animated.timing(transitionOpacity, {
        toValue: 0,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(transitionTranslateX, {
        toValue: -18,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(next);
      transitionTranslateX.setValue(18);
      transitionOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(transitionOpacity, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(transitionTranslateX, {
          toValue: 0,
          duration: 240,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
  }, [
    isTransitioning,
    onComplete,
    transitionOpacity,
    transitionTranslateX,
    totalSteps,
  ]);

  let content: React.ReactNode;
  switch (step) {
    case 0:
      content = <WelcomeScreen onNext={goNext} />;
      break;
    case 1:
      content = <Screen2 onNext={goNext} />;
      break;
    case 2:
      content = <Screen3 onNext={goNext} />;
      break;
    default:
      content = <Screen3 onNext={goNext} />;
      break;
  }

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: transitionOpacity,
        transform: [{ translateX: transitionTranslateX }],
      }}
    >
      {content}
    </Animated.View>
  );
}
