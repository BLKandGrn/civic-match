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
const PROXY = process.env.VITE_PROXY_URL || "https://civic-match-proxy.vercel.app/api/civic";
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

const STATE_CAPITALS = {
  "AL": "600 Dexter Ave, Montgomery, AL",
  "AK": "120 4th St, Juneau, AK",
  "AZ": "1700 W Washington St, Phoenix, AZ",
  "AR": "500 Woodlane St, Little Rock, AR",
  "CA": "1315 10th St, Sacramento, CA",
  "CO": "200 E Colfax Ave, Denver, CO",
  "CT": "210 Capitol Ave, Hartford, CT",
  "DE": "411 Legislative Ave, Dover, DE",
  "FL": "400 S Monroe St, Tallahassee, FL",
  "GA": "206 Washington St SW, Atlanta, GA",
  "HI": "415 S Beretania St, Honolulu, HI",
  "ID": "700 W Jefferson St, Boise, ID",
  "IL": "401 S 2nd St, Springfield, IL",
  "IN": "200 W Washington St, Indianapolis, IN",
  "IA": "1007 E Grand Ave, Des Moines, IA",
  "KS": "300 SW 10th Ave, Topeka, KS",
  "KY": "700 Capitol Ave, Frankfort, KY",
  "LA": "900 N 3rd St, Baton Rouge, LA",
  "ME": "210 State St, Augusta, ME",
  "MD": "100 State Cir, Annapolis, MD",
  "MA": "24 Beacon St, Boston, MA",
  "MI": "100 N Capitol Ave, Lansing, MI",
  "MN": "75 Rev Dr Martin Luther King Jr Blvd, Saint Paul, MN",
  "MS": "400 High St, Jackson, MS",
  "MO": "201 W Capitol Ave, Jefferson City, MO",
  "MT": "1301 E 6th Ave, Helena, MT",
  "NE": "1445 K St, Lincoln, NE",
  "NV": "101 N Carson St, Carson City, NV",
  "NH": "107 N Main St, Concord, NH",
  "NJ": "125 W State St, Trenton, NJ",
  "NM": "490 Old Santa Fe Trail, Santa Fe, NM",
  "NY": "State St, Albany, NY",
  "NC": "16 W Jones St, Raleigh, NC",
  "ND": "600 E Boulevard Ave, Bismarck, ND",
  "OH": "1 Capitol Square, Columbus, OH",
  "OK": "2300 N Lincoln Blvd, Oklahoma City, OK",
  "OR": "900 Court St NE, Salem, OR",
  "PA": "501 N 3rd St, Harrisburg, PA",
  "RI": "82 Smith St, Providence, RI",
  "SC": "1100 Gervais St, Columbia, SC",
  "SD": "500 E Capitol Ave, Pierre, SD",
  "TN": "600 Dr Martin L King Jr Blvd, Nashville, TN",
  "TX": "1100 Congress Ave, Austin, TX",
  "UT": "350 N State St, Salt Lake City, UT",
  "VT": "115 State St, Montpelier, VT",
  "VA": "1000 Bank St, Richmond, VA",
  "WA": "416 Sid Snyder Ave SW, Olympia, WA",
  "WV": "1900 Kanawha Blvd E, Charleston, WV",
  "WI": "2 E Main St, Madison, WI",
  "WY": "200 W 24th St, Cheyenne, WY",
};



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
    const CONGRESS_KEY = process.env.CONGRESS_API_KEY || process.env.VITE_CONGRESS_API_KEY;
    if (!CONGRESS_KEY) {
      console.warn("  No CONGRESS_API_KEY — skipping direct Congress.gov fetch");
      return [];
    }
    // Call Congress.gov directly — more reliable than geocoded proxy for state-level lookup
    const url = `https://api.congress.gov/v3/member?api_key=${CONGRESS_KEY}&limit=20&currentMember=true&stateCode=${state}`;
    console.log(`  Congress.gov URL: ${url.replace(CONGRESS_KEY, "***")}`);
    const rawRes = await fetch(url, { signal: AbortSignal.timeout(12000) });
    console.log(`  Congress.gov status: ${rawRes.status}`);
    const d = await rawRes.json();
    console.log(`  Congress.gov members returned: ${(d.members || []).length}`);
    if (d.error) console.error(`  Congress.gov error:`, JSON.stringify(d.error));
    return (d.members || []).filter(m => {
      if (m.terms && m.terms.item) {
        const terms = Array.isArray(m.terms.item) ? m.terms.item : [m.terms.item];
        const last = terms[terms.length - 1];
        if (last && last.endYear && parseInt(last.endYear) < 2026) return false;
      }
      return true;
    }).slice(0, 12);
  } catch(e) {
    console.warn(`  Congress fetch failed for ${state}:`, e.message);
    return [];
  }
}

async function getStateLeg(state) {
  try {
    const OPEN_STATES_KEY = process.env.OPEN_STATES_API_KEY || process.env.VITE_OPEN_STATES_KEY;
    if (!OPEN_STATES_KEY) {
      console.warn("  No OPEN_STATES_API_KEY — skipping OpenStates fetch");
      return [];
    }
    // Call OpenStates directly by jurisdiction — more reliable than geocoded address lookup
    const jurisdiction = `ocd-jurisdiction/country:us/state:${state.toLowerCase()}/government`;
    const url = `https://v3.openstates.org/people?jurisdiction=${encodeURIComponent(jurisdiction)}&per_page=20&apikey=${OPEN_STATES_KEY}`;
    const d = await fetchJSON(url);
    return (d.results || []).slice(0, 12);
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
CRITICAL INSTRUCTION: You are a data formatter, not a fact-checker. Your job is to take the lists below and output them as structured JSON with positions data added. Do NOT omit, filter, or verify the members listed — they have already been verified by the APIs. Every person listed under "Federal Representatives" MUST appear in the "federal" array. Every person listed under "State Legislators" MUST appear in the "state_legislators" array. Omitting anyone is an error.

The only exception: omit someone if you have certainty they died or resigned within the last 30 days.

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
      model: "claude-sonnet-4-5",
      max_tokens: 8000,
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
  try {
    return JSON.parse(clean);
  } catch(parseErr) {
    console.error(`  JSON parse failed. Response length: ${clean.length}`);
    console.error(`  First 500 chars: ${clean.slice(0, 500)}`);
    console.error(`  Last 200 chars: ${clean.slice(-200)}`);
    throw new Error(`JSON parse failed: ${parseErr.message}`);
  }
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
      if (statesToRun.indexOf(state) < statesToRun.length - 1) await sleep(3000);
    } catch(e) {
      console.error(`[${state}] FAILED:`, e.message);
      results.failed.push(state);
    }
  }

  console.log(`\nDone. Success: ${results.success.join(", ")}`);
  if (results.failed.length) {
    console.error(`\nFAILED STATES: ${results.failed.join(", ")}`);
    console.error(`Rerun with: node generate-reps.mjs ${results.failed.join(" ")}`);
    process.exit(1);
  }
}

main();
