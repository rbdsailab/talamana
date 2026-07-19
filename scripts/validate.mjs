// Design-AI Literacy Taxonomy — integrity validator. No dependencies. Run: node scripts/validate.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = f => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));
const errs = [], warns = [];

const T = read("topics.json"), D = read("dependencies.json"),
      C = read("clusters.json"), F = read("frameworks.json"), M = read("manifest.json");
const topics = T.topics, deps = D.dependencies, clusters = C.clusters;
const byId = new Map(topics.map(t => [t.id, t]));

// --- topics ---
const TYPES = ["CONCEPTUAL","PROCEDURAL","REPRESENTATIONAL","LANGUAGE","META","JUDGMENT"];
const SUBJECTS = ["Foundations","Generative Mechanics","The Brief","Judgment","Ethics & Provenance","Studio Practice"];
const seen = new Set();
for (const t of topics) {
  const w = m => errs.push(`topic ${t.id}: ${m}`);
  if (!/^dt_[a-z0-9-]+$/.test(t.id)) w("bad id");
  if (seen.has(t.id)) w("duplicate id"); seen.add(t.id);
  if (!TYPES.includes(t.type)) w("bad type " + t.type);
  if (!SUBJECTS.includes(t.subject)) w("bad subject " + t.subject);
  if (!t.name || !t.description || t.description.length < 20) w("missing/short name or description");
  if (!(t.ageRangeStart >= 11 && t.ageRangeEnd <= 22 && t.ageRangeStart <= t.ageRangeEnd)) w("bad age range");
  if (!(t.centrality >= 0 && t.centrality <= 1)) w("bad centrality");
  if (!Array.isArray(t.evidence) || t.evidence.length < 2) w("needs >=2 evidence criteria");
  if (!t.critPrompt || t.critPrompt.length < 10) w("missing critPrompt");
  if (t.stance === "FACTUAL") { if ((t.grounding||[]).length < 2) w("FACTUAL requires >=2 grounding anchors"); }
  else if (t.stance === "POSITIONAL") { if ((t.grounding||[]).length < 1) w("POSITIONAL requires >=1 grounding anchor"); }
  else w("missing/bad stance");
  if (t.bridge && !t.attribution) w("bridge topic missing attribution");
  for (const s of (t.standards || []))
    if (!F.frameworks.some(fw => s.startsWith(fw.keyPrefix))) w("standards key has no framework: " + s);
}

// --- dependencies ---
const eSeen = new Set();
for (const e of deps) {
  const w = m => errs.push(`edge ${e.prerequisiteId} -> ${e.topicId}: ${m}`);
  if (!byId.has(e.topicId)) w("unknown topicId");
  if (!byId.has(e.prerequisiteId)) w("unknown prerequisiteId");
  if (e.topicId === e.prerequisiteId) w("self-loop");
  if (!["hard","soft"].includes(e.strength)) w("bad strength");
  if (!e.reason || e.reason.length < 10) w("missing reason");
  const k = e.topicId + "|" + e.prerequisiteId;
  if (eSeen.has(k)) w("duplicate edge"); eSeen.add(k);
  const p = byId.get(e.prerequisiteId), c = byId.get(e.topicId);
  if (p && c && p.ageRangeStart > c.ageRangeEnd) warns.push(`age inversion: ${p.id}(${p.ageRangeStart}) prereq of ${c.id}(<=${c.ageRangeEnd})`);
}

// --- acyclicity ---
const adj = new Map();
for (const e of deps) { if (!adj.has(e.prerequisiteId)) adj.set(e.prerequisiteId, []); adj.get(e.prerequisiteId).push(e.topicId); }
const state = new Map();
function dfs(n) {
  state.set(n, 1);
  for (const m of (adj.get(n) || [])) {
    if (state.get(m) === 1) { errs.push("CYCLE detected through " + m); return true; }
    if (!state.has(m) && dfs(m)) return true;
  }
  state.set(n, 2); return false;
}
for (const id of byId.keys()) if (!state.has(id) && dfs(id)) break;

// --- clusters cover every topic exactly once ---
const covered = new Map();
for (const c of clusters) for (const id of c.topicIds) {
  if (!byId.has(id)) errs.push(`cluster "${c.name}": unknown topic ${id}`);
  covered.set(id, (covered.get(id) || 0) + 1);
}
for (const id of byId.keys()) {
  const n = covered.get(id) || 0;
  if (n === 0) errs.push(`topic ${id} not in any cluster`);
  if (n > 1) errs.push(`topic ${id} in ${n} clusters`);
}

// --- manifest counts + checksums ---
if (M.counts.topics !== topics.length) errs.push(`manifest topics ${M.counts.topics} != ${topics.length}`);
if (M.counts.dependencies !== deps.length) errs.push(`manifest dependencies ${M.counts.dependencies} != ${deps.length}`);
if (M.counts.clusters !== clusters.length) errs.push(`manifest clusters ${M.counts.clusters} != ${clusters.length}`);
for (const [file, sha] of Object.entries(M.checksums || {})) {
  const actual = crypto.createHash("sha256").update(fs.readFileSync(path.join(root, "data", file))).digest("hex");
  if (actual !== sha) errs.push(`checksum mismatch: ${file}`);
}

// --- report ---
const hard = deps.filter(e => e.strength === "hard").length;
const stances = {}; topics.forEach(t => stances[t.stance] = (stances[t.stance] || 0) + 1);
console.log(`topics: ${topics.length} (${topics.filter(t=>t.bridge).length} bridge) · edges: ${deps.length} (${hard} hard / ${deps.length - hard} soft) · clusters: ${clusters.length} · frameworks: ${F.frameworks.length}`);
console.log(`stance: ${JSON.stringify(stances)}`);
warns.forEach(w => console.log("⚠ " + w));
if (errs.length) { console.error(`\n✗ ${errs.length} error(s):`); errs.forEach(e => console.error("  " + e)); process.exit(1); }
console.log(`\n✓ VALID — schema rules, referential integrity, acyclic, stance/grounding rules, cluster coverage, checksums OK${warns.length ? ` (${warns.length} warning[s])` : ""}`);
