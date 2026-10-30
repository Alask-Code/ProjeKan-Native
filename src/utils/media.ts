import * as ImagePicker from "expo-image-picker";

export async function chooseImage(aspect: [number, number]): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect, quality: 0.9 });
  return result.canceled ? null : result.assets[0]?.uri ?? null;
}
