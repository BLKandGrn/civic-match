import { useState, useRef } from "react";

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
const PC = { 3: "#C8F97A", 2: "#7AC8F9", 1: "#F9C87A", 0: "#3a3a3a" };
const STEPS = ["welcome", "issues", "address", "registration", "results"];
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

function renderLine(line, i, photos) {
  const t = line.trim();
  if (!t) return <br key={i} />;
  if (t.indexOf("Note:") === 0 || t.indexOf("Note (") === 0) return null;
  if (t.indexOf("### ") === 0) {
    return <div key={i} style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#C8F97A", marginTop:"8px", marginBottom:"4px" }}>{t.slice(4)}</div>;
  }

  // Style inline citations — anything in parentheses that looks like a citation
  function styleCitations(text) {
    return text
      .replace(/(https?:\/\/[^\s<)]+)/g, function(url) {
        const display = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color:#C8F97A;text-decoration:underline;word-break:break-all;">' + display + '</a>';
      })
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\(([^)]{10,})\)/g, function(match, inner) {
        // Only style if it looks like a citation (has a year, bill number, or source name)
        if (/\d{4}|HR |S\.|HB |SB |Act|Bill|vote|voted|statement|report|Survey|Journal|Times|Post|Sun|News/i.test(inner)) {
          return '<span style="font-size:11px;color:#666;font-family:\'Syne\',sans-serif;background:#1a1a1a;padding:1px 6px;border-radius:3px;white-space:nowrap;">(' + inner + ')</span>';
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
  if (photoUrl && !strong && !partial && !low && isCandidateHeader) {
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
    const color = strong ? "#C8F97A" : partial ? "#F9C87A" : "#ff8080";
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
        <span style={{ color:"#C8F97A", flexShrink:0, marginTop:"2px", fontSize:"11px" }}>&#9672;</span>
        <span dangerouslySetInnerHTML={{ __html: styleCitations(t.slice(2)) }} />
      </div>
    );
  }
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
              style={{ fontFamily:FF_SYNE, fontWeight:600, fontSize:"11px", letterSpacing:".06em", padding:"6px 12px", borderRadius:"4px", background: tab === i ? "#C8F97A" : "#1a1a1a", color: tab === i ? "#0e0e0e" : "#666", border: tab === i ? "1px solid #C8F97A" : "1px solid #2a2a2a", cursor:"pointer" }}
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
        <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", letterSpacing:".08em", color:"#C8F97A", textTransform:"uppercase", paddingBottom:"10px", borderBottom:"1px solid #1e1e1e" }}>{cur.heading}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {cur.body.map(function(line, i) { return renderLine(line, i, props.photos); })}
        </div>
        <div style={{ display:"flex", gap:"10px", marginTop:"8px" }}>
          {tab > 0 && (
            <button style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", padding:"10px 20px", borderRadius:"4px", background:"#1e1e1e", color:"#C8F97A", border:"none", cursor:"pointer" }}
              onClick={function() { changeTab(tab - 1); }}>
              Prev
            </button>
          )}
          {tab < secs.length - 1 && (
            <button style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", padding:"10px 20px", borderRadius:"4px", background:"#C8F97A", color:"#0e0e0e", border:"none", cursor:"pointer", marginLeft:"auto" }}
              onClick={function() { changeTab(tab + 1); }}>
              Next
            </button>
          )}
        </div>
      </div>
      {/* Print view: all sections expanded */}
      <div className="print-only">
        {secs.map(function(sec, si) {
          return (
            <div key={si} style={{ marginBottom:"28px" }}>
              <div style={{ fontWeight:700, fontSize:"13px", textTransform:"uppercase", paddingBottom:"6px", borderBottom:"2px solid #000", marginBottom:"14px", letterSpacing:"0.1em" }}>{sec.heading}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
                {sec.body.map(function(line, i) {
                  const t = (line || "").trim();
                  const isCandHeader = t.indexOf("**") === 0 && t.indexOf(" — ") >= 0;
                  if (isCandHeader) {
                    return <div key={i} className="candidate-block" style={{ marginTop:"12px" }}>{renderLine(line, i, props.photos)}</div>;
                  }
                  return renderLine(line, i, props.photos);
                })}
              </div>
            </div>
          );
        })}
        <div className="print-footer">
          Powered by BLK + GRN &nbsp;|&nbsp; blkgrn.com &nbsp;|&nbsp; &copy; {new Date().getFullYear()} BLK + GRN. For informational purposes only.
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
        <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#C8F97A", letterSpacing:".06em" }}>Check Your {props.state || "State"} Registration</div>
        <p style={{ fontSize:"14px", color:"#aaa", lineHeight:1.6 }}>Use your state's official voter lookup tool to confirm your registration is active at your current address.</p>
        <a href={checkUrl} target="_blank" rel="noopener noreferrer" style={{ background:"#C8F97A", color:"#0e0e0e", fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", padding:"12px 20px", borderRadius:"4px", textDecoration:"none", alignSelf:"flex-start" }}>
          Check Registration Status
        </a>
        <p style={{ fontSize:"12px", color:"#555", lineHeight:1.6 }}>After checking, confirm your status below so we can include the right resources in your guide.</p>
      </div>
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
        <button className="cta" style={{ background:"#C8F97A", color:"#0e0e0e", fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", padding:"12px 20px", borderRadius:"4px" }}
          onClick={function() { props.setRegistered(true); props.setRegStatus("confirmed"); }}>
          I am registered
        </button>
        <button className="cta" style={{ background:"#1e1e1e", color:"#C8F97A", fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", padding:"12px 20px", borderRadius:"4px", border:"1px solid #2a2a2a" }}
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
      <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#C8F97A", letterSpacing:".06em" }}>How to Register in {props.state || "Your State"}</div>
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
      <a href={regUrl} target="_blank" rel="noopener noreferrer" style={{ background:"#C8F97A", color:"#0e0e0e", fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", padding:"12px 20px", borderRadius:"4px", textDecoration:"none", alignSelf:"flex-start" }}>
        {"Register to Vote in " + (props.state || "Your State")}
      </a>
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
  const allRated = ISSUES.every(function(i) { return priorities[i.id] !== undefined; });
  const canContinue = addr.street.trim() && addr.city.trim() && addr.state.length === 2 && addr.zip.length === 5;

  function go(n) {
    setAnim(false);
    setTimeout(function() { setStep(n); setAnim(true); }, 200);
  }

  function buildPrompt(members, stateLeg, voteData, localElections, dwData, dwStateUrls) {
    const sorted = ISSUES.map(function(i) { return { id:i.id, label:i.label, score: priorities[i.id] || 0 }; }).sort(function(a,b) { return b.score - a.score; });
    const top3 = sorted.slice(0,3).map(function(i) { return i.label; }).join(", ");
    const issueList = sorted.map(function(i) { return "- " + i.label + " (" + PL[i.score] + ")"; }).join("\n");

    const membersStr = members && members.length
      ? members.map(function(m) { return "- " + m.name + " (" + m.partyName + ", " + (m.chamber||"Congress") + (m.district ? ", District " + m.district : "") + ")"; }).join("\n")
      : "No federal member data retrieved.";

    const stateStr = stateLeg && stateLeg.length
      ? stateLeg.map(function(l) { return "- " + l.name + " (" + (l.party||"Unknown") + ", " + (l.current_role&&l.current_role.chamber?l.current_role.chamber:"State Legislature") + ", District " + (l.current_role&&l.current_role.district?l.current_role.district:"?") + ")"; }).join("\n")
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
      : "No local data from API — use your own knowledge for this address.";

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

    return "You are a nonpartisan civic information assistant. Be specific, concise, and evidence-based. Every opinion about a candidate must have an inline citation immediately after it. The API data provided may sometimes miscategorize federal legislators as state legislators or vice versa — use the names provided and your own knowledge of their actual roles, voting records, and positions to produce accurate results. Never refuse to provide information about a named representative just because the API data appears miscategorized. If you can identify the representative by name, provide their full record.\n\nVOTER INFO:\nAddress: " + fullAddr + "\nState: " + addr.state + "\nRegistered: " + (registered ? "Yes" : "No/Unsure") + "\n\nFEDERAL REPS (Congress.gov):\n" + membersStr + "\n\nSTATE LEGISLATORS (OpenStates):\n" + stateStr + "\n\nVERIFIED ELECTION DATES (Democracy Works):\n" + dwStr + "\n\nSTATE VOTING URLS:\n" + dwUrlStr + "\n\nLOCAL OFFICIALS & ELECTIONS (Google Civic + your knowledge):\n" + localStr + "\n\nVOTING RECORD ALIGNMENT:\n" + voteStr + "\n\nVOTER PRIORITIES:\n" + issueList + "\n\nPRODUCE THESE SECTIONS. Be concise — 2-4 sentences per candidate max. Group related information together. No long paragraphs.\n\n## Your Districts\nOne clean list: Congressional district, State Senate district, State House district, County, City, School board district. No prose — just the list.\n## Federal Representatives\nFor each rep, cover ALL voter priorities listed above — not just the top 3. For each priority, include their position with an inline citation. Format:\n**[Name] — [Office] — Elected: [date elected] — Term ends: [date term ends]**\n- [Priority]: [Their position + inline citation]\n(repeat for every priority)\n\n## State Legislators\nSame format as Federal Representatives.\n\n## Local Elections\\nList ALL current local officeholders and upcoming races for this specific address. Include: County Executive, all County Council members (identify the district), State's Attorney, Sheriff, Board of Education members (identify the district), and any other local offices. Use Google Civic data if provided, otherwise use your best knowledge — do not omit officials. Format:\\n**[Name] — [Office] — Elected: [date] — Term ends: [date]**\\n- [Priority]: [Their position + inline citation if available]\\nGroup issues with no recorded position at the end: **No recorded position found on:** [comma-separated list]

CRITICAL FORMAT RULE: Always put the person's name FIRST in every bold header. Use **[Name] — [Office] — ...** never **[Office] — [Name]**. No exceptions.

