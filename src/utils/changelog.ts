export type ReleaseNoteCategory = { name: string; notes: string[] };
export type ReleaseNotes = { version: string; categories: ReleaseNoteCategory[] };

export function parseChangelog(markdown: string): ReleaseNotes[] {
  const sections: ReleaseNotes[] = [];
  let currentCategory: ReleaseNoteCategory | null = null;
  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^##\s+\[([^\]]+)\]/);
    if (heading) {
      sections.push({ version: heading[1], categories: [] });
      currentCategory = null;
      continue;
    }
    const categoryHeading = line.match(/^###\s+(.+)/);
    if (categoryHeading && sections.length) {
      currentCategory = { name: categoryHeading[1].trim(), notes: [] };
      sections[sections.length - 1].categories.push(currentCategory);
      continue;
    }
    const bullet = line.match(/^\s*[-*]\s+(.+)/);
    if (bullet && currentCategory) currentCategory.notes.push(bullet[1].trim());
  }
  return sections;
}
