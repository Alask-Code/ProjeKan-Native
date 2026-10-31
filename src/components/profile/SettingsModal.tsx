import React, { useEffect, useState } from "react";
import { Alert, Modal, Platform, Pressable, ScrollView, Switch, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import appConfig from "../../../app.json";
import { ThemeSettings } from "../../stores/themeStore";
import { Action, AppIcon, Body, CloseButton, SectionTitle, Small } from "../../components/ui";
import { fontFamily, openExternalUrl } from "../../utils/theme";
import { CHANGELOG_MARKDOWN } from "../../constants/changelog.generated";

const REMINDER_SETTINGS_KEY = "projekan-reminder-settings";
const REMINDER_NOTIFICATION_KEY = "projekan-reminder-notification-id";
const REMINDER_CHANNEL_ID = "task-reminders";
const LATEST_RELEASE_API = "https://api.github.com/repos/Alask-Code/ProjeKan-Native/releases/latest";
const LATEST_RELEASE_PAGE = "https://github.com/Alask-Code/ProjeKan-Native/releases/latest";

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

type ReleaseNotes = { version: string; notes: string[] };
function parseChangelog(markdown: string): ReleaseNotes[] {
  const sections: ReleaseNotes[] = [];
  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^##\s+\[([^\]]+)\]/);
    if (heading) { sections.push({ version: heading[1], notes: [] }); continue; }
    const bullet = line.match(/^\s*[-*]\s+(.+)/);
    if (bullet && sections.length) sections[sections.length - 1].notes.push(bullet[1].trim());
  }
  return sections;
}

function parseVersion(version: string) {
  const core = version.trim().replace(/^v/i, "").split(/[+-]/)[0];
  const parts = core.split(".").map((part) => Number(part));
  return parts.length >= 2 && parts.length <= 3 && parts.every(Number.isInteger) ? [...parts, 0].slice(0, 3) : null;
}

function compareVersions(left: string, right: string) {
  const a = parseVersion(left);
  const b = parseVersion(right);
  if (!a || !b) return null;
  for (let index = 0; index < 3; index += 1) {
    if (a[index] > b[index]) return 1;
    if (a[index] < b[index]) return -1;
  }
  return 0;
}

function makeTime(hour: number, minute: number) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

export function SettingsModal({ visible, theme, onClose }: { visible: boolean; theme: ThemeSettings; onClose: () => void }) {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(9);
  const [reminderMinute, setReminderMinute] = useState(0);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [iosTimePickerVisible, setIosTimePickerVisible] = useState(false);
  const [iosDraftTime, setIosDraftTime] = useState(makeTime(9, 0));
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updateResult, setUpdateResult] = useState<{ kind: "current" | "available" | "error"; message: string; url?: string } | null>(null);
  const currentVersion = appConfig.expo.version;
  const releaseNotes = parseChangelog(CHANGELOG_MARKDOWN);

  useEffect(() => {
    if (!visible) return;
    let active = true;
    setLoadingPreferences(true);
    AsyncStorage.getItem(REMINDER_SETTINGS_KEY).then((stored) => {
      if (!active || !stored) return;
      const parsed = JSON.parse(stored) as { enabled?: boolean; hour?: number; minute?: number };
      if (typeof parsed.hour === "number" && parsed.hour >= 0 && parsed.hour <= 23) setReminderHour(parsed.hour);
      if (typeof parsed.minute === "number" && parsed.minute >= 0 && parsed.minute <= 59) setReminderMinute(parsed.minute);
      setReminderEnabled(parsed.enabled === true);
    }).catch(() => undefined).finally(() => { if (active) setLoadingPreferences(false); });
    return () => { active = false; };
  }, [visible]);

  const savePreferences = (enabled: boolean, hour: number, minute: number) => AsyncStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify({ enabled, hour, minute }));

  const scheduleReminder = async (hour: number, minute: number) => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
        name: "Lembretes de tarefas",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 200, 100, 200],
      });
    }
    let permission = await Notifications.getPermissionsAsync();
    if (permission.status !== "granted") permission = await Notifications.requestPermissionsAsync();
    if (permission.status !== "granted") return false;

    const previousId = await AsyncStorage.getItem(REMINDER_NOTIFICATION_KEY);
    if (previousId) await Notifications.cancelScheduledNotificationAsync(previousId).catch(() => undefined);
    const trigger: Notifications.DailyTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      ...(Platform.OS === "android" ? { channelId: REMINDER_CHANNEL_ID } : {}),
    };
    const id = await Notifications.scheduleNotificationAsync({
      content: { title: "Hora de revisar suas tarefas", body: "Confira o que ainda está pendente no ProjeKan." },
      trigger,
    });
    await AsyncStorage.setItem(REMINDER_NOTIFICATION_KEY, id);
    return true;
  };

  const cancelReminder = async () => {
    const id = await AsyncStorage.getItem(REMINDER_NOTIFICATION_KEY);
    if (id) await Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined);
    await AsyncStorage.removeItem(REMINDER_NOTIFICATION_KEY);
  };

  const toggleReminder = async (enabled: boolean) => {
    try {
      if (enabled) {
        const scheduled = await scheduleReminder(reminderHour, reminderMinute);
        if (!scheduled) {
          Alert.alert("Permissão necessária", "Ative as notificações do ProjeKan nas configurações do dispositivo para receber lembretes.");
          return;
        }
      } else await cancelReminder();
      setReminderEnabled(enabled);
      await savePreferences(enabled, reminderHour, reminderMinute);
    } catch {
      Alert.alert("Não foi possível configurar", "Tente novamente nas configurações de notificações do dispositivo.");
    }
  };

  const updateReminderTime = async (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    setReminderHour(hour);
    setReminderMinute(minute);
    setIosTimePickerVisible(false);
    try {
      if (reminderEnabled) {
        const scheduled = await scheduleReminder(hour, minute);
        if (!scheduled) {
          setReminderEnabled(false);
          await savePreferences(false, hour, minute);
          Alert.alert("Notificações desativadas", "A permissão foi removida nas configurações do dispositivo.");
          return;
        }
      }
      await savePreferences(reminderEnabled, hour, minute);
    } catch {
      Alert.alert("Não foi possível alterar o horário", "Tente novamente.");
    }
  };

  const openTimePicker = () => {
    const initial = makeTime(reminderHour, reminderMinute);
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({ value: initial, mode: "time", display: "clock", is24Hour: true, onValueChange: (_event, selectedDate) => { if (selectedDate) void updateReminderTime(selectedDate); } });
    } else {
      setIosDraftTime(initial);
      setIosTimePickerVisible(true);
    }
  };

  const checkForUpdates = async () => {
    setCheckingUpdates(true);
    setUpdateResult(null);
    try {
      const response = await fetch(LATEST_RELEASE_API, { headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" } });
      if (!response.ok) throw new Error(`GitHub respondeu ${response.status}`);
      const release = await response.json() as { tag_name?: string; name?: string; html_url?: string };
      const latestVersion = release.tag_name ?? release.name;
      if (!latestVersion) throw new Error("A release não contém uma versão.");
      const comparison = compareVersions(currentVersion, latestVersion);
      if (comparison === null) throw new Error("Não foi possível interpretar o número da versão.");
      if (comparison < 0) {
        setUpdateResult({ kind: "available", message: `Nova versão disponível: ${latestVersion} (instalada: ${currentVersion}).`, url: release.html_url ?? LATEST_RELEASE_PAGE });
      } else {
        setUpdateResult({ kind: "current", message: comparison === 0 ? `Você está usando a versão mais recente (${currentVersion}).` : `A versão instalada (${currentVersion}) é mais nova que a última release publicada (${latestVersion}).` });
      }
    } catch {
      setUpdateResult({ kind: "error", message: "Não foi possível consultar as releases do GitHub. Verifique sua conexão e tente novamente." });
    } finally {
      setCheckingUpdates(false);
    }
  };

  const timeLabel = `${String(reminderHour).padStart(2, "0")}:${String(reminderMinute).padStart(2, "0")}`;
  return <>
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 justify-end bg-black/60">
        <View className="max-h-[90%] border-t p-4" style={{ backgroundColor: theme.background, borderColor: theme.border, borderTopWidth: theme.borderWidth, borderTopLeftRadius: theme.borderRadius, borderTopRightRadius: theme.borderRadius }}>
          <View className="mb-3 h-1 w-10 self-center" style={{ backgroundColor: theme.border }} />
          <View className="mb-3 flex-row items-center justify-between"><View><Small theme={theme}>PREFERÊNCIAS DO APP</Small><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="mt-1 text-xl font-black">Configurações</Text></View><CloseButton theme={theme} onPress={onClose} /></View>
          <ScrollView showsVerticalScrollIndicator keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 12 }}>
            <View className="mb-3 p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
              <View className="mb-2"><SectionTitle theme={theme}>Lembretes</SectionTitle><Body theme={theme}>Receba uma notificação diária para revisar suas tarefas pendentes.</Body></View>
              <View className="flex-row items-center justify-between py-2"><View className="flex-1 pr-3"><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-xs font-bold">Lembrete diário</Text><Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="mt-0.5 text-[10px]">{reminderEnabled ? `Ativo às ${timeLabel}` : "Desativado"}</Text></View><Switch accessibilityLabel="Ativar lembretes diários" value={reminderEnabled} disabled={loadingPreferences} onValueChange={toggleReminder} trackColor={{ false: theme.border, true: theme.primary }} thumbColor={theme.background} /></View>
              {reminderEnabled ? <Pressable accessibilityRole="button" accessibilityLabel={`Alterar horário do lembrete, atualmente ${timeLabel}`} onPress={openTimePicker} className="mt-2 flex-row items-center justify-between p-3" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><View className="flex-row items-center gap-2"><AppIcon name="clock" size={17} color={theme.primary} /><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-xs font-semibold">Horário do lembrete</Text></View><Text style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }} className="text-sm font-black">{timeLabel}</Text></Pressable> : null}
            </View>

            <View className="mb-3 p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
              <View className="mb-2 flex-row items-center gap-2"><AppIcon name="overview" size={17} color={theme.primary} /><SectionTitle theme={theme}>O que há de novo</SectionTitle></View>
              {releaseNotes.length ? releaseNotes.map((section) => <View key={section.version} className="mt-2"><Text style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }} className="mb-1 text-xs font-extrabold">Versão {section.version}</Text>{section.notes.length ? section.notes.map((note, index) => <View key={`${section.version}-${index}`} className="mb-1 flex-row items-start gap-2"><Text style={{ color: theme.primary }} className="text-xs">•</Text><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="flex-1 text-xs leading-4">{note}</Text></View>) : <Body theme={theme}>Nenhuma nota foi publicada para esta versão.</Body>}</View>) : <Body theme={theme}>Não há notas de versão no CHANGELOG.md.</Body>}
            </View>

            <View className="p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
              <View className="mb-3 flex-row items-center gap-2"><AppIcon name="arrowUpRight" size={17} color={theme.primary} /><View><SectionTitle theme={theme}>Atualizações</SectionTitle><Body theme={theme}>Versão instalada: {currentVersion}</Body></View></View>
              <Action theme={theme} secondary onPress={checkForUpdates}>{checkingUpdates ? "Consultando GitHub…" : "Verificar atualizações"}</Action>
              {updateResult ? <View className="mt-3"><Text style={{ color: updateResult.kind === "error" ? theme.danger : updateResult.kind === "available" ? theme.warning : theme.success, fontFamily: fontFamily(theme.font) }} className="text-xs font-semibold">{updateResult.message}</Text>{updateResult.kind === "available" ? <Pressable accessibilityRole="link" onPress={() => openExternalUrl(updateResult.url)} className="mt-2 flex-row items-center gap-1"><Text style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }} className="text-xs font-bold">Abrir release</Text><AppIcon name="arrowUpRight" size={13} color={theme.primary} /></Pressable> : null}</View> : null}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
    {Platform.OS === "ios" ? <Modal transparent animationType="fade" visible={iosTimePickerVisible} onRequestClose={() => setIosTimePickerVisible(false)}><View className="flex-1 justify-center px-6" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}><Pressable accessibilityRole="button" accessibilityLabel="Fechar horário" onPress={() => setIosTimePickerVisible(false)} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} /><View className="p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="mb-2 text-sm font-bold">Horário do lembrete</Text><DateTimePicker value={iosDraftTime} mode="time" display="spinner" locale="pt-BR" is24Hour onValueChange={(_event, date) => { if (date) setIosDraftTime(date); }} /><View className="mt-3 flex-row justify-end gap-2"><Action theme={theme} secondary onPress={() => setIosTimePickerVisible(false)}>Cancelar</Action><Action theme={theme} onPress={() => updateReminderTime(iosDraftTime)}>Salvar horário</Action></View></View></View></Modal> : null}
  </>;
}
