import React, { useEffect, useState } from "react";
import { Keyboard, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import useTodoStore from "../stores/todoStore";
import { ThemeSettings } from "../stores/themeStore";
import { Action, Body, Eyebrow, AppIcon, KeyboardAwareScrollView, LinkText, Panel, SectionTitle, Small, Title } from "../components/ui";
import { fontFamily, inputDynamic } from "../utils/theme";
export function TodoScreen({ theme }: { theme: ThemeSettings }) {
  const lists = useTodoStore((state) => state.lists);
  const todos = useTodoStore((state) => state.todos);
  const selectedListId = useTodoStore((state) => state.selectedListId);
  const setSelectedListId = useTodoStore((state) => state.setSelectedListId);
  const addTodo = useTodoStore((state) => state.addTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const addList = useTodoStore((state) => state.addList);
  const renameList = useTodoStore((state) => state.renameList);
  const removeList = useTodoStore((state) => state.removeList);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const uncheckCompleted = useTodoStore((state) => state.uncheckCompleted);
  const [text, setText] = useState("");
  const [newListName, setNewListName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [showListActions, setShowListActions] = useState(false);
  const [showAddListMenu, setShowAddListMenu] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [confirmDeleteList, setConfirmDeleteList] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editTodoText, setEditTodoText] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => setKeyboardHeight(event.endCoordinates.height));
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setKeyboardHeight(0));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const selectedList = lists.find((list) => list.id === selectedListId) ?? lists[0];
  const listTodos = todos.filter((todo) => todo.listId === selectedList?.id);
  const pendingTodos = listTodos.filter((todo) => !todo.done);
  const completedTodos = listTodos.filter((todo) => todo.done);
  const completed = completedTodos.length;
  useEffect(() => { setShowCompleted(false); }, [selectedList?.id]);
  const createTodo = () => { if (text.trim() && selectedList) { addTodo(selectedList.id, text.trim()); setText(""); } };
  const saveTodoEdit = () => {
    if (editingTodoId === null || !editTodoText.trim()) return;
    updateTodo(editingTodoId, editTodoText.trim());
    setEditingTodoId(null);
    setEditTodoText("");
  };
  const createList = () => { if (!newListName.trim()) return; const id = addList(newListName.trim()); setSelectedListId(id); setNewListName(""); setShowAddListMenu(false); };
  const inputStyle = inputDynamic(theme);
  const renderTodoRows = (items: typeof listTodos) => items.map((todo) => {
    const editing = editingTodoId === todo.id;
    return <View key={todo.id} className="flex-row items-center border-b py-3" style={{ borderColor: theme.border, borderBottomWidth: theme.borderWidth }}>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: todo.done }} accessibilityLabel={todo.done ? `Marcar ${todo.text} como pendente` : `Concluir ${todo.text}`} onPress={() => toggleTodo(todo.id)} className="mr-3 h-6 w-6 items-center justify-center" style={{ backgroundColor: "transparent" }}><Svg width={24} height={24} viewBox="0 0 24 24"><Rect x={3} y={3} width={18} height={18} rx={Math.min(theme.borderRadius, 5)} fill={todo.done ? theme.primary : theme.raised} stroke={theme.border} strokeWidth={theme.borderWidth} />{todo.done ? <Path d="m7 12 3.2 3.2L17.5 8" fill="none" stroke={theme.background} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /> : null}</Svg></Pressable>
      {editing ? <TextInput accessibilityLabel="Editar tarefa" autoFocus value={editTodoText} onChangeText={setEditTodoText} onSubmitEditing={saveTodoEdit} returnKeyType="done" style={[inputStyle, { flex: 1 }]} /> : <Text className={`flex-1 text-sm ${todo.done ? "line-through" : ""}`} style={{ color: todo.done ? theme.muted : theme.text, fontFamily: fontFamily(theme.font) }}>{todo.text}</Text>}
      {editing ? <View className="ml-2 flex-row items-center gap-1"><Action theme={theme} onPress={saveTodoEdit}>Salvar</Action><Pressable accessibilityRole="button" accessibilityLabel="Cancelar edição" onPress={() => { setEditingTodoId(null); setEditTodoText(""); }} className="h-8 w-8 items-center justify-center"><AppIcon name="close" size={16} color={theme.muted} /></Pressable></View> : <View className="ml-2 flex-row items-center gap-1"><Pressable accessibilityRole="button" accessibilityLabel={`Editar ${todo.text}`} onPress={() => { setEditingTodoId(todo.id); setEditTodoText(todo.text); }} className="h-8 w-8 items-center justify-center"><AppIcon name="pencil" size={18} color={theme.primary} /></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`Excluir ${todo.text}`} onPress={() => removeTodo(todo.id)} className="h-8 w-8 items-center justify-center"><AppIcon name="trash" size={18} color={theme.primary} /></Pressable></View>}
    </View>;
  });
  return <KeyboardAwareScrollView className="flex-1" keyboardShouldPersistTaps="handled" keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"} contentContainerStyle={{ padding: 18, paddingBottom: keyboardHeight + 28 }}>
    <View className="mb-5 flex-row items-end justify-between"><View className="flex-1 pr-2"><Eyebrow theme={theme}>FOCO DO DIA</Eyebrow><Title theme={theme}>Tarefas</Title><Body numberOfLines={1} theme={theme}>Organize suas tarefas em listas separadas.</Body></View><View className="items-end"><Text style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }} className="text-xl font-black">{completed}/{listTodos.length}</Text><Small theme={theme}>concluídas</Small></View></View>
    <Panel theme={theme}>
      <View className="mb-3"><SectionTitle theme={theme}>Suas listas</SectionTitle></View>
      <View className="flex-row items-center gap-2">
        <View style={{ flex: 1, position: "relative", zIndex: 20, elevation: 20 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Selecionar lista" accessibilityState={{ expanded: showListMenu }} onPress={() => setShowListMenu(!showListMenu)} className="h-10 flex-row items-center justify-between px-3 py-1" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><View className="flex-1"><Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="text-[9px]">LISTA ATUAL</Text><Text numberOfLines={1} style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-xs font-bold">{selectedList?.name ?? "Selecione uma lista"}</Text></View><AppIcon name={showListMenu ? "chevronUp" : "chevronDown"} size={18} color={theme.primary} /></Pressable>
          {showListMenu ? <View className="overflow-hidden" style={{ position: "absolute", top: 44, left: 0, right: 0, zIndex: 30, elevation: 30, height: Math.min(lists.length * 52, 280), backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">{lists.map((list) => { const active = list.id === selectedList?.id; const count = todos.filter((todo) => todo.listId === list.id && !todo.done).length; return <Pressable key={list.id} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => { setSelectedListId(list.id); setShowListMenu(false); setRenaming(false); setConfirmDeleteList(false); }} className="flex-row items-center justify-between px-3 py-2.5" style={{ backgroundColor: active ? theme.raised : theme.surface, borderBottomColor: theme.border, borderBottomWidth: theme.borderWidth }}><View className="flex-1"><Text numberOfLines={1} style={{ color: active ? theme.primary : theme.text, fontFamily: fontFamily(theme.font) }} className="text-xs font-bold">{list.name}</Text><Text style={{ color: theme.muted }} className="mt-0.5 text-[9px]">{count} pendente{count === 1 ? "" : "s"}</Text></View>{active ? <AppIcon name="check" size={16} color={theme.primary} /> : null}</Pressable>; })}</ScrollView></View> : null}
        </View>
        <View style={{ position: "relative", zIndex: 40, elevation: 40 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Ações da lista" accessibilityState={{ expanded: showListActions }} onPress={() => { setShowListActions(!showListActions); setShowListMenu(false); setShowAddListMenu(false); }} className="h-10 w-10 items-center justify-center" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><AppIcon name="more" size={20} color={theme.text} /></Pressable>
          {showListActions ? <View className="overflow-hidden" style={{ position: "absolute", top: 44, right: 0, width: 176, zIndex: 50, elevation: 50, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><Pressable accessibilityRole="button" onPress={() => { if (selectedList) setRenameText(selectedList.name); setRenaming(Boolean(selectedList)); setShowListActions(false); }} className="px-3 py-3" style={{ borderBottomColor: theme.border, borderBottomWidth: theme.borderWidth }}><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-xs font-bold">Renomear lista</Text></Pressable>{lists.length > 1 ? <Pressable accessibilityRole="button" onPress={() => { setConfirmDeleteList(true); setShowListActions(false); }} className="px-3 py-3"><Text style={{ color: theme.danger, fontFamily: fontFamily(theme.font) }} className="text-xs font-bold">Excluir lista</Text></Pressable> : null}</View> : null}
        </View>
        <View style={{ position: "relative", zIndex: 30, elevation: 30 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Adicionar lista" accessibilityState={{ expanded: showAddListMenu }} onPress={() => { setShowAddListMenu(!showAddListMenu); setShowListMenu(false); setShowListActions(false); }} className="h-10 w-10 items-center justify-center" style={{ backgroundColor: theme.primary, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><AppIcon name="plus" size={18} color={theme.background} strokeWidth={2.5} /></Pressable>
          {showAddListMenu ? <View className="p-3" style={{ position: "absolute", top: 44, right: 0, width: 260, zIndex: 40, elevation: 40, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="mb-2 text-xs font-bold">Nova lista</Text><TextInput accessibilityLabel="Nome da nova lista" value={newListName} onChangeText={setNewListName} onSubmitEditing={createList} returnKeyType="done" placeholder="Nome da lista" placeholderTextColor={theme.muted} style={inputStyle} /><View className="mt-2 flex-row justify-end gap-2"><Action theme={theme} secondary onPress={() => { setShowAddListMenu(false); setNewListName(""); }}>Cancelar</Action><Action theme={theme} onPress={createList}>Adicionar</Action></View></View> : null}
        </View>
      </View>
      {renaming && selectedList ? <View className="mt-3 flex-row gap-2"><TextInput accessibilityLabel="Renomear lista" value={renameText} onChangeText={setRenameText} onSubmitEditing={() => { if (renameText.trim()) renameList(selectedList.id, renameText.trim()); setRenaming(false); }} returnKeyType="done" placeholder="Nome da lista" placeholderTextColor={theme.muted} style={[inputStyle, { flex: 1 }]} /><Action theme={theme} onPress={() => { if (renameText.trim()) renameList(selectedList.id, renameText.trim()); setRenaming(false); }}>Salvar</Action><Action theme={theme} secondary onPress={() => setRenaming(false)}>Cancelar</Action></View> : null}
      {lists.length > 1 && selectedList && confirmDeleteList ? <View className="mt-2"><View className="flex-row flex-wrap items-center gap-2"><Body theme={theme}>Excluir “{selectedList.name}” e suas tarefas?</Body><Action theme={theme} danger onPress={() => { const remaining = lists.find((list) => list.id !== selectedList.id); removeList(selectedList.id); if (remaining) setSelectedListId(remaining.id); setConfirmDeleteList(false); }}>Excluir lista</Action><Action theme={theme} secondary onPress={() => setConfirmDeleteList(false)}>Cancelar</Action></View></View> : null}
    </Panel>
    <Panel theme={theme}><View className="flex-row gap-2"><TextInput accessibilityLabel="Nova tarefa" value={text} onChangeText={setText} placeholder={selectedList ? `Adicionar tarefa em ${selectedList.name}` : "Escreva uma tarefa"} placeholderTextColor={theme.muted} onSubmitEditing={createTodo} returnKeyType="done" style={[inputStyle, { flex: 1 }]} /><Action theme={theme} icon="plus" onPress={createTodo}>Adicionar</Action></View>
      <View className="mb-3 mt-5"><SectionTitle theme={theme}>{selectedList?.name ?? "Tarefas"}</SectionTitle></View>
      {pendingTodos.length ? renderTodoRows(pendingTodos) : <View className="items-center py-7"><AppIcon name={completed ? "check" : "tasks"} size={26} color={theme.primary} /><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="mt-1 font-bold">{completed ? "Tudo concluído" : "Lista vazia"}</Text><Body theme={theme}>{completed ? "As tarefas concluídas estão recolhidas abaixo." : "Adicione a primeira tarefa desta lista."}</Body></View>}
      {listTodos.length ? <View className="mt-2"><Small theme={theme}>{pendingTodos.length} pendente{pendingTodos.length === 1 ? "" : "s"} · salvas neste dispositivo</Small></View> : null}
    </Panel>
    {completedTodos.length ? <Panel theme={theme}><View className="flex-row items-center gap-2"><Pressable accessibilityRole="button" accessibilityState={{ expanded: showCompleted }} onPress={() => setShowCompleted((value) => !value)} className="min-h-8 flex-1 flex-row items-center gap-2"><SectionTitle theme={theme}>Concluídas</SectionTitle><View className="px-2 py-0.5" style={{ backgroundColor: theme.primary, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><Text style={{ color: theme.background, fontFamily: fontFamily(theme.font) }} className="text-[9px] font-bold">{completedTodos.length}</Text></View><AppIcon name={showCompleted ? "chevronUp" : "chevronDown"} size={17} color={theme.primary} /></Pressable><LinkText theme={theme} onPress={() => { if (selectedList) uncheckCompleted(selectedList.id); }}>Desmarcar todas</LinkText></View>{showCompleted ? <View className="mt-2"><View className="mb-1 flex-row justify-end"><LinkText theme={theme} onPress={() => { if (selectedList) clearCompleted(selectedList.id); }}>Limpar concluídas</LinkText></View>{renderTodoRows(completedTodos)}</View> : null}</Panel> : null}
  </KeyboardAwareScrollView>;
}
