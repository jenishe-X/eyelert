import React, { useCallback, useState } from "react";
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
  const totalSteps = 1;

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
    default:
      return <WelcomeScreen onNext={goNext} />;
  }
}
