const fs = require("fs");
const path = require("path");

const repoRoot = __dirname;
const defaultOutput = "repo_for_ai.txt";
const defaultIncludeExtensions = new Set([
  ".py",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".md",
  ".txt",
  ".csv",
  ".html",
  ".css",
  ".yml",
  ".yaml",
  ".env",
  ".mmd",
  ".sh",
  ".ps1",
]);
const defaultExcludedDirs = new Set([
  ".git",
  ".idea",
  ".vscode",
  "__pycache__",
  "node_modules",
  "dist",
  "build",
  ".vite",
  ".next",
  ".venv",
  "venv",
  "env",
]);
const maxFileBytesDefault = 300000;

function parseArgs(argv) {
  const args = {
    output: defaultOutput,
    maxBytes: maxFileBytesDefault,
    includeAllText: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "-o" || arg === "--output") {
      args.output = argv[index + 1] || args.output;
      index += 1;
    } else if (arg === "--max-bytes") {
      args.maxBytes = Number(argv[index + 1] || args.maxBytes);
      index += 1;
    } else if (arg === "--include-all-text") {
      args.includeAllText = true;
    }
  }

  return args;
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function isExcludedDir(relativePath) {
  return relativePath.split(path.sep).some((part) => defaultExcludedDirs.has(part));
}

function isProbablyText(filePath) {
  try {
    const chunk = fs.readFileSync(filePath).subarray(0, 4096);
    if (chunk.includes(0)) {
      return false;
    }
    new TextDecoder("utf-8", { fatal: true }).decode(chunk);
    return true;
  } catch {
    return false;
  }
}

function shouldIncludeFile(filePath, maxBytes, includeAllText, outputName) {
  const relativePath = path.relative(repoRoot, filePath);
  const stats = fs.statSync(filePath);
  const extension = path.extname(filePath).toLowerCase();

  if (!stats.isFile()) {
    return false;
  }
  if (path.basename(filePath) === outputName) {
    return false;
  }
  if (isExcludedDir(relativePath)) {
    return false;
  }
  if (stats.size > maxBytes) {
    return false;
  }
  if (defaultIncludeExtensions.has(extension)) {
    return true;
  }

  return includeAllText && isProbablyText(filePath);
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(filePath, files);
    } else {
      files.push(filePath);
    }
  }
  return files;
}

function gatherFiles(maxBytes, includeAllText, outputName) {
  return walk(repoRoot)
    .filter((filePath) => shouldIncludeFile(filePath, maxBytes, includeAllText, outputName))
    .sort((a, b) => toPosix(path.relative(repoRoot, a)).localeCompare(toPosix(path.relative(repoRoot, b))));
}

function languageHint(filePath) {
  const mapping = {
    ".py": "python",
    ".js": "javascript",
    ".jsx": "jsx",
    ".ts": "typescript",
    ".tsx": "tsx",
    ".json": "json",
    ".md": "markdown",
    ".txt": "text",
    ".csv": "csv",
    ".html": "html",
    ".css": "css",
    ".yml": "yaml",
    ".yaml": "yaml",
    ".mmd": "mermaid",
    ".sh": "bash",
    ".ps1": "powershell",
  };
  return mapping[path.extname(filePath).toLowerCase()] || "text";
}

function makeRepoSummary(files) {
  const extensions = new Map();
  const topLevel = new Map();

  for (const filePath of files) {
    const relativePath = path.relative(repoRoot, filePath);
    const extension = path.extname(filePath).toLowerCase() || "[no extension]";
    const top = relativePath.split(path.sep)[0] || ".";
    extensions.set(extension, (extensions.get(extension) || 0) + 1);
    topLevel.set(top, (topLevel.get(top) || 0) + 1);
  }

  const extensionLines = [...extensions.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([extension, count]) => `- ${extension}: ${count}`)
    .join("\n");
  const topLevelLines = [...topLevel.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => `- ${name}: ${count} files`)
    .join("\n");

  return [
    "# Repository Export For AI",
    "",
    "This file contains a structured export of the repository for use by an AI agent.",
    "It includes a file manifest and the full contents of included text files.",
    "",
    `Repository root: ${repoRoot}`,
    `Included files: ${files.length}`,
    "",
    "## Top-Level Coverage",
    topLevelLines,
    "",
    "## Extension Breakdown",
    extensionLines,
  ].join("\n");
}

function buildManifest(files) {
  return ["## File Manifest", ...files.map((filePath) => `- ${toPosix(path.relative(repoRoot, filePath))}`)].join("\n");
}

function buildFileSections(files) {
  const sections = ["## File Contents"];
  for (const filePath of files) {
    const relativePath = toPosix(path.relative(repoRoot, filePath));
    const content = fs.readFileSync(filePath, "utf8").replace(/\s+$/u, "");
    sections.push(`\n### FILE: ${relativePath}\n`);
    sections.push(`\`\`\`${languageHint(filePath)}`);
    sections.push(content);
    sections.push("```");
  }
  return sections.join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const outputPath = path.join(repoRoot, args.output);
  const files = gatherFiles(args.maxBytes, args.includeAllText, path.basename(outputPath));
  const content = [makeRepoSummary(files), buildManifest(files), buildFileSections(files)].join("\n\n");

  fs.writeFileSync(outputPath, content, "utf8");
  console.log(`Wrote AI export to: ${outputPath}`);
  console.log(`Included files: ${files.length}`);
}

main();
