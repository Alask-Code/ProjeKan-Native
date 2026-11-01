import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ProjectStatus = "unstarted" | "progress" | "finished" | "continuous" | "warning" | "archived";
export type ProjectPropertyType = "text" | "number" | "date" | "select" | "checkbox" | "url" | "releases";
export type Release = { id: string; version: string; date: string; url: string; changelogUrl: string };
export type ProjectProperty = { id: string; name: string; type: ProjectPropertyType; value: string | number | boolean | Release[]; options?: string[] };
export type Project = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  category: "unstarted" | "in-development" | "finished" | "active" | "inactive" | "warning";
  priority: "Baixa" | "Média" | "Alta";
  owner: string;
  createdAt: number;
  updatedAt?: number;
  dueDate?: string;
  repositoryUrl?: string;
  softwareDocumentDesignUrl?: string;
  notes?: string;
  logo?: string | number;
  backgroundImage?: string | number;
  properties?: ProjectProperty[];
  sortOrder?: number;
  taskListId?: string;
};
export type ProjectDraft = Omit<Project, "id" | "createdAt" | "updatedAt">;

type Store = {
  projects: Project[];
  hiddenColumns: ProjectStatus[];
  setHiddenColumns: (update: ProjectStatus[] | ((current: ProjectStatus[]) => ProjectStatus[])) => void;
  addProject: (project: ProjectDraft) => void;
  updateProject: (id: number, updates: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  clearAllProjects: () => void;
  importProjects: (projects: Project[]) => void;
  moveProject: (id: number, status: ProjectStatus) => void;
  moveProjectToPosition: (id: number, status: ProjectStatus, index: number) => void;
};

const useNativeProjects = create<Store>()(persist((set, get) => ({
  projects: [],
  hiddenColumns: [],
  setHiddenColumns: (update) => set((state) => ({ hiddenColumns: typeof update === "function" ? update(state.hiddenColumns) : update })),
  addProject: (project) => {
    const id = Math.max(0, ...get().projects.map((item) => item.id)) + 1;
    const createdAt = Date.now();
    set((state) => ({ projects: [{ ...project, id, createdAt, updatedAt: createdAt }, ...state.projects] }));
  },
  updateProject: (id, updates) => set((state) => ({ projects: state.projects.map((project) => project.id === id ? { ...project, ...updates, updatedAt: Date.now() } : project) })),
  deleteProject: (id) => set((state) => ({ projects: state.projects.filter((project) => project.id !== id) })),
  clearAllProjects: () => set({ projects: [] }),
  importProjects: (projects) => set({ projects }),
  moveProject: (id, status) => set((state) => ({ projects: state.projects.map((project) => project.id === id ? { ...project, status } : project) })),
  moveProjectToPosition: (id, status, index) => set((state) => {
    const moving = state.projects.find((project) => project.id === id);
    if (!moving) return {};
    const sourceStatus = moving.status ?? "unstarted";
    const fallbackOrder = new Map(state.projects.map((project, order) => [project.id, order]));
    const sortItems = (items: Project[]) => items.sort((a, b) => (a.sortOrder ?? fallbackOrder.get(a.id) ?? 0) - (b.sortOrder ?? fallbackOrder.get(b.id) ?? 0));
    const sourceItems = sortItems(state.projects.filter((project) => (project.status ?? "unstarted") === sourceStatus && project.id !== id));
    const destinationItems = sourceStatus === status
      ? sourceItems
      : sortItems(state.projects.filter((project) => (project.status ?? "unstarted") === status));
    destinationItems.splice(Math.max(0, Math.min(index, destinationItems.length)), 0, { ...moving, status });
    const orderById = new Map(destinationItems.map((project, order) => [project.id, order]));
    const sourceOrderById = sourceStatus === status ? orderById : new Map(sourceItems.map((project, order) => [project.id, order]));
    return { projects: state.projects.map((project) => {
      if (project.id === id || (project.status ?? "unstarted") === status) return { ...project, status: project.id === id ? status : project.status, sortOrder: orderById.get(project.id) };
      if (sourceStatus !== status && (project.status ?? "unstarted") === sourceStatus) return { ...project, sortOrder: sourceOrderById.get(project.id) };
      return project;
    }) };
  }),
}), {
  name: "projekan-projects-native",
  storage: createJSONStorage(() => AsyncStorage),
  version: 6,
  migrate: (persisted: any) => {
    const projects: Project[] = Array.isArray(persisted?.projects)
      ? persisted.projects.map(({ isTemplate: _isTemplate, ...project }: Project & { isTemplate?: boolean }) => project)
      : [];
    const validStatuses: ProjectStatus[] = ["unstarted", "progress", "finished", "continuous", "warning", "archived"];
    const hiddenColumns = Array.isArray(persisted?.hiddenColumns) ? persisted.hiddenColumns.filter((status: unknown): status is ProjectStatus => validStatuses.includes(status as ProjectStatus)) : [];
    return { ...persisted, projects, hiddenColumns };
  },
}));

export default useNativeProjects;
