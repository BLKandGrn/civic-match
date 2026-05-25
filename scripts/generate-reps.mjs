// generate-reps.mjs
// Run: node generate-reps.mjs
// Generates one JSON file per state in public/data/
// Uses Congress.gov API for federal members + OpenStates for state legislators
// Then calls Claude once per state to enrich with positions + voting record summaries

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "data");
const PROXY = process.env.VITE_PROXY_URL || "https://civic-match-proxy.vercel.app/api/proxy";
const ANTH_KEY = process.env.VITE_ANTHROPIC_API_KEY;

if (!ANTH_KEY) {
  console.error("ERROR: VITE_ANTHROPIC_API_KEY not set");
  process.exit(1);
}

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

const ISSUES = [
  "Environmental Protection","Police Accountability","Criminal Justice Reform",
  "Progressive Taxation","Cannabis Policy","Fresh Food Access","Data Center Regulation",
  "Small Business Funding","Reproductive Health Rights","LGBTQ+ Rights","Public School Funding"
];


async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchJSON(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.json();
}

async function getCongressMembers(state) {
  try {
    const d = await fetchJSON(`${PROXY}?endpoint=congress-members&state=${state}`);
    return (d.members || []).filter(m => {
      if (!m.state || m.state.toUpperCase() !== state) return false;
      if (m.terms && m.terms.item) {
        const terms = Array.isArray(m.terms.item) ? m.terms.item : [m.terms.item];
        const last = terms[terms.length - 1];
        if (last && last.endYear && parseInt(last.endYear) < 2026) return false;
      }
      return true;
    }).slice(0, 8);
  } catch(e) {
    console.warn(`  Congress fetch failed for ${state}:`, e.message);
    return [];
  }
}

async function getStateLeg(state) {
  try {
    const d = await fetchJSON(`${PROXY}?endpoint=state-legislators&address=${encodeURIComponent(`${state}, USA`)}`);
    return (d.results || []).slice(0, 10);
  } catch(e) {
    console.warn(`  OpenStates fetch failed for ${state}:`, e.message);
    return [];
  }
}

async function enrichWithClaude(state, members, stateLeg) {
  const partyAbbr = p => (p === "Democrat" || p === "Democratic") ? "D" : p === "Republican" ? "R" : "N";

  const membersStr = members.length
    ? members.map(m => `- ${m.name} (${partyAbbr(m.partyName)}, ${m.chamber || "Congress"}${m.district ? ", District " + m.district : ""})`).join("\n")
    : "No federal member data available.";

  const stateStr = stateLeg.length
    ? stateLeg.map(l => `- ${l.name} (${partyAbbr(l.party)}, ${l.current_role?.chamber || "State Legislature"}, District ${l.current_role?.district || "?"})`).join("\n")
    : "No state legislator data available.";

  const prompt = `You are a nonpartisan civic data generator. Today is May 2026.

PARTY FORMAT RULE: Always use (D), (R), or (N) — never spell out party names.
DATA ACCURACY — CRITICAL: The input lists above may contain stale or incorrect data. You must independently verify each official against your knowledge before including them.

INCLUSION RULES — include an official only if ALL of the following are true:
1. They are confirmed to be currently serving in the listed role as of ${new Date().toISOString().slice(0,7)} (year-month).
2. Their most recent term began on or before today and has not yet ended.
3. They hold the specific role listed (Senate, House, State Legislature) — not a role they previously held.

EXCLUSION RULES — omit an official if ANY of the following are true:
- Their term ended or they resigned before the current date, regardless of whether the API listed them.
- They were appointed or elected to a different role and no longer hold this one.
- You have any uncertainty about whether they are currently serving — when in doubt, leave them out.
- They are a local/county/school-board official — this list covers only federal and state legislators.

Do not add any official not present in the input lists above.

State: ${state}

Federal Representatives provided by Congress.gov API:
${membersStr}

State Legislators provided by OpenStates API:
${stateStr}

Issues to cover: ${ISSUES.join(", ")}

For EACH representative listed above, generate a JSON object with their known positions and voting record on the issues above. Use only verified public information — voting records, bill sponsorships, official statements.

For each issue where you have verified data:
- Set "stance" to support, oppose, mixed, or unclear
- Populate "voted_for" with specific bills/actions they supported (with source and date)
- Populate "voted_against" with specific bills/actions they actively opposed or voted against (with source and date)
- Use empty arrays [] when no verified data exists for that direction
- Omit the issue entirely only if you have zero verified information on it

Return ONLY valid JSON in this exact shape, no markdown, no explanation:
{
  "state": "${state}",
  "generated": "${new Date().toISOString().slice(0,10)}",
  "federal": [
    {
      "name": "Full Name",
      "party": "D|R|N",
      "chamber": "Senate|House",
      "district": "number or null",
      "phone": "official .gov phone",
      "website": "official .gov website",
      "twitter": "handle or null",
      "instagram": "handle or null",
      "positions": {
        "Environmental Protection": {
          "stance": "support|oppose|mixed|unclear",
          "summary": "One sentence factual summary of their position",
          "voted_for": ["Bill or action they supported, with citation (Source, date)"],
          "voted_against": ["Bill or action they opposed, with citation (Source, date)"]
        }
      }
    }
  ],
  "state_legislators": [
    {
      "name": "Full Name",
      "party": "D|R|N",
      "chamber": "Senate|House",
      "district": "number or null",
      "phone": "official phone or null",
      "website": "official website or null",
      "twitter": "handle or null",
      "instagram": "handle or null",
      "positions": {
        "Public School Funding": {
          "stance": "support|oppose|mixed|unclear",
          "summary": "One sentence factual summary",
          "voted_for": ["Bill or action they supported, with citation (Source, date)"],
          "voted_against": ["Bill or action they opposed, with citation (Source, date)"]
        }
      }
    }
  ]
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": ANTH_KEY
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20251022",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(`Claude API ${res.status}: ${e.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const text = data.content.find(b => b.type === "text")?.text || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function generateState(state) {
  console.log(`\n[${state}] Fetching data...`);
  const [members, stateLeg] = await Promise.all([
    getCongressMembers(state),
    getStateLeg(state)
  ]);
  console.log(`[${state}] ${members.length} federal, ${stateLeg.length} state legislators`);
  console.log(`[${state}] Calling Claude...`);
  const enriched = await enrichWithClaude(state, members, stateLeg);
  const outPath = path.join(OUT_DIR, `reps-${state}.json`);
  fs.writeFileSync(outPath, JSON.stringify(enriched, null, 2));
  console.log(`[${state}] Saved to ${outPath}`);
  return enriched;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const args = process.argv.slice(2);
  const statesToRun = args.length ? args.map(s => s.toUpperCase()) : STATES;

  console.log(`Generating static rep data for: ${statesToRun.join(", ")}`);
  console.log(`Output directory: ${OUT_DIR}`);

  const results = { success: [], failed: [] };

  for (const state of statesToRun) {
    try {
      await generateState(state);
      results.success.push(state);
      // Rate limit — 1 call per 2 seconds
      if (statesToRun.indexOf(state) < statesToRun.length - 1) await sleep(2000);
    } catch(e) {
      console.error(`[${state}] FAILED:`, e.message);
      results.failed.push(state);
    }
  }

  console.log(`\nDone. Success: ${results.success.join(", ")}`);
  if (results.failed.length) console.log(`Failed: ${results.failed.join(", ")} — rerun with: node generate-reps.mjs ${results.failed.join(" ")}`);
}

main();
