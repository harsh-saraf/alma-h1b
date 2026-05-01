import { useState, useMemo } from "react";

const EMPLOYERS = [
  { id: 1, name: "Meridian Health Systems", ein: "84-2931847", candidates: 42, complete: 38, duplicates: 3, petitionerReady: true, status: "ready" },
  { id: 2, name: "Apex Robotics Inc.", ein: "91-4820173", candidates: 28, complete: 22, duplicates: 1, petitionerReady: true, status: "in_progress" },
  { id: 3, name: "NovaBridge Analytics", ein: "73-6192840", candidates: 15, complete: 15, duplicates: 0, petitionerReady: true, status: "ready" },
  { id: 4, name: "Lumen Therapeutics", ein: "62-8301956", candidates: 67, complete: 41, duplicates: 5, petitionerReady: false, status: "blocked" },
  { id: 5, name: "Crestline Manufacturing", ein: "55-7104832", candidates: 19, complete: 19, duplicates: 0, petitionerReady: true, status: "ready" },
  { id: 6, name: "Vantage Cloud Solutions", ein: "38-9201764", candidates: 31, complete: 27, duplicates: 2, petitionerReady: true, status: "in_progress" },
];

const BENEFICIARIES = [
  { id: 1, empId: 1, name: "Priya Venkatesh", passport: "T8294710", dob: "03/15/1994", cob: "India", coc: "India", gender: "F", soc: "15-1252", wage: "III", city: "Boston", state: "MA", zip: "02101", validation: "pass", duplicate: null, template: "ready" },
  { id: 2, empId: 1, name: "Wei Zhang", passport: "E73918204", dob: "11/02/1991", cob: "China", coc: "China", gender: "M", soc: "15-1256", wage: "II", city: "Cambridge", state: "MA", zip: "02139", validation: "pass", duplicate: null, template: "ready" },
  { id: 3, empId: 1, name: "Anika Sharma", passport: "R5820194", dob: "07/28/1996", cob: "India", coc: "India", gender: "F", soc: "29-1228", wage: "", city: "Boston", state: "MA", zip: "02101", validation: "warning", validationDetails: "V6: OEWS wage level missing", duplicate: null, template: "blocked" },
  { id: 4, empId: 1, name: "Carlos Mendez", passport: "MX4829103", dob: "01/09/1989", cob: "Mexico", coc: "Mexico", gender: "M", soc: "17-2141", wage: "III", city: "Worcester", state: "MA", zip: "01601", validation: "pass", duplicate: null, template: "ready" },
  { id: 5, empId: 1, name: "Tomoko Hayashi", passport: "TZ8291047", dob: "05/14/1993", cob: "Japan", coc: "Japan", gender: "F", soc: "15-1252", wage: "II", city: "Boston", state: "MA", zip: "02101", validation: "block", validationDetails: "V2: Country 'Japan' — verify matches USCIS list entry", duplicate: null, template: "blocked" },
  { id: 6, empId: 1, name: "Ravi Krishnan", passport: "T8294711", dob: "09/30/1990", cob: "India", coc: "India", gender: "M", soc: "15-1211", wage: "III", city: "Boston", state: "MA", zip: "02101", validation: "warning", validationDetails: "V10: Duplicate risk — strong fuzzy match", duplicate: "strong_fuzzy", duplicateMatch: "Ravi Krishnan (Apex Robotics, passport R6291048)", template: "blocked" },
  { id: 7, empId: 1, name: "Elena Popova", passport: "RU2918374", dob: "12/05/1995", cob: "Russia", coc: "Russia", gender: "F", soc: "11-9041", wage: "II", city: "Cambridge", state: "MA", zip: "02139", validation: "pass", duplicate: null, template: "ready" },
  { id: 8, empId: 1, name: "Sanjay Gupta", passport: "", dob: "04/22/1992", cob: "India", coc: "India", gender: "M", soc: "15-1299", wage: "II", city: "Boston", state: "MA", zip: "02101", validation: "block", validationDetails: "V1: Passport number missing", duplicate: null, template: "blocked" },
  { id: 9, empId: 1, name: "Min-Jun Park", passport: "K4829103", dob: "08/17/1988", cob: "South Korea", coc: "South Korea", gender: "M", soc: "15-1252", wage: "III", city: "Boston", state: "MA", zip: "02101", validation: "block", validationDetails: "V2: 'South Korea' — use USCIS name 'Korea, South'", duplicate: null, template: "blocked" },
  { id: 10, empId: 1, name: "Fatima Al-Hassan", passport: "JO1928374", dob: "06/11/1997", cob: "Jordan", coc: "Jordan", gender: "F", soc: "29-1141", wage: "II", city: "Worcester", state: "MA", zip: "01601", validation: "pass", duplicate: null, template: "ready" },
];

const BATCHES = [
  { id: "B-2027-001", empName: "NovaBridge Analytics", petitioner: "NovaBridge Analytics LLC", count: 15, review: "complete", exceptions: 0, g28: "accepted", payment: "paid", submission: "submitted", confirmation: "CNF-92817364" },
  { id: "B-2027-002", empName: "Meridian Health Systems", petitioner: "Meridian Health Corp.", count: 22, review: "in_review", exceptions: 3, g28: "pending", payment: "unpaid", submission: "not_ready", confirmation: null },
  { id: "B-2027-003", empName: "Meridian Health Systems", petitioner: "Meridian Specialty Group Inc.", count: 16, review: "complete", exceptions: 0, g28: "sent", payment: "unpaid", submission: "not_ready", confirmation: null },
  { id: "B-2027-004", empName: "Apex Robotics Inc.", petitioner: "Apex Robotics Inc.", count: 22, review: "not_started", exceptions: 0, g28: "not_sent", payment: "unpaid", submission: "not_ready", confirmation: null },
  { id: "B-2027-005", empName: "Crestline Manufacturing", petitioner: "Crestline Manufacturing Co.", count: 19, review: "complete", exceptions: 0, g28: "accepted", payment: "paid", submission: "submitted", confirmation: "CNF-10293847" },
  { id: "B-2027-006", empName: "Vantage Cloud Solutions", petitioner: "Vantage Cloud Inc.", count: 18, review: "complete", exceptions: 1, g28: "accepted", payment: "paid", submission: "submitted", confirmation: "CNF-56473829" },
];

const CONFIRMATIONS = [
  { batchId: "B-2027-001", empName: "NovaBridge Analytics", confirmation: "CNF-92817364", status: "Selected", submittedAt: "2026-03-15 09:42 EST", expected: 15, confirmed: 15, auditComplete: true },
  { batchId: "B-2027-005", empName: "Crestline Manufacturing", confirmation: "CNF-10293847", status: "Selected", submittedAt: "2026-03-15 11:18 EST", expected: 19, confirmed: 19, auditComplete: true },
  { batchId: "B-2027-006", empName: "Vantage Cloud Solutions", confirmation: "CNF-56473829", status: "Not Selected", submittedAt: "2026-03-15 14:05 EST", expected: 18, confirmed: 18, auditComplete: false },
];

const StatusBadge = ({ type, label }) => {
  const colors = {
    ready: { bg: "#e9fbf4", color: "#0f9f6e", border: "#b5ecd7" },
    pass: { bg: "#e9fbf4", color: "#0f9f6e", border: "#b5ecd7" },
    complete: { bg: "#e9fbf4", color: "#0f9f6e", border: "#b5ecd7" },
    accepted: { bg: "#e9fbf4", color: "#0f9f6e", border: "#b5ecd7" },
    paid: { bg: "#e9fbf4", color: "#0f9f6e", border: "#b5ecd7" },
    submitted: { bg: "#e9fbf4", color: "#0f9f6e", border: "#b5ecd7" },
    Selected: { bg: "#e9fbf4", color: "#0f9f6e", border: "#b5ecd7" },
    in_progress: { bg: "#fff7e8", color: "#b7791f", border: "#f1d8a6" },
    warning: { bg: "#fff7e8", color: "#b7791f", border: "#f1d8a6" },
    in_review: { bg: "#fff7e8", color: "#b7791f", border: "#f1d8a6" },
    pending: { bg: "#fff7e8", color: "#b7791f", border: "#f1d8a6" },
    sent: { bg: "#eff4ff", color: "#2952cc", border: "#d8e2ff" },
    blocked: { bg: "#fff1ec", color: "#c2410c", border: "#f4c8b9" },
    block: { bg: "#fff1ec", color: "#c2410c", border: "#f4c8b9" },
    unpaid: { bg: "#fff1ec", color: "#c2410c", border: "#f4c8b9" },
    not_ready: { bg: "#f5f0ff", color: "#6d28d9", border: "#e0d4f7" },
    not_started: { bg: "#f7f9fc", color: "#6b7280", border: "#dbe3ee" },
    not_sent: { bg: "#f7f9fc", color: "#6b7280", border: "#dbe3ee" },
    "Not Selected": { bg: "#fff1ec", color: "#c2410c", border: "#f4c8b9" },
  };
  const c = colors[type] || colors.not_started;
  const displayLabel = label || type.replace(/_/g, " ");
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color, border: `1px solid ${c.border}`, textTransform: "capitalize", letterSpacing: "0.02em" }}>
      {displayLabel}
    </span>
  );
};

const ReadinessScore = ({ employer }) => {
  const validPct = Math.round((employer.complete / employer.candidates) * 100);
  const petitioner = employer.petitionerReady ? 100 : 0;
  const dupResolved = employer.duplicates === 0 ? 100 : Math.max(0, 100 - employer.duplicates * 20);
  const overall = Math.round((validPct * 0.5 + petitioner * 0.3 + dupResolved * 0.2));
  const color = overall >= 90 ? "#0f9f6e" : overall >= 60 ? "#b7791f" : "#c2410c";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 60, height: 6, borderRadius: 3, background: "#eef1f6", overflow: "hidden" }}>
        <div style={{ width: `${overall}%`, height: "100%", borderRadius: 3, background: color, transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{overall}%</span>
    </div>
  );
};

const ChecklistItem = ({ done, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13, color: done ? "#0f9f6e" : "#6b7280" }}>
    <span style={{ width: 18, height: 18, borderRadius: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? "#e9fbf4" : "#f7f9fc", border: `1.5px solid ${done ? "#0f9f6e" : "#dbe3ee"}`, fontSize: 11, fontWeight: 700 }}>
      {done ? "✓" : ""}
    </span>
    <span style={{ textDecoration: done ? "none" : "none" }}>{label}</span>
  </div>
);

// ─── SCREENS ──────────────────────────────────────────────

const EmployerDashboard = ({ onSelectEmployer }) => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Employer Dashboard</h2>
      <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>FY2027 H-1B Cap Season — 6 employer clients, 202 total candidates</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
      {[
        { label: "Ready to File", value: EMPLOYERS.filter(e => e.status === "ready").length, color: "#0f9f6e", bg: "#e9fbf4" },
        { label: "In Progress", value: EMPLOYERS.filter(e => e.status === "in_progress").length, color: "#b7791f", bg: "#fff7e8" },
        { label: "Blocked", value: EMPLOYERS.filter(e => e.status === "blocked").length, color: "#c2410c", bg: "#fff1ec" },
      ].map((s, i) => (
        <div key={i} style={{ background: s.bg, borderRadius: 14, padding: "16px 18px", border: `1px solid ${s.color}22` }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
          <div style={{ fontSize: 13, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>

    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #dbe3ee", overflow: "hidden", boxShadow: "0 4px 20px rgba(23,43,77,0.06)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f8fbff", borderBottom: "1px solid #dbe3ee" }}>
            <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a" }}>Employer</th>
            <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a" }}>EIN</th>
            <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a" }}>Candidates</th>
            <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a" }}>Data Complete</th>
            <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a" }}>Dup. Risks</th>
            <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a" }}>Petitioner</th>
            <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a" }}>Readiness</th>
            <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {EMPLOYERS.map(emp => (
            <tr key={emp.id} onClick={() => onSelectEmployer(emp)} style={{ borderBottom: "1px solid #eef1f6", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "#f8fbff"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <td style={{ padding: "14px 16px", fontWeight: 600, color: "#1f2937" }}>{emp.name}</td>
              <td style={{ padding: "14px 16px", color: "#6b7280", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{emp.ein}</td>
              <td style={{ padding: "14px 16px", textAlign: "center", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{emp.candidates}</td>
              <td style={{ padding: "14px 16px", textAlign: "center" }}>
                <span style={{ fontWeight: 700, fontFamily: "'DM Mono', monospace", color: emp.complete === emp.candidates ? "#0f9f6e" : "#b7791f" }}>
                  {emp.complete}/{emp.candidates}
                </span>
              </td>
              <td style={{ padding: "14px 16px", textAlign: "center" }}>
                {emp.duplicates > 0 ? <span style={{ fontWeight: 700, color: "#c2410c", fontFamily: "'DM Mono', monospace" }}>{emp.duplicates}</span> : <span style={{ color: "#0f9f6e" }}>—</span>}
              </td>
              <td style={{ padding: "14px 16px", textAlign: "center" }}>
                <StatusBadge type={emp.petitionerReady ? "ready" : "blocked"} label={emp.petitionerReady ? "Ready" : "Incomplete"} />
              </td>
              <td style={{ padding: "14px 16px", textAlign: "center" }}>
                <ReadinessScore employer={emp} />
              </td>
              <td style={{ padding: "14px 16px", textAlign: "center" }}>
                <StatusBadge type={emp.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DataHub = ({ employer, onBack }) => {
  const [filter, setFilter] = useState("all");
  const bens = BENEFICIARIES.filter(b => b.empId === (employer?.id || 1));
  const filtered = filter === "all" ? bens : bens.filter(b => b.validation === filter || (filter === "duplicate" && b.duplicate));
  const [expandedDup, setExpandedDup] = useState(null);
  const passCount = bens.filter(b => b.validation === "pass").length;
  const warnCount = bens.filter(b => b.validation === "warning").length;
  const blockCount = bens.filter(b => b.validation === "block").length;
  const templateReady = bens.filter(b => b.template === "ready").length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #dbe3ee", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, color: "#6b7280" }}>← Back</button>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{employer?.name || "Meridian Health Systems"} — Data Hub</h2>
          <p style={{ margin: "2px 0 0", color: "#6b7280", fontSize: 13 }}>Beneficiary data, validation, and template status</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Pass", value: passCount, type: "pass" },
          { label: "Warnings", value: warnCount, type: "warning" },
          { label: "Blocked", value: blockCount, type: "block" },
          { label: "Template Ready", value: templateReady, type: "ready" },
        ].map((s, i) => (
          <div key={i} onClick={() => setFilter(s.type === "ready" ? "all" : s.type)} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: `1px solid ${filter === s.type ? "#2952cc" : "#dbe3ee"}`, cursor: "pointer", transition: "border 0.15s" }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["all", "pass", "warning", "block", "duplicate"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1px solid ${filter === f ? "#2952cc" : "#dbe3ee"}`, background: filter === f ? "#eff4ff" : "#fff", color: filter === f ? "#2952cc" : "#6b7280", cursor: "pointer", textTransform: "capitalize" }}>
            {f === "all" ? "All Records" : f}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #dbe3ee", overflow: "auto", boxShadow: "0 4px 20px rgba(23,43,77,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 900 }}>
          <thead>
            <tr style={{ background: "#f8fbff", borderBottom: "1px solid #dbe3ee" }}>
              {["Name", "Passport", "DOB", "COB", "SOC", "Wage", "Location", "Validation", "Duplicate", "Template"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <>
                <tr key={b.id} style={{ borderBottom: "1px solid #eef1f6" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600, whiteSpace: "nowrap" }}>{b.name}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 11, color: b.passport ? "#1f2937" : "#c2410c" }}>{b.passport || "MISSING"}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{b.dob}</td>
                  <td style={{ padding: "10px 12px", fontSize: 11 }}>{b.cob}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{b.soc}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    {b.wage ? <span style={{ fontWeight: 700, fontSize: 11 }}>{b.wage}</span> : <span style={{ color: "#c2410c", fontSize: 11, fontWeight: 700 }}>—</span>}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 11 }}>{b.city}, {b.state}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <StatusBadge type={b.validation} />
                      {b.validationDetails && <span title={b.validationDetails} style={{ cursor: "help", fontSize: 14 }}>ⓘ</span>}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    {b.duplicate ? (
                      <button onClick={() => setExpandedDup(expandedDup === b.id ? null : b.id)} style={{ background: "#fff7e8", border: "1px solid #f1d8a6", borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontWeight: 600, color: "#b7791f" }}>
                        {b.duplicate === "strong_fuzzy" ? "Strong match ▾" : "Fuzzy ▾"}
                      </button>
                    ) : <span style={{ color: "#0f9f6e", fontSize: 11 }}>Clean</span>}
                  </td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge type={b.template === "ready" ? "ready" : "blocked"} label={b.template} /></td>
                </tr>
                {expandedDup === b.id && b.duplicateMatch && (
                  <tr key={`dup-${b.id}`} style={{ background: "#fffcf5" }}>
                    <td colSpan={10} style={{ padding: "10px 16px 14px", fontSize: 12 }}>
                      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <div style={{ flex: 1, padding: 12, background: "#fff", borderRadius: 10, border: "1px solid #f1d8a6" }}>
                          <div style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", color: "#b7791f", marginBottom: 6 }}>Current Record</div>
                          <div><strong>{b.name}</strong> · {b.passport} · {b.dob} · {b.cob}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", fontSize: 20, color: "#b7791f", paddingTop: 16 }}>⇄</div>
                        <div style={{ flex: 1, padding: 12, background: "#fff", borderRadius: 10, border: "1px solid #f1d8a6" }}>
                          <div style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", color: "#b7791f", marginBottom: 6 }}>Potential Duplicate</div>
                          <div><strong>{b.duplicateMatch}</strong></div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 8 }}>
                          <button style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #0f9f6e", background: "#e9fbf4", color: "#0f9f6e", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Not a Duplicate</button>
                          <button style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #c2410c", background: "#fff1ec", color: "#c2410c", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Remove Record</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
        <button disabled={blockCount > 0} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: blockCount > 0 ? "#dbe3ee" : "#2952cc", color: blockCount > 0 ? "#6b7280" : "#fff", fontSize: 14, fontWeight: 700, cursor: blockCount > 0 ? "not-allowed" : "pointer" }}>
          {blockCount > 0 ? `Resolve ${blockCount} blocks to generate template` : "Generate USCIS Template"}
        </button>
      </div>
    </div>
  );
};

const FilingControlCenter = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const batch = selectedBatch ? BATCHES.find(b => b.id === selectedBatch) : null;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Filing Control Center</h2>
        <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>Batch tracking, exception review, and submission readiness</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedBatch ? "1fr 340px" : "1fr", gap: 18 }}>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #dbe3ee", overflow: "auto", boxShadow: "0 4px 20px rgba(23,43,77,0.06)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f8fbff", borderBottom: "1px solid #dbe3ee" }}>
                {["Batch ID", "Employer", "Petitioner Entity", "Count", "Review", "Exceptions", "G-28", "Payment", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BATCHES.map(b => (
                <tr key={b.id} onClick={() => setSelectedBatch(b.id)} style={{ borderBottom: "1px solid #eef1f6", cursor: "pointer", background: selectedBatch === b.id ? "#f8fbff" : "transparent", transition: "background 0.15s" }} onMouseEnter={e => { if (selectedBatch !== b.id) e.currentTarget.style.background = "#fcfdff"; }} onMouseLeave={e => { if (selectedBatch !== b.id) e.currentTarget.style.background = "transparent"; }}>
                  <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 11 }}>{b.id}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{b.empName}</td>
                  <td style={{ padding: "10px 12px", fontSize: 11, color: "#6b7280" }}>{b.petitioner}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{b.count}</td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge type={b.review} label={b.review.replace(/_/g, " ")} /></td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    {b.exceptions > 0 ? <span style={{ fontWeight: 700, color: "#c2410c", fontFamily: "'DM Mono', monospace" }}>{b.exceptions}</span> : <span style={{ color: "#0f9f6e" }}>0</span>}
                  </td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge type={b.g28} label={b.g28.replace(/_/g, " ")} /></td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge type={b.payment} /></td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge type={b.submission === "submitted" ? "submitted" : b.submission} label={b.submission.replace(/_/g, " ")} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {batch && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #dbe3ee", padding: 18, boxShadow: "0 4px 20px rgba(23,43,77,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{batch.id}</h3>
              <button onClick={() => setSelectedBatch(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280" }}>✕</button>
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
              <div><strong>Employer:</strong> {batch.empName}</div>
              <div><strong>Petitioner:</strong> {batch.petitioner}</div>
              <div><strong>Beneficiaries:</strong> {batch.count}</div>
            </div>

            <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", color: "#50627a", letterSpacing: "0.04em", marginBottom: 10 }}>Submission Readiness</div>
            <ChecklistItem done={batch.review === "complete"} label="Attorney review complete" />
            <ChecklistItem done={batch.exceptions === 0} label="All exceptions resolved" />
            <ChecklistItem done={batch.g28 === "accepted"} label="G-28 accepted by client" />
            <ChecklistItem done={batch.payment === "paid"} label="Payment confirmed" />
            <ChecklistItem done={batch.submission === "submitted"} label="Submitted to USCIS" />

            {batch.submission !== "submitted" && (
              <div style={{ marginTop: 16 }}>
                <div style={{ padding: 12, borderRadius: 10, background: batch.g28 === "pending" || batch.g28 === "sent" ? "#fff7e8" : "#f7f9fc", border: `1px solid ${batch.g28 === "pending" ? "#f1d8a6" : "#dbe3ee"}`, fontSize: 12, color: "#6b7280" }}>
                  {batch.g28 === "pending" && <><span style={{ color: "#b7791f", fontWeight: 700 }}>⚠ G-28 pending:</span> Sent 2 days ago. Auto-reminder scheduled in 24h.</>}
                  {batch.g28 === "sent" && <><span style={{ color: "#2952cc", fontWeight: 700 }}>ℹ G-28 sent:</span> Awaiting company admin action.</>}
                  {batch.g28 === "not_sent" && <>G-28 not yet prepared. Complete attorney review first.</>}
                  {batch.g28 === "accepted" && batch.payment === "unpaid" && <><span style={{ color: "#b7791f", fontWeight: 700 }}>→ Next step:</span> Complete payment via Pay.gov</>}
                </div>
              </div>
            )}

            {batch.confirmation && (
              <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "#e9fbf4", border: "1px solid #b5ecd7" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#0f9f6e", marginBottom: 4 }}>Confirmed</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700 }}>{batch.confirmation}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ConfirmationTracker = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Confirmation Tracker</h2>
      <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>Post-submission reconciliation and audit records</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
      {[
        { label: "Submitted Batches", value: CONFIRMATIONS.length, color: "#2952cc", bg: "#eff4ff" },
        { label: "Count Match", value: CONFIRMATIONS.filter(c => c.expected === c.confirmed).length + "/" + CONFIRMATIONS.length, color: "#0f9f6e", bg: "#e9fbf4" },
        { label: "Audit Complete", value: CONFIRMATIONS.filter(c => c.auditComplete).length + "/" + CONFIRMATIONS.length, color: "#6d28d9", bg: "#f5f0ff" },
      ].map((s, i) => (
        <div key={i} style={{ background: s.bg, borderRadius: 14, padding: "16px 18px", border: `1px solid ${s.color}22` }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
          <div style={{ fontSize: 13, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>

    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #dbe3ee", overflow: "hidden", boxShadow: "0 4px 20px rgba(23,43,77,0.06)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f8fbff", borderBottom: "1px solid #dbe3ee" }}>
            {["Batch ID", "Employer", "Confirmation #", "Lottery Status", "Submitted", "Expected", "Confirmed", "Reconciled", "Audit"].map(h => (
              <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CONFIRMATIONS.map(c => (
            <tr key={c.batchId} style={{ borderBottom: "1px solid #eef1f6" }}>
              <td style={{ padding: "12px 14px", fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 12 }}>{c.batchId}</td>
              <td style={{ padding: "12px 14px", fontWeight: 600 }}>{c.empName}</td>
              <td style={{ padding: "12px 14px", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#2952cc", fontWeight: 700 }}>{c.confirmation}</td>
              <td style={{ padding: "12px 14px" }}><StatusBadge type={c.status} /></td>
              <td style={{ padding: "12px 14px", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{c.submittedAt}</td>
              <td style={{ padding: "12px 14px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{c.expected}</td>
              <td style={{ padding: "12px 14px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{c.confirmed}</td>
              <td style={{ padding: "12px 14px", textAlign: "center" }}>
                {c.expected === c.confirmed ? (
                  <span style={{ color: "#0f9f6e", fontWeight: 700 }}>✓ Match</span>
                ) : (
                  <span style={{ color: "#c2410c", fontWeight: 700 }}>✗ Mismatch</span>
                )}
              </td>
              <td style={{ padding: "12px 14px" }}>
                {c.auditComplete ? (
                  <button style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #0f9f6e", background: "#e9fbf4", color: "#0f9f6e", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Export ↓</button>
                ) : (
                  <StatusBadge type="in_progress" label="Pending" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── MAIN APP ──────────────────────────────────────────────

export default function AlmaPrototype() {
  const [screen, setScreen] = useState("dashboard");
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  const nav = [
    { id: "dashboard", label: "Employers", icon: "◫" },
    { id: "datahub", label: "Data Hub", icon: "◰" },
    { id: "filing", label: "Filing Control", icon: "◳" },
    { id: "confirmation", label: "Confirmations", icon: "◲" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#f4f6fa" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div style={{ width: 220, background: "#0f1729", color: "#fff", padding: "20px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>alma</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>H-1B Registration Platform</div>
        </div>

        <div style={{ padding: "16px 10px", flex: 1 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setScreen(n.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10,
              border: "none", background: screen === n.id ? "rgba(255,255,255,0.1)" : "transparent",
              color: screen === n.id ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, cursor: "pointer",
              textAlign: "left", marginBottom: 4, transition: "all 0.15s", fontFamily: "inherit",
            }}>
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          FY2027 Cap Season<br />Prototype v1.0
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: 28, overflow: "auto" }}>
        {screen === "dashboard" && (
          <EmployerDashboard onSelectEmployer={(emp) => { setSelectedEmployer(emp); setScreen("datahub"); }} />
        )}
        {screen === "datahub" && (
          <DataHub employer={selectedEmployer || EMPLOYERS[0]} onBack={() => setScreen("dashboard")} />
        )}
        {screen === "filing" && <FilingControlCenter />}
        {screen === "confirmation" && <ConfirmationTracker />}
      </div>
    </div>
  );
}
