import React, { useMemo } from 'react';
import { Modal, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import appConfig from '../../../app.json';
import { ThemeSettings } from '../../stores/themeStore';
import { Action, AppIcon, Body, CloseButton, SectionTitle, Small } from '../../components/ui';
import { fontFamily, openExternalUrl } from '../../utils/theme';
import { CHANGELOG_MARKDOWN } from '../../constants/changelog.generated';
import { useReminderSettings } from '../../hooks/useReminderSettings';
import { useReleaseUpdates } from '../../hooks/useReleaseUpdates';
import type { AppDialogOptions } from '../../hooks/useAppDialog';
import { parseChangelog } from '../../utils/changelog';
import ReleaseNotesSection from './ReleaseNotesSection';
import ReminderTimePickerModal from './ReminderTimePickerModal';

export function SettingsModal({
  visible,
  theme,
  onClose,
  onDeleteAll,
  onShowDialog
}: {
  visible: boolean;
  theme: ThemeSettings;
  onClose: () => void;
  onDeleteAll: () => void;
  onShowDialog: (options: AppDialogOptions) => void;
}) {
  const currentVersion = appConfig.expo.version;
  const installedVersionLabel = `${currentVersion}${__DEV__ ? ' (Desenvolvimento)' : ''}`;
  const releaseNotes = useMemo(() => parseChangelog(CHANGELOG_MARKDOWN), []);
  const reminder = useReminderSettings(visible, onShowDialog);
  const { checkingUpdates, updateResult, checkForUpdates } = useReleaseUpdates(currentVersion);
  const {
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
    timeLabel
  } = reminder;
  return (
    <>
      <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose} statusBarTranslucent>
        <View className="flex-1 justify-end bg-black/60">
          <View
            className="max-h-[90%] border-t p-4"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.border,
              borderTopWidth: theme.borderWidth,
              borderTopLeftRadius: theme.borderRadius,
              borderTopRightRadius: theme.borderRadius
            }}
          >
            <View className="mb-3 h-1 w-10 self-center" style={{ backgroundColor: theme.border }} />
            <View className="mb-3 flex-row items-center justify-between">
              <View>
                <Small theme={theme}>PREFERÊNCIAS DO APP</Small>
                <Text
                  style={{ color: theme.text, fontFamily: fontFamily(theme.font) }}
                  className="mt-1 text-xl font-black"
                >
                  Configurações
                </Text>
              </View>
              <CloseButton theme={theme} onPress={onClose} />
            </View>
            <ScrollView
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 12 }}
            >
              <View
                className="mb-3 p-4"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  borderWidth: theme.borderWidth,
                  borderRadius: theme.borderRadius
                }}
              >
                <View className="mb-2">
                  <SectionTitle theme={theme}>Lembretes</SectionTitle>
                  <Body theme={theme}>Receba uma notificação diária para revisar suas tarefas pendentes.</Body>
                </View>
                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-1 pr-3">
                    <Text
                      style={{ color: theme.text, fontFamily: fontFamily(theme.font) }}
                      className="text-xs font-bold"
                    >
                      Lembrete diário
                    </Text>
                    <Text
                      style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }}
                      className="mt-0.5 text-[10px]"
                    >
                      {reminderEnabled ? `Ativo às ${timeLabel}` : 'Desativado'}
                    </Text>
                  </View>
                  <Switch
                    accessibilityLabel="Ativar lembretes diários"
                    value={reminderEnabled}
                    disabled={loadingPreferences}
                    onValueChange={toggleReminder}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor={theme.background}
                  />
                </View>
                {reminderEnabled ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Alterar horário do lembrete, atualmente ${timeLabel}`}
                    onPress={openTimePicker}
                    className="mt-2 flex-row items-center justify-between p-3"
                    style={{
                      backgroundColor: theme.raised,
                      borderColor: theme.border,
                      borderWidth: theme.borderWidth,
                      borderRadius: theme.borderRadius
                    }}
                  >
                    <View className="flex-row items-center gap-2">
                      <AppIcon name="clock" size={17} color={theme.primary} />
                      <Text
                        style={{ color: theme.text, fontFamily: fontFamily(theme.font) }}
                        className="text-xs font-semibold"
                      >
                        Horário do lembrete
                      </Text>
                    </View>
                    <Text
                      style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }}
                      className="text-sm font-black"
                    >
                      {timeLabel}
                    </Text>
                  </Pressable>
                ) : null}
              </View>

              <View
                className="mb-3 p-4"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  borderWidth: theme.borderWidth,
                  borderRadius: theme.borderRadius
                }}
              >
                <View className="mb-2">
                  <SectionTitle theme={theme}>Dados do app</SectionTitle>
                  <Body theme={theme}>
                    Apague projetos, listas, tarefas e dados do perfil salvos neste dispositivo.
                  </Body>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Apagar todo o conteúdo salvo"
                  onPress={onDeleteAll}
                  className="flex-row items-center gap-3 rounded-xl border p-3"
                  style={{
                    backgroundColor: theme.raised,
                    borderColor: theme.danger,
                    borderWidth: theme.borderWidth,
                    borderRadius: theme.borderRadius
                  }}
                >
                  <View
                    className="h-9 w-9 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.surface }}
                  >
                    <AppIcon name="trash" size={17} color={theme.danger} />
                  </View>
                  <View className="flex-1">
                    <Text
                      style={{ color: theme.danger, fontFamily: fontFamily(theme.font) }}
                      className="text-xs font-bold"
                    >
                      Apagar todo o conteúdo
                    </Text>
                    <Text
                      style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }}
                      className="mt-0.5 text-[10px]"
                    >
                      Esta ação não pode ser desfeita
                    </Text>
                  </View>
                  <AppIcon name="chevronRight" size={16} color={theme.danger} />
                </Pressable>
              </View>

              <View
                className="p-4"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  borderWidth: theme.borderWidth,
                  borderRadius: theme.borderRadius
                }}
              >
                <View className="mb-3 flex-row items-center gap-2">
                  <AppIcon name="arrowUpRight" size={17} color={theme.primary} />
                  <View>
                    <SectionTitle theme={theme}>Atualizações</SectionTitle>
                    <Body theme={theme}>Versão instalada: {installedVersionLabel}</Body>
                  </View>
                </View>
                <Action theme={theme} secondary onPress={checkForUpdates}>
                  {checkingUpdates ? 'Consultando GitHub…' : 'Verificar atualizações'}
                </Action>
                {updateResult ? (
                  <View className="mt-3">
                    <Text
                      style={{
                        color:
                          updateResult.kind === 'error'
                            ? theme.danger
                            : updateResult.kind === 'available'
                              ? theme.warning
                              : theme.success,
                        fontFamily: fontFamily(theme.font)
                      }}
                      className="text-xs font-semibold"
                    >
                      {updateResult.message}
                    </Text>
                    {updateResult.kind === 'available' ? (
                      <Pressable
                        accessibilityRole="link"
                        onPress={() => openExternalUrl(updateResult.url)}
                        className="mt-2 flex-row items-center gap-1"
                      >
                        <Text
                          style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }}
                          className="text-xs font-bold"
                        >
                          Abrir release
                        </Text>
                        <AppIcon name="arrowUpRight" size={13} color={theme.primary} />
                      </Pressable>
                    ) : null}
                  </View>
                ) : null}
              </View>
              <ReleaseNotesSection theme={theme} releaseNotes={releaseNotes} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      <ReminderTimePickerModal
        visible={timePickerVisible}
        time={draftTime}
        theme={theme}
        onClose={() => setTimePickerVisible(false)}
        onChange={changeDraftTime}
        onSetMinute={setDraftMinute}
        onConfirm={updateReminderTime}
      />
    </>
  );
}
