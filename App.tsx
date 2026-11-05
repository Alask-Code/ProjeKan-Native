import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts as useCustomFonts } from 'expo-font';
import { Archivo_400Regular } from '@expo-google-fonts/archivo';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { Rajdhani_500Medium } from '@expo-google-fonts/rajdhani';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppContent from './src/AppContent';

export default function App() {
  const [fontsLoaded, fontError] = useCustomFonts({
    Archivo: Archivo_400Regular,
    Inter: Inter_400Regular,
    Rajdhani: Rajdhani_500Medium,
    PressStart2P: PressStart2P_400Regular
  });
  if (!fontsLoaded && !fontError) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
