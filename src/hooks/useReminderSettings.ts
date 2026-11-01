import { useEffect, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import type { AppDialogOptions } from "./useAppDialog";

const REMINDER_SETTINGS_KEY = "projekan-reminder-settings";
const REMINDER_NOTIFICATION_KEY = "projekan-reminder-notification-id";
const REMINDER_CHANNEL_ID = "task-reminders";

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

function makeTime(hour: number, minute: number) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

export function useReminderSettings(visible: boolean, onShowDialog: (options: AppDialogOptions) => void) {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(9);
  const [reminderMinute, setReminderMinute] = useState(0);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [draftTime, setDraftTime] = useState(makeTime(9, 0));

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

  const savePreferences = (enabled: boolean, hour: number, minute: number) =>
    AsyncStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify({ enabled, hour, minute }));

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
          onShowDialog({ title: "Permissão necessária", message: "Ative as notificações do ProjeKan nas configurações do dispositivo para receber lembretes.", actions: [{ text: "Entendi" }] });
          return;
        }
      } else await cancelReminder();
      setReminderEnabled(enabled);
      await savePreferences(enabled, reminderHour, reminderMinute);
    } catch {
      onShowDialog({ title: "Não foi possível configurar", message: "Tente novamente nas configurações de notificações do dispositivo.", actions: [{ text: "Entendi" }] });
    }
  };

  const updateReminderTime = async (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    setReminderHour(hour);
    setReminderMinute(minute);
    setTimePickerVisible(false);
    try {
      if (reminderEnabled) {
        const scheduled = await scheduleReminder(hour, minute);
        if (!scheduled) {
          setReminderEnabled(false);
          await savePreferences(false, hour, minute);
          onShowDialog({ title: "Notificações desativadas", message: "A permissão foi removida nas configurações do dispositivo.", actions: [{ text: "Entendi" }] });
          return;
        }
      }
      await savePreferences(reminderEnabled, hour, minute);
    } catch {
      onShowDialog({ title: "Não foi possível alterar o horário", message: "Tente novamente.", actions: [{ text: "Entendi" }] });
    }
  };

  const openTimePicker = () => {
    setDraftTime(makeTime(reminderHour, reminderMinute));
    setTimePickerVisible(true);
  };

  const changeDraftTime = (unit: "hour" | "minute", amount: number) => {
    setDraftTime((current) => {
      const next = new Date(current);
      if (unit === "hour") next.setHours((current.getHours() + amount + 24) % 24);
      else next.setMinutes((current.getMinutes() + amount + 60) % 60);
      return next;
    });
  };

  const setDraftMinute = (minute: number) => {
    setDraftTime((current) => makeTime(current.getHours(), minute));
  };

  const timeLabel = `${String(reminderHour).padStart(2, "0")}:${String(reminderMinute).padStart(2, "0")}`;
  return {
    reminderEnabled,
    reminderHour,
    reminderMinute,
    loadingPreferences,
    timePickerVisible,
    setTimePickerVisible,
    draftTime,
    openTimePicker,
    changeDraftTime,
    setDraftMinute,
    toggleReminder,
    updateReminderTime,
    timeLabel,
  };
}
