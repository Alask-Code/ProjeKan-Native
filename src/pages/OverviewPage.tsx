import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import useTodoStore from "../stores/todoStore";
import { Project, ProjectStatus } from "../stores/nativeProjectStore";
import { ThemeSettings } from "../stores/themeStore";
import { columns } from "../constants/app";
import { Body, Eyebrow, LinkText, Panel, SectionTitle, Small, Title } from "../components/ui";
import { cardStyle, fontFamily, pieSlicePath } from "../utils/theme";
export function OverviewScreen({ projects, theme, onOpenBoard, onOpen }: { projects: Project[]; theme: ThemeSettings; onOpenBoard: () => void; onOpen: (id: number) => void }) {
  const todoLists = useTodoStore((state) => state.lists);
  const todos = useTodoStore((state) => state.todos);
  const count = (status: ProjectStatus) => projects.filter((project) => (project.status ?? "unstarted") === status).length;
  const active = count("progress") + count("continuous");
  const finished = count("finished");
  const completion = projects.length ? Math.round((finished / projects.length) * 100) : 0;
  const completedTodos = todos.filter((todo) => todo.done).length;
  const pendingTodos = todos.length - completedTodos;
  const stats = [{ label: "Total de projetos", value: projects.length, icon: "▧" }, { label: "Em andamento", value: active, icon: "◷" }, { label: "Concluídos", value: finished, icon: "✓" }];
  return <ScrollView className="flex-1" contentContainerStyle={{ padding: 18, paddingBottom: 28 }}>
    <View className="mb-5 flex-row items-end justify-between"><View className="flex-1 pr-2"><Eyebrow theme={theme}>RESUMO DO ESPAÇO</Eyebrow><Title theme={theme}>Visão geral</Title><Body theme={theme}>Acompanhe o andamento dos seus projetos em um só lugar.</Body></View><LinkText theme={theme} onPress={onOpenBoard}>Abrir quadro ↗</LinkText></View>
    <View className="mb-3 flex-row gap-2">{stats.map((stat) => <View key={stat.label} className="flex-1 p-3" style={cardStyle(theme)}><Text style={{ color: theme.primary }} className="mb-2 text-lg">{stat.icon}</Text><Text numberOfLines={2} style={{ color: theme.muted }} className="text-[9px]">{stat.label}</Text><Text style={{ color: theme.text }} className="mt-1 text-xl font-black">{stat.value}</Text></View>)}</View>
    <Panel theme={theme}><View className="mb-3"><SectionTitle theme={theme}>Progresso geral</SectionTitle><Body theme={theme}>Projetos concluídos em relação ao total</Body></View><View className="items-center py-2"><View className="h-48 w-48 items-center justify-center"><Svg width={192} height={192} viewBox="0 0 128 128"><Circle cx={64} cy={64} r={60} fill={theme.raised} />{completion >= 100 ? <Circle cx={64} cy={64} r={60} fill={theme.primary} /> : completion > 0 ? <Path d={pieSlicePath(64, 64, 60, completion)} fill={theme.primary} /> : null}</Svg><Text pointerEvents="none" style={{ color: theme.text, fontFamily: fontFamily(theme.font), position: "absolute" }} className="text-2xl font-black">{completion}%</Text></View><View className="mt-5 w-full flex-row items-center justify-center gap-5"><View className="flex-row items-center gap-2"><View className="h-3 w-3 rounded-sm" style={{ backgroundColor: theme.primary }} /><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-xs font-bold">{finished} concluídos · {completion}%</Text></View><View className="flex-row items-center gap-2"><View className="h-3 w-3 rounded-sm" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth }} /><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-xs font-bold">{projects.length - finished} restantes · {100 - completion}%</Text></View></View></View></Panel>
    <Panel theme={theme}>
      <View className="mb-3"><SectionTitle theme={theme}>Listas Todo</SectionTitle><Body theme={theme}>Resumo das suas listas e tarefas.</Body></View>
      <View className="mb-3 flex-row gap-2">
        {[{ label: "Listas", value: todoLists.length }, { label: "Tarefas", value: todos.length }, { label: "Pendentes", value: pendingTodos }].map((item) => <View key={item.label} className="flex-1 p-3" style={cardStyle(theme)}><Small theme={theme}>{item.label}</Small><Text style={{ color: theme.text }} className="mt-1 text-lg font-black">{item.value}</Text></View>)}
      </View>
      {todoLists.length ? todoLists.map((list) => {
        const listTodos = todos.filter((todo) => todo.listId === list.id);
        const listCompleted = listTodos.filter((todo) => todo.done).length;
        const listProgress = listTodos.length ? Math.round((listCompleted / listTodos.length) * 100) : 0;
        return <View key={list.id} className="border-b py-2.5" style={{ borderColor: theme.border, borderBottomWidth: theme.borderWidth }}>
          <View className="mb-2 flex-row items-center"><Text numberOfLines={1} style={{ color: theme.text }} className="flex-1 text-xs font-bold">{list.name}</Text><Text style={{ color: theme.muted }} className="ml-2 text-[10px]">{listCompleted}/{listTodos.length} concluídas</Text></View>
          <View className="h-1.5 overflow-hidden" style={{ backgroundColor: theme.raised, borderRadius: theme.borderRadius }}><View style={{ width: `${listProgress}%`, backgroundColor: theme.primary }} className="h-full" /></View>
        </View>;
      }) : <Body theme={theme}>Nenhuma lista Todo disponível.</Body>}
      <View className="mt-2"><Small theme={theme}>{completedTodos} tarefas concluídas · {pendingTodos} pendentes</Small></View>
    </Panel>
    <Panel theme={theme}><SectionTitle theme={theme}>Projetos por status</SectionTitle><Body theme={theme}>Distribuição atual</Body><View className="mt-3">{columns.map((column) => <View key={column.key} className="flex-row items-center border-b py-2" style={{ borderColor: theme.border, borderBottomWidth: theme.borderWidth }}><View className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: column.color }} /><Text style={{ color: theme.muted }} className="flex-1 text-xs">{column.key === "warning" ? "Precisa de atenção" : column.label}</Text><Text style={{ color: theme.text }} className="text-xs font-bold">{count(column.key)}</Text></View>)}</View></Panel>
    <Panel theme={theme}><View className="mb-3 flex-row items-center justify-between"><View><SectionTitle theme={theme}>Projetos recentes</SectionTitle><Body theme={theme}>Continue de onde você parou</Body></View><LinkText theme={theme} onPress={onOpenBoard}>Ver quadro ↗</LinkText></View>{projects.length ? projects.slice(0, 5).map((project) => <Pressable onPress={() => onOpen(project.id)} key={project.id} className="flex-row items-center border-b py-2.5" style={{ borderColor: theme.border, borderBottomWidth: theme.borderWidth }}><View className="mr-2 h-8 w-8 items-center justify-center" style={{ backgroundColor: theme.raised }}><Text style={{ color: theme.primary }} className="font-bold">{project.name[0]?.toUpperCase()}</Text></View><View className="flex-1"><Text style={{ color: theme.text }} className="text-xs font-bold">{project.name}</Text><Text numberOfLines={1} style={{ color: theme.muted }} className="text-[10px]">{project.description || "Sem descrição"}</Text></View><Text style={{ color: theme.muted }} className="ml-2 text-[9px]">{columns.find((column) => column.key === project.status)?.label}</Text></Pressable>) : <Body theme={theme}>Seus projetos aparecerão aqui quando você criar o primeiro.</Body>}</Panel>
  </ScrollView>;
}
