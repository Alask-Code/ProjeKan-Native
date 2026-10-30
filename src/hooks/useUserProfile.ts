import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PHOTO_KEY = "projekan-profile-photo";
const NAME_KEY = "projekan-profile-name";

export function useUserProfile() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.multiGet([PHOTO_KEY, NAME_KEY]).then((items) => {
      const values = Object.fromEntries(items);
      setPhoto(values[PHOTO_KEY] || null);
      setName(values[NAME_KEY] || "");
    }).catch(() => undefined);
  }, []);

  const saveName = useCallback((nextName: string) => {
    setName(nextName);
    AsyncStorage.setItem(NAME_KEY, nextName).catch(() => undefined);
  }, []);

  const saveProfile = useCallback((nextPhoto: string, nextName: string) => {
    const normalizedName = nextName.trim() || "Meu perfil";
    setPhoto(nextPhoto || null);
    setName(normalizedName);
    AsyncStorage.multiSet([[PHOTO_KEY, nextPhoto], [NAME_KEY, normalizedName]]).catch(() => undefined);
  }, []);

  const clearProfile = useCallback(() => {
    setPhoto(null);
    setName("");
    AsyncStorage.multiRemove([PHOTO_KEY, NAME_KEY]).catch(() => undefined);
  }, []);

  return { name, photo, saveName, saveProfile, clearProfile };
}
