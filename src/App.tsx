import "./global.css";
import React, { useEffect, useState } from "react";
import { Alert, BackHandler, Image, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts as useCustomFonts } from "expo-font";
import { Archivo_400Regular } from "@expo-google-fonts/archivo";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Rajdhani_500Medium } from "@expo-google-fonts/rajdhani";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import brandMark from "./assets/projekan-mark.png";
import useNativeProjects from "./stores/nativeProjectStore";
import useTodoStore from "./stores/todoStore";
import { createBackupCsv, parseBackupCsv } from "./utils/csvBackup";
import useThemeStore from "./stores/themeStore";
import { navigation, type Route } from "./constants/app";
import { BoardScreen } from "./pages/BoardPage";
import { OverviewScreen } from "./pages/OverviewPage";
import { BacklogScreen } from "./pages/BacklogPage";
import { TodoScreen } from "./pages/TodoPage";
import { ThemeEditorScreen } from "./pages/ThemeEditorPage";
import { ProjectDetailsModal } from "./components/project/ProjectDetailsModal";
import { ProjectFormModal } from "./components/project/ProjectFormModal";
import { OnboardingModal, ProfilePhotoModal } from "./components/profile/ProfileModals";
import { SettingsModal } from "./components/profile/SettingsModal";
import { Action, AppIcon } from "./components/ui";
import { isDark, fontFamily } from "./utils/theme";
import { useUserProfile } from "./hooks/useUserProfile";
import { useOnboarding } from "./hooks/useOnboarding";
function AppContent() {
  const [route, setRoute] = useState<Route>("/");
  const [routeHydrated, setRouteHydrated] = useState(false);
  const [themeDraftDirty, setThemeDraftDirty] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingProfilePhoto, setEditingProfilePhoto] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const profile = useUserProfile();
  const { photo: profilePhoto, name: profileName, saveName: saveProfileName, saveProfile, clearProfile } = profile;
  const onboarding = useOnboarding();
  const { visible: showOnboarding, step: onboardingStep, setStep: setOnboardingStep, open: openOnboarding, dismiss: finishOnboarding, restart: restartOnboarding } = onboarding;
  const projects = useNativeProjects((state) => state.projects);
  const saveProject = useNativeProjects((state) => state.addProject);
  const updateProject = useNativeProjects((state) => state.updateProject);
  const deleteProject = useNativeProjects((state) => state.deleteProject);
  const clearAllProjects = useNativeProjects((state) => state.clearAllProjects);
  const removeTemplateProjects = useNativeProjects((state) => state.removeTemplateProjects);
  const clearAllTodos = useTodoStore((state) => state.clearAllTodos);
  const lists = useTodoStore((state) => state.lists);
  const todos = useTodoStore((state) => state.todos);
  const importTodos = useTodoStore((state) => state.importTodos);
  const importProjects = useNativeProjects((state) => state.importProjects);
  const resetTheme = useThemeStore((state) => state.resetSettings);
  const moveProjectToPosition = useNativeProjects((state) => state.moveProjectToPosition);
  const theme = useThemeStore((state) => state.settings);
  const completeOnboarding = () => { removeTemplateProjects(); finishOnboarding(); };
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem("projekan-last-route").then((savedRoute) => {
      if (!active) return;
      const validRoute = navigation.some((item) => item.path === savedRoute) || savedRoute === "/theme-editor";
      if (validRoute) setRoute(savedRoute as Route);
    }).catch(() => undefined).finally(() => { if (active) setRouteHydrated(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (routeHydrated) void AsyncStorage.setItem("projekan-last-route", route).catch(() => undefined);
  }, [route, routeHydrated]);
  const deleteAllSavedData = () => {
    clearAllProjects(); clearAllTodos(); resetTheme(); clearProfile();
    setRoute("/"); setEditingId(null); setCreating(false); setEditingProfilePhoto(false);
    restartOnboarding();
  };
  const selectedProject = projects.find((project) => project.id === editingId) ?? null;
  const currentTitle = route === "/theme-editor" ? "Tema" : navigation.find((item) => item.path === route)?.label ?? "Quadro";
  const requestRoute = (nextRoute: Route) => {
    if (route === "/theme-editor" && themeDraftDirty && nextRoute !== route) {
      Alert.alert("Descartar alterações?", "Você tem alterações no tema que ainda não foram salvas.", [
        { text: "Continuar editando", style: "cancel" },
        { text: "Sair sem salvar", style: "destructive", onPress: () => { setThemeDraftDirty(false); setRoute(nextRoute); } },
      ]);
      return;
    }
    setRoute(nextRoute);
  };
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (route === "/theme-editor" && themeDraftDirty) {
        Alert.alert("Descartar alterações?", "Você tem alterações no tema que ainda não foram salvas.", [
          { text: "Continuar editando", style: "cancel" },
          { text: "Sair sem salvar", style: "destructive", onPress: () => { setThemeDraftDirty(false); setRoute("/"); } },
        ]);
      } else if (route !== "/") {
        setRoute("/");
      } else {
        Alert.alert("Sair do ProjeKan?", "Deseja fechar o aplicativo?", [
          { text: "Cancelar", style: "cancel" },
          { text: "Sair", style: "destructive", onPress: () => BackHandler.exitApp() },
        ]);
      }
      return true;
    });
    return () => subscription.remove();
  }, [route, themeDraftDirty]);
  const colorsStyle = { backgroundColor: theme.background };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1" style={colorsStyle} edges={["top", "left", "right"]}>
        <StatusBar style={isDark(theme.background) ? "light" : "dark"} />
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View className="flex-1">
          <View className="flex-row items-center justify-between border-b px-4 py-3" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderBottomWidth: theme.borderWidth }}>
            <View className="flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center"><Image source={brandMark} resizeMode="contain" className="h-9 w-9" /></View>
              <View><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-base font-black">ProjeKan Manager</Text><Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="text-[10px]">{currentTitle}</Text></View>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Abrir perfil do usuário" onPress={() => setEditingProfilePhoto(true)} className="h-9 w-9 items-center justify-center overflow-hidden rounded-full" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth }}>{profilePhoto ? <Image source={{ uri: profilePhoto }} resizeMode="cover" className="h-full w-full" /> : <Text style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }} className="font-bold">{profileName.trim().slice(0, 1).toUpperCase() || "M"}</Text>}</Pressable>
          </View>

          <View className="flex-1">
            {route === "/" ? <BoardScreen projects={projects} theme={theme} onCreate={() => setCreating(true)} onOpen={(id) => setEditingId(id)} onMoveToPosition={moveProjectToPosition} /> : null}
            {route === "/overview" ? <OverviewScreen projects={projects} theme={theme} onOpenBoard={() => setRoute("/")} onOpen={(id) => setEditingId(id)} /> : null}
            {route === "/backlog" ? <BacklogScreen projects={projects} theme={theme} onCreate={() => setCreating(true)} onOpen={(id) => setEditingId(id)} /> : null}
            {route === "/todo" ? <TodoScreen theme={theme} /> : null}
            {route === "/theme-editor" ? <ThemeEditorScreen theme={theme} onDirtyChange={setThemeDraftDirty} /> : null}
          </View>

          <View className="flex-row gap-1 border-t px-2 pb-2 pt-2" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderTopWidth: theme.borderWidth }}>
            {navigation.map((item) => {
              const active = route === item.path;
              return <Pressable key={item.path} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: active }} onPress={() => requestRoute(item.path)} className="min-h-[54px] flex-1 items-center justify-center px-0.5" style={{ backgroundColor: active ? theme.raised : "transparent", borderColor: active ? theme.border : "transparent", borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><View className="h-7 items-center justify-center"><AppIcon name={item.icon} size={22} color={active ? theme.primary : theme.muted} strokeWidth={2.1} /></View><Text numberOfLines={1} style={{ color: active ? theme.primary : theme.muted, fontFamily: fontFamily(theme.font) }} className="mt-0.5 text-[9px] font-bold">{item.label}</Text>{active ? <View className="absolute bottom-0.5 h-0.5 w-5" style={{ backgroundColor: theme.primary, borderRadius: theme.borderRadius }} /> : null}</Pressable>;
            })}
          </View>
        </View>
        </KeyboardAvoidingView>

        <ProjectFormModal visible={creating} project={null} theme={theme} onClose={() => setCreating(false)} onSave={(draft) => { saveProject(draft); setCreating(false); }} />
        <ProjectDetailsModal project={selectedProject} projects={projects} theme={theme} onClose={() => setEditingId(null)} onEdit={() => { if (!selectedProject) return; const project = selectedProject; setEditingId(null); setTimeout(() => setEditingId(-project.id), 0); }} onDelete={(id) => { deleteProject(id); setEditingId(null); }} onUpdate={updateProject} />
        <ProjectFormModal visible={editingId !== null && editingId < 0} project={editingId ? projects.find((project) => project.id === Math.abs(editingId)) ?? null : null} theme={theme} onClose={() => setEditingId(null)} onSave={(draft) => { if (editingId) updateProject(Math.abs(editingId), draft); setEditingId(null); }} />
        <ProfilePhotoModal visible={editingProfilePhoto} value={profilePhoto ?? ""} name={profileName} theme={theme} onClose={() => setEditingProfilePhoto(false)} onShowTutorial={() => { setEditingProfilePhoto(false); openOnboarding(); }} onOpenTheme={() => { setEditingProfilePhoto(false); setRoute("/theme-editor"); }} onOpenSettings={() => { setEditingProfilePhoto(false); setShowSettings(true); }} onDeleteAll={() => Alert.alert("Apagar todo o conteúdo salvo?", "Isso remove projetos, listas e tarefas, restaura o tema padrão e apaga os dados do perfil. Essa ação não pode ser desfeita.", [{ text: "Cancelar", style: "cancel" }, { text: "Apagar tudo", style: "destructive", onPress: deleteAllSavedData }])} onExportCsv={() => createBackupCsv({ projects, lists, todos })} onImportCsv={(csv) => {
          try {
            const backup = parseBackupCsv(csv);
            Alert.alert("Substituir dados atuais?", `O CSV contém ${backup.projects.length} projetos, ${backup.lists.length} listas e ${backup.todos.length} tarefas. Os dados atuais dessas áreas serão substituídos.`, [
              { text: "Cancelar", style: "cancel" },
              { text: "Importar", onPress: () => { importProjects(backup.projects); importTodos(backup.lists, backup.todos); Alert.alert("Importação concluída", "Projetos e tarefas foram restaurados do CSV."); } },
            ]);
          } catch (error) {
            Alert.alert("CSV inválido", error instanceof Error ? error.message : "Confira o arquivo e tente novamente.");
          }
        }} onSave={(photo, name) => { const nextName = name.trim() || "Meu perfil"; saveProfile(photo, nextName); setEditingProfilePhoto(false); }} />
        <SettingsModal visible={showSettings} theme={theme} onClose={() => { setShowSettings(false); setEditingProfilePhoto(true); }} />
        <OnboardingModal visible={showOnboarding} step={onboardingStep} name={profileName} theme={theme} onStep={setOnboardingStep} onNameSave={saveProfileName} onDismiss={finishOnboarding} onComplete={completeOnboarding} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useCustomFonts({ Archivo: Archivo_400Regular, Inter: Inter_400Regular, Rajdhani: Rajdhani_500Medium, PressStart2P: PressStart2P_400Regular });
  if (!fontsLoaded && !fontError) return null;
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><AppContent /></SafeAreaProvider></GestureHandlerRootView>;
}

