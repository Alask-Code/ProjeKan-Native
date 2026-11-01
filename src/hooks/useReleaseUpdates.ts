import { useState } from "react";

const LATEST_RELEASE_API = "https://api.github.com/repos/Alask-Code/ProjeKan-Native/releases/latest";
const LATEST_RELEASE_PAGE = "https://github.com/Alask-Code/ProjeKan-Native/releases/latest";

type UpdateResult = { kind: "current" | "available" | "error"; message: string; url?: string };

function parseVersion(version: string) {
  const core = version.trim().replace(/^v/i, "").split(/[+-]/)[0];
  const parts = core.split(".").map((part) => Number(part));
  return parts.length >= 2 && parts.length <= 3 && parts.every(Number.isInteger) ? [...parts, 0].slice(0, 3) : null;
}

function compareVersions(left: string, right: string) {
  const a = parseVersion(left);
  const b = parseVersion(right);
  if (!a || !b) return null;
  for (let index = 0; index < 3; index += 1) {
    if (a[index] > b[index]) return 1;
    if (a[index] < b[index]) return -1;
  }
  return 0;
}

export function useReleaseUpdates(currentVersion: string) {
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateResult | null>(null);

  const checkForUpdates = async () => {
    setCheckingUpdates(true);
    setUpdateResult(null);
    try {
      const response = await fetch(LATEST_RELEASE_API, { headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" } });
      if (!response.ok) throw new Error(`GitHub respondeu ${response.status}`);
      const release = await response.json() as { tag_name?: string; name?: string; html_url?: string };
      const latestVersion = release.tag_name ?? release.name;
      if (!latestVersion) throw new Error("A release não contém uma versão.");
      const comparison = compareVersions(currentVersion, latestVersion);
      if (comparison === null) throw new Error("Não foi possível interpretar o número da versão.");
      if (comparison < 0) {
        setUpdateResult({ kind: "available", message: `Nova versão disponível: ${latestVersion} (instalada: ${currentVersion}).`, url: release.html_url ?? LATEST_RELEASE_PAGE });
      } else {
        setUpdateResult({ kind: "current", message: comparison === 0 ? `Você está usando a versão mais recente (${currentVersion}).` : `A versão instalada (${currentVersion}) é mais nova que a última release publicada (${latestVersion}).` });
      }
    } catch {
      setUpdateResult({ kind: "error", message: "Não foi possível consultar as releases do GitHub. Verifique sua conexão e tente novamente." });
    } finally {
      setCheckingUpdates(false);
    }
  };

  return { checkingUpdates, updateResult, checkForUpdates };
}
