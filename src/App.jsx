import { useState, useRef, useEffect } from "react";

const FF_SYNE = "'Syne',sans-serif";
const FF_NEWS = "'Newsreader',Georgia,serif";
const FF_NEWS2 = "'Newsreader',serif";


const ISSUES = [
  { id: "environment", label: "Environmental Protection", desc: "Climate policy, emissions, green energy, conservation" },
  { id: "police_brutality", label: "Police Accountability", desc: "Oversight, use-of-force reform, civilian review boards" },
  { id: "prison_cop_policy", label: "Criminal Justice Reform", desc: "Sentencing, prison conditions, policing standards" },
  { id: "taxes_high_earners", label: "Progressive Taxation", desc: "Higher rates for incomes above $500K/year" },
  { id: "cannabis_incarceration", label: "Cannabis Policy", desc: "Decriminalization, expungement, legalization" },
  { id: "food_waste", label: "Fresh Food Waste", desc: "Food access, redistribution policy, waste reduction" },
  { id: "data_centers", label: "Data Center Regulation", desc: "Energy use, zoning, community impact, water usage" },
  { id: "small_business", label: "Small Business Funding", desc: "Grants, loans, tax incentives for independent businesses" },
  { id: "public_schools", label: "Public School Funding", desc: "Education equity, teacher pay, resource allocation" },
  { id: "reproductive_health", label: "Reproductive Health Rights", desc: "Abortion access, contraception, maternal healthcare" },
  { id: "lgbtq_rights", label: "LGBTQ+ Rights", desc: "Anti-discrimination protections, trans rights, marriage equality" },
];

const PL = { 3: "Top Priority", 2: "Matters to Me", 1: "Somewhat Important", 0: "Not a Focus" };
const PC = { 3: "#445B3E", 2: "#7AC8F9", 1: "#F9C87A", 0: "#3a3a3a" };
const STEPS = ["welcome", "address", "registration", "results"];
const PROXY = "https://civic-match-proxy.vercel.app/api/civic";

const KW = {
  environment: ["climate","environment","emission","carbon","clean energy","solar","wind","EPA","pollution"],
  police_brutality: ["police","law enforcement","use of force","accountability","qualified immunity","misconduct"],
  prison_cop_policy: ["criminal justice","sentencing","incarceration","prison","mandatory minimum","reentry"],
  taxes_high_earners: ["tax","income tax","wealth","millionaire","billionaire","progressive tax","revenue"],
  cannabis_incarceration: ["cannabis","marijuana","drug","decriminalization","expungement","scheduling"],
  food_waste: ["food waste","food bank","hunger","nutrition","SNAP","food access","food security"],
  data_centers: ["data center","artificial intelligence","AI","energy consumption","technology","broadband"],
  small_business: ["small business","entrepreneur","SBA","loan","grant","startup"],
  public_schools: ["education","school","teacher","student","public school","curriculum","Title I"],
  reproductive_health: ["abortion","reproductive","contraception","maternal","women's health","family planning"],
  lgbtq_rights: ["LGBTQ","transgender","gay","lesbian","same-sex","marriage equality","gender identity"],
};

const REGS = {
  AL:"https://www.alabamavotes.gov/",AK:"https://voterregistration.alaska.gov/",AZ:"https://voter.az.gov/",
  AR:"https://www.sos.arkansas.gov/elections/voter-information/",CA:"https://registertovote.ca.gov/",
  CO:"https://www.sos.state.co.us/voter/",CT:"https://voterregistration.ct.gov/",DE:"https://ivote.de.gov/",
  FL:"https://registertovoteflorida.gov/",GA:"https://mvp.sos.ga.gov/",HI:"https://olvr.hawaii.gov/",
  ID:"https://sos.idaho.gov/elections-division/voter-registration/",IL:"https://www.vote.org/state/illinois/",
  IN:"https://indianavoters.in.gov/",IA:"https://mymvd.iowadot.gov/Account/Login",
  KS:"https://www.kdor.ks.gov/Apps/VoterReg/",KY:"https://vrsws.sos.ky.gov/ovrweb/",
  LA:"https://voterportal.sos.la.gov/",ME:"https://www.maine.gov/sos/cec/elec/voter-info/voterguide.html",
  MD:"https://voterservices.elections.maryland.gov/OnlineVoterRegistration/",
  MA:"https://www.sec.state.ma.us/OVR/",MI:"https://mvic.sos.state.mi.us/",
  MN:"https://mnvotes.sos.state.mn.us/",MS:"https://www.sos.ms.gov/elections-voting/voter-registration-information",
  MO:"https://www.sos.mo.gov/elections/goVoteMissouri/",MT:"https://app.mt.gov/voterinfo/",
  NE:"https://www.nebraska.gov/apps-sos-voter-registration/",NV:"https://www.nvsos.gov/sosvoterservices/",
  NH:"https://www.sos.nh.gov/elections/voters/register-vote",NJ:"https://voter.svrs.nj.gov/register",
  NM:"https://portal.sos.state.nm.us/OVR/",NY:"https://voterreg.dmv.ny.gov/MotorVoter/",
  NC:"https://www.ncsbe.gov/registering/how-register",ND:"https://vip.sos.nd.gov/",
  OH:"https://www.ohiosos.gov/elections/voters/register/",
  OK:"https://www.ok.gov/elections/Voter_Info/Register_to_Vote/",
  OR:"https://sos.oregon.gov/voting/Pages/register.aspx",PA:"https://www.vote.pa.gov/Register-to-Vote/",
  RI:"https://vote.sos.ri.gov/",SC:"https://www.scvotes.gov/",
  SD:"https://sdsos.gov/elections-voting/voting/register-to-vote/",TN:"https://ovr.govote.tn.gov/",
  TX:"https://www.sos.state.tx.us/elections/voter/",UT:"https://vote.utah.gov/",
  VT:"https://olvr.vermont.gov/",VA:"https://www.elections.virginia.gov/registration/",
  WA:"https://voter.votewa.gov/",WV:"https://ovr.govottawa.wv.gov/",WI:"https://myvote.wi.gov/",
  WY:"https://sos.wyo.gov/Elections/Docs/WYVoterReg.pdf",DC:"https://www.vote4dc.com/",
};

const REG_STEPS = {
  MD: { check: "https://voterservices.elections.maryland.gov/VoterSearch", register: "https://voterservices.elections.maryland.gov/OnlineVoterRegistration/", deadline: "15 days before election", method: "Online, by mail, or in person at your local board of elections" },
  VA: { check: "https://vote.elections.virginia.gov/VoterInformation", register: "https://www.elections.virginia.gov/registration/", deadline: "15 days before election", method: "Online at elections.virginia.gov or in person at DMV or registrar" },
  DC: { check: "https://www.vote4dc.com/", register: "https://www.vote4dc.com/", deadline: "21 days before election (can register same day at polls)", method: "Online, by mail, or in person at any early voting center" },
  CA: { check: "https://voterstatus.sos.ca.gov/", register: "https://registertovote.ca.gov/", deadline: "15 days before election (same-day conditional available)", method: "Online at registertovote.ca.gov or at your county elections office" },
  NY: { check: "https://voterlookup.elections.ny.gov/", register: "https://voterreg.dmv.ny.gov/MotorVoter/", deadline: "25 days before election", method: "Online via DMV, by mail, or in person at your county board of elections" },
  TX: { check: "https://teamrv-mvp.sos.texas.gov/MVP/mvp.do", register: "https://www.sos.state.tx.us/elections/voter/", deadline: "30 days before election", method: "By mail or in person at your county tax assessor-collector office. No online registration." },
  FL: { check: "https://registration.elections.myflorida.com/CheckVoterStatus", register: "https://registertovoteflorida.gov/", deadline: "29 days before election", method: "Online at registertovoteflorida.gov, by mail, or at a driver license office" },
  GA: { check: "https://mvp.sos.ga.gov/", register: "https://mvp.sos.ga.gov/", deadline: "28 days before election", method: "Online at mvp.sos.ga.gov, by mail, or in person at county registrar" },
  PA: { check: "https://www.pavoterservices.pa.gov/Pages/voterregistrationstatus.aspx", register: "https://www.vote.pa.gov/Register-to-Vote/", deadline: "15 days before election", method: "Online, by mail, or in person at your county election office or PennDOT" },
  IL: { check: "https://ova.elections.il.gov/", register: "https://ova.elections.il.gov/", deadline: "28 days before election (grace period registration available)", method: "Online, by mail, or in person. Grace period allows registration up to and on Election Day." },
  OH: { check: "https://voterlookup.ohiosos.gov/voterlookup.aspx", register: "https://www.ohiosos.gov/elections/voters/register/", deadline: "30 days before election", method: "Online via Ohio BMV, by mail, or in person at county board of elections" },
  MI: { check: "https://mvic.sos.state.mi.us/Voter/Index", register: "https://mvic.sos.state.mi.us/", deadline: "Same-day registration available at your clerk's office", method: "Online, by mail, or in person. Michigan allows same-day voter registration." },
  NC: { check: "https://vt.ncsbe.gov/RegLkup/", register: "https://www.ncsbe.gov/registering/how-register", deadline: "25 days before election (same-day at early voting sites)", method: "Online, by mail, or in person. Same-day registration available at early voting sites." },
  WA: { check: "https://voter.votewa.gov/", register: "https://voter.votewa.gov/", deadline: "8 days before election (online/mail) or same-day in person", method: "Online, by mail, or in person at your county auditor. All-mail state." },
  CO: { check: "https://www.sos.state.co.us/voter/pages/pub/olvr/verifyNewVoter.xhtml", register: "https://www.sos.state.co.us/voter/", deadline: "8 days before election (same-day available)", method: "Online, by mail, or in person. Colorado is an all-mail voting state." },
  AZ: { check: "https://my.arizona.vote/", register: "https://voter.az.gov/", deadline: "29 days before election", method: "Online at ServiceArizona.com, by mail, or in person at your county recorder" },
  MN: { check: "https://mnvotes.sos.state.mn.us/", register: "https://mnvotes.sos.state.mn.us/", deadline: "Same-day registration available at your polling place", method: "Online, by mail, or in person. Minnesota allows same-day voter registration." },
  WI: { check: "https://myvote.wi.gov/", register: "https://myvote.wi.gov/", deadline: "20 days before election (same-day at clerk's office)", method: "Online at myvote.wi.gov, by mail, or in person at your municipal clerk" },
  NJ: { check: "https://voter.svrs.nj.gov/registration-check", register: "https://voter.svrs.nj.gov/register", deadline: "21 days before election", method: "Online, by mail, or in person at your county clerk or any MVC agency" },
  MA: { check: "https://www.sec.state.ma.us/VoterRegistrationSearch/MyVoterRegStatus.aspx", register: "https://www.sec.state.ma.us/OVR/", deadline: "10 days before election", method: "Online, by mail, or in person at your city or town clerk" },
};

const DEFAULT_REG = { check: null, register: null, deadline: "varies by state", method: "Visit your state's official election website for registration options" };

function scoreCandidate(votes) {
  const scores = {};
  ISSUES.forEach(function(i) { scores[i.id] = { hits: 0, total: 0 }; });
  (votes || []).forEach(function(vote) {
    const title = (vote.bill ? vote.bill.title || "" : vote.description || "").toLowerCase();
    ISSUES.forEach(function(issue) {
      const kws = KW[issue.id] || [];
      if (kws.some(function(kw) { return title.indexOf(kw.toLowerCase()) >= 0; })) {
        scores[issue.id].total++;
        if (["Yea","Yes","Aye"].indexOf(vote.memberVoted) >= 0) scores[issue.id].hits++;
      }
    });
  });
  return scores;
}

const STATE_ELECTION_SITES = {
    "AK": "https://elections.alaska.gov",
    "AL": "https://www.sos.alabama.gov/alabama-votes",
    "AR": "https://www.sos.arkansas.gov/elections",
    "AZ": "https://azsos.gov/elections",
    "CA": "https://www.sos.ca.gov/elections",
    "CO": "https://www.coloradosos.gov/voter/pages/pub/home.xhtml",
    "CT": "https://portal.ct.gov/SOTS/Election-Services/Election-Services-Home-Page",
    "DC": "https://www.dcboe.org",
    "DE": "https://elections.delaware.gov",
    "FL": "https://dos.fl.gov/elections",
    "GA": "https://sos.ga.gov/page/elections-division",
    "HI": "https://elections.hawaii.gov",
    "IA": "https://sos.iowa.gov/elections",
    "ID": "https://sos.idaho.gov/elections-division",
    "IL": "https://www.elections.il.gov",
    "IN": "https://www.in.gov/sos/elections",
    "KS": "https://www.sos.ks.gov/elections",
    "KY": "https://elect.ky.gov",
    "LA": "https://www.sos.la.gov/ElectionsAndVoting",
    "MA": "https://www.sec.state.ma.us/ele",
    "MD": "https://elections.maryland.gov",
    "ME": "https://www.maine.gov/sos/cec/elec",
    "MI": "https://mvic.sos.state.mi.us",
    "MN": "https://www.sos.state.mn.us/elections-voting",
    "MO": "https://www.sos.mo.gov/elections",
    "MS": "https://www.sos.ms.gov/elections-voting",
    "MT": "https://sosmt.gov/elections",
    "NC": "https://www.ncsbe.gov",
    "ND": "https://vip.sos.nd.gov",
    "NE": "https://sos.nebraska.gov/elections",
    "NH": "https://sos.nh.gov/elections",
    "NJ": "https://www.njelections.org",
    "NM": "https://www.sos.nm.gov/voting-and-elections",
    "NV": "https://www.nvsos.gov/sos/elections",
    "NY": "https://www.elections.ny.gov",
    "OH": "https://www.ohiosos.gov/elections",
    "OK": "https://www.ok.gov/elections",
    "OR": "https://sos.oregon.gov/voting",
    "PA": "https://www.vote.pa.gov",
    "RI": "https://vote.sos.ri.gov",
    "SC": "https://www.scvotes.gov",
    "SD": "https://sdsos.gov/elections-voting",
    "TN": "https://sos.tn.gov/elections",
    "TX": "https://www.sos.state.tx.us/elections",
    "UT": "https://vote.utah.gov",
    "VA": "https://www.elections.virginia.gov",
    "VT": "https://sos.vermont.gov/elections",
    "WA": "https://www.sos.wa.gov/elections",
    "WI": "https://elections.wi.gov",
    "WV": "https://sos.wv.gov/elections",
    "WY": "https://sos.wyo.gov/elections",
  };

  function parseSections(text) {
  const sections = [];
  let cur = null;
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.indexOf("## ") === 0) {
      if (cur) sections.push(cur);
      cur = { heading: line.slice(3), body: [] };
    } else {
      if (!cur) cur = { heading: null, body: [] };
      cur.body.push(line);
    }
  }
  if (cur) sections.push(cur);
  return sections.filter(function(s) { return s.heading; });
}

function renderLine(line, i, photos, usedPhotoUrls, sectionHeading) {
  if (!usedPhotoUrls) usedPhotoUrls = new Set();
  const noPhotosSection = sectionHeading === "Resources" || sectionHeading === "Election Reminders" || sectionHeading === "Upcoming Ballot";
  const t = line.trim();
  if (!t) return <br key={i} />;
  if (t.indexOf("Note:") === 0 || t.indexOf("Note (") === 0) return null;
  if (t.indexOf("### ") === 0) {
    return <div key={i} style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#445B3E", marginTop:"8px", marginBottom:"4px" }}>{t.slice(4)}</div>;
  }

  // Style inline citations — anything in parentheses that looks like a citation
  function billUrl(inner) {
    // Federal bills
    var hrMatch = inner.match(/H\.?R\.?\s*(\d+)/i);
    var sMatch = inner.match(/(?:^|\s)S\.\s*(\d+)/i);
    var sbMatch = inner.match(/SB\s*(\d+)/i);
    var hbMatch = inner.match(/HB\s*(\d+)/i);
    var execMatch = inner.match(/Executive Order/i);
    var resMatch = inner.match(/(?:Resolution|Res\.)\s*([A-Z]{0,3}-?\d+)/i);
    if (hrMatch) return "https://www.congress.gov/search?q=" + encodeURIComponent("H.R." + hrMatch[1]);
    if (sMatch) return "https://www.congress.gov/search?q=" + encodeURIComponent("S." + sMatch[1]);
    if (sbMatch) return "https://openstates.org/search/?query=" + encodeURIComponent("SB " + sbMatch[1]);
    if (hbMatch) return "https://openstates.org/search/?query=" + encodeURIComponent("HB " + hbMatch[1]);
    if (resMatch) return "https://openstates.org/search/?query=" + encodeURIComponent(resMatch[0]);
    if (execMatch) return "https://www.federalregister.gov/presidential-documents/executive-orders";
    return null;
  }

  function styleCitations(text) {
    return text
      .replace(/(https?:\/\/[^\s<)]+)/g, function(url) {
        const display = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color:#445B3E;text-decoration:underline;word-break:break-all;">' + display + '</a>';
      })
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\(([^)]{5,})\)/g, function(match, inner) {
        if (/\d{4}|H\.?R\.|SB |HB |Act|Bill|vote|voted|statement|report|Executive|County|Office|Board|policy|initiative|law/i.test(inner)) {
          var url = billUrl(inner);
          if (url) {
            return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#445B3E;font-family:\'Syne\',sans-serif;background:#1a1a1a;padding:1px 6px;border-radius:3px;white-space:nowrap;text-decoration:underline;">(' + inner + ')</a>';
          }
          return '<a href="https://www.congress.gov/search?q=' + encodeURIComponent(inner) + '" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#888;font-family:\'Syne\',sans-serif;background:#1a1a1a;padding:1px 6px;border-radius:3px;white-space:nowrap;text-decoration:underline;">(' + inner + ')</a>';
        }
        return match;
      });
  }

  const strong = t.indexOf("**Strong Match**") >= 0;
  const partial = t.indexOf("**Partial Match**") >= 0;
  const low = t.indexOf("**Low Match**") >= 0;
  const tLower = t.toLowerCase();
  const nameKey = photos && Object.keys(photos).find(function(k) {
    if (tLower.indexOf(k.toLowerCase()) >= 0) return true;
    // Also match on last name alone (e.g. "Griffith" matches "Melony Griffith")
    const lastName = k.split(" ").pop();
    return lastName.length > 3 && tLower.indexOf(lastName.toLowerCase()) >= 0;
  });
  const photoUrl = nameKey ? photos[nameKey] : null;
  const isCandidateHeader = t.indexOf("**") === 0 && t.indexOf(" — ") >= 0;
  // Show favicon for Explore Further section
  if (noPhotosSection && isCandidateHeader) {
    const nameOnly = t.replace(/\*\*/g, "").split(" — ")[0].trim();
    // Try to extract domain from the next line or use org name
    const domains = {
      "NAACP Legal Defense Fund": "naacpldf.org",
      "Democracy Docket": "democracydocket.com",
      "Black Voters Matter": "blackvotersmatterfund.org",
      "Congress.gov": "congress.gov",
      "OpenStates": "openstates.org",
      "Ballotpedia": "ballotpedia.org",
      "Vote411": "vote411.org",
      "BallotReady": "ballotready.org",
      "USA.gov Elected Officials": "usa.gov",
    };
    const domain = domains[nameOnly];
    const faviconUrl = domain ? "https://www.google.com/s2/favicons?domain=" + domain + "&sz=32" : null;
    return (
      <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"14px", marginBottom:"2px" }}>
        {faviconUrl && <img src={faviconUrl} alt={nameOnly} style={{ width:"20px", height:"20px", borderRadius:"4px", objectFit:"contain", flexShrink:0 }} />}
        <div dangerouslySetInnerHTML={{ __html: styleCitations(t) }} />
      </div>
    );
  }
  if (photoUrl && !strong && !partial && !low && isCandidateHeader && !usedPhotoUrls.has(photoUrl) && !noPhotosSection) {
    usedPhotoUrls.add(photoUrl);
    return (
      <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", marginTop:"16px", marginBottom:"4px" }}>
        <img src={photoUrl} alt={nameKey} style={{ width:"48px", height:"48px", borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
        <span style={{ fontSize:"16px", color:"#f0f0f0", fontFamily:"FF_NEWS2", lineHeight:1.3 }} dangerouslySetInnerHTML={{ __html: styleCitations(t) }} />
      </div>
    );
  }
  if (strong || partial || low) {
    const photoUrl2 = photoUrl;
    const badge = strong ? "Strong Match" : partial ? "Partial Match" : "Low Match";
    const color = strong ? "#445B3E" : partial ? "#F9C87A" : "#ff8080";
    const rest = t.replace("**" + badge + "**", "").trim();
    return (
      <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"10px", flexWrap:"wrap", marginBottom:"4px" }}>
        {photoUrl2 ? <img src={photoUrl2} alt={nameKey} style={{ width:"40px", height:"40px", borderRadius:"50%", objectFit:"cover", flexShrink:0, marginTop:"2px" }} /> : null}
        <span style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"10px", letterSpacing:".08em", padding:"3px 8px", borderRadius:"3px", whiteSpace:"nowrap", flexShrink:0, marginTop:"2px", background:color, color:"#0e0e0e" }}>{badge}</span>
        <span dangerouslySetInnerHTML={{ __html: styleCitations(rest) }} />
      </div>
    );
  }
  if (t.indexOf("- ") === 0 || t.indexOf("* ") === 0) {
    return (
      <div key={i} style={{ display:"flex", gap:"10px", fontSize:"15px", lineHeight:1.65, color:"#ccc" }}>
        <span style={{ color:"#445B3E", flexShrink:0, marginTop:"2px", fontSize:"11px" }}>&#9672;</span>
        <span dangerouslySetInnerHTML={{ __html: styleCitations(t.slice(2)) }} />
      </div>
    );
  }
  if (t.trim() === "---" || t.trim() === "***" || t.trim() === "___") {
    return <hr key={i} style={{ border:"none", borderTop:"1px solid #333", margin:"8px 0" }} />;
  }
  if (!t.trim()) return <div key={i} style={{ height:"6px" }} />;
  return <p key={i} style={{ fontSize:"15px", lineHeight:1.7, color:"#bbb" }} dangerouslySetInnerHTML={{ __html: styleCitations(t) }} />;
}

function Tabs(props) {
  const [tab, setTab] = useState(0);
  const topRef = useRef(null);
  const secs = props.sections;
  if (!secs || !secs.length) return null;
  const cur = secs[tab];

  function changeTab(n) {
    setTab(n);
    setTimeout(function() {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  }

  return (
    <div ref={topRef}>
      <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", borderBottom:"1px solid #1e1e1e", paddingBottom:"12px" }}>
        {secs.map(function(sec, i) {
          return (
            <button key={i}
              style={{ fontFamily:FF_SYNE, fontWeight:600, fontSize:"11px", letterSpacing:".06em", padding:"6px 12px", borderRadius:"4px", background: tab === i ? "#445B3E" : "#1a1a1a", color: tab === i ? "#0e0e0e" : "#666", border: tab === i ? "1px solid #445B3E" : "1px solid #2a2a2a", cursor:"pointer" }}
              onClick={function() { changeTab(i); }}>
              {(function() {
              const nameKey = Object.keys(props.photos || {}).find(function(k) { return sec.heading.indexOf(k) >= 0; });
              return nameKey ? (
                <img src={props.photos[nameKey]} alt={nameKey}
                  style={{ width:"48px", height:"48px", borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
              ) : null;
            })()}
            {sec.heading}
            </button>
          );
        })}
      </div>
      {/* Screen view: single active tab */}
      <div className="screen-only" style={{ background:"#141414", border:"1px solid #222", borderRadius:"6px", padding:"22px", display:"flex", flexDirection:"column", gap:"14px", marginTop:"0" }}>
        <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", letterSpacing:".08em", color:"#445B3E", textTransform:"uppercase", paddingBottom:"10px", borderBottom:"1px solid #1e1e1e" }}>{cur.heading}</div>
        {cur.heading === "Upcoming Ballot" && (
          <UpcomingBallot addr={props.addr} proxy={props.proxy} />
        )}
        {cur.heading === "Election Reminders" && (
          <ElectionReminders stateCode={props.addr && props.addr.state} />
        )}
        {cur.heading === "Questions to Ask" && (
          <div style={{ background:"#111", border:"1px solid #2a2a2a", borderRadius:"6px", padding:"14px 18px", marginBottom:"4px" }}>
            <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#445B3E", marginBottom:"6px" }}>Make your voice heard in person</div>
            <div style={{ fontSize:"13px", color:"#aaa", lineHeight:1.7 }}>
              The most powerful way to create change is to show up and make noise. Research shows it only takes five calls to get a representative's attention — your representatives' phone numbers are listed in the Contact section below. Check their Instagram to find out when in-person meetings are being held. Bring this personalized question guide to your next town hall and hold your officials accountable to their actual voting record.
            </div>
          </div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {(function() { var used = new Set(); return cur.body.map(function(line, i) { return renderLine(line, i, props.photos, used, cur.heading); }); })()}
        </div>
        <div style={{ display:"flex", gap:"10px", marginTop:"8px" }}>
          {tab > 0 && (
            <button style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", padding:"10px 20px", borderRadius:"4px", background:"#1e1e1e", color:"#445B3E", border:"none", cursor:"pointer" }}
              onClick={function() { changeTab(tab - 1); }}>
              Prev
            </button>
          )}
          {tab < secs.length - 1 && (
            <button style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", padding:"10px 20px", borderRadius:"4px", background:"#445B3E", color:"#fff", border:"none", cursor:"pointer", marginLeft:"auto" }}
              onClick={function() { changeTab(tab + 1); }}>
              Next
            </button>
          )}
        </div>
      </div>
      {/* Print view: all sections expanded */}
      <div className="print-only">
        {/* Print header */}
        <div style={{ marginBottom:"24px", paddingBottom:"20px", borderBottom:"3px solid #445B3E" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"16px", marginBottom:"12px" }}>
            <div>
              <div style={{ fontFamily:"Arial Black, Arial, sans-serif", fontSize:"42px", fontWeight:900, letterSpacing:"3px", color:"#181818", lineHeight:1, marginBottom:"10px" }}>CIVIC MATCH</div>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{ fontFamily:"Arial, sans-serif", fontSize:"12px", color:"#555", letterSpacing:".04em" }}>An initiative by</span>
                <img src="/blkgrn-logo-color.png" alt="BLK + GRN" className="print-logo" style={{ height:"22px", width:"auto", display:"block" }} />
              </div>
            </div>
            <div style={{ textAlign:"right", whiteSpace:"nowrap", paddingTop:"6px" }}>
              <div style={{ fontFamily:"Arial, sans-serif", fontSize:"13px", fontWeight:"bold", color:"#181818", marginBottom:"3px" }}>{props.location || ""}</div>
              <div style={{ fontFamily:"Arial, sans-serif", fontSize:"11px", color:"#445B3E", letterSpacing:".04em" }}>Civic Match Voter Guide</div>
            </div>
          </div>
          <div style={{ fontFamily:"Arial, sans-serif", fontSize:"12px", color:"#555", lineHeight:"1.6" }}>
            A nonpartisan voter guide powered by real voting records, bill sponsorships, and public statements — not campaign ads.
          </div>
        </div>
        {secs.map(function(sec, si) {
          var isContact = sec.heading === "Contact Your Representatives";
          return (
            <div key={si} style={{ marginBottom:"24px", pageBreakInside:"avoid", border: isContact ? "2px solid #445B3E" : "none", borderRadius: isContact ? "6px" : "0", padding: isContact ? "12px 16px" : "0" }}>
              <div style={{ fontWeight:700, fontSize:"14px", textTransform:"uppercase", paddingBottom:"8px", borderBottom: isContact ? "2px solid #445B3E" : "1px solid #ccc", marginBottom:"12px", color: isContact ? "#445B3E" : "#000" }}>{sec.heading}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                {(function() { var used = new Set(); return sec.body.map(function(line, i) { return renderLine(line, i, props.photos, used, sec.heading); }); })()}
              </div>
            </div>
          );
        })}
        <div style={{ marginTop:"40px", paddingTop:"14px", borderTop:"2px solid #445B3E", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"11px", color:"#555", fontFamily:"Arial, sans-serif" }}>
          <div style={{ color:"#181818", fontWeight:"bold" }}>blkgrn.com &nbsp;|&nbsp; hello@blkgrn.com</div>
          <div>&copy; {new Date().getFullYear()} BLK + GRN. For informational purposes only.</div>
        </div>
      </div>
    </div>
  );
}

function RegCheckPanel(props) {
  const stateInfo = REG_STEPS[props.state.toUpperCase()] || DEFAULT_REG;
  const checkUrl = stateInfo.check || REGS[props.state.toUpperCase()] || "https://vote.org/am-i-registered-to-vote/";
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:"6px", padding:"20px 22px", display:"flex", flexDirection:"column", gap:"12px" }}>
        <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#445B3E", letterSpacing:".06em" }}>Check Your {props.state || "State"} Registration</div>
        <p style={{ fontSize:"14px", color:"#aaa", lineHeight:1.6 }}>Use your state's official voter lookup tool to confirm your registration is active at your current address.</p>
        <a href={checkUrl} target="_blank" rel="noopener noreferrer" style={{ background:"#445B3E", color:"#fff", fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", padding:"12px 20px", borderRadius:"4px", textDecoration:"none", alignSelf:"flex-start" }}>
          Check Registration Status
        </a>
        <p style={{ fontSize:"12px", color:"#555", lineHeight:1.6 }}>After checking, confirm your status below so we can include the right resources in your guide.</p>
      </div>
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
        <button className="cta" style={{ background:"#445B3E", color:"#fff", fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", padding:"12px 20px", borderRadius:"4px" }}
          onClick={function() { props.setRegistered(true); props.setRegStatus("confirmed"); }}>
          I am registered
        </button>
        <button className="cta" style={{ background:"#1e1e1e", color:"#445B3E", fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", padding:"12px 20px", borderRadius:"4px", border:"1px solid #2a2a2a" }}
          onClick={function() { props.setRegistered(false); props.setRegStatus("need-to-register"); }}>
          I need to register
        </button>
      </div>
    </div>
  );
}

function RegRegisterPanel(props) {
  const stateInfo = REG_STEPS[props.state.toUpperCase()] || DEFAULT_REG;
  const regUrl = stateInfo.register || REGS[props.state.toUpperCase()] || "https://vote.org/register-to-vote/";
  return (
    <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:"6px", padding:"20px 22px", display:"flex", flexDirection:"column", gap:"14px" }}>
      <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#445B3E", letterSpacing:".06em" }}>How to Register in {props.state || "Your State"}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        <div style={{ display:"flex", gap:"12px" }}>
          <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"11px", color:"#555", textTransform:"uppercase", width:"80px", flexShrink:0, paddingTop:"2px" }}>How</div>
          <div style={{ fontSize:"14px", color:"#ccc", lineHeight:1.6 }}>{stateInfo.method}</div>
        </div>
        <div style={{ display:"flex", gap:"12px" }}>
          <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"11px", color:"#555", textTransform:"uppercase", width:"80px", flexShrink:0, paddingTop:"2px" }}>Deadline</div>
          <div style={{ fontSize:"14px", color:"#ccc", lineHeight:1.6 }}>{stateInfo.deadline}</div>
        </div>
      </div>
      <a href={regUrl} target="_blank" rel="noopener noreferrer" style={{ background:"#445B3E", color:"#fff", fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", padding:"12px 20px", borderRadius:"4px", textDecoration:"none", alignSelf:"flex-start" }}>
        {"Register to Vote in " + (props.state || "Your State")}
      </a>
    </div>
  );
}

function formatFecName(raw) {
  if (!raw || raw !== raw.toUpperCase()) return raw;
  const parts = raw.split(",");
  if (parts.length < 2) return raw.split(" ").map(function(w) { return w.charAt(0) + w.slice(1).toLowerCase(); }).join(" ");
  const last = parts[0].trim().split(" ").map(function(w) { return w.charAt(0) + w.slice(1).toLowerCase(); }).join(" ");
  const first = parts[1].trim().split(" ").map(function(w) { return w.charAt(0) + w.slice(1).toLowerCase(); }).join(" ");
  return first + " " + last;
}

function CandidateCard({ c, fin, proxy }) {
  const [bio, setBio] = useState(null);
  const [bioLoading, setBioLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [wikiUrl, setWikiUrl] = useState(null);
  const displayName = formatFecName(c.name);

  // Validate Wikipedia link on mount — only show if page exists and is about this politician
  useEffect(function() {
    async function checkWiki() {
      try {
        // Use Wikipedia search API to find the right page
        const s = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(displayName + " politician") + "&format=json&origin=*&srlimit=3");
        if (!s.ok) return;
        const sd = await s.json();
        const results = (sd.query && sd.query.search) || [];
        for (const r of results) {
          // Only use if title closely matches the candidate name
          const titleLower = r.title.toLowerCase();
          const nameParts = displayName.toLowerCase().split(" ");
          const matchScore = nameParts.filter(function(p) { return p.length > 2 && titleLower.includes(p); }).length;
          if (matchScore >= 2) {
            setWikiUrl("https://en.wikipedia.org/wiki/" + encodeURIComponent(r.title.replace(/ /g, "_")));
            return;
          }
        }
      } catch(e) {}
    }
    checkWiki();
  }, [displayName]);

  function fmt(n) {
    if (!n && n !== 0) return "—";
    if (n >= 1000000) return "$" + (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return "$" + (n / 1000).toFixed(0) + "K";
    return "$" + n.toFixed(0);
  }

  async function loadBio() {
    if (bio !== null || bioLoading) { setExpanded(!expanded); return; }
    setBioLoading(true);
    setExpanded(true);
    try {
      const res = await fetch(proxy + "?endpoint=candidate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: c.name,
          office: c.office === "S" ? "U.S. Senate" : "U.S. House District " + (c.district || ""),
          state: c.state || ""
        })
      });
      const data = await res.json();
      setBio(data.text || "Limited public record. Visit their FEC profile or search their name for campaign information.");
    } catch(e) {
      setBio("Unable to load candidate information.");
    } finally {
      setBioLoading(false);
    }
  }

  const officeName = c.office === "S" ? "U.S. Senate" : "U.S. House" + (c.district ? ", District " + parseInt(c.district) : "");

  return (
    <div style={{ background:"#111", border:"1px solid #2a2a2a", borderRadius:"8px", padding:"16px 18px", display:"flex", flexDirection:"column", gap:"8px" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"12px" }}>
        <div>
          <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", color:"#f0f0f0" }}>{displayName}</div>
          <div style={{ fontSize:"12px", color:"#666", marginTop:"2px" }}>
            {c.party_full || c.party} — {officeName}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"4px", alignItems:"flex-end", flexShrink:0 }}>
          <a href={"https://www.fec.gov/data/candidate/" + c.candidate_id + "/"} target="_blank" rel="noopener noreferrer"
            style={{ fontSize:"11px", color:"#445B3E", whiteSpace:"nowrap" }}>FEC ↗</a>
          <a href={"https://ballotpedia.org/" + displayName.replace(/ /g, "_")} target="_blank" rel="noopener noreferrer"
            style={{ fontSize:"11px", color:"#445B3E", whiteSpace:"nowrap" }}>Ballotpedia ↗</a>
          {wikiUrl && (
            <a href={wikiUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize:"11px", color:"#445B3E", whiteSpace:"nowrap" }}>Wikipedia ↗</a>
          )}
        </div>
      </div>

      {fin ? (
        <div style={{ display:"flex", gap:"16px", flexWrap:"wrap", paddingTop:"8px", borderTop:"1px solid #1e1e1e" }}>
          <div>
            <div style={{ fontSize:"11px", color:"#555", marginBottom:"2px" }}>Total Raised</div>
            <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", color:"#C8F97A" }}>{fmt(fin.raised)}</div>
          </div>
          <div>
            <div style={{ fontSize:"11px", color:"#555", marginBottom:"2px" }}>Total Spent</div>
            <div style={{ fontFamily:FF_SYNE, fontWeight:600, fontSize:"14px", color:"#aaa" }}>{fmt(fin.spent)}</div>
          </div>
          <div>
            <div style={{ fontSize:"11px", color:"#555", marginBottom:"2px" }}>Cash on Hand</div>
            <div style={{ fontFamily:FF_SYNE, fontWeight:600, fontSize:"14px", color:"#aaa" }}>{fmt(fin.cash)}</div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize:"12px", color:"#444", paddingTop:"6px", borderTop:"1px solid #1e1e1e" }}>Finance data not yet filed for 2026</div>
      )}

      <button onClick={loadBio}
        style={{ alignSelf:"flex-start", fontFamily:FF_SYNE, fontWeight:600, fontSize:"12px", padding:"6px 12px", borderRadius:"4px", background:"#1a1a1a", color:"#445B3E", border:"1px solid #445B3E", cursor:"pointer", marginTop:"4px" }}>
        {bioLoading ? "Loading..." : expanded ? "Hide positions" : "View positions ↓"}
      </button>

      {expanded && (
        <div style={{ background:"#0e0e0e", border:"1px solid #1e1e1e", borderRadius:"6px", padding:"12px 14px", fontSize:"13px", color:"#aaa", lineHeight:1.7, marginTop:"2px" }}>
          {bioLoading ? (
            <span style={{ color:"#555" }}>Pulling public record...</span>
          ) : (
            <span>{bio}</span>
          )}
        </div>
      )}
    </div>
  );
}

function UpcomingBallot({ addr, proxy }) {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [financeMap, setFinanceMap] = useState({});
  const [error, setError] = useState(null);

  const stateCode = addr && addr.state ? addr.state.toUpperCase() : null;
  const cycle = "2026";

  // 2026 key election dates
  const electionDates = [
    { label: "Primary Season", date: "May–Aug 2026", detail: "Dates vary by state. Check your state election site for your exact primary date." },
    { label: "General Election Day", date: "November 3, 2026", detail: "Federal midterms — U.S. Senate, U.S. House, and many state races." },
    { label: "Voter Registration Deadline", date: "~30 days before election", detail: "Deadlines vary by state. Verify at vote.gov." },
  ];

  useEffect(function() {
    if (!stateCode) { setLoading(false); return; }
    async function load() {
      try {
        const [senRes, houseRes] = await Promise.all([
          fetch(proxy + "?endpoint=fec-candidates&state=" + stateCode + "&office=S&cycle=" + cycle),
          fetch(proxy + "?endpoint=fec-candidates&state=" + stateCode + "&office=H&cycle=" + cycle),
        ]);
        const senData = senRes.ok ? await senRes.json() : { results: [] };
        const houseData = houseRes.ok ? await houseRes.json() : { results: [] };
        const all = [...(senData.results || []), ...(houseData.results || [])].slice(0, 20);
        setCandidates(all);
        const fMap = {};
        await Promise.all(all.map(async function(c) {
          try {
            const totRes = await fetch(proxy + "?endpoint=fec-totals&candidateId=" + c.candidate_id + "&cycle=" + cycle);
            if (!totRes.ok) return;
            const tot = await totRes.json();
            const t = (tot.results || [])[0];
            if (t) fMap[c.candidate_id] = { raised: t.receipts, spent: t.disbursements, cash: t.cash_on_hand_end_period };
          } catch(e) {}
        }));
        setFinanceMap(fMap);
      } catch(e) {
        setError("Unable to load candidate data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [stateCode]);

  if (!stateCode) return (
    <div style={{ fontSize:"14px", color:"#888", padding:"16px 0" }}>Enter a full address to see your upcoming ballot.</div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

      {/* Election Dates */}
      <div style={{ background:"#111", border:"1px solid #2a2a2a", borderRadius:"8px", padding:"16px 18px" }}>
        <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#445B3E", letterSpacing:".08em", textTransform:"uppercase", marginBottom:"12px" }}>2026 Key Dates</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {electionDates.map(function(ev, i) {
            return (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"12px", paddingBottom: i < electionDates.length-1 ? "10px" : "0", borderBottom: i < electionDates.length-1 ? "1px solid #1a1a1a" : "none" }}>
                <div>
                  <div style={{ fontFamily:FF_SYNE, fontWeight:600, fontSize:"13px", color:"#f0f0f0" }}>{ev.label}</div>
                  <div style={{ fontSize:"12px", color:"#555", marginTop:"2px", lineHeight:1.5 }}>{ev.detail}</div>
                </div>
                <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#C8F97A", whiteSpace:"nowrap", flexShrink:0 }}>{ev.date}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidates */}
      <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#445B3E", letterSpacing:".08em", textTransform:"uppercase" }}>
        2026 Federal Candidates — {stateCode}
      </div>
      <div style={{ fontSize:"12px", color:"#555", marginTop:"-8px" }}>
        Registered with the FEC. Click "View positions" on any candidate for their publicly stated beliefs. For state and local races visit your{" "}
        <a href={"https://vote.gov/register/" + stateCode.toLowerCase()} target="_blank" rel="noopener noreferrer" style={{ color:"#445B3E" }}>state election site</a>.
      </div>

      {loading && <div style={{ fontSize:"14px", color:"#666" }}>Loading candidates for {stateCode}...</div>}
      {error && <div style={{ fontSize:"14px", color:"#e55" }}>{error}</div>}

      {!loading && !error && candidates.length === 0 && (
        <div style={{ background:"#111", border:"1px solid #2a2a2a", borderRadius:"8px", padding:"16px 18px", fontSize:"13px", color:"#888" }}>
          No federal candidates found yet for 2026 in {stateCode}. Check back as the election cycle progresses.
        </div>
      )}

      {!loading && candidates.length > 0 && (function() {
        const senators = candidates.filter(function(c) { return c.office === "S"; });
        const reps = candidates.filter(function(c) { return c.office === "H"; });
        return (
          <>
            {senators.length > 0 && <div style={{ fontFamily:FF_SYNE, fontWeight:600, fontSize:"11px", letterSpacing:".1em", color:"#555", textTransform:"uppercase" }}>U.S. Senate</div>}
            {senators.map(function(c) { return <CandidateCard key={c.candidate_id} c={c} fin={financeMap[c.candidate_id]} proxy={proxy} />; })}
            {reps.length > 0 && <div style={{ fontFamily:FF_SYNE, fontWeight:600, fontSize:"11px", letterSpacing:".1em", color:"#555", textTransform:"uppercase", marginTop:"8px" }}>U.S. House</div>}
            {reps.map(function(c) { return <CandidateCard key={c.candidate_id} c={c} fin={financeMap[c.candidate_id]} proxy={proxy} />; })}
          </>
        );
      })()}
    </div>
  );
}

function ElectionReminders({ stateCode }) {
  // Build a Google Calendar URL for a given event
  function calUrl(title, date, details) {
    const d = date.replace(/-/g, "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: d + "/" + d,
      details: details || "",
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  // Key 2026 election dates — national + common state patterns
  // State-specific primary dates for 2026
  const STATE_PRIMARY_DATES = {
    AL:"June 2, 2026", AK:"August 25, 2026", AZ:"August 4, 2026", AR:"May 19, 2026",
    CA:"June 2, 2026", CO:"June 23, 2026", CT:"August 11, 2026", DE:"September 15, 2026",
    FL:"August 18, 2026", GA:"May 19, 2026", HI:"August 8, 2026", ID:"May 19, 2026",
    IL:"March 17, 2026", IN:"May 5, 2026", IA:"June 2, 2026", KS:"August 4, 2026",
    KY:"May 19, 2026", LA:"October 24, 2026", ME:"June 9, 2026", MD:"June 23, 2026",
    MA:"September 15, 2026", MI:"August 4, 2026", MN:"August 11, 2026", MS:"June 2, 2026",
    MO:"August 4, 2026", MT:"June 2, 2026", NE:"May 12, 2026", NV:"June 9, 2026",
    NH:"September 8, 2026", NJ:"June 2, 2026", NM:"June 2, 2026", NY:"June 23, 2026",
    NC:"May 19, 2026", ND:"June 9, 2026", OH:"May 5, 2026", OK:"June 23, 2026",
    OR:"May 19, 2026", PA:"May 19, 2026", RI:"September 15, 2026", SC:"June 9, 2026",
    SD:"June 2, 2026", TN:"August 4, 2026", TX:"March 3, 2026", UT:"June 23, 2026",
    VT:"August 11, 2026", VA:"June 9, 2026", WA:"August 4, 2026", WV:"May 12, 2026",
    WI:"August 11, 2026", WY:"August 18, 2026", DC:"June 2, 2026"
  };
  const primaryDate = STATE_PRIMARY_DATES[stateCode] || "Check your state election site";
  const stateElectionUrl = "https://vote.gov/register/" + (stateCode || "").toLowerCase();

  const events = [
    { label: "Primary Election Day", date: primaryDate, detail: "Your " + (stateCode || "state") + " primary date. Verify at your state election office." },
    { label: "General Election Day", date: "November 3, 2026", detail: "Federal midterms — U.S. Senate, U.S. House, and many state races." },
    { label: "Voter Registration Deadline", date: "~30 days before election", detail: "Verify your exact deadline at vote.gov or your state election site." },
    { label: "Early Voting (typical)", date: "~2 weeks before election", detail: "Early voting windows vary. Check your local election office." },
    { label: "Mail Ballot Request Deadline", date: "~1 week before election", detail: "Deadlines vary by state. Check your local election office." },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
      <div style={{ background:"#111", border:"1px solid #2a2a2a", borderRadius:"8px", padding:"18px 20px", marginBottom:"4px" }}>
        <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"15px", color:"#445B3E", marginBottom:"6px" }}>2026 Key Election Dates</div>
        <div style={{ fontSize:"13px", color:"#888", lineHeight:1.6 }}>Add dates to your calendar. Always verify exact dates with your <a href="https://vote.gov" target="_blank" rel="noopener noreferrer" style={{ color:"#445B3E" }}>state's official election site</a>.</div>
      </div>
      {events.map(function(ev, i) {
        return (
          <div key={i} style={{ background:"#111", border:"1px solid #2a2a2a", borderRadius:"8px", padding:"16px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px" }}>
            <div>
              <div style={{ fontFamily:FF_SYNE, fontWeight:600, fontSize:"14px", color:"#f0f0f0", marginBottom:"3px" }}>{ev.label}</div>
              <div style={{ fontSize:"13px", color:"#666" }}>{ev.date}</div>
              <div style={{ fontSize:"12px", color:"#555", marginTop:"3px", lineHeight:1.5 }}>{ev.detail}</div>
            </div>
            <a
              href={calUrl(ev.label + " — Civic Match", ev.date, ev.detail)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flexShrink:0, fontFamily:FF_SYNE, fontWeight:600, fontSize:"12px", letterSpacing:".06em", padding:"8px 14px", borderRadius:"4px", background:"#445B3E", color:"#fff", textDecoration:"none", whiteSpace:"nowrap" }}>
              + Add to Calendar
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [priorities, setPriorities] = useState(Object.fromEntries(ISSUES.map(function(i) { return [i.id, 3]; })));
  const [addr, setAddr] = useState({ street:"", city:"", state:"", zip:"" });
  const [registered, setRegistered] = useState(null);
  const [regStatus, setRegStatus] = useState(null); // "confirmed" | "need-to-register" | "need-to-check"
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [results, setResults] = useState(null);
  const [photos, setPhotos] = useState({});
  const [regUrl, setRegUrl] = useState(null);
  const [error, setError] = useState(null);
  const [anim, setAnim] = useState(true);

  const cur = STEPS[step];
  const fullAddr = [addr.street, addr.city, addr.state, addr.zip].filter(function(v) { return v && v.trim(); }).join(", ");
  const allRated = true; // Issue selection removed - all issues shown by default
  const canContinue = addr.street.trim() && addr.city.trim() && addr.state.length === 2 && addr.zip.length === 5;

  function go(n) {
    setAnim(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    window.parent.postMessage({ type: "civic-match-scroll-top" }, "*");
    setTimeout(function() { setStep(n); setAnim(true); }, 200);
  }

  function buildPrompt(members, stateLeg, voteData, localElections, dwData, dwStateUrls, staticReps) {
    const issueList = ISSUES.map(function(i) { return "- " + i.label; }).join("\n");

    // Build static enriched context if available
    const staticFederalMap = {};
    const staticStateMap = {};
    if (staticReps) {
      (staticReps.federal || []).forEach(function(r) { staticFederalMap[r.name] = r; });
      (staticReps.state_legislators || []).forEach(function(r) { staticStateMap[r.name] = r; });
    }

    function formatPositions(rep) {
      if (!rep || !rep.positions || !Object.keys(rep.positions).length) return "";
      return "\n  Known positions:\n" + Object.entries(rep.positions).map(function(entry) {
        const issue = entry[0];
        const pos = entry[1];
        // Handle both old string format and new structured format
        if (typeof pos === "string") return "  - " + issue + ": " + pos;
        const parts = ["  - " + issue + " (" + (pos.stance || "unclear") + "): " + (pos.summary || "")];
        if (pos.voted_for && pos.voted_for.length) parts.push("    Voted FOR: " + pos.voted_for.join("; "));
        if (pos.voted_against && pos.voted_against.length) parts.push("    Voted AGAINST: " + pos.voted_against.join("; "));
        return parts.join("\n");
      }).join("\n");
    }

    const membersStr = members && members.length
      ? members.map(function(m) {
          const party = m.partyName==="Democrat"||m.partyName==="Democratic"?"D":m.partyName==="Republican"?"R":"N";
          const staticData = staticFederalMap[m.name] || {};
          const contact = [staticData.website, staticData.twitter ? "@"+staticData.twitter : null].filter(Boolean).join(" | ");
          return "- " + m.name + " (" + party + ", " + (m.chamber||"Congress") + (m.district ? ", District " + m.district : "") + ")" + (contact ? " — " + contact : "") + formatPositions(staticData);
        }).join("\n")
      : "No federal member data retrieved.";

    const stateStr = stateLeg && stateLeg.length
      ? stateLeg.map(function(l) {
          const party = l.party==="Democrat"||l.party==="Democratic"?"D":l.party==="Republican"?"R":l.party?"N":"N";
          const staticData = staticStateMap[l.name] || {};
          const contact = [staticData.website].filter(Boolean).join(" | ");
          return "- " + l.name + " (" + party + ", " + (l.current_role&&l.current_role.chamber?l.current_role.chamber:"State Legislature") + ", District " + (l.current_role&&l.current_role.district?l.current_role.district:"?") + ")" + (contact ? " — " + contact : "") + formatPositions(staticData);
        }).join("\n")
      : "No state legislator data retrieved.";

    // Format Democracy Works election data
    const dwStr = dwData && Array.isArray(dwData) && dwData.length
      ? dwData.slice(0, 8).map(function(e) {
          const date = e.date ? e.date.slice(0, 10) : "TBD";
          const desc = e.description || e.type || "Election";
          const methods = e["district-divisions"] && e["district-divisions"][0];
          const vmethods = methods && methods["voting-methods"] ? methods["voting-methods"].map(function(v) { return v.type; }).join(", ") : "";
          const regMethods = methods && methods["voter-registration-methods"] ? methods["voter-registration-methods"] : [];
          const regDeadline = regMethods.length ? (regMethods[0]["deadline-received"] || regMethods[0]["deadline-postmarked"] || "").slice(0, 10) : "";
          const earlyVoting = methods && methods["voting-methods"] ? methods["voting-methods"].find(function(v) { return v.type === "early-voting"; }) : null;
          const earlyStart = earlyVoting && earlyVoting["start-date"] ? earlyVoting["start-date"].slice(0, 10) : "";
          const earlyEnd = earlyVoting && earlyVoting["end-date"] ? earlyVoting["end-date"].slice(0, 10) : "";
          const pollingUrl = e["polling-place-url"] || "";
          const sampleBallot = e["website"] || "";
          return "Election: " + desc + "\nDate: " + date
            + (regDeadline ? "\nRegistration Deadline: " + regDeadline : "")
            + (vmethods ? "\nVoting Methods: " + vmethods : "")
            + (earlyStart ? "\nEarly Voting: " + earlyStart + " to " + earlyEnd : "")
            + (pollingUrl ? "\nPolling Place Lookup: " + pollingUrl : "")
            + (sampleBallot ? "\nMore Info: " + sampleBallot : "");
        }).join("\n\n")
      : "No verified election data available for this state.";

    const dwUrlStr = dwStateUrls
      ? (dwStateUrls["local-election-authority-lookup-url"] ? "Local Election Authority: " + dwStateUrls["local-election-authority-lookup-url"] : "")
      : "";

    const localStr = localElections && localElections.length
      ? localElections.map(function(c) {
          const cands = c.candidates && c.candidates.length
            ? c.candidates.map(function(cd) { return cd.name + (cd.party ? " (" + cd.party + ")" : ""); }).join(", ")
            : "No candidates listed";
          return "- " + (c.office || c.type || "Local Race") + ": " + cands;
        }).join("\n")
      : "Use your own knowledge for this address: " + fullAddr;

    const voteStr = voteData && Object.keys(voteData).length
      ? Object.keys(voteData).map(function(name) {
          const scores = voteData[name];
          const lines = ISSUES.filter(function(i) { return scores[i.id] && scores[i.id].total > 0; }).map(function(i) {
            const s = scores[i.id];
            return "  " + i.label + ": " + Math.round((s.hits/s.total)*100) + "% alignment (" + s.hits + "/" + s.total + " votes)";
          });
          return name + ":\n" + (lines.length ? lines.join("\n") : "  No relevant votes found");
        }).join("\n\n")
      : "No voting record data available.";

    return "You are a nonpartisan civic information assistant. Be specific, concise, and evidence-based. Do NOT include delegate elections, party primaries for presidential delegates, or any 2028 election information. Every opinion about a candidate must have an inline citation immediately after it. PARTY FORMAT RULE: Always display party affiliation as (D) for Democrat/Democratic, (R) for Republican, or (N) for no party/nonpartisan/independent — never spell out the full party name. DATA ACCURACY RULES: (1) Prioritize Congress.gov/OpenStates/Google Civic API data over your training knowledge. Always include each representative's official office phone number from their .gov website, not campaign numbers. (2) For any official whose term ends between November 2024 and May 2026 and you are uncertain if they are still in office, add (Verify current status) after their name. If you are confident the term has ended, omit them entirely — for example, Bob Casey Jr. lost his Pennsylvania Senate seat in November 2024 and should NEVER appear. Dave McCormick won that race. (3) Never assume incumbency for offices with elections after November 2024. (4) Every claim needs an inline citation with a date. (5) If a term end date has already passed before today (May 2026), OMIT that official entirely — do not include them in the guide. If the data provided lists someone whose term ended in January 2025, discard them and use your knowledge of who currently holds that seat. (6) For local officials especially county council members, school board members, and municipal offices — your training data is frequently outdated. If you are not highly confident who currently holds a specific local seat, add (Verify current officeholder at official county website) after the name rather than stating a name you are uncertain about. Never invent or guess a name for a local office. The API data provided may sometimes miscategorize federal legislators as state legislators or vice versa. NOTE: As of June 2025, Aisha Braveboy is the Prince George's County Executive (not State's Attorney — that role is now held by Tara Jackson) — use the names provided and your own knowledge of their actual roles, voting records, and positions to produce accurate results. Never refuse to provide information about a named representative just because the API data appears miscategorized. If you can identify the representative by name, provide their full record.\n\nVOTER INFO:\nAddress: " + fullAddr + "\nState: " + addr.state + "\nRegistered: " + (registered ? "Yes" : "No/Unsure") + "\n\nFEDERAL REPS (Congress.gov):\n" + membersStr + "\n\nSTATE LEGISLATORS (OpenStates):\n" + stateStr + "\n\nVERIFIED ELECTION DATES (Democracy Works):\n" + dwStr + "\n\nSTATE VOTING URLS:\n" + dwUrlStr + "\n\nLOCAL OFFICIALS & ELECTIONS (use your full knowledge for this address -- list all current county, city, school board, and municipal officeholders):\n" + localStr + "\n\nVOTING RECORD ALIGNMENT:\n" + voteStr + "\n\nVOTER PRIORITIES:\n" + issueList + "\n\nPRODUCE THESE SECTIONS. Be concise — 2-4 sentences per candidate max. Group related information together. No long paragraphs.\n\n## Your Districts\nSimple bullet list only. No photos, no prose. Each line: **[Office]: [Value]** — [max 8 words on what that office does]. Example: **Congressional District: 5** — Votes on federal laws and budget.\n## Federal Representatives\nFor each rep, cover ALL voter priorities listed above — not just the top 3. For each priority, include their position with an inline citation. Format:\n**[Name] — [Office] — Phone: [official .gov office phone] — Elected: [date elected] — Term ends: [date term ends]**\n- [Priority]: [What they voted FOR + citation]. Voted against: [What they voted AGAINST on this issue + citation if available]\\n(repeat for every priority)ty)\n**Contact:** [official office phone] | [Instagram URL if known] | [Twitter/X URL if known]\n\n## State Legislators\nSame format as Federal Representatives.\n\n## Local Elections\\nUsing the local data provided OR your own knowledge for this address, list current officeholders and upcoming races for county, city, school board, and other local offices. Do NOT include U.S. Senators, U.S. Representatives, or state legislators here — they are covered in the Federal and State sections above. For each:\\n**[Name] (D, R, or N for no party) — [Office] — Phone: [official .gov office phone] — Elected: [date] — Term ends: [date]**\\n- [Priority]: [What they voted FOR or supported + citation]. Voted against: [What they voted AGAINST or opposed on this issue + citation if available]\\nEnd each officeholder entry with: **Contact:** [official office phone] | [Instagram URL if known] | [Twitter/X URL if known]\\nIf no data is available for an office, use your best knowledge for this specific address.\\n\\nAlso include a subsection titled **Delegate Elections** covering:\\n1. Presidential primary delegates — any upcoming or recent presidential primary delegate selection for this state, including date, party, number of delegates, and how they are selected\\n2. State party convention delegates — upcoming state party conventions and how delegates are chosen from this district\\n3. DNC/RNC delegate races — any known delegate slots, filing deadlines, or candidate slates for the next national party convention\\nFor each delegate race, format as:\\n**[Race name] ([Party])**\\n- Date: [date or TBD]\\n- How delegates are selected: [caucus/primary/convention/appointment]\\n- Key information: [relevant details]\\n- Verify current information at: [state party website URL]\\nNote that delegate race data changes frequently — always direct voters to verify with their state party website.\\n\\n## Questions to Ask\nFor EVERY voter priority listed above, provide 2 sharp, specific questions a voter should ask their representatives at town halls. Then add a subsection **Contact Your Representatives** listing for each rep: their official .gov office phone number, and their verified Instagram URL (https://instagram.com/handle) for finding in-person meeting announcements. One entry per rep. Only include information you are certain is accurate. Format:\n**[Priority name]**\n- [Question]\n- [Question]\n\n## Election Dates\nIf verified Democracy Works data is provided above, use it to list UPCOMING elections only (2026 or later — do NOT list any past 2025 elections) with dates, registration deadlines, voting methods, early voting windows, and polling place lookup URLs. If no verified data is available, use your own knowledge to list only upcoming future elections for this state (2026 and beyond). If the next election date is not yet determined, say so. Always produce this section.\n\nCITATION RULES:\n- Every factual claim about a candidate gets an inline citation in parentheses immediately after the claim\n- Format: (Bill name/number, vote direction, date) or (Source name, date) or (Official statement, date)\n- Never group citations at the end — they go right next to the claim they support\n- If you cannot cite a claim, do not make it\n- For each candidate, list every issue you can find a position on. For issues with no voting record, bill sponsorship, or public statement, do not scatter 'No recorded position' entries throughout — instead group all issues with no recorded position together at the end of that candidate's section under a single line: **No recorded position found on:** [comma-separated list of issues]. Do not infer positions based on party affiliation or related votes. Never include notes, disclaimers, or explanations about data sources, API categorization, or district mapping — just present the information directly. CRITICAL: Every bold header MUST start with the person's name. CORRECT: **Angela Alsobrooks -- County Executive -- Elected: 2018 -- Term ends: December 2026**. WRONG: **County Executive -- Angela Alsobrooks -- ...**. NEVER put the office before the name. No padding. No repetition. If there is no voting record, bill sponsorship, or public statement that directly addresses an issue, explicitly state: No recorded position found on this issue. Do not infer or assume a position based on party affiliation or related votes.  If there is no voting record, bill sponsorship, or public statement that directly addresses an issue, explicitly state that no recorded position was found. Do not infer or assume a position based on party affiliation or related votes."
  }

  
  function isPersonPage(d) {
    // Wikipedia returns type="standard" for biographical pages
    if (d.type && d.type !== "standard") return false;
    const desc = (d.description || "").toLowerCase();
    const extract = (d.extract || "").toLowerCase();
    // Reject if description clearly identifies a non-person entity
    const nonPersonWords = ["building", "stadium", "arena", "hospital", "bridge", "city of", "town of", "county seat", "nonprofit", "organization", "company", "corporation", "founded in", "is a city", "is a town", "is a county", "is a district", "is a school"];
    if (nonPersonWords.some(function(w) { return desc.includes(w) || extract.slice(0, 200).includes(w); })) return false;
    // Reject historical figures — not current officeholders
    const historicalWords = ["founding father", "president of the united states", "american revolution", "civil war", "world war", "colonial", "founding fathers"];
    if (historicalWords.some(function(w) { return desc.includes(w) || extract.slice(0, 300).includes(w); })) return false;
    // Reject if born before 1930 (would be 95+ — almost certainly not a current officeholder)
    const bornMatch = (d.extract || "").match(/born\s+(?:on\s+)?(?:\w+\s+\d+,?\s+)?(\d{4})/i);
    if (bornMatch && parseInt(bornMatch[1]) < 1930) return false;
    // Reject if the thumbnail URL looks like architecture/landscape (contains common non-portrait signals)
    const thumb = (d.thumbnail && d.thumbnail.source) ? d.thumbnail.source.toLowerCase() : "";
    const nonPortraitPatterns = ["building", "courthouse", "capitol", "skyline", "aerial", "campus", "stadium", "hospital", "bridge", "church", "map", "flag", "seal", "logo", "coat_of_arms", "school"];
    if (nonPortraitPatterns.some(function(p) { return thumb.includes(p); })) return false;
    return true;
  }

  function scoreVotes(votes, priorities) {
    const scores = {};
    const issueLookup = (priorities || []).map(function(p) { return (p.label || p).toLowerCase(); });
    (votes || []).forEach(function(v) {
      const desc = ((v.description || "") + " " + (v.question || "")).toLowerCase();
      issueLookup.forEach(function(issue) {
        if (desc.indexOf(issue.slice(0, 6)) !== -1) {
          if (!scores[issue]) scores[issue] = { for: 0, against: 0 };
          if (v.position === "Yes") scores[issue].for++;
          else if (v.position === "No") scores[issue].against++;
        }
      });
    });
    return scores;
  }

  async function fetchWikiPhoto(name) {
    function checkPhoto(d) {
      if (!d || !d.thumbnail || !d.thumbnail.source || !isPersonPage(d)) return null;
      const desc = (d.description || "").toLowerCase();
      const isPol = desc.includes("council") || desc.includes("politician") || desc.includes("representative") || desc.includes("senator") || desc.includes("mayor") || desc.includes("assembly") || desc.includes("commissioner") || desc.includes("delegate") || desc.includes("board") || desc.includes("official");
      return isPol ? d.thumbnail.source : null;
    }
    try {
      // Try direct name first
      const r1 = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(name.replace(/ /g, "_")));
      if (r1.ok) { const p = checkPhoto(await r1.json()); if (p) return p; }

      // Try with politician suffix
      const r2 = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent((name + " politician").replace(/ /g, "_")));
      if (r2.ok) { const p = checkPhoto(await r2.json()); if (p) return p; }

      // Try Wikipedia search — most reliable for disambiguation
      const s = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(name + " politician United States") + "&format=json&origin=*&srlimit=3");
      if (s.ok) {
        const sd = await s.json();
        const results = (sd.query && sd.query.search) || [];
        for (const result of results) {
          const r3 = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(result.title.replace(/ /g, "_")));
          if (r3.ok) { const p = checkPhoto(await r3.json()); if (p) return p; }
        }
      }
      return null;
    } catch(e) { return null; }
  }

  async function fetchWithTimeout(url, timeout) {
    const controller = new AbortController();
    const id = setTimeout(function() { controller.abort(); }, timeout || 8000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      return res;
    } catch(e) {
      clearTimeout(id);
      throw e;
    }
  }

  async function run() {
    setLoading(true);
    setError(null);
    setResults(null);
    setRegUrl(REGS[addr.state.toUpperCase()] || "https://vote.org/register-to-vote/");

    let members = [], stateLeg = [], voteData = {}, localElections = [], dwData = null, dwStateUrls = null;
    let staticReps = null;

    // ── Load pre-generated static data (federal + state) ──
    try {
      setLoadMsg("Loading representative data...");
      const stateCode = addr.state.toUpperCase();
      const staticRes = await fetch("/data/reps-" + stateCode + ".json");
      if (staticRes.ok) {
        staticReps = await staticRes.json();
        console.log("Static data loaded for", stateCode, "— generated:", staticReps.generated);
        // Convert static format back to members/stateLeg arrays for downstream use
        members = (staticReps.federal || []).map(function(r) {
          return { name: r.name, partyName: r.party === "D" ? "Democrat" : r.party === "R" ? "Republican" : "Independent", chamber: r.chamber, district: r.district, bioguideId: r.bioguideId || null };
        });
        stateLeg = (staticReps.state_legislators || []).map(function(r) {
          return { name: r.name, party: r.party === "D" ? "Democrat" : r.party === "R" ? "Republican" : "Independent", current_role: { chamber: r.chamber, district: r.district } };
        });
      } else {
        console.warn("No static data for", stateCode, "— falling back to live API");
      }
    } catch(e) { console.warn("Static data load failed:", e.message); }

    // ── Fall back to live API if no static data ──
    if (!staticReps) {
      try {
        setLoadMsg("Finding your representatives...");
        const r1 = await fetchWithTimeout(PROXY + "?endpoint=congress-members&state=" + addr.state.toUpperCase());
        if (r1.ok) {
          const d = await r1.json();
          members = (d.members || []).filter(function(m) {
            if (!m.state || m.state.toUpperCase() !== addr.state.toUpperCase()) return false;
            if (m.terms && m.terms.item) {
              const terms = Array.isArray(m.terms.item) ? m.terms.item : [m.terms.item];
              const lastTerm = terms[terms.length - 1];
              if (lastTerm && lastTerm.endYear) {
                const endYear = parseInt(lastTerm.endYear);
                if (endYear < 2026) return false;
              }
            }
            return true;
          }).slice(0, 6);
        }
      } catch(e) { console.warn("Congress:", e.message); }

      try {
        setLoadMsg("Finding your state legislators...");
        const r2 = await fetchWithTimeout(PROXY + "?endpoint=state-legislators&address=" + encodeURIComponent(fullAddr));
        if (r2.ok) {
          const d = await r2.json();
          stateLeg = (d.results || []).slice(0, 6);
        }
      } catch(e) { console.warn("OpenStates:", e.message); }
    }

    // Google Civic Representatives API was retired April 2025 — local officials sourced from Claude knowledge

    try {
      setLoadMsg("Fetching verified election dates...");
      const [dwRes, dwUrlRes] = await Promise.all([
        fetch(PROXY + "?endpoint=dw-elections&state=" + encodeURIComponent(addr.state.toUpperCase())),
        fetch(PROXY + "?endpoint=dw-state-urls&state=" + encodeURIComponent(addr.state.toUpperCase()))
      ]);
      if (dwRes.ok) dwData = await dwRes.json();
      if (dwUrlRes.ok) dwStateUrls = await dwUrlRes.json();
    } catch(e) { console.warn("Democracy Works:", e.message); }

    try {
      setLoadMsg("Analyzing voting records...");
      for (let i = 0; i < Math.min(members.length, 3); i++) {
        const m = members[i];
        const r3 = await fetchWithTimeout(PROXY + "?endpoint=member-votes&memberId=" + m.bioguideId);
        if (r3.ok) {
          const d = await r3.json();
          voteData[m.name] = scoreVotes(d.votes || [], priorities);
        }
      }
    } catch(e) { console.warn("Votes:", e.message); }

    try {
      
    const allNames = [
      ...members.map(function(m) { return m.name; }),
      ...stateLeg.map(function(l) { return l.name; }),
      ...localElections.flatMap(function(o) { return (o.candidates || []).map(function(c) { return c.name; }); })
    ];
    const photoMap = {};
    await Promise.all(allNames.map(async function(name) {
      const p = await fetchWikiPhoto(name);
      if (p) photoMap[name] = p;
    }));
    setPhotos(photoMap);

    setLoadMsg("Searching voting records in your area...");
      const resp = await fetch(PROXY + "?endpoint=generate-guide", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: buildPrompt(members, stateLeg, voteData) })
});

      if (!resp.ok) {
        if (resp.status === 429) { setError("RATE_LIMIT"); setLoading(false); return; }
        const e = await resp.json().catch(function() { return {}; });
        throw new Error("API " + resp.status + ": " + (e.error && e.error.message ? e.error.message : resp.statusText));
      }

      const data = await resp.json();
      if (data.type === "error") throw new Error("API error: " + (data.error && data.error.message ? data.error.message : "unknown"));
      if (!data.content || !data.content.length) throw new Error("Empty response. Please try again.");
      const text = data.content.filter(function(b) { return b.type === "text"; }).map(function(b) { return b.text; }).join("\n");
      if (!text.trim()) throw new Error("No text returned.");
      setResults(text);

      // Extract candidate names from bold headers in AI output and fetch missing photos
      try {
        const boldNames = [];
        text.split("\n").forEach(function(line) {
          if (line.indexOf("**") === 0) {
            const afterBold = line.slice(2);
            const dashIdx = afterBold.indexOf(" —");
            const endBold = afterBold.indexOf("**");
            const cutIdx = dashIdx > 0 ? dashIdx : endBold > 0 ? endBold : afterBold.length;
            const name = afterBold.slice(0, cutIdx).trim();
            if (name.length > 3 && name.length < 50 && name.indexOf(":") < 0 && name.indexOf("Match") < 0 && name.indexOf("recorded") < 0) {
              boldNames.push(name);
            }
          }
        });
        const newPhotoMap = Object.assign({}, photoMap);
        const skipNames = new Set(["Ballotpedia","Congress.gov","OpenStates","Vote411","BallotReady","USA.gov","NAACP","Democracy Docket","Black Voters Matter","Instagram","Website","Contact"]);
        await Promise.all(boldNames.map(async function(name) {
          try {
            if (!newPhotoMap[name] && !skipNames.has(name)) {
              const p = await fetchWikiPhoto(name);
              if (p) newPhotoMap[name] = p;
            }
          } catch(photoErr) { console.warn("Photo fetch failed for", name); }
        }));
        setPhotos(newPhotoMap);
      } catch(photoSectionErr) {
        console.warn("Photo section error:", photoSectionErr);
      }

      // Show static data freshness if available
      if (staticReps && staticReps.generated) {
        setLoadMsg("Data current as of " + staticReps.generated);
      }
      go(3);
    } catch(e) {
      console.error(e);
      setError(e.name === "AbortError"
        ? "Request timed out. Please check your connection and try again."
        : "Something went wrong loading your voter guide. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(function() {
    if (cur === "results" && results) {
      document.title = "Civic Match Voter Guide — Powered by BLK + GRN";
    } else {
      document.title = "Civic Match — BLK + GRN";
    }
  }, [cur, results]);

  useEffect(function() {
    function reportHeight() {
      var h = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: "civic-match-height", height: h }, "*");
    }
    reportHeight();
    var observer = new ResizeObserver(reportHeight);
    observer.observe(document.body);
    return function() { observer.disconnect(); };
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:"#0e0e0e", color:"#f0f0f0", fontFamily:FF_NEWS, display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Newsreader:ital,wght@0,300;0,400;1,300&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}html,body{margin:0;padding:0;overflow-x:hidden;width:100%;}
        ::selection{background:#445B3E;color:#0e0e0e;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#445B3E;border-radius:2px;}
        .sIn{animation:sIn .3s ease forwards;}
        .sOut{animation:sOut .2s ease forwards;}
        @keyframes sIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes sOut{from{opacity:1;}to{opacity:0;}}
        button.cta{transition:all .18s ease;cursor:pointer;border:none;}
        button.cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(200,249,122,.25);}
        button.cta:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;}
        .print-only{display:none;}
        @page { margin: 0.75in; size: letter; }
        @media print{
          .screen-only{display:none!important;}
          .print-only{display:block!important;}
          body{background:#fff!important;color:#000!important;font-size:12px!important;margin:0;padding:20px;}
          button{display:none!important;}
          *{color:#000!important;background:#fff!important;border-color:#ddd!important;box-shadow:none!important;}
          img{border-radius:50%!important;object-fit:cover!important;max-width:44px!important;max-height:44px!important;}
          img.print-logo{border-radius:0!important;object-fit:contain!important;max-width:none!important;max-height:none!important;}
          h2{font-size:20px!important;margin-bottom:6px!important;}
          .candidate-block{page-break-inside:avoid!important;break-inside:avoid!important;}
          .print-disclaimer{display:none!important;}
        }
        input:focus{outline:none;border-color:#445B3E!important;}
        a{color:#445B3E;}
        .regBtn{transition:border-color .15s ease;cursor:pointer;}
        .regBtn:hover{border-color:#445B3E!important;}
        .regBtn.sel{border-color:#445B3E!important;background:rgba(200,249,122,.08)!important;}
        .pBtn{transition:all .15s ease;cursor:pointer;border:none;}
        .pBtn:hover{filter:brightness(1.15);}
        @keyframes spin{from{stroke-dashoffset:107;}to{stroke-dashoffset:-107;}}
      `}</style>

      <div style={{ display:"flex", alignItems:"center", gap:"16px", padding:"20px 32px", borderBottom:"1px solid #1e1e1e", position:"sticky", top:0, background:"#0e0e0e", zIndex:10 }}>
        <div style={{ fontFamily:FF_SYNE, fontWeight:800, fontSize:"14px", letterSpacing:".15em", color:"#fff", whiteSpace:"nowrap" }}>CIVIC MATCH</div>
        <div style={{ flex:1, height:"2px", background:"#2a2a2a", borderRadius:"1px", overflow:"hidden" }}>
          <div style={{ height:"100%", background:"#445B3E", borderRadius:"1px", transition:"width .4s ease", width: (step/(STEPS.length-1)*100)+"%" }} />
        </div>
        <div style={{ fontFamily:FF_SYNE, fontSize:"11px", color:"#555", whiteSpace:"nowrap" }}>{step+1} / {STEPS.length}</div>
      </div>

      <div style={{ flex:1, display:"flex", justifyContent:"center", padding:"40px 20px 80px" }}>
        <div className={anim ? "sIn" : "sOut"} style={{ width:"100%", maxWidth:"680px" }}>

          {cur === "welcome" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
              <div style={{ fontFamily:FF_SYNE, fontSize:"11px", fontWeight:600, letterSpacing:".18em", color:"#445B3E", textTransform:"uppercase" }}>Your Voice. Your Vote.</div>
              <h1 style={{ fontFamily:FF_SYNE, fontSize:"clamp(36px,7vw,64px)", fontWeight:800, lineHeight:1.05, color:"#f8f8f8" }}>
                Find candidates<br /><em style={{ fontStyle:"italic", fontWeight:300 }}>who match what you believe.</em>
              </h1>
              <p style={{ fontSize:"17px", lineHeight:1.7, color:"#aaa" }}>Get a personalized guide showing how your actual representatives have voted at every level of government — federal, state, and local.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {["Voting records","District identification","Contact info","Local election coverage"].map(function(f) {
                  return <div key={f} style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"14px", color:"#ccc", fontFamily:FF_SYNE }}><span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#445B3E", flexShrink:0, display:"block" }} />{f}</div>;
                })}
              </div>
              <button className="cta" style={{ background:"#445B3E", color:"#fff", fontFamily:FF_SYNE, fontWeight:700, fontSize:"15px", letterSpacing:".08em", padding:"16px 36px", borderRadius:"4px", alignSelf:"flex-start", marginTop:"8px" }} onClick={function() { go(1); }}>Get Started</button>
            </div>
          )}

          {cur === "address" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
              <div style={{ fontFamily:FF_SYNE, fontSize:"11px", fontWeight:600, letterSpacing:".18em", color:"#445B3E", textTransform:"uppercase" }}>Step 1 of 2</div>
              <h2 style={{ fontFamily:FF_SYNE, fontSize:"clamp(26px,5vw,42px)", fontWeight:700, lineHeight:1.1, color:"#f8f8f8" }}>Where do you vote?</h2>
              <p style={{ fontSize:"17px", lineHeight:1.7, color:"#aaa" }}>Your ZIP code is enough to identify your federal and state representatives. No data is stored.</p>

              <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:"6px", padding:"16px 18px", display:"flex", flexDirection:"column", gap:"6px" }}>
                <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"12px", color:"#445B3E", letterSpacing:".08em" }}>Why add your full address?</div>
                <p style={{ fontSize:"13px", color:"#777", lineHeight:1.6 }}>
                  ZIP code covers federal and state races. A full street address improves accuracy for city council wards, school board districts, and hyper-local races — which often split within the same ZIP code. Full address support for local elections is coming soon via an upcoming data integration.
                </p>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <label style={{ fontFamily:FF_SYNE, fontSize:"12px", fontWeight:600, letterSpacing:".12em", color:"#888", textTransform:"uppercase" }}>Street Address</label>
                  <span style={{ fontFamily:FF_SYNE, fontSize:"10px", color:"#555", background:"#1e1e1e", padding:"2px 8px", borderRadius:"20px" }}>Optional</span>
                </div>
                <input style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:"4px", padding:"14px 16px", fontSize:"16px", color:"#f0f0f0", fontFamily:FF_NEWS2, width:"100%" }}
                  autoComplete="street-address" placeholder="123 Main St" value={addr.street}
                  onChange={function(e) { const v = e.target.value; setAddr(function(a) { return { street:v, city:a.city, state:a.state, zip:a.zip }; }); }} />
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <label style={{ fontFamily:FF_SYNE, fontSize:"12px", fontWeight:600, letterSpacing:".12em", color:"#888", textTransform:"uppercase" }}>City</label>
                  <span style={{ fontFamily:FF_SYNE, fontSize:"10px", color:"#555", background:"#1e1e1e", padding:"2px 8px", borderRadius:"20px" }}>Optional</span>
                </div>
                <input style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:"4px", padding:"14px 16px", fontSize:"16px", color:"#f0f0f0", fontFamily:FF_NEWS2, width:"100%" }}
                  autoComplete="address-level2" placeholder="Baltimore" value={addr.city}
                  onChange={function(e) { const v = e.target.value; setAddr(function(a) { return { street:a.street, city:v, state:a.state, zip:a.zip }; }); }} />
              </div>

              <div style={{ display:"flex", gap:"12px" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:"8px", flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <label style={{ fontFamily:FF_SYNE, fontSize:"12px", fontWeight:600, letterSpacing:".12em", color:"#888", textTransform:"uppercase" }}>State</label>
                    <span style={{ fontFamily:FF_SYNE, fontSize:"10px", color:"#555", background:"#1e1e1e", padding:"2px 8px", borderRadius:"20px" }}>Optional</span>
                  </div>
                  <input style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:"4px", padding:"14px 16px", fontSize:"16px", color:"#f0f0f0", fontFamily:FF_NEWS2, width:"100%" }}
                    autoComplete="address-level1" placeholder="MD" maxLength={2} value={addr.state}
                    onChange={function(e) { const v = e.target.value.toUpperCase(); setAddr(function(a) { return { street:a.street, city:a.city, state:v, zip:a.zip }; }); }} />
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"8px", flex:2 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <label style={{ fontFamily:FF_SYNE, fontSize:"12px", fontWeight:600, letterSpacing:".12em", color:"#888", textTransform:"uppercase" }}>ZIP Code</label>
                    <span style={{ fontFamily:FF_SYNE, fontSize:"10px", color:"#445B3E", background:"rgba(200,249,122,.1)", padding:"2px 8px", borderRadius:"20px" }}>Required</span>
                  </div>
                  <input style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:"4px", padding:"14px 16px", fontSize:"16px", color:"#f0f0f0", fontFamily:FF_NEWS2, width:"100%" }}
                    autoComplete="postal-code" placeholder="21201" maxLength={5} value={addr.zip}
                    onChange={function(e) { const v = e.target.value.replace(/\D/g,""); setAddr(function(a) { return { street:a.street, city:a.city, state:a.state, zip:v }; }); }} />
                </div>
              </div>
              <button className="cta" style={{ background:"#445B3E", color:"#fff", fontFamily:FF_SYNE, fontWeight:700, fontSize:"15px", letterSpacing:".08em", padding:"16px 36px", borderRadius:"4px", alignSelf:"flex-start", marginTop:"8px" }} disabled={addr.zip.length < 5} onClick={function() { go(2); }}>Continue</button>
            </div>
          )}

          {cur === "registration" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
              <div style={{ fontFamily:FF_SYNE, fontSize:"11px", fontWeight:600, letterSpacing:".18em", color:"#445B3E", textTransform:"uppercase" }}>Step 2 of 2</div>
              <h2 style={{ fontFamily:FF_SYNE, fontSize:"clamp(26px,5vw,42px)", fontWeight:700, lineHeight:1.1, color:"#f8f8f8" }}>Almost there</h2>
              <p style={{ fontSize:"17px", lineHeight:1.7, color:"#aaa" }}>One last step before we pull your voter guide.</p>

              {!regStatus && (
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  {[
                    { val:"confirmed", label:"I am registered and confirmed", sub:"I have verified my registration is active and up to date" },
                    { val:"need-to-check", label:"I need to check my registration", sub:"I may be registered but want to verify my status" },
                    { val:"need-to-register", label:"I need to register", sub:"I am not yet registered or need to re-register" },
                  ].map(function(opt) {
                    return (
                      <button key={opt.val} className={"regBtn" + (regStatus === opt.val ? " sel" : "")}
                        style={{ background:"#141414", borderRadius:"6px", padding:"18px 20px", textAlign:"left", cursor:"pointer", border:"2px solid transparent" }}
                        onClick={function() { setRegStatus(opt.val); setRegistered(opt.val === "confirmed"); }}>
                        <div style={{ fontFamily:FF_SYNE, fontWeight:600, fontSize:"15px", color:"#eee", marginBottom:"4px" }}>{opt.label}</div>
                        <div style={{ fontSize:"13px", color:"#666" }}>{opt.sub}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              {regStatus === "need-to-check" && (
                <RegCheckPanel state={addr.state} setRegistered={setRegistered} setRegStatus={setRegStatus} />
              )}

              {regStatus === "need-to-register" && (
                <RegRegisterPanel state={addr.state} />
              )}

              {regStatus && (
                <button style={{ background:"none", border:"none", color:"#555", fontFamily:FF_SYNE, fontSize:"12px", cursor:"pointer", textDecoration:"underline", alignSelf:"flex-start" }}
                  onClick={function() { setRegStatus(null); setRegistered(null); }}>
                  Back to options
                </button>
              )}

              {error === "RATE_LIMIT" && (
                <div style={{ background:"rgba(200,249,122,.06)", border:"1px solid rgba(200,249,122,.25)", borderRadius:"6px", padding:"18px 20px", display:"flex", flexDirection:"column", gap:"8px" }}>
                  <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", color:"#445B3E" }}>We are experiencing high demand right now</div>
                  <div style={{ fontSize:"13px", color:"#aaa", lineHeight:1.6 }}>Our servers are busy helping other voters. Please wait a few minutes and try again. Your selections have been saved.</div>
                  <button className="cta" style={{ background:"#445B3E", color:"#fff", fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", padding:"10px 24px", borderRadius:"4px", alignSelf:"flex-start", marginTop:"4px" }}
                    onClick={function() { setError(null); run(); }}>Try Again</button>
                </div>
              )}
              {error && error !== "RATE_LIMIT" && (
                <div style={{ background:"rgba(255,80,80,.1)", border:"1px solid rgba(255,80,80,.3)", borderRadius:"4px", padding:"12px 16px", fontSize:"14px", color:"#ff8080", fontFamily:FF_SYNE }}>{error}</div>
              )}

              {(regStatus === "confirmed" || regStatus === "need-to-register") && (
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  <button className="cta" style={{ background:"#445B3E", color:"#fff", fontFamily:FF_SYNE, fontWeight:700, fontSize:"15px", letterSpacing:".08em", padding:"16px 36px", borderRadius:"4px", alignSelf:"flex-start" }} disabled={loading} onClick={run}>
                    {loading ? ("◌ " + loadMsg + "...") : "Generate My Voter Guide"}
                  </button>
                  {loading && (
                    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                      <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                        {[
                          { label:"Representatives", msg:"Finding your representatives..." },
                          { label:"State Legislators", msg:"Finding your state legislators..." },
                          { label:"Voting Records", msg:"Finding local elections..." },
                          { label:"Candidate Match", msg:"Searching voting records in your area..." },
                        ].map(function(s, i, arr) {
                          const msgs = arr.map(function(x) { return x.msg; });
                          const curIdx = loadMsg === "Finding your representatives..." ? 0
                            : loadMsg === "Finding your state legislators..." ? 1
                            : loadMsg === "Finding local elections..." || loadMsg === "Fetching verified election dates..." ? 2
                            : loadMsg === "Analyzing voting records..." || loadMsg === "Searching voting records in your area..." ? 3
                            : loadMsg ? 4 : 0;
                          const done = i < curIdx;
                          const active = i === curIdx;
return (
                            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"6px", flex:1 }}>
                              <div style={{ position:"relative", width:"40px", height:"40px" }}>
                                <svg width="40" height="40" viewBox="0 0 40 40">
                                  <circle cx="20" cy="20" r="17" fill="none" stroke="#2a2a2a" strokeWidth="3" />
                                  {done && <circle cx="20" cy="20" r="17" fill="none" stroke="#445B3E" strokeWidth="3" strokeDasharray="107" strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 20 20)" />}
                                  {active && <circle cx="20" cy="20" r="17" fill="none" stroke="#445B3E" strokeWidth="3" strokeDasharray="107" strokeDashoffset="54" strokeLinecap="round" transform="rotate(-90 20 20)" style={{ animation:"spin 1.5s linear infinite" }} />}
                                </svg>
                                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px" }}>
                                  {done ? "✓" : active ? "" : <span style={{ color:"#333", fontSize:"12px" }}>{i+1}</span>}
                                </div>
                              </div>
                              <div style={{ fontFamily:FF_SYNE, fontSize:"10px", color: done ? "#445B3E" : active ? "#aaa" : "#444", textAlign:"center", lineHeight:1.3 }}>{s.label}</div>
                            </div>
                          );
                        })}
                      </div>
                      <p style={{ fontSize:"13px", color:"#555", fontFamily:FF_SYNE, lineHeight:1.6 }}>This may take a minute or two. Please be patient.</p>
                    </div>
                  )}
                  {!loading && (
                    <p style={{ fontSize:"13px", color:"#555", fontFamily:FF_SYNE, lineHeight:1.6 }}>This may take a minute or two. We are pulling voting records, representative data, and local election information for your address.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {cur === "results" && results && (
            <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
              <div className="screen-only" style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                <div style={{ fontFamily:FF_SYNE, fontSize:"11px", fontWeight:600, letterSpacing:".18em", color:"#445B3E", textTransform:"uppercase" }}>Your Civic Match</div>
                <h2 style={{ fontFamily:FF_SYNE, fontSize:"clamp(26px,5vw,42px)", fontWeight:700, lineHeight:1.1, color:"#f8f8f8" }}>Your personalized<br />voter guide</h2>
                <div style={{ fontFamily:FF_SYNE, fontSize:"15px", color:"#aaa" }}>
                  {[addr.city, addr.state].filter(Boolean).join(", ")}
                </div>
              </div>

              <div className="print-disclaimer screen-only" style={{ background:"#1a1a1a", border:"1px solid #333", borderRadius:"6px", padding:"12px 16px", fontSize:"12px", color:"#999", lineHeight:1.6, marginTop:"4px" }}>
                AI-generated from Congress.gov, OpenStates, and public records. Officeholder data may be outdated — always verify with your{" "}<a href={STATE_ELECTION_SITES[addr.state] || "https://usa.gov/election-office"} target="_blank" rel="noopener noreferrer" style={{ color:"#445B3E", textDecoration:"underline" }}>{addr.state} State Election Website</a>.
              </div>

              <Tabs sections={[...parseSections(results), { heading: "Upcoming Ballot", body: [] }, { heading: "Election Reminders", body: [] }, { heading: "Resources", body: [
          "**NAACP Legal Defense Fund** — Fighting for voting rights and racial justice in the courts",
          "Website: https://www.naacpldf.org | Instagram: https://www.instagram.com/naacp_ldf",
          "",
          "**Democracy Docket** — Real-time tracking of voting rights litigation across the country",
          "Website: https://www.democracydocket.com | Instagram: https://www.instagram.com/democracydocket",
          "",
          "**Black Voters Matter** — Amplifying Black voting power in communities across the South and beyond",
          "Website: https://www.blackvotersmatterfund.org | Instagram: https://www.instagram.com/blackvotersmatter",
          "",
          "**Congress.gov** — Official voting records and legislation for all federal representatives",
          "Website: https://www.congress.gov",
          "",
          "**OpenStates** — State legislative data, voting records, and bill tracking",
          "Website: https://www.openstates.org",
          "",
          "**Ballotpedia** — Comprehensive candidate profiles, election history, and local races",
          "Website: https://www.ballotpedia.org",
          "",
          "**Vote411** — League of Women Voters voter guide with local candidate Q&A",
          "Website: https://www.vote411.org",
          "",
          "**BallotReady** — Personalized ballot guide covering local races by address",
          "Website: https://www.ballotready.org",
          "",
          "**USA.gov Elected Officials** — Find all your current elected officials at every level",
          "Website: https://www.usa.gov/elected-officials"
        ] }]} photos={photos} location={[addr.city, addr.state].filter(Boolean).join(", ")} addr={addr} proxy={PROXY} />

              

              <div style={{ fontSize:"12px", color:"#444", lineHeight:1.6, borderTop:"1px solid #1e1e1e", paddingTop:"16px", fontStyle:"italic" }}>
                Federal data from Congress.gov. State data from OpenStates. Local election guidance based on AI analysis. Verify with your county board of elections. Nonpartisan and informational. No personal data stored.
              </div>

              {!registered && regUrl && (
                <div style={{ background:"rgba(200,249,122,.06)", border:"1px solid rgba(200,249,122,.3)", borderRadius:"6px", padding:"20px 22px", display:"flex", flexDirection:"column", gap:"10px" }}>
                  <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", color:"#445B3E" }}>Check or Complete Your Registration</div>
                  <p style={{ fontSize:"14px", color:"#aaa", lineHeight:1.6 }}>Use your state's official voter registration portal to confirm or complete your registration before the deadline.</p>
                  <a href={regUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#445B3E", textDecoration:"none" }}>
                    {"Go to " + addr.state + " Voter Registration"}
                  </a>
                </div>
              )}

              <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
                <button className="cta" style={{ background:"#445B3E", color:"#fff", fontFamily:FF_SYNE, fontWeight:700, fontSize:"15px", letterSpacing:".08em", padding:"16px 36px", borderRadius:"4px" }}
                  onClick={function() { window.print(); }}>
                  Print Voter Guide
                </button>
                <button className="cta" style={{ background:"#2a2a2a", color:"#445B3E", fontFamily:FF_SYNE, fontWeight:700, fontSize:"15px", letterSpacing:".08em", padding:"16px 36px", borderRadius:"4px" }}
                onClick={function() { setStep(0); setPriorities({}); setAddr({street:"",city:"",state:"",zip:""}); setRegistered(null); setRegStatus(null); setResults(null); setRegUrl(null); setError(null); go(0); }}>
                Start Over
              </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <footer className="screen-only" style={{ textAlign:"center", padding:"24px 16px", borderTop:"1px solid #1a1a1a", marginTop:"16px" }}>
        <a href="https://blkgrn.com" target="_blank" rel="noopener noreferrer">
          <img src="/blkgrn-logo.png" alt="BLK + GRN" style={{ height:"28px", marginBottom:"10px", opacity:0.85 }} />
        </a>
        <div style={{ fontSize:"11px", color:"#555", lineHeight:1.6 }}>
          Civic Match is a BLK + GRN initiative &nbsp;&bull;&nbsp;
          <a href="https://blkgrn.com" target="_blank" rel="noopener noreferrer" style={{ color:"#666", textDecoration:"underline" }}>blkgrn.com</a>
          <br />&copy; {new Date().getFullYear()} BLK + GRN. For informational purposes only. Always verify with official sources.
        </div>
      </footer>
    </div>
  );
}
