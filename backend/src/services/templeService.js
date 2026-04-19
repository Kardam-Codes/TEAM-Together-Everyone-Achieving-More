// OWNER - KARDAM
// PURPOSE - Manage temple and corridor metadata (Somnath is data-backed; others can be added as offline placeholders).

const fs = require("fs");
const path = require("path");
const {
  store,
  ensureSomnathTemple,
  createTemple,
  createCorridor,
  listCorridorsByTemple,
} = require("../store/inMemoryStore");

function resolveDatasetPath() {
  return path.resolve(__dirname, "..", "..", "..", "dataset");
}

function loadManifest() {
  const datasetDir = resolveDatasetPath();
  const manifestPath = path.join(datasetDir, "table_manifest.json");
  const raw = fs.readFileSync(manifestPath, "utf8");
  return JSON.parse(raw);
}

function ensureSomnathCorridorsFromManifest() {
  ensureSomnathTemple();
  const manifest = loadManifest();

  for (const entry of manifest) {
    const tableName = entry.table_name;
    const existing = store.corridors.find((c) => c.templeId === "somnath" && c.tableName === tableName);
    if (existing) {
      existing.offline = false;
      if (!existing.label) existing.label = entry.cctv_camera_location || tableName;
      if (entry.roles) existing.roles = entry.roles;
      continue;
    }
    
    createCorridor({
      templeId: "somnath",
      tableName,
      label: entry.cctv_camera_location || tableName,
      offline: false,
      roles: entry.roles || [],
    });
  }
}

function getTemplesWithCorridors() {
  ensureSomnathTemple();
  return store.temples.map((t) => ({
    ...t,
    corridors: listCorridorsByTemple(t.id),
  }));
}

function addTemple({ name }) {
  ensureSomnathTemple();
  return createTemple({ name });
}

function addCorridor(templeId, { tableName, label, mapPosition }) {
  ensureSomnathTemple();
  const temple = store.temples.find((t) => t.id === templeId);
  if (!temple) throw new Error("Temple not found");

  return createCorridor({
    templeId,
    tableName,
    label,
    mapPosition,
    offline: true,
  });
}

function getCorridorByTableName({ templeId = "somnath", tableName }) {
  return store.corridors.find((c) => c.templeId === templeId && c.tableName === tableName) || null;
}

module.exports = {
  ensureSomnathCorridorsFromManifest,
  getTemplesWithCorridors,
  addTemple,
  addCorridor,
  getCorridorByTableName,
};

