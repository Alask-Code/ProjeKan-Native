const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const changelog = fs.readFileSync(path.join(root, "CHANGELOG.md"), "utf8");
const output = `// Generated from CHANGELOG.md by scripts/sync-changelog.cjs.\nexport const CHANGELOG_MARKDOWN = ${JSON.stringify(changelog)};\n`;
fs.writeFileSync(path.join(root, "src/constants/changelog.generated.ts"), output, "utf8");
