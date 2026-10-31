import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "projekan-onboarding-complete";
const DATA_KEYS = [
  ONBOARDING_KEY,
  "projekan-projects-native",
  "projekan-todos",
  "projekan-profile-photo",
  "projekan-profile-name",
] as const;

function parseStoredValue(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function hasSavedUserData(values: (string | null)[]) {
  const [, projectsRaw, todosRaw, photoRaw, nameRaw] = values;
  const projectsState = parseStoredValue(projectsRaw);
  const projects = projectsState?.state?.projects ?? projectsState?.projects;
  if (Array.isArray(projects) && projects.some((project) => !project.isTemplate)) return true;

  const todosState = parseStoredValue(todosRaw);
  const todos = todosState?.state?.todos ?? todosState?.todos;
  const lists = todosState?.state?.lists ?? todosState?.lists;
  if (Array.isArray(todos) && todos.length > 0) return true;
  if (Array.isArray(lists) && lists.some((list) => list.id !== "default" || list.name !== "Minha lista")) return true;

  return Boolean(photoRaw || nameRaw?.trim());
}

export function useOnboarding() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    AsyncStorage.multiGet([...DATA_KEYS]).then((values) => {
      const stored = values.map(([, value]) => value);
      const completed = stored[0] === "true";
      if (completed || hasSavedUserData(stored)) {
        setVisible(false);
        if (!completed) AsyncStorage.setItem(ONBOARDING_KEY, "true").catch(() => undefined);
      } else {
        setVisible(true);
      }
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
