// build_meta.mjs — derive every count the public files state from the data itself, and write it in.
// Run after any data change: node scripts/build_meta.mjs   (prints what it wrote; CITATION.cff, README.md and manifest.json are
// never typed by hand — a stale number in any of them is a wrong citation).
import fs from "node:fs"; import path from "node:path"; import crypto from "node:crypto"; import { fileURLToPath } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), ".."); const dp = f => path.join(root, "data", f);
const read = f => JSON.parse(fs.readFileSync(dp(f), "utf8"));
const T = read("topics.json").topics, D = read("dependencies.json").dependencies, W = read("walks.json").walks, C = read("clusters.json").clusters, F = read("frameworks.json").frameworks, M = read("manifest.json");
const count = (arr, key) => arr.reduce((o, x) => { const k = key(x); o[k] = (o[k] || 0) + 1; return o; }, {});
const n = {
  topics: T.length, bridgeTopics: T.filter(t => t.bridge).length, dependencies: D.length, hardEdges: D.filter(d => d.strength === "hard").length,
  clusters: C.length, frameworks: F.length, standardsAssignments: T.reduce((s, t) => s + (t.standards || []).length, 0), walks: W.length,
  unescoCodes: new Set(T.flatMap(t => (t.standards || []).filter(s => s.startsWith("unesco-aicfs:")))).size,
  ageMin: Math.min(...T.map(t => t.ageRangeStart)), ageMax: Math.max(...T.map(t => t.ageRangeEnd)), strands: new Set(T.map(t => t.subject)).size,
};
const bySubject = count(T, t => t.subject), byStance = count(T, t => t.stance), byType = count(T, t => t.type), byEpistemic = count(T.filter(t => t.card && t.card.epistemic), t => t.card.epistemic);
const version = M.version, released = M.generated;
// manifest — counts, breakdowns, checksums
Object.assign(M, { counts: { topics: n.topics, bridgeTopics: n.bridgeTopics, dependencies: n.dependencies, hardEdges: n.hardEdges, clusters: n.clusters, frameworks: n.frameworks, standardsAssignments: n.standardsAssignments, walks: n.walks }, bySubject, byStance, byType, byEpistemic });
for (const f of Object.keys(M.checksums || {})) M.checksums[f] = crypto.createHash("sha256").update(fs.readFileSync(dp(f))).digest("hex");
fs.writeFileSync(dp("manifest.json"), JSON.stringify(M, null, 2) + "\n");
// CITATION.cff — version, date, abstract numbers, both licences
let cff = fs.readFileSync(path.join(root, "CITATION.cff"), "utf8");
cff = cff.replace(/^version: .*$/m, `version: ${version}`).replace(/^date-released: .*$/m, `date-released: ${released}`)
  .replace(/\(ages \d+-\d+\): \d+ micro-topics, \d+ reasoned prerequisite/, `(ages ${n.ageMin}-${n.ageMax}): ${n.topics} micro-topics, ${n.dependencies} reasoned prerequisite`)
  .replace(/^license: .*$/m, `license:\n  - "ODbL-1.0"\n  - "CC-BY-SA-4.0"`).replace(/^license:\n  - "ODbL-1.0"\n  - "CC-BY-SA-4.0"\n  - "ODbL-1.0"\n  - "CC-BY-SA-4.0"$/m, `license:\n  - "ODbL-1.0"\n  - "CC-BY-SA-4.0"`);
fs.writeFileSync(path.join(root, "CITATION.cff"), cff);
// README — the header line, the bullets, the stance sentence, the strand table, the code count
let md = fs.readFileSync(path.join(root, "README.md"), "utf8");
md = md.replace(/\*\*Version:\*\* `[^`]+` · \*\*Topics:\*\* \d+ · \*\*Prerequisite edges:\*\* \d+ · \*\*Ages:\*\* [\d–-]+ · \*\*Strands:\*\* \d+/, `**Version:** \`${version}\` · **Topics:** ${n.topics} · **Prerequisite edges:** ${n.dependencies} · **Ages:** ${n.ageMin}–${n.ageMax} · **Strands:** ${n.strands}`)
  .replace(/- \*\*\d+ micro-topics\*\*/, `- **${n.topics} micro-topics**`).replace(/- \*\*\d+ prerequisite edges\*\*/, `- **${n.dependencies} prerequisite edges**`)
  .replace(/— \d+ bridge topics adapted/, `— ${n.bridgeTopics} bridge topics adapted`)
  .replace(/UNESCO AI Competency Framework for Students \(\d+ curricular-goal codes\)/, `UNESCO AI Competency Framework for Students (${n.unescoCodes} curricular-goal codes in use)`)
  .replace(/This one publishes its bias honestly: \d+ factual topics, \d+ positional ones, each marked\./, `This one publishes its bias honestly: ${byStance.FACTUAL} factual topics, ${byStance.POSITIONAL} positional ones, each marked.`)
  .replace(/\| Strand \| Topics \|\n\|---\|---:\|\n(?:\|[^\n]+\|\n)+/, `| Strand | Topics |\n|---|---:|\n` + Object.entries(bySubject).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join("\n") + "\n")
  .replace(/- \d+ on-ramp topics adapt text/, `- ${n.bridgeTopics} on-ramp topics adapt text`);
fs.writeFileSync(path.join(root, "README.md"), md);
console.log(JSON.stringify({ version, released, ...n, byStance, byEpistemic, bySubject }, null, 1));
