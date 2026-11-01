import type { Project } from "../stores/nativeProjectStore";
import type { TodoItem, TodoList } from "../stores/todoStore";

export type BackupData = { projects: Project[]; lists: TodoList[]; todos: TodoItem[] };

const seedPrefix = "PROJEKAN1-";
const base64UrlAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function utf8Bytes(value: string): number[] {
  const encoded = encodeURIComponent(value);
  const bytes: number[] = [];
  for (let index = 0; index < encoded.length; index += 1) {
    if (encoded[index] === "%") {
      bytes.push(Number.parseInt(encoded.slice(index + 1, index + 3), 16));
      index += 2;
    } else {
      bytes.push(encoded.charCodeAt(index));
    }
  }
  return bytes;
}

function encodeBase64Url(bytes: number[]): string {
  let encoded = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const second = bytes[index + 1];
    const third = bytes[index + 2];
    encoded += base64UrlAlphabet[first >> 2];
    encoded += base64UrlAlphabet[((first & 3) << 4) | ((second ?? 0) >> 4)];
    if (second !== undefined) encoded += base64UrlAlphabet[((second & 15) << 2) | ((third ?? 0) >> 6)];
    if (third !== undefined) encoded += base64UrlAlphabet[third & 63];
  }
  return encoded;
}

function decodeBase64Url(encoded: string): number[] {
  if (!encoded || encoded.length % 4 === 1 || /[^A-Za-z0-9_-]/.test(encoded)) {
    throw new Error("O formato da seed não é válido.");
  }
  const bytes: number[] = [];
  for (let index = 0; index < encoded.length; index += 4) {
    const first = base64UrlAlphabet.indexOf(encoded[index]);
    const second = base64UrlAlphabet.indexOf(encoded[index + 1]);
    const third = encoded[index + 2] === undefined ? -1 : base64UrlAlphabet.indexOf(encoded[index + 2]);
    const fourth = encoded[index + 3] === undefined ? -1 : base64UrlAlphabet.indexOf(encoded[index + 3]);
    bytes.push((first << 2) | (second >> 4));
    if (third >= 0) bytes.push(((second & 15) << 4) | (third >> 2));
    if (fourth >= 0) bytes.push(((third & 3) << 6) | fourth);
  }
  return bytes;
}

function decodeUtf8(bytes: number[]): string {
  const encoded = bytes.map((byte) => `%${byte.toString(16).padStart(2, "0")}`).join("");
  try {
    return decodeURIComponent(encoded);
  } catch {
    throw new Error("A seed contém texto inválido ou corrompido.");
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseBackupData(value: unknown): BackupData {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.projects) || !Array.isArray(value.lists) || !Array.isArray(value.todos)) {
    throw new Error("Esta seed não contém um backup ProjeKan compatível.");
  }
  const projects = value.projects;
  const lists = value.lists;
  const todos = value.todos;
  if (!projects.every((item) => isRecord(item) && typeof item.id === "number" && typeof item.name === "string")) {
    throw new Error("A seed contém um projeto inválido.");
  }
  if (!lists.every((item) => isRecord(item) && typeof item.id === "string" && typeof item.name === "string")) {
    throw new Error("A seed contém uma lista inválida.");
  }
  if (!todos.every((item) => isRecord(item) && typeof item.id === "number" && typeof item.text === "string" && typeof item.listId === "string")) {
    throw new Error("A seed contém uma tarefa inválida.");
  }
  return {
    projects: projects as Project[],
    lists: lists as TodoList[],
    todos: todos as TodoItem[],
  };
}

export function createDataSeed(data: BackupData): string {
  const payload = JSON.stringify({ version: 1, ...data });
  return `${seedPrefix}${encodeBase64Url(utf8Bytes(payload))}`;
}

export function parseDataSeed(seed: string): BackupData {
  const normalizedSeed = seed.trim();
  if (!normalizedSeed.startsWith(seedPrefix)) {
    throw new Error("Seed inválida. Use uma seed gerada pelo ProjeKan.");
  }
  const payload = decodeUtf8(decodeBase64Url(normalizedSeed.slice(seedPrefix.length)));
  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(payload) as unknown;
  } catch {
    throw new Error("Não foi possível ler os dados desta seed.");
  }
  return parseBackupData(parsedPayload);
}
