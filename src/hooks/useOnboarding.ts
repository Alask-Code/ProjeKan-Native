import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "projekan-onboarding-complete";

export function useOnboarding() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((completed) => {
      if (!completed) setVisible(true);
    }).catch(() => setVisible(true));
  }, []);

  const open = useCallback(() => { setStep(0); setVisible(true); }, []);
  const dismiss = useCallback(() => {
    setVisible(false);
    AsyncStorage.setItem(ONBOARDING_KEY, "true").catch(() => undefined);
  }, []);
  const restart = useCallback(() => {
    setStep(0);
    setVisible(true);
    AsyncStorage.removeItem(ONBOARDING_KEY).catch(() => undefined);
  }, []);

  return { visible, step, setStep, open, dismiss, restart };
}
