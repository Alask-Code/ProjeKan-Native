import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logoImage from "../assets/logo.jpg";
import backgroundImage from "../assets/bkgImage.png";

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
  isTemplate?: boolean;
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
  removeTemplateProjects: () => void;
  moveProject: (id: number, status: ProjectStatus) => void;
  moveProjectToPosition: (id: number, status: ProjectStatus, index: number) => void;
};

const now = Date.now();
const starterProjects: Project[] = [
  { id: 1, name: "Outland's Edge", description: "Survive the division, fight for freedom.", status: "progress", category: "in-development", priority: "Alta", owner: "Equipe", createdAt: now, logo: logoImage, backgroundImage, notes: "" },
  { id: 2, name: "Novo projeto", description: "Organize as primeiras entregas e defina os próximos passos.", status: "unstarted", category: "unstarted", priority: "Média", owner: "", createdAt: now, logo: logoImage, backgroundImage, notes: "" },
];
const demoProjectDetails: { name: string; description: string; status: ProjectStatus; priority: Project["priority"] }[] = [
  { name: "Portal do cliente", description: "Centralizar solicitações, documentos e atualizações dos clientes.", status: "unstarted", priority: "Alta" },
  { name: "Revisão do onboarding", description: "Simplificar os primeiros passos para novas pessoas usuárias.", status: "unstarted", priority: "Média" },
  { name: "Biblioteca de componentes", description: "Documentar padrões visuais e componentes reutilizáveis.", status: "unstarted", priority: "Baixa" },
  { name: "Pesquisa de satisfação", description: "Preparar entrevistas e questionário para clientes ativos.", status: "unstarted", priority: "Média" },
  { name: "Aplicativo mobile", description: "Implementar navegação e estrutura principal do aplicativo.", status: "progress", priority: "Alta" },
  { name: "Painel de métricas", description: "Criar indicadores de uso e desempenho do produto.", status: "progress", priority: "Alta" },
  { name: "Integração de pagamentos", description: "Conectar o fluxo de cobrança ao provedor escolhido.", status: "progress", priority: "Média" },
  { name: "Área de documentação", description: "Organizar guias técnicos e instruções de uso.", status: "progress", priority: "Baixa" },
  { name: "Atualização visual", description: "Aplicar a nova identidade nas telas principais.", status: "finished", priority: "Média" },
  { name: "Correções de acessibilidade", description: "Aprimorar rótulos, contraste e navegação por teclado.", status: "finished", priority: "Alta" },
  { name: "Importação de dados", description: "Validar e concluir a migração dos dados legados.", status: "finished", priority: "Baixa" },
  { name: "Monitoramento da plataforma", description: "Acompanhar disponibilidade e indicadores de operação.", status: "continuous", priority: "Alta" },
  { name: "Conteúdo para redes", description: "Planejar publicações e manter o calendário atualizado.", status: "continuous", priority: "Média" },
  { name: "Atendimento ao cliente", description: "Responder dúvidas e acompanhar solicitações abertas.", status: "continuous", priority: "Média" },
  { name: "Site da campanha antiga", description: "Página substituída pela nova campanha institucional.", status: "archived", priority: "Baixa" },
  { name: "Protótipo de relatórios", description: "Experimento arquivado após validação com a equipe.", status: "archived", priority: "Baixa" },
  { name: "Migração do fórum", description: "Discussão encerrada após adoção do canal de suporte.", status: "archived", priority: "Média" },
  { name: "Falha no envio de e-mails", description: "Investigar aumento de mensagens que não chegam ao destino.", status: "warning", priority: "Alta" },
  { name: "Certificado do domínio", description: "Renovação próxima do vencimento; verificar configuração.", status: "warning", priority: "Alta" },
  { name: "Atraso na revisão jurídica", description: "Aguardando retorno para liberar os termos atualizados.", status: "warning", priority: "Média" },
];
function createDemoProjects(firstId: number): Project[] {
  return demoProjectDetails.map((detail, index) => ({
    ...detail,
    isTemplate: true,
    id: firstId + index,
    category: detail.status === "finished" ? "finished" : detail.status === "unstarted" ? "unstarted" : detail.status === "warning" ? "warning" : detail.status === "archived" ? "inactive" : "in-development",
    owner: "Equipe",
    createdAt: now - (index + 1) * 86400000,
    notes: "",
  }));
}
const templateProjectNames = new Set([...starterProjects.map((project) => project.name), ...demoProjectDetails.map((project) => project.name)]);
const initialProjects: Project[] = [...starterProjects.map((project) => ({ ...project, isTemplate: true })), ...createDemoProjects(3)];

const useNativeProjects = create<Store>()(persist((set, get) => ({
  projects: initialProjects,
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
  removeTemplateProjects: () => set((state) => ({ projects: state.projects.filter((project) => !project.isTemplate) })),
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
  version: 3,
  migrate: (persisted: any) => {
    const projects = Array.isArray(persisted?.projects) ? persisted.projects as Project[] : starterProjects;
    const validStatuses: ProjectStatus[] = ["unstarted", "progress", "finished", "continuous", "warning", "archived"];
    const hiddenColumns = Array.isArray(persisted?.hiddenColumns) ? persisted.hiddenColumns.filter((status: unknown): status is ProjectStatus => validStatuses.includes(status as ProjectStatus)) : [];
    const markedProjects = projects.map((project) => ({ ...project, isTemplate: project.isTemplate ?? templateProjectNames.has(project.name) }));
    if (markedProjects.some((project) => project.isTemplate)) return { ...persisted, projects: markedProjects, hiddenColumns };
    const firstId = Math.max(0, ...projects.map((project) => project.id)) + 1;
    return { ...persisted, projects: [...markedProjects, ...createDemoProjects(firstId)], hiddenColumns };
  },
}));

export default useNativeProjects;
