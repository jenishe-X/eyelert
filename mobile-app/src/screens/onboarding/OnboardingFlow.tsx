import React, { useCallback, useState } from "react";
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
  const totalSteps = 3;

  const goNext = useCallback(() => {
    setStep((prev) => {
      const next = prev + 1;
      if (next >= totalSteps) {
        onComplete();
        return prev;
      }
      return next;
    });
  }, [onComplete]);

  switch (step) {
    case 0:
      return <WelcomeScreen onNext={goNext} />;
    case 1:
      return <Screen2 onNext={goNext} />;
    case 2:
      return <Screen3 onNext={goNext} />;
    default:
      return <Screen3 onNext={goNext} />;
  }
}
