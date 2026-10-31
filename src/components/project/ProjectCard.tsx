import React, { useEffect, useRef } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Project } from "../../stores/nativeProjectStore";
import { ThemeSettings } from "../../stores/themeStore";
import { columns } from "../../constants/app";
import { fontFamily, imageSource } from "../../utils/theme";
export function ProjectCard({ project, theme, isDragging = false, isSettling = false, onPress, onLayout, onDragStart, onDragMove, onDragEnd, onDragCancel }: { project: Project; theme: ThemeSettings; isDragging?: boolean; isSettling?: boolean; onPress: () => void; onLayout?: (y: number, height: number, width: number) => void; onDragStart?: (pageX: number, pageY: number, localX: number, localY: number) => void; onDragMove?: (pageX: number, pageY: number, localX: number, localY: number) => void; onDragEnd?: (pageX: number, pageY: number) => void; onDragCancel?: () => void }) {
  const cardOpacity = useRef(new Animated.Value(isSettling ? 0 : 1)).current;
  useEffect(() => {
    cardOpacity.stopAnimation();
    if (isDragging) { cardOpacity.setValue(0); return; }
    if (!isSettling) { cardOpacity.setValue(1); return; }
    cardOpacity.setValue(0);
    const fadeIn = Animated.timing(cardOpacity, { toValue: 1, duration: 180, useNativeDriver: true });
    fadeIn.start();
    return () => fadeIn.stop();
  }, [cardOpacity, isDragging, isSettling]);
  const dragGesture = Gesture.Pan()
    .activateAfterLongPress(250)
    .runOnJS(true)
    .onStart((event) => onDragStart?.(event.absoluteX, event.absoluteY, event.x, event.y))
    .onUpdate((event) => onDragMove?.(event.absoluteX, event.absoluteY, event.x, event.y))
    .onEnd((event) => onDragEnd?.(event.absoluteX, event.absoluteY))
    .onFinalize((_, success) => { if (!success) onDragCancel?.(); });
  const status = columns.find((item) => item.key === project.status) ?? columns[0];
  const deadline = project.dueDate ? new Date(`${project.dueDate}T00:00:00`).toLocaleDateString("pt-BR") : "Sem prazo";
  const priorityColor = project.priority === "Alta" ? theme.danger : project.priority === "Baixa" ? theme.success : theme.warning;
  const card = <Animated.View onLayout={(event) => onLayout?.(event.nativeEvent.layout.y, event.nativeEvent.layout.height, event.nativeEvent.layout.width)} style={[{ opacity: cardOpacity, marginBottom: 10 }, isDragging ? { position: "absolute", top: 0, left: 0, right: 0 } : null]}><Pressable onPress={onPress} className="p-3 active:opacity-80" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
    <View className="mb-2 flex-row items-center"><View className="mr-2.5 h-8 w-8 items-center justify-center overflow-hidden" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>{project.logo ? <Image source={imageSource(project.logo)} resizeMode="cover" className="h-full w-full" /> : <Text style={{ color: theme.primary }} className="text-xs font-black">{project.name.trim().slice(0, 1).toUpperCase()}</Text>}</View><Text numberOfLines={1} className="flex-1 text-xs font-extrabold" style={{ color: theme.text, fontFamily: fontFamily(theme.font) }}>{project.name}</Text><View className="h-2 w-2 rounded-full" style={{ backgroundColor: project.priority === "Alta" ? theme.danger : project.priority === "Baixa" ? theme.success : theme.warning }} /></View>
    <Text numberOfLines={2} className="mb-3 text-[11px] leading-4" style={{ color: theme.muted }}>{project.description || "Adicione uma descrição para este projeto."}</Text>
    <View className="flex-row items-center justify-between"><View className="flex-row items-center gap-1.5"><View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.color }} /><Text className="text-[9px] font-bold" style={{ color: theme.muted }}>{status.label}</Text></View><View className="px-2 py-1" style={{ backgroundColor: theme.surface, borderRadius: theme.borderRadius }}><Text className="text-[9px] font-bold" style={{ color: priorityColor }}>Prioridade {project.priority.toLowerCase()}</Text></View></View>
    <View className="mt-2 flex-row items-center justify-between"><Text numberOfLines={1} className="flex-1 text-[9px]" style={{ color: theme.muted }}>{project.owner ? `Responsável: ${project.owner}` : "Sem responsável"}</Text><Text className="ml-2 text-[9px]" style={{ color: project.dueDate ? theme.text : theme.muted }}>{deadline}</Text></View>
  </Pressable></Animated.View>;
  return onDragStart ? <GestureDetector gesture={dragGesture}>{card}</GestureDetector> : card;
}

export function DragPreviewCard({ project, theme }: { project: Project; theme: ThemeSettings }) {
  const status = columns.find((item) => item.key === project.status) ?? columns[0];
  const deadline = project.dueDate ? new Date(`${project.dueDate}T00:00:00`).toLocaleDateString("pt-BR") : "Sem prazo";
  const priorityColor = project.priority === "Alta" ? theme.danger : project.priority === "Baixa" ? theme.success : theme.warning;
  return <View className="mb-2.5 p-3" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius, elevation: 24, shadowColor: "#000", shadowOpacity: 0.28, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } }}>
    <View className="mb-2 flex-row items-center"><View className="mr-2.5 h-8 w-8 items-center justify-center overflow-hidden" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>{project.logo ? <Image source={imageSource(project.logo)} resizeMode="cover" className="h-full w-full" /> : <Text style={{ color: theme.primary }} className="text-xs font-black">{project.name.trim().slice(0, 1).toUpperCase()}</Text>}</View><Text numberOfLines={1} className="flex-1 text-xs font-extrabold" style={{ color: theme.text, fontFamily: fontFamily(theme.font) }}>{project.name}</Text><View className="h-2 w-2 rounded-full" style={{ backgroundColor: project.priority === "Alta" ? theme.danger : project.priority === "Baixa" ? theme.success : theme.warning }} /></View>
    <Text numberOfLines={2} className="mb-3 text-[11px] leading-4" style={{ color: theme.muted }}>{project.description || "Adicione uma descrição para este projeto."}</Text>
    <View className="flex-row items-center justify-between"><View className="flex-row items-center gap-1.5"><View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.color }} /><Text className="text-[9px] font-bold" style={{ color: theme.muted }}>{status.label}</Text></View><View className="px-2 py-1" style={{ backgroundColor: theme.surface, borderRadius: theme.borderRadius }}><Text className="text-[9px] font-bold" style={{ color: priorityColor }}>Prioridade {project.priority.toLowerCase()}</Text></View></View>
    <View className="mt-2 flex-row items-center justify-between"><Text numberOfLines={1} className="flex-1 text-[9px]" style={{ color: theme.muted }}>{project.owner ? `Responsável: ${project.owner}` : "Sem responsável"}</Text><Text className="ml-2 text-[9px]" style={{ color: project.dueDate ? theme.text : theme.muted }}>{deadline}</Text></View>
  </View>;
}
