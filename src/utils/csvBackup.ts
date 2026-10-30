import type { Project } from "../stores/nativeProjectStore";
import type { TodoItem, TodoList } from "../stores/todoStore";

export type BackupData = { projects: Project[]; lists: TodoList[]; todos: TodoItem[] };
const csvCell = (value: string) => `"${value.replaceAll('"', '""')}"`;

export function createBackupCsv(data: BackupData): string {
  const rows: [string, unknown][] = [
    ...data.projects.map((item) => ["project", item] as [string, unknown]),
    ...data.lists.map((item) => ["list", item] as [string, unknown]),
    ...data.todos.map((item) => ["todo", item] as [string, unknown]),
  ];
  return ["tipo,dados", ...rows.map(([type, value]) => `${csvCell(type)},${csvCell(JSON.stringify(value))}`)].join("\r\n");
}

function parseCsvRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i];
    if (quoted && char === '"' && csv[i + 1] === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && csv[i + 1] === "\n") i += 1;
      row.push(cell); if (row.some((part) => part.trim())) rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error("CSV inválido: há uma aspa sem fechamento.");
  row.push(cell); if (row.some((part) => part.trim())) rows.push(row);
  return rows;
}

export function parseBackupCsv(csv: string): BackupData {
  const rows = parseCsvRows(csv.trim());
  if (rows[0]?.[0]?.replace(/^\uFEFF/, "").trim().toLowerCase() !== "tipo" || rows[0]?.[1]?.trim().toLowerCase() !== "dados") {
    throw new Error("Cabeçalho inválido. Use um CSV exportado pelo ProjeKan (tipo,dados).");
  }
  const result: BackupData = { projects: [], lists: [], todos: [] };
  for (const [type, json] of rows.slice(1)) {
    let value: unknown;
    try { value = JSON.parse(json); } catch { throw new Error(`Não foi possível ler um registro CSV (${type || "sem tipo"}).`); }
    if (type === "project" && value && typeof value === "object" && typeof (value as Project).id === "number" && typeof (value as Project).name === "string") result.projects.push(value as Project);
    else if (type === "list" && value && typeof value === "object" && typeof (value as TodoList).id === "string" && typeof (value as TodoList).name === "string") result.lists.push(value as TodoList);
    else if (type === "todo" && value && typeof value === "object" && typeof (value as TodoItem).id === "number" && typeof (value as TodoItem).text === "string" && typeof (value as TodoItem).listId === "string") result.todos.push(value as TodoItem);
    else throw new Error(`Registro inválido no CSV: ${type || "sem tipo"}.`);
  }
  return result;
}
