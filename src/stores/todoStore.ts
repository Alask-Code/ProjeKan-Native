import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TodoItem {
  id: number;
  listId: string;
  text: string;
  done: boolean;
  createdAt: number;
}
export interface TodoList { id: string; name: string; }
interface TodoStore {
  lists: TodoList[];
  todos: TodoItem[];
  addList: (name: string) => string;
  renameList: (id: string, name: string) => void;
  removeList: (id: string) => void;
  addTodo: (listId: string, text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  clearCompleted: (listId: string) => void;
  uncheckCompleted: (listId: string) => void;
  clearAllTodos: () => void;
  importTodos: (lists: TodoList[], todos: TodoItem[]) => void;
}
const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      lists: [{ id: 'default', name: 'Minha lista' }],
      todos: [],
      addList: (name) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set((state) => ({ lists: [...state.lists, { id, name }] }));
        return id;
      },
      renameList: (id, name) => set((state) => ({ lists: state.lists.map((list) => list.id === id ? { ...list, name } : list) })),
      removeList: (id) => set((state) => state.lists.length <= 1 ? {} : ({ lists: state.lists.filter((list) => list.id !== id), todos: state.todos.filter((todo) => todo.listId !== id) })),
      addTodo: (listId, text) =>
        set((state) => ({ todos: [{ id: Date.now(), listId, text, done: false, createdAt: Date.now() }, ...state.todos] })),
      toggleTodo: (id) =>
        set((state) => ({ todos: state.todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)) })),
      removeTodo: (id) => set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) })),
      clearCompleted: (listId) => set((state) => ({ todos: state.todos.filter((todo) => todo.listId !== listId || !todo.done) })),
      uncheckCompleted: (listId) => set((state) => ({ todos: state.todos.map((todo) => todo.listId === listId && todo.done ? { ...todo, done: false } : todo) })),
      clearAllTodos: () => set({ lists: [], todos: [] }),
      importTodos: (lists, todos) => set({ lists: lists.length ? lists : [{ id: 'default', name: 'Minha lista' }], todos })
    }),
    {
      name: 'projekan-todos',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persisted: any) => {
        const todos = Array.isArray(persisted?.todos) ? persisted.todos : [];
        return {
          ...persisted,
          lists: Array.isArray(persisted?.lists) && persisted.lists.length ? persisted.lists : [{ id: 'default', name: 'Minha lista' }],
          todos: todos.map((todo: TodoItem) => ({ ...todo, listId: todo.listId ?? 'default' })),
        };
      },
    }
  )
);
export default useTodoStore;
