import { ProjectStatus, ProjectPropertyType } from "../stores/nativeProjectStore";
import { ThemeSettings } from "../stores/themeStore";

export type Route = "/" | "/overview" | "/backlog" | "/todo" | "/theme-editor";

export const navigation: { path: Route; label: string; icon: "board" | "overview" | "backlog" | "tasks" }[] = [
  { path: "/", label: "Quadro", icon: "board" },
  { path: "/overview", label: "Visão geral", icon: "overview" },
  { path: "/backlog", label: "Backlog", icon: "backlog" },
  { path: "/todo", label: "Tarefas", icon: "tasks" },
];

export const columns: { key: ProjectStatus; label: string; color: string }[] = [
  { key: "unstarted", label: "Não iniciado", color: "#929c96" },
  { key: "progress", label: "Em progresso", color: "#d2a33d" },
  { key: "finished", label: "Finalizado", color: "#43a77f" },
  { key: "continuous", label: "Contínuo", color: "#658cca" },
  { key: "archived", label: "Arquivados", color: "#69726e" },
  { key: "warning", label: "Atenção", color: "#d26f67" },
];

export const colors: { key: keyof ThemeSettings; label: string }[] = [
  { key: "primary", label: "Cor principal" }, { key: "background", label: "Fundo da aplicação" },
  { key: "surface", label: "Superfícies e cartões" }, { key: "raised", label: "Elementos elevados" },
  { key: "text", label: "Texto principal" }, { key: "muted", label: "Texto secundário" },
  { key: "border", label: "Bordas" }, { key: "danger", label: "Ações de atenção" },
  { key: "success", label: "Estados positivos" }, { key: "warning", label: "Estados de alerta" },
  { key: "info", label: "Informações" },
];

export const fonts = ["monospace", "system-ui, sans-serif", "Arial, sans-serif", "Verdana, sans-serif", "Georgia, serif", '"Courier New", monospace', "Archivo", "Inter", "Rajdhani", "Press Start 2P"];

export const propertyTypes: { key: ProjectPropertyType; label: string }[] = [
  { key: "text", label: "Texto" }, { key: "number", label: "Número" }, { key: "date", label: "Data" },
  { key: "select", label: "Seleção" }, { key: "checkbox", label: "Caixa de seleção" }, { key: "url", label: "URL" }, { key: "releases", label: "Releases" },
];
