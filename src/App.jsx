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

function renderLine(line, i, photos, usedPhotoUrls) {
  if (!usedPhotoUrls) usedPhotoUrls = new Set();
  const t = line.trim();
  if (!t) return <br key={i} />;
  if (t.indexOf("Note:") === 0 || t.indexOf("Note (") === 0) return null;
  if (t.indexOf("### ") === 0) {
    return <div key={i} style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#C8F97A", marginTop:"8px", marginBottom:"4px" }}>{t.slice(4)}</div>;
  }

  // Style inline citations — anything in parentheses that looks like a citation
  function billUrl(inner) {
    var hrMatch = inner.match(/H\.?R\.?\s*(\d+)/i);
    var sMatch = inner.match(/(?:^|[^A-Z])S\.\s*(\d+)/i);
    var sbMatch = inner.match(/SB\s*(\d+)/i);
    var hbMatch = inner.match(/HB\s*(\d+)/i);
    if (hrMatch) return "https://www.congress.gov/search?q=" + encodeURIComponent("H.R." + hrMatch[1]);
    if (sMatch) return "https://www.congress.gov/search?q=" + encodeURIComponent("S." + sMatch[1]);
    if (sbMatch) return "https://openstates.org/search/?query=" + encodeURIComponent("SB " + sbMatch[1]);
    if (hbMatch) return "https://openstates.org/search/?query=" + encodeURIComponent("HB " + hbMatch[1]);
    return null;
  }

  function styleCitations(text) {
    return text
      .replace(/(https?:\/\/[^\s<)]+)/g, function(url) {
        const display = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color:#C8F97A;text-decoration:underline;word-break:break-all;">' + display + '</a>';
      })
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\(([^)]{5,})\)/g, function(match, inner) {
        if (/\d{4}|H\.?R\.|SB |HB |Act|Bill|vote|voted|statement|report|Executive|County|Office|Board|policy|initiative|law/i.test(inner)) {
          var url = billUrl(inner);
          if (url) {
            return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#C8F97A;font-family:\'Syne\',sans-serif;background:#1a1a1a;padding:1px 6px;border-radius:3px;white-space:nowrap;text-decoration:underline;">(' + inner + ')</a>';
          }
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
  if (photoUrl && !strong && !partial && !low && isCandidateHeader && !usedPhotoUrls.has(photoUrl)) {
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
        {cur.heading === "Questions to Ask" && (
          <div style={{ background:"#111", border:"1px solid #2a2a2a", borderRadius:"6px", padding:"14px 18px", marginBottom:"4px" }}>
            <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#C8F97A", marginBottom:"6px" }}>Make your voice heard in person</div>
            <div style={{ fontSize:"13px", color:"#aaa", lineHeight:1.7 }}>
              The most powerful way to create change is to show up and make noise. Research shows it only takes five calls to get a representative's attention — your representatives' phone numbers are listed in the Contact section below. Check their Instagram to find out when in-person meetings are being held. Bring this personalized question guide to your next town hall and hold your officials accountable to their actual voting record.
            </div>
          </div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {(function() { var used = new Set(); return cur.body.map(function(line, i) { return renderLine(line, i, props.photos, used); }); })()}
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
        <div style={{ textAlign:"center", marginBottom:"20px", paddingBottom:"16px", borderBottom:"2px solid #000" }}>
          <img src="/blkgrn-logo.png" alt="BLK + GRN" style={{ height:"32px" }} />
          <div style={{ fontSize:"11px", color:"#666", marginTop:"6px" }}>Civic Match — Your Personalized Voter Guide</div>
        </div>
        {secs.map(function(sec, si) {
          return (
            <div key={si} style={{ marginBottom:"24px", pageBreakInside:"avoid" }}>
              <div style={{ fontWeight:700, fontSize:"14px", textTransform:"uppercase", paddingBottom:"8px", borderBottom:"1px solid #ccc", marginBottom:"12px" }}>{sec.heading}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                {(function() { var used = new Set(); return sec.body.map(function(line, i) { return renderLine(line, i, props.photos, used); }); })()}
              </div>
            </div>
          );
        })}
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
  const allRated = true; // Issue selection removed - all issues shown by default
  const canContinue = addr.street.trim() && addr.city.trim() && addr.state.length === 2 && addr.zip.length === 5;

  function go(n) {
    setAnim(false);
    setTimeout(function() { setStep(n); setAnim(true); }, 200);
  }

  function buildPrompt(members, stateLeg, voteData, localElections, dwData, dwStateUrls) {
    const issueList = ISSUES.map(function(i) { return "- " + i.label; }).join("\n");

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

    return "You are a nonpartisan civic information assistant. Be specific, concise, and evidence-based. Every opinion about a candidate must have an inline citation immediately after it. DATA ACCURACY RULES: (1) Prioritize Congress.gov/OpenStates/Google Civic API data over your training knowledge. Always include each representative's official office phone number from their .gov website, not campaign numbers. (2) For any official whose term may have ended after November 2024, add (Verify current status) after their name. (3) Never assume incumbency for offices with elections after November 2024. (4) Every claim needs an inline citation with a date. (5) If a term end date has already passed, flag it as: Term ended [date] - current officeholder unverified. The API data provided may sometimes miscategorize federal legislators as state legislators or vice versa. NOTE: As of June 2025, Aisha Braveboy is the Prince George's County Executive (not State's Attorney — that role is now held by Tara Jackson) — use the names provided and your own knowledge of their actual roles, voting records, and positions to produce accurate results. Never refuse to provide information about a named representative just because the API data appears miscategorized. If you can identify the representative by name, provide their full record.\n\nVOTER INFO:\nAddress: " + fullAddr + "\nState: " + addr.state + "\nRegistered: " + (registered ? "Yes" : "No/Unsure") + "\n\nFEDERAL REPS (Congress.gov):\n" + membersStr + "\n\nSTATE LEGISLATORS (OpenStates):\n" + stateStr + "\n\nVERIFIED ELECTION DATES (Democracy Works):\n" + dwStr + "\n\nSTATE VOTING URLS:\n" + dwUrlStr + "\n\nLOCAL OFFICIALS & ELECTIONS (Google Civic + your knowledge):\n" + localStr + "\n\nVOTING RECORD ALIGNMENT:\n" + voteStr + "\n\nVOTER PRIORITIES:\n" + issueList + "\n\nPRODUCE THESE SECTIONS. Be concise — 2-4 sentences per candidate max. Group related information together. No long paragraphs.\n\n## Your Districts\nOne clean list: Congressional district, State Senate district, State House district, County, City, School board district. No prose — just the list.\n## Federal Representatives\nFor each rep, cover ALL voter priorities listed above — not just the top 3. For each priority, include their position with an inline citation. Format:\n**[Name] — [Office] — Phone: [official .gov office phone] — Elected: [date elected] — Term ends: [date term ends]**\n- [Priority]: [Their position + inline citation]\n(repeat for every priority)\n**Contact:** [official office phone] | [Instagram URL if known]\n\n## State Legislators\nSame format as Federal Representatives.\n\n## Local Elections\nUsing the local data provided OR your own knowledge for this address, list current officeholders and upcoming races for county, city, school board, and other local offices. For each:\n**[Name] ([Party]) — [Office] — Phone: [official .gov office phone] — Elected: [date] — Term ends: [date]**\n- [Priority]: [Known position on voter priorities + inline citation if available]\nEnd each officeholder entry with: **Contact:** [official office phone] | [Instagram URL if known]\\nIf no data is available for an office, use your best knowledge for this specific address.\n\n## Questions to Ask\nFor EVERY voter priority listed above, provide 2 sharp, specific questions a voter should ask their representatives at town halls. Then add a subsection **Contact Your Representatives** listing for each rep: their official .gov office phone number, and their verified Instagram URL (https://instagram.com/handle) for finding in-person meeting announcements. One entry per rep. Only include information you are certain is accurate. Format:\n**[Priority name]**\n- [Question]\n- [Question]\n\n## Election Dates\nIf verified Democracy Works data is provided above, use it to list upcoming elections with dates, registration deadlines, voting methods, early voting windows, and polling place lookup URLs. If no verified data is available, use your own knowledge to list the next primary date, general election date, voter registration deadline, and early voting window for this state. Always produce this section.\n\nCITATION RULES:\n- Every factual claim about a candidate gets an inline citation in parentheses immediately after the claim\n- Format: (Bill name/number, vote direction, date) or (Source name, date) or (Official statement, date)\n- Never group citations at the end — they go right next to the claim they support\n- If you cannot cite a claim, do not make it\n- For each candidate, list every issue you can find a position on. For issues with no voting record, bill sponsorship, or public statement, do not scatter 'No recorded position' entries throughout — instead group all issues with no recorded position together at the end of that candidate's section under a single line: **No recorded position found on:** [comma-separated list of issues]. Do not infer positions based on party affiliation or related votes. Never include notes, disclaimers, or explanations about data sources, API categorization, or district mapping — just present the information directly. CRITICAL: Every bold header MUST start with the person's name. CORRECT: **Angela Alsobrooks -- County Executive -- Elected: 2018 -- Term ends: December 2026**. WRONG: **County Executive -- Angela Alsobrooks -- ...**. NEVER put the office before the name. No padding. No repetition.";
  }

  
  function isPersonPage(d) {
    // Wikipedia returns type="standard" for biographical pages
    if (d.type && d.type !== "standard") return false;
    const desc = (d.description || "").toLowerCase();
    const extract = (d.extract || "").toLowerCase();
    // Reject if description clearly identifies a non-person entity
    const nonPersonWords = ["building", "stadium", "arena", "hospital", "bridge", "city of", "town of", "county seat", "nonprofit", "organization", "company", "corporation", "founded in", "is a city", "is a town", "is a county", "is a district", "is a school"];
    if (nonPersonWords.some(function(w) { return desc.includes(w) || extract.slice(0, 200).includes(w); })) return false;
    // Reject if the thumbnail URL looks like architecture/landscape (contains common non-portrait signals)
    const thumb = (d.thumbnail && d.thumbnail.source) ? d.thumbnail.source.toLowerCase() : "";
    const nonPortraitPatterns = ["building", "courthouse", "capitol", "skyline", "aerial", "campus", "stadium", "hospital", "bridge", "church", "map", "flag", "seal", "logo", "coat_of_arms"];
    if (nonPortraitPatterns.some(function(p) { return thumb.includes(p); })) return false;
    return true;
  }

  async function fetchWikiPhoto(name) {
    try {
      const q = encodeURIComponent(name.replace(/ /g, "_"));
      const r = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + q);
      if (r.ok) {
        const d = await r.json();
        if (d.thumbnail && d.thumbnail.source && isPersonPage(d)) return d.thumbnail.source;
      }
      // Try with disambiguation terms
      for (const suffix of [" politician", " U.S. Representative", " senator", " congressman", " council member"]) {
        const rs = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent((name + suffix).replace(/ /g, "_")));
        if (rs.ok) {
          const ds = await rs.json();
          if (ds.thumbnail && ds.thumbnail.source && isPersonPage(ds)) return ds.thumbnail.source;
        }
      }
      const s = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(name + " politician") + "&format=json&origin=*&srlimit=1");
      if (!s.ok) return null;
      const sd = await s.json();
      const title = sd.query && sd.query.search && sd.query.search[0] && sd.query.search[0].title;
      if (!title) return null;
      const r2 = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(title.replace(/ /g, "_")));
      if (!r2.ok) return null;
      const d2 = await r2.json();
      return (d2.thumbnail && d2.thumbnail.source && isPersonPage(d2)) ? d2.thumbnail.source : null;
    } catch(e) { return null; }
  }

  async function run() {
    setLoading(true);
    setError(null);
    setResults(null);
    setRegUrl(REGS[addr.state.toUpperCase()] || "https://vote.org/register-to-vote/");

    let members = [], stateLeg = [], voteData = {}, localElections = [], dwData = null, dwStateUrls = null;

    try {
      setLoadMsg("Finding your representatives...");
      const r1 = await fetch(PROXY + "?endpoint=congress-members&state=" + addr.state.toUpperCase());
      if (r1.ok) {
        const d = await r1.json();
        members = (d.members || []).filter(function(m) {
          if (!m.state || m.state.toUpperCase() !== addr.state.toUpperCase()) return false;
          if (m.terms && m.terms.item) {
            const terms = Array.isArray(m.terms.item) ? m.terms.item : [m.terms.item];
            const lastTerm = terms[terms.length - 1];
            if (lastTerm && lastTerm.endYear) {
              const endYear = parseInt(lastTerm.endYear);
              if (endYear < 2025) return false;
            }
          }
          return true;
        }).slice(0, 6);
      }
    } catch(e) { console.warn("Congress:", e.message); }

    try {
      setLoadMsg("Finding your state legislators...");
      const r2 = await fetch(PROXY + "?endpoint=state-legislators&address=" + encodeURIComponent(fullAddr));
      if (r2.ok) {
        const d = await r2.json();
        stateLeg = (d.results || []).slice(0, 6);
      }
    } catch(e) { console.warn("OpenStates:", e.message); }

    try {
      setLoadMsg("Finding local elections...");
      const rr = await fetch(PROXY + "?endpoint=representatives&address=" + encodeURIComponent(fullAddr));
      if (rr.ok) {
        const dr = await rr.json();
        const offices = dr.offices || [];
        const officials = dr.officials || [];
        console.log("Google Civic offices:", offices.map(function(o) { return o.name + " | " + JSON.stringify(o.levels); }));
        const localOffices = offices.filter(function(o) {
          const lvl = (o.levels || []).join(",").toLowerCase();
          return !lvl.includes("country") && !lvl.includes("administrativearea1");
        });
        console.log("Local offices after filter:", localOffices.map(function(o) { return o.name; }));
        const localReps = localOffices.map(function(o) {
          const reps = (o.officialIndices || []).map(function(idx) { return officials[idx]; }).filter(Boolean);
          return { office: o.name, type: "local", candidates: reps.map(function(r) { return { name: r.name, party: r.party || "Unknown" }; }) };
        }).filter(function(o) { return o.candidates.length > 0; });
        console.log("Local reps:", localReps);
        if (localReps.length > 0) localElections = localReps;
      } else {
        console.warn("Google Civic response not ok:", rr.status);
      }
    } catch(e) { console.warn("Google Civic:", e.message); }

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
        const r3 = await fetch(PROXY + "?endpoint=member-votes&memberId=" + m.bioguideId);
        if (r3.ok) {
          const d = await r3.json();
          voteData[m.name] = scoreVotes(d.votes || [], priorities);
        }
      }
    } catch(e) { console.warn("Votes:", e.message); }

    try {
      
    const allNames = [
      ...members.map(function(m) { return m.name; }),
      ...stateLeg.map(function(l) { return l.name; })
    ];
    const photoMap = {};
    await Promise.all(allNames.map(async function(name) {
      const p = await fetchWikiPhoto(name);
      if (p) photoMap[name] = p;
    }));
    setPhotos(photoMap);

    setLoadMsg("Matching your priorities to candidates...");
      const ANTH_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ""; const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "x-api-key": ANTH_KEY, "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 6000, messages: [{ role: "user", content: buildPrompt(members, stateLeg, voteData, localElections, dwData, dwStateUrls) }] }),
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
      console.log("Extracted candidate names:", boldNames);
      const newPhotoMap = Object.assign({}, photoMap);
      await Promise.all(boldNames.map(async function(name) {
        if (!newPhotoMap[name]) {
          const p = await fetchWikiPhoto(name);
          console.log("Photo for", name, ":", p ? "found" : "not found");
          if (p) newPhotoMap[name] = p;
        }
      }));
      setPhotos(newPhotoMap);

      go(3);
    } catch(e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0e0e0e", color:"#f0f0f0", fontFamily:FF_NEWS, display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Newsreader:ital,wght@0,300;0,400;1,300&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:#C8F97A;color:#0e0e0e;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#C8F97A;border-radius:2px;}
        .sIn{animation:sIn .3s ease forwards;}
        .sOut{animation:sOut .2s ease forwards;}
        @keyframes sIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes sOut{from{opacity:1;}to{opacity:0;}}
        button.cta{transition:all .18s ease;cursor:pointer;border:none;}
        button.cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(200,249,122,.25);}
        button.cta:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;}
        .print-only{display:none;}
        @media print{
          .screen-only{display:none!important;}
          .print-only{display:block!important;}
          body{background:#fff!important;color:#000!important;font-size:11px!important;}
          button{display:none!important;}
          *{color:#000!important;background:#fff!important;border-color:#ccc!important;box-shadow:none!important;}
          img{width:36px!important;height:36px!important;border-radius:50%!important;}
          h2{font-size:20px!important;}
          div[style*="gap"]{gap:4px!important;}
        }
        input:focus{outline:none;border-color:#C8F97A!important;}
        a{color:#C8F97A;}
        .regBtn{transition:border-color .15s ease;}
        .regBtn:hover{border-color:#C8F97A!important;}
        .regBtn.sel{border-color:#C8F97A!important;background:rgba(200,249,122,.08)!important;}
        .pBtn{transition:all .15s ease;cursor:pointer;border:none;}
        .pBtn:hover{filter:brightness(1.15);}
        @keyframes spin{from{stroke-dashoffset:107;}to{stroke-dashoffset:-107;}}
      `}</style>

      <div style={{ display:"flex", alignItems:"center", gap:"16px", padding:"20px 32px", borderBottom:"1px solid #1e1e1e", position:"sticky", top:0, background:"#0e0e0e", zIndex:10 }}>
        <div style={{ fontFamily:FF_SYNE, fontWeight:800, fontSize:"14px", letterSpacing:".15em", color:"#C8F97A", whiteSpace:"nowrap" }}>CIVIC MATCH</div>
        <div style={{ flex:1, height:"2px", background:"#2a2a2a", borderRadius:"1px", overflow:"hidden" }}>
          <div style={{ height:"100%", background:"#C8F97A", borderRadius:"1px", transition:"width .4s ease", width: (step/(STEPS.length-1)*100)+"%" }} />
        </div>
        <div style={{ fontFamily:FF_SYNE, fontSize:"11px", color:"#555", whiteSpace:"nowrap" }}>{step+1} / {STEPS.length}</div>
      </div>

      <div style={{ flex:1, display:"flex", justifyContent:"center", padding:"40px 20px 80px" }}>
        <div className={anim ? "sIn" : "sOut"} style={{ width:"100%", maxWidth:"680px" }}>

          {cur === "welcome" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
              <div style={{ fontFamily:FF_SYNE, fontSize:"11px", fontWeight:600, letterSpacing:".18em", color:"#C8F97A", textTransform:"uppercase" }}>Your Voice. Your Vote.</div>
              <h1 style={{ fontFamily:FF_SYNE, fontSize:"clamp(36px,7vw,64px)", fontWeight:800, lineHeight:1.05, color:"#f8f8f8" }}>
                Find candidates<br /><em style={{ fontStyle:"italic", fontWeight:300 }}>who match what you believe.</em>
              </h1>
              <p style={{ fontSize:"17px", lineHeight:1.7, color:"#aaa" }}>Get a personalized guide showing how your actual representatives have voted at every level of government — federal, state, and local.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {["Real voting records","District identification","Real voting records","Local election coverage"].map(function(f) {
                  return <div key={f} style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"14px", color:"#ccc", fontFamily:FF_SYNE }}><span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#C8F97A", flexShrink:0, display:"block" }} />{f}</div>;
                })}
              </div>
              <button className="cta" style={{ background:"#C8F97A", color:"#0e0e0e", fontFamily:FF_SYNE, fontWeight:700, fontSize:"15px", letterSpacing:".08em", padding:"16px 36px", borderRadius:"4px", alignSelf:"flex-start", marginTop:"8px" }} onClick={function() { go(1); }}>Get Started</button>
            </div>
          )}

          {cur === "address" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
              <div style={{ fontFamily:FF_SYNE, fontSize:"11px", fontWeight:600, letterSpacing:".18em", color:"#C8F97A", textTransform:"uppercase" }}>Step 1 of 2</div>
              <h2 style={{ fontFamily:FF_SYNE, fontSize:"clamp(26px,5vw,42px)", fontWeight:700, lineHeight:1.1, color:"#f8f8f8" }}>Where do you vote?</h2>
              <p style={{ fontSize:"17px", lineHeight:1.7, color:"#aaa" }}>Your ZIP code is enough to identify your federal and state representatives. No data is stored.</p>

              <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:"6px", padding:"16px 18px", display:"flex", flexDirection:"column", gap:"6px" }}>
                <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"12px", color:"#C8F97A", letterSpacing:".08em" }}>Why add your full address?</div>
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
                    <span style={{ fontFamily:FF_SYNE, fontSize:"10px", color:"#C8F97A", background:"rgba(200,249,122,.1)", padding:"2px 8px", borderRadius:"20px" }}>Required</span>
                  </div>
                  <input style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:"4px", padding:"14px 16px", fontSize:"16px", color:"#f0f0f0", fontFamily:FF_NEWS2, width:"100%" }}
                    autoComplete="postal-code" placeholder="21201" maxLength={5} value={addr.zip}
                    onChange={function(e) { const v = e.target.value.replace(/\D/g,""); setAddr(function(a) { return { street:a.street, city:a.city, state:a.state, zip:v }; }); }} />
                </div>
              </div>
              <button className="cta" style={{ background:"#C8F97A", color:"#0e0e0e", fontFamily:FF_SYNE, fontWeight:700, fontSize:"15px", letterSpacing:".08em", padding:"16px 36px", borderRadius:"4px", alignSelf:"flex-start", marginTop:"8px" }} disabled={addr.zip.length < 5} onClick={function() { go(3); }}>Continue</button>
            </div>
          )}

          {cur === "registration" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
              <div style={{ fontFamily:FF_SYNE, fontSize:"11px", fontWeight:600, letterSpacing:".18em", color:"#C8F97A", textTransform:"uppercase" }}>Step 2 of 2</div>
              <h2 style={{ fontFamily:FF_SYNE, fontSize:"clamp(26px,5vw,42px)", fontWeight:700, lineHeight:1.1, color:"#f8f8f8" }}>Voter registration</h2>
              <p style={{ fontSize:"17px", lineHeight:1.7, color:"#aaa" }}>Where are you with your registration?</p>

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
                  <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", color:"#C8F97A" }}>We are experiencing high demand right now</div>
                  <div style={{ fontSize:"13px", color:"#aaa", lineHeight:1.6 }}>Our servers are busy helping other voters. Please wait a few minutes and try again. Your selections have been saved.</div>
                  <button className="cta" style={{ background:"#C8F97A", color:"#0e0e0e", fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", padding:"10px 24px", borderRadius:"4px", alignSelf:"flex-start", marginTop:"4px" }}
                    onClick={function() { setError(null); run(); }}>Try Again</button>
                </div>
              )}
              {error && error !== "RATE_LIMIT" && (
                <div style={{ background:"rgba(255,80,80,.1)", border:"1px solid rgba(255,80,80,.3)", borderRadius:"4px", padding:"12px 16px", fontSize:"14px", color:"#ff8080", fontFamily:FF_SYNE }}>{error}</div>
              )}

              {(regStatus === "confirmed" || regStatus === "need-to-register") && (
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  <button className="cta" style={{ background:"#C8F97A", color:"#0e0e0e", fontFamily:FF_SYNE, fontWeight:700, fontSize:"15px", letterSpacing:".08em", padding:"16px 36px", borderRadius:"4px", alignSelf:"flex-start" }} disabled={loading} onClick={run}>
                    {loading ? ("◌ " + loadMsg + "...") : "Generate My Voter Guide"}
                  </button>
                  {loading && (
                    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                      <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                        {[
                          { label:"Representatives" },
                          { label:"State Legislators" },
                          { label:"Voting Records" },
                          { label:"Candidate Match" },
                        ].map(function(s, i) {
                          const active = (
                            (i === 0 && loadMsg === "Finding your representatives...") ||
                            (i === 1 && loadMsg === "Finding your state legislators...") ||
                            (i === 2 && loadMsg === "Analyzing voting records...") ||
                            (i === 3 && loadMsg === "Matching your priorities to candidates...")
                          );
                          const done = (
                            (i === 0 && loadMsg !== "Finding your representatives...") ||
                            (i === 1 && (loadMsg === "Analyzing voting records..." || loadMsg === "Matching your priorities to candidates...")) ||
                            (i === 2 && loadMsg === "Matching your priorities to candidates...")
                          );
                          return (
                            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"6px", flex:1 }}>
                              <div style={{ position:"relative", width:"40px", height:"40px" }}>
                                <svg width="40" height="40" viewBox="0 0 40 40">
                                  <circle cx="20" cy="20" r="17" fill="none" stroke="#2a2a2a" strokeWidth="3" />
                                  {done && <circle cx="20" cy="20" r="17" fill="none" stroke="#C8F97A" strokeWidth="3" strokeDasharray="107" strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 20 20)" />}
                                  {active && <circle cx="20" cy="20" r="17" fill="none" stroke="#C8F97A" strokeWidth="3" strokeDasharray="107" strokeDashoffset="54" strokeLinecap="round" transform="rotate(-90 20 20)" style={{ animation:"spin 1.5s linear infinite" }} />}
                                </svg>
                                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px" }}>
                                  {done ? "✓" : active ? "" : <span style={{ color:"#333", fontSize:"12px" }}>{i+1}</span>}
                                </div>
                              </div>
                              <div style={{ fontFamily:FF_SYNE, fontSize:"10px", color: done ? "#C8F97A" : active ? "#aaa" : "#444", textAlign:"center", lineHeight:1.3 }}>{s.label}</div>
                            </div>
                          );
                        })}
                      </div>
                      <p style={{ fontSize:"13px", color:"#555", fontFamily:FF_SYNE, lineHeight:1.6 }}>This may take a minute or two. Please be patient.</p>
                    </div>
                  )}
                  {!loading && (
                    <p style={{ fontSize:"13px", color:"#555", fontFamily:FF_SYNE, lineHeight:1.6 }}>This may take a minute or two. We are pulling real voting records, representative data, and local election information for your address.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {cur === "results" && results && (
            <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
              <div style={{ fontFamily:FF_SYNE, fontSize:"11px", fontWeight:600, letterSpacing:".18em", color:"#C8F97A", textTransform:"uppercase" }}>Your Civic Match</div>
              <h2 style={{ fontFamily:FF_SYNE, fontSize:"clamp(26px,5vw,42px)", fontWeight:700, lineHeight:1.1, color:"#f8f8f8" }}>Your personalized<br />voter guide</h2>

              <div style={{ fontFamily:FF_SYNE, fontSize:"15px", color:"#aaa" }}>
                {[addr.city, addr.state].filter(Boolean).join(", ")}
              </div>

              <div style={{ background:"#1a1a1a", border:"1px solid #333", borderRadius:"6px", padding:"12px 16px", fontSize:"12px", color:"#999", lineHeight:1.6, marginTop:"4px" }}>
                AI-generated from Congress.gov, OpenStates, and public records. Officeholder data may be outdated — always verify with your{" "}<a href={STATE_ELECTION_SITES[addr.state] || "https://usa.gov/election-office"} target="_blank" rel="noopener noreferrer" style={{ color:"#C8F97A", textDecoration:"underline" }}>{addr.state} State Election Website</a>.
              </div>

              <Tabs sections={parseSections(results)} photos={photos} />

              <div className="screen-only" style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:"6px", padding:"20px 22px", display:"flex", flexDirection:"column", gap:"14px" }}>
                <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"12px", letterSpacing:".12em", color:"#888", textTransform:"uppercase" }}>Explore Further</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {[
                    { label:"Congress.gov", desc:"Official voting records and legislation for all federal representatives", url:"https://www.congress.gov" },
                    { label:"OpenStates", desc:"State legislative data, voting records, and bill tracking", url:"https://openstates.org" },
                    { label:"Ballotpedia", desc:"Comprehensive candidate profiles, election history, and local races", url:"https://ballotpedia.org" },
                    { label:"Vote411", desc:"League of Women Voters voter guide with local candidate Q&A", url:"https://www.vote411.org" },
                    { label:"BallotReady", desc:"Personalized ballot guide covering local races by address", url:"https://www.ballotready.org" },
                    { label:"USA.gov Elected Officials", desc:"Find all your current elected officials at every level", url:"https://www.usa.gov/elected-officials" },
                  ].map(function(src) {
                    return (
                      <a key={src.url} href={src.url} target="_blank" rel="noopener noreferrer"
                        style={{ display:"flex", flexDirection:"column", gap:"2px", textDecoration:"none", padding:"10px 12px", background:"#1a1a1a", borderRadius:"4px", border:"1px solid #252525" }}>
                        <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#C8F97A" }}>{src.label}</div>
                        <div style={{ fontSize:"12px", color:"#666", lineHeight:1.5 }}>{src.desc}</div>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div style={{ fontSize:"12px", color:"#444", lineHeight:1.6, borderTop:"1px solid #1e1e1e", paddingTop:"16px", fontStyle:"italic" }}>
                Federal data from Congress.gov. State data from OpenStates. Local election guidance based on AI analysis. Verify with your county board of elections. Nonpartisan and informational. No personal data stored.
              </div>

              {!registered && regUrl && (
                <div style={{ background:"rgba(200,249,122,.06)", border:"1px solid rgba(200,249,122,.3)", borderRadius:"6px", padding:"20px 22px", display:"flex", flexDirection:"column", gap:"10px" }}>
                  <div style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"14px", color:"#C8F97A" }}>Check or Complete Your Registration</div>
                  <p style={{ fontSize:"14px", color:"#aaa", lineHeight:1.6 }}>Use your state's official voter registration portal to confirm or complete your registration before the deadline.</p>
                  <a href={regUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily:FF_SYNE, fontWeight:700, fontSize:"13px", color:"#C8F97A", textDecoration:"none" }}>
                    {"Go to " + addr.state + " Voter Registration"}
                  </a>
                </div>
              )}

              <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
                <button className="cta" style={{ background:"#C8F97A", color:"#0e0e0e", fontFamily:FF_SYNE, fontWeight:700, fontSize:"15px", letterSpacing:".08em", padding:"16px 36px", borderRadius:"4px" }}
                  onClick={function() { window.print(); }}>
                  Print Voter Guide
                </button>
                <button className="cta" style={{ background:"#2a2a2a", color:"#C8F97A", fontFamily:FF_SYNE, fontWeight:700, fontSize:"15px", letterSpacing:".08em", padding:"16px 36px", borderRadius:"4px" }}
                onClick={function() { setStep(0); setPriorities({}); setAddr({street:"",city:"",state:"",zip:""}); setRegistered(null); setRegStatus(null); setResults(null); setRegUrl(null); setError(null); go(0); }}>
                Start Over
              </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <footer style={{ textAlign:"center", padding:"24px 16px", borderTop:"1px solid #1a1a1a", marginTop:"16px" }}>
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
