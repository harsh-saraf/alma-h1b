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

const EXCEPTIONS_INIT = [
  { id: "EX-001", beneficiaryId: 8, empId: 1, batchId: "B-2027-002", issueType: "Missing passport number", severity: "high", owner: "Employer HR", status: "open", recommendedAction: "Contact Meridian HR to obtain passport number from Sanjay Gupta before template generation.", notes: "" },
  { id: "EX-002", beneficiaryId: 9, empId: 1, batchId: "B-2027-002", issueType: "Invalid country value", severity: "high", owner: "Legal Ops", status: "open", recommendedAction: "Update COB/COC from 'South Korea' to 'Korea, South' to match the USCIS accepted country list.", notes: "" },
  { id: "EX-003", beneficiaryId: 6, empId: 1, batchId: "B-2027-002", issueType: "Possible duplicate passport", severity: "high", owner: "Attorney", status: "in_review", recommendedAction: "Compare passport numbers and DOBs across employers. Remove duplicate or document as distinct individuals.", notes: "Cross-employer fuzzy match flagged against Apex Robotics record (passport R6291048). Attorney reviewing." },
  { id: "EX-004", beneficiaryId: 5, empId: 1, batchId: "B-2027-002", issueType: "Invalid country value", severity: "medium", owner: "Legal Ops", status: "open", recommendedAction: "Verify 'Japan' matches the correct USCIS-accepted country list entry for this beneficiary.", notes: "" },
  { id: "EX-005", beneficiaryId: 3, empId: 1, batchId: "B-2027-002", issueType: "Missing OEWS wage level", severity: "medium", owner: "Employer HR", status: "waiting_on_client", recommendedAction: "Request OEWS wage level (I–IV) from Meridian HR for SOC code 29-1228.", notes: "Reminder email sent to Meridian HR on 2026-04-28. Follow up by 2026-05-03 if no response." },
  { id: "EX-006", beneficiaryId: null, empId: 4, batchId: null, issueType: "Petitioner entity mismatch", severity: "high", owner: "Attorney", status: "open", recommendedAction: "Verify correct legal entity name and EIN for Lumen Therapeutics before generating template. Confirm subsidiary vs. parent entity.", notes: "" },
  { id: "EX-007", beneficiaryId: null, empId: 2, batchId: "B-2027-004", issueType: "Company admin rejected batch", severity: "high", owner: "Legal Ops", status: "open", recommendedAction: "Contact Apex Robotics company admin to determine rejection reason. Correct and resubmit G-28.", notes: "" },
  { id: "EX-008", beneficiaryId: null, empId: 6, batchId: "B-2027-006", issueType: "Same name + DOB match", severity: "medium", owner: "Attorney", status: "in_review", recommendedAction: "Cross-check Vantage Cloud beneficiary records against NovaBridge submission for same-name DOB overlap.", notes: "Two records share 'Chen Wei' with DOB 11/02/1991 across different employers." },
  { id: "EX-009", beneficiaryId: null, empId: 4, batchId: null, issueType: "Missing SOC code", severity: "medium", owner: "Employer HR", status: "waiting_on_client", recommendedAction: "Request job classification SOC codes from Lumen Therapeutics HR for 26 pending beneficiaries.", notes: "Initial request sent 2026-04-25. Follow-up sent 2026-04-30." },
  { id: "EX-010", beneficiaryId: null, empId: 3, batchId: "B-2027-001", issueType: "Confirmation number missing", severity: "low", owner: "Legal Ops", status: "resolved", recommendedAction: "Log into USCIS portal and retrieve the confirmation number for batch B-2027-001.", notes: "Resolved 2026-03-15. Confirmation CNF-92817364 captured and verified." },
];

function computeEmployerReadiness(employer, allExceptions) {
  const bens = BENEFICIARIES.filter(b => b.empId === employer.id);
  const rawDupRisks = bens.filter(b => b.duplicate).length;
  const dupRisks = Math.max(rawDupRisks, employer.duplicates);

  const readyBens   = bens.length > 0 ? bens.filter(b => b.template === "ready").length : employer.complete;
  const missingInfo = bens.length > 0 ? bens.filter(b => b.validation === "block").length : (employer.candidates - employer.complete);
  const total       = bens.length > 0 ? bens.length : employer.candidates;

  const exForEmp = allExceptions.filter(e => e.empId === employer.id);
  const openEx   = exForEmp.filter(e => e.status !== "resolved").length;
  const highEx   = exForEmp.filter(e => e.severity === "high" && e.status !== "resolved").length;

  const dataScore       = total > 0 ? (readyBens / total) * 100 : 100;
  const dupScore        = dupRisks === 0 ? 100 : Math.max(0, 100 - dupRisks * 25);
  const highExScore     = highEx === 0 ? 100 : 0;
  const petitionerScore = employer.petitionerReady ? 100 : 0;
  const openExScore     = Math.max(0, 100 - openEx * 15);

  const score = Math.round(
    dataScore       * 0.35 +
    highExScore     * 0.25 +
    petitionerScore * 0.20 +
    dupScore        * 0.15 +
    openExScore     * 0.05
  );

  let state, color;
  if (score >= 90)      { state = "Ready";            color = "#0f9f6e"; }
  else if (score >= 70) { state = "Needs Minor Fixes"; color = "#b7791f"; }
  else if (score >= 40) { state = "At Risk";           color = "#d97706"; }
  else                  { state = "Blocked";           color = "#c2410c"; }

  let nextAction;
  if (!employer.petitionerReady) {
    nextAction = "Confirm petitioner entity and EIN before template generation.";
  } else if (highEx > 0) {
    nextAction = `Resolve ${highEx} high-severity exception${highEx > 1 ? "s" : ""} before template generation.`;
  } else if (missingInfo > 0) {
    nextAction = `Fix ${missingInfo} validation block${missingInfo > 1 ? "s" : ""} in beneficiary data.`;
  } else if (dupRisks > 0) {
    nextAction = `Investigate ${dupRisks} duplicate risk${dupRisks > 1 ? "s" : ""} and clear or document.`;
  } else if (openEx > 0) {
    nextAction = `Resolve ${openEx} remaining open exception${openEx > 1 ? "s" : ""}.`;
  } else {
    nextAction = "All checks passed — ready to generate template.";
  }

  return { score, state, color, readyBens, missingInfo, dupRisks, openEx, highEx, nextAction, total };
}

function computeBatchReadiness(batch, allExceptions) {
  const batchEx = allExceptions.filter(e => e.batchId === batch.id && e.status !== "resolved");
  const highEx  = batchEx.filter(e => e.severity === "high").length;

  const reviewDone  = batch.review === "complete";
  const noExcept    = batch.exceptions === 0 && highEx === 0;
  const g28Accepted = batch.g28 === "accepted";
  const paid        = batch.payment === "paid";
  const submitted   = batch.submission === "submitted";

  let score, stage, blocking;

  if (submitted) {
    score = 100; stage = "Submitted"; blocking = null;
  } else if (g28Accepted && paid && reviewDone && noExcept) {
    score = 88; stage = "Ready to Submit"; blocking = null;
  } else if (g28Accepted && paid) {
    score = 72; stage = "Payment Confirmed";
    blocking = !reviewDone ? "Attorney review pending" : batchEx.length > 0 ? `${batchEx.length} open exception${batchEx.length > 1 ? "s" : ""}` : null;
  } else if (g28Accepted) {
    score = 58; stage = "G-28 Accepted"; blocking = "Payment pending";
  } else if (batch.g28 === "sent" || batch.g28 === "pending") {
    score = 42; stage = "G-28 Pending"; blocking = "Awaiting client G-28 acceptance";
  } else if (reviewDone) {
    score = 30; stage = "Review Complete"; blocking = "G-28 not yet sent";
  } else if (batch.review === "in_review") {
    score = 20; stage = "In Review"; blocking = "Attorney review in progress";
  } else {
    score = 10; stage = "Not Started"; blocking = "Attorney review not started";
  }

  if (highEx > 0 && score < 90) {
    score = Math.min(score, 30);
    blocking = blocking || `${highEx} high-severity exception${highEx > 1 ? "s" : ""}`;
  }

  const color = score >= 88 ? "#0f9f6e" : score >= 55 ? "#b7791f" : "#c2410c";
  return { score, stage, blocking, color };
}

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

const ReadinessBar = ({ score, color, width = 64, height = 6 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ width, height, borderRadius: 3, background: "#eef1f6", overflow: "hidden", flexShrink: 0 }}>
      <div style={{ width: `${score}%`, height: "100%", borderRadius: 3, background: color, transition: "width 0.5s ease" }} />
    </div>
    <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 28 }}>{score}%</span>
  </div>
);

const ChecklistItem = ({ done, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13, color: done ? "#0f9f6e" : "#6b7280" }}>
    <span style={{ width: 18, height: 18, borderRadius: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? "#e9fbf4" : "#f7f9fc", border: `1.5px solid ${done ? "#0f9f6e" : "#dbe3ee"}`, fontSize: 11, fontWeight: 700 }}>
      {done ? "✓" : ""}
    </span>
    <span>{label}</span>
  </div>
);

const SEVERITY_STYLES = {
  high:   { bg: "#fff1ec", color: "#c2410c", border: "#f4c8b9", label: "High" },
  medium: { bg: "#fff7e8", color: "#b7791f", border: "#f1d8a6", label: "Medium" },
  low:    { bg: "#eff4ff", color: "#2952cc", border: "#d8e2ff", label: "Low" },
};
const STATUS_STYLES = {
  open:              { bg: "#fff1ec", color: "#c2410c", border: "#f4c8b9", label: "Open" },
  in_review:         { bg: "#fff7e8", color: "#b7791f", border: "#f1d8a6", label: "In Review" },
  waiting_on_client: { bg: "#eff4ff", color: "#2952cc", border: "#d8e2ff", label: "Waiting on Client" },
  resolved:          { bg: "#e9fbf4", color: "#0f9f6e", border: "#b5ecd7", label: "Resolved" },
};

const pill = (styles) => ({
  display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
  background: styles.bg, color: styles.color, border: `1px solid ${styles.border}`,
});

const SeverityBadge = ({ severity }) => {
  const s = SEVERITY_STYLES[severity] || SEVERITY_STYLES.low;
  return <span style={pill(s)}>{s.label}</span>;
};

const ExStatusPill = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.open;
  return <span style={pill(s)}>{s.label}</span>;
};

// ─── SCREENS ──────────────────────────────────────────────

const EmployerDashboard = ({ onSelectEmployer, exceptions }) => {
  const empReadiness = useMemo(
    () => EMPLOYERS.reduce((acc, e) => { acc[e.id] = computeEmployerReadiness(e, exceptions); return acc; }, {}),
    [exceptions]
  );

  const readyCount   = EMPLOYERS.filter(e => empReadiness[e.id].score >= 90).length;
  const fixesCount   = EMPLOYERS.filter(e => { const s = empReadiness[e.id].score; return s >= 70 && s < 90; }).length;
  const blockedCount = EMPLOYERS.filter(e => empReadiness[e.id].score < 70).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Employer Dashboard</h2>
        <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>FY2027 H-1B Cap Season — 6 employer clients, 202 total candidates</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Ready (≥90%)",          value: readyCount,   color: "#0f9f6e", bg: "#e9fbf4" },
          { label: "Needs Minor Fixes (70–89%)", value: fixesCount, color: "#b7791f", bg: "#fff7e8" },
          { label: "Blocked (<70%)",         value: blockedCount, color: "#c2410c", bg: "#fff1ec" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: 14, padding: "16px 18px", border: `1px solid ${s.color}22` }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #dbe3ee", overflow: "auto", boxShadow: "0 4px 20px rgba(23,43,77,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 860 }}>
          <thead>
            <tr style={{ background: "#f8fbff", borderBottom: "1px solid #dbe3ee" }}>
              {["Employer", "EIN", "Beneficiaries", "Dup. Risks", "Open Ex.", "Petitioner", "Readiness", "Next Action"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EMPLOYERS.map(emp => {
              const r = empReadiness[emp.id];
              return (
                <tr key={emp.id} onClick={() => onSelectEmployer(emp)}
                  style={{ borderBottom: "1px solid #eef1f6", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fbff"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 14px", fontWeight: 600, color: "#1f2937", whiteSpace: "nowrap" }}>{emp.name}</td>
                  <td style={{ padding: "14px 14px", color: "#6b7280", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{emp.ein}</td>
                  <td style={{ padding: "14px 14px" }}>
                    <span style={{ fontWeight: 700, fontFamily: "'DM Mono', monospace", color: r.readyBens === r.total ? "#0f9f6e" : "#b7791f" }}>
                      {r.readyBens}/{r.total}
                    </span>
                    <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 4 }}>ready</span>
                  </td>
                  <td style={{ padding: "14px 14px" }}>
                    {r.dupRisks > 0
                      ? <span style={{ fontWeight: 700, color: "#c2410c", fontFamily: "'DM Mono', monospace" }}>{r.dupRisks}</span>
                      : <span style={{ color: "#0f9f6e" }}>—</span>}
                  </td>
                  <td style={{ padding: "14px 14px" }}>
                    {r.openEx > 0
                      ? <span style={{ fontWeight: 700, color: r.highEx > 0 ? "#c2410c" : "#b7791f", fontFamily: "'DM Mono', monospace" }}>{r.openEx}</span>
                      : <span style={{ color: "#0f9f6e" }}>—</span>}
                  </td>
                  <td style={{ padding: "14px 14px" }}>
                    <StatusBadge type={emp.petitionerReady ? "ready" : "blocked"} label={emp.petitionerReady ? "Ready" : "Incomplete"} />
                  </td>
                  <td style={{ padding: "14px 14px", minWidth: 130 }}>
                    <ReadinessBar score={r.score} color={r.color} />
                    <div style={{ fontSize: 10, color: r.color, fontWeight: 600, marginTop: 3 }}>{r.state}</div>
                  </td>
                  <td style={{ padding: "14px 14px", fontSize: 12, color: "#6b7280", maxWidth: 220 }}>
                    <span title={r.nextAction} style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {r.nextAction}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DataHub = ({ employer, onBack, exceptions }) => {
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

      {(() => {
        const hasHighEx = exceptions?.some(e => e.empId === (employer?.id || 1) && e.severity === "high" && e.status !== "resolved");
        const blocked = blockCount > 0 || hasHighEx;
        const label = blockCount > 0 ? `Resolve ${blockCount} validation blocks first` : hasHighEx ? "Resolve open high-severity exceptions first" : "Generate USCIS Template";
        return (
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
            <button disabled={blocked} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: blocked ? "#dbe3ee" : "#2952cc", color: blocked ? "#6b7280" : "#fff", fontSize: 14, fontWeight: 700, cursor: blocked ? "not-allowed" : "pointer" }}>
              {label}
            </button>
          </div>
        );
      })()}
    </div>
  );
};

const FilingControlCenter = ({ exceptions }) => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const batch = selectedBatch ? BATCHES.find(b => b.id === selectedBatch) : null;

  const batchReadiness = useMemo(
    () => BATCHES.reduce((acc, b) => { acc[b.id] = computeBatchReadiness(b, exceptions); return acc; }, {}),
    [exceptions]
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Filing Control Center</h2>
        <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>Batch tracking, exception review, and submission readiness</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedBatch ? "1fr 340px" : "1fr", gap: 18 }}>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #dbe3ee", overflow: "auto", boxShadow: "0 4px 20px rgba(23,43,77,0.06)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 860 }}>
            <thead>
              <tr style={{ background: "#f8fbff", borderBottom: "1px solid #dbe3ee" }}>
                {["Batch ID", "Employer", "Count", "Readiness", "Stage", "Blocking Issue", "G-28", "Payment", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BATCHES.map(b => {
                const br = batchReadiness[b.id];
                return (
                  <tr key={b.id} onClick={() => setSelectedBatch(b.id)}
                    style={{ borderBottom: "1px solid #eef1f6", cursor: "pointer", background: selectedBatch === b.id ? "#f8fbff" : "transparent", transition: "background 0.15s" }}
                    onMouseEnter={e => { if (selectedBatch !== b.id) e.currentTarget.style.background = "#fcfdff"; }}
                    onMouseLeave={e => { if (selectedBatch !== b.id) e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 11 }}>{b.id}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{b.empName}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{b.count}</td>
                    <td style={{ padding: "10px 12px", minWidth: 110 }}>
                      <ReadinessBar score={br.score} color={br.color} width={48} height={5} />
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: "#6b7280", whiteSpace: "nowrap" }}>{br.stage}</td>
                    <td style={{ padding: "10px 12px", fontSize: 11, maxWidth: 160 }}>
                      {br.blocking
                        ? <span style={{ color: "#c2410c", fontWeight: 600 }} title={br.blocking}>{br.blocking}</span>
                        : <span style={{ color: "#0f9f6e" }}>—</span>}
                    </td>
                    <td style={{ padding: "10px 12px" }}><StatusBadge type={b.g28} label={b.g28.replace(/_/g, " ")} /></td>
                    <td style={{ padding: "10px 12px" }}><StatusBadge type={b.payment} /></td>
                    <td style={{ padding: "10px 12px" }}><StatusBadge type={b.submission === "submitted" ? "submitted" : b.submission} label={b.submission.replace(/_/g, " ")} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {batch && (() => {
          const br = batchReadiness[batch.id];
          return (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #dbe3ee", padding: 18, boxShadow: "0 4px 20px rgba(23,43,77,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{batch.id}</h3>
                <button onClick={() => setSelectedBatch(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280" }}>✕</button>
              </div>

              <div style={{ marginBottom: 16, padding: 14, borderRadius: 12, background: br.score >= 88 ? "#e9fbf4" : br.score >= 55 ? "#fff7e8" : "#fff1ec", border: `1px solid ${br.color}33` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#50627a", letterSpacing: "0.04em" }}>Readiness</div>
                  <span style={{ fontSize: 20, fontWeight: 800, color: br.color, fontFamily: "'DM Mono', monospace" }}>{br.score}%</span>
                </div>
                <div style={{ width: "100%", height: 7, borderRadius: 4, background: "#eef1f6", overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ width: `${br.score}%`, height: "100%", borderRadius: 4, background: br.color, transition: "width 0.5s ease" }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: br.color }}>{br.stage}</div>
                {br.blocking && (
                  <div style={{ marginTop: 6, fontSize: 11, color: "#c2410c", fontWeight: 600 }}>⚑ {br.blocking}</div>
                )}
              </div>

              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                <div><strong>Employer:</strong> {batch.empName}</div>
                <div><strong>Petitioner:</strong> {batch.petitioner}</div>
                <div><strong>Beneficiaries:</strong> {batch.count}</div>
              </div>

              <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", color: "#50627a", letterSpacing: "0.04em", marginBottom: 10 }}>Submission Checklist</div>
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

              {batch.submission !== "submitted" && (
                <div style={{ marginTop: 16 }}>
                  <button
                    disabled={!!br.blocking}
                    style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none", background: br.blocking ? "#dbe3ee" : "#2952cc", color: br.blocking ? "#6b7280" : "#fff", fontSize: 13, fontWeight: 700, cursor: br.blocking ? "not-allowed" : "pointer" }}
                  >
                    {br.blocking ? `Blocked: ${br.blocking}` : "Mark Ready for Submission"}
                  </button>
                </div>
              )}
            </div>
          );
        })()}
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

// ─── EXCEPTION REVIEW QUEUE ───────────────────────────────

const ExceptionReviewQueue = ({ exceptions, setExceptions }) => {
  const [filters, setFilters] = useState({ severity: "all", owner: "all", empId: "all", status: "all" });
  const [reviewEx, setReviewEx] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  const getBen = (id) => BENEFICIARIES.find(b => b.id === id);
  const getEmp = (id) => EMPLOYERS.find(e => e.id === id);

  const openCount    = exceptions.filter(e => e.status !== "resolved").length;
  const highCount    = exceptions.filter(e => e.severity === "high" && e.status !== "resolved").length;
  const attCount     = exceptions.filter(e => e.owner === "Attorney" && e.status !== "resolved").length;
  const waitingCount = exceptions.filter(e => e.status === "waiting_on_client").length;

  const filtered = exceptions.filter(e => {
    if (filters.severity !== "all" && e.severity !== filters.severity) return false;
    if (filters.owner !== "all" && e.owner !== filters.owner) return false;
    if (filters.empId !== "all" && e.empId !== parseInt(filters.empId)) return false;
    if (filters.status !== "all" && e.status !== filters.status) return false;
    return true;
  });

  const updateEx = (id, patch) => {
    setExceptions(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
    setReviewEx(prev => prev?.id === id ? { ...prev, ...patch } : prev);
  };

  const openReview = (ex) => {
    setReviewEx(ex);
    setNoteInput(ex.notes || "");
    if (ex.status === "open" && ex.owner === "Attorney") updateEx(ex.id, { status: "in_review" });
  };

  const btnStyle = (bg, color) => ({
    padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
    cursor: "pointer", border: "none", background: bg, color,
  });

  const getCtaButtons = (ex) => {
    if (ex.status === "resolved") return <span style={{ color: "#0f9f6e", fontSize: 11, fontWeight: 600 }}>✓ Resolved</span>;
    const reviewBtn   = <button onClick={() => openReview(ex)} style={btnStyle("#eff4ff", "#2952cc")}>Review</button>;
    const resolveBtn  = <button onClick={() => updateEx(ex.id, { status: "resolved" })} style={btnStyle("#e9fbf4", "#0f9f6e")}>Mark Resolved</button>;
    const requestBtn  = <button onClick={() => updateEx(ex.id, { status: "waiting_on_client" })} style={btnStyle("#fff7e8", "#b7791f")}>Request Info</button>;
    const escalateBtn = <button onClick={() => updateEx(ex.id, { owner: "Attorney", status: "in_review" })} style={btnStyle("#fff1ec", "#c2410c")}>Escalate</button>;

    if (ex.status === "waiting_on_client") return <div style={{ display: "flex", gap: 4 }}>{resolveBtn}</div>;
    if (ex.status === "in_review") return <div style={{ display: "flex", gap: 4 }}>{reviewBtn}{resolveBtn}</div>;
    if (ex.owner === "Employer HR" || ex.owner === "Company Admin") return <div style={{ display: "flex", gap: 4 }}>{requestBtn}</div>;
    if (ex.severity === "high" && ex.owner === "Legal Ops") return <div style={{ display: "flex", gap: 4 }}>{reviewBtn}{escalateBtn}</div>;
    return <div style={{ display: "flex", gap: 4 }}>{reviewBtn}</div>;
  };

  const filterDefs = [
    { key: "severity", options: [{ value: "all", label: "All Severities" }, { value: "high", label: "High" }, { value: "medium", label: "Medium" }, { value: "low", label: "Low" }] },
    { key: "owner", options: [{ value: "all", label: "All Owners" }, { value: "Attorney", label: "Attorney" }, { value: "Legal Ops", label: "Legal Ops" }, { value: "Employer HR", label: "Employer HR" }, { value: "Company Admin", label: "Company Admin" }] },
    { key: "empId", options: [{ value: "all", label: "All Clients" }, ...EMPLOYERS.map(e => ({ value: String(e.id), label: e.name }))] },
    { key: "status", options: [{ value: "all", label: "All Statuses" }, { value: "open", label: "Open" }, { value: "in_review", label: "In Review" }, { value: "waiting_on_client", label: "Waiting on Client" }, { value: "resolved", label: "Resolved" }] },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Exception Review Queue</h2>
        <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>Flagged issues across all clients requiring attorney or legal ops attention</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Open Exceptions",       value: openCount,    color: "#c2410c", bg: "#fff1ec", border: "#f4c8b9" },
          { label: "High Severity",          value: highCount,    color: "#c2410c", bg: "#fff1ec", border: "#f4c8b9" },
          { label: "Assigned to Attorney",   value: attCount,     color: "#6d28d9", bg: "#f5f0ff", border: "#e0d4f7" },
          { label: "Waiting on Client",      value: waitingCount, color: "#2952cc", bg: "#eff4ff", border: "#d8e2ff" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: 14, padding: "16px 18px", border: `1px solid ${s.border}` }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#50627a", textTransform: "uppercase", letterSpacing: "0.04em" }}>Filter:</span>
        {filterDefs.map(f => (
          <select key={f.key} value={filters[f.key]} onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
            style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #dbe3ee", fontSize: 12, color: "#1f2937", background: "#fff", cursor: "pointer" }}>
            {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>{filtered.length} exception{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table + review panel */}
      <div style={{ display: "grid", gridTemplateColumns: reviewEx ? "1fr 380px" : "1fr", gap: 16, alignItems: "start" }}>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #dbe3ee", overflow: "auto", boxShadow: "0 4px 20px rgba(23,43,77,0.06)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 920 }}>
            <thead>
              <tr style={{ background: "#f8fbff", borderBottom: "1px solid #dbe3ee" }}>
                {["ID", "Beneficiary", "Client", "Batch", "Issue Type", "Severity", "Owner", "Status", "Recommended Action", "Action"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: "#50627a", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ex => {
                const ben = ex.beneficiaryId ? getBen(ex.beneficiaryId) : null;
                const emp = getEmp(ex.empId);
                return (
                  <tr key={ex.id} style={{ borderBottom: "1px solid #eef1f6", background: reviewEx?.id === ex.id ? "#f8fbff" : "transparent" }}>
                    <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#6b7280" }}>{ex.id}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600, whiteSpace: "nowrap" }}>{ben ? ben.name : <span style={{ color: "#6b7280" }}>—</span>}</td>
                    <td style={{ padding: "10px 12px", fontSize: 11 }}>{emp?.name}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{ex.batchId || "—"}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{ex.issueType}</td>
                    <td style={{ padding: "10px 12px" }}><SeverityBadge severity={ex.severity} /></td>
                    <td style={{ padding: "10px 12px", fontSize: 11 }}>{ex.owner}</td>
                    <td style={{ padding: "10px 12px" }}><ExStatusPill status={ex.status} /></td>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: "#6b7280", maxWidth: 200 }}>{ex.recommendedAction}</td>
                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{getCtaButtons(ex)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 48, textAlign: "center", color: "#6b7280", fontSize: 14 }}>No exceptions match the current filters.</div>
          )}
        </div>

        {/* Review panel */}
        {reviewEx && (() => {
          const ben = reviewEx.beneficiaryId ? getBen(reviewEx.beneficiaryId) : null;
          const emp = getEmp(reviewEx.empId);
          return (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #dbe3ee", padding: 18, boxShadow: "0 4px 20px rgba(23,43,77,0.06)", position: "sticky", top: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#6b7280", marginBottom: 3 }}>{reviewEx.id}</div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>{reviewEx.issueType}</h3>
                </div>
                <button onClick={() => setReviewEx(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280", padding: 0, lineHeight: 1 }}>✕</button>
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                <SeverityBadge severity={reviewEx.severity} />
                <ExStatusPill status={reviewEx.status} />
              </div>

              {ben && (
                <div style={{ background: "#f8fbff", borderRadius: 10, border: "1px solid #dbe3ee", padding: 12, marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#50627a", letterSpacing: "0.04em", marginBottom: 8 }}>Beneficiary</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{ben.name}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: 11, color: "#6b7280" }}>
                    <div><strong style={{ color: "#1f2937" }}>Passport:</strong> {ben.passport || <span style={{ color: "#c2410c" }}>MISSING</span>}</div>
                    <div><strong style={{ color: "#1f2937" }}>DOB:</strong> {ben.dob}</div>
                    <div><strong style={{ color: "#1f2937" }}>COB:</strong> <span style={{ color: ben.cob === "South Korea" || ben.cob === "Japan" ? "#c2410c" : "inherit" }}>{ben.cob}</span></div>
                    <div><strong style={{ color: "#1f2937" }}>SOC:</strong> {ben.soc}</div>
                    <div><strong style={{ color: "#1f2937" }}>Wage:</strong> {ben.wage || <span style={{ color: "#c2410c" }}>MISSING</span>}</div>
                    <div><strong style={{ color: "#1f2937" }}>Location:</strong> {ben.city}, {ben.state}</div>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#50627a", letterSpacing: "0.04em", marginBottom: 4 }}>Client</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{emp?.name}</div>
                {reviewEx.batchId && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Batch: <span style={{ fontFamily: "'DM Mono', monospace" }}>{reviewEx.batchId}</span></div>}
              </div>

              <div style={{ marginBottom: 14, padding: 12, borderRadius: 10, background: "#fffcf5", border: "1px solid #f1d8a6" }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#b7791f", letterSpacing: "0.04em", marginBottom: 6 }}>Recommended Action</div>
                <div style={{ fontSize: 12, color: "#1f2937", lineHeight: 1.5 }}>{reviewEx.recommendedAction}</div>
              </div>

              {reviewEx.notes && (
                <div style={{ marginBottom: 14, padding: 12, borderRadius: 10, background: "#f7f9fc", border: "1px solid #dbe3ee" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#50627a", letterSpacing: "0.04em", marginBottom: 4 }}>Notes</div>
                  <div style={{ fontSize: 12, color: "#1f2937", lineHeight: 1.5 }}>{reviewEx.notes}</div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#50627a", letterSpacing: "0.04em", marginBottom: 6 }}>Add Note</div>
                <textarea value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="Add a note..."
                  style={{ width: "100%", minHeight: 72, padding: 10, borderRadius: 8, border: "1px solid #dbe3ee", fontSize: 12, fontFamily: "inherit", resize: "vertical", color: "#1f2937", boxSizing: "border-box" }} />
                <button onClick={() => updateEx(reviewEx.id, { notes: noteInput })}
                  style={{ marginTop: 6, padding: "6px 14px", borderRadius: 8, border: "1px solid #dbe3ee", background: "#f7f9fc", color: "#1f2937", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  Save Note
                </button>
              </div>

              {reviewEx.status !== "resolved" ? (
                <div style={{ borderTop: "1px solid #eef1f6", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#50627a", letterSpacing: "0.04em", marginBottom: 2 }}>Actions</div>
                  <button onClick={() => updateEx(reviewEx.id, { status: "resolved" })}
                    style={{ padding: "9px 0", borderRadius: 10, border: "none", background: "#e9fbf4", color: "#0f9f6e", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Mark Resolved
                  </button>
                  {reviewEx.status !== "waiting_on_client" && (
                    <button onClick={() => updateEx(reviewEx.id, { status: "waiting_on_client" })}
                      style={{ padding: "9px 0", borderRadius: 10, border: "none", background: "#fff7e8", color: "#b7791f", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      Request Info from Client
                    </button>
                  )}
                  {reviewEx.owner !== "Attorney" && (
                    <button onClick={() => updateEx(reviewEx.id, { owner: "Attorney", status: "in_review" })}
                      style={{ padding: "9px 0", borderRadius: 10, border: "none", background: "#fff1ec", color: "#c2410c", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      Escalate to Attorney
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ borderTop: "1px solid #eef1f6", paddingTop: 16, padding: 12, borderRadius: 10, background: "#e9fbf4", border: "1px solid #b5ecd7", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f9f6e" }}>✓ Exception Resolved</div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────

export default function AlmaPrototype() {
  const [screen, setScreen] = useState("dashboard");
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [exceptions, setExceptions] = useState(EXCEPTIONS_INIT);

  const openExCount = exceptions.filter(e => e.status !== "resolved").length;

  const nav = [
    { id: "dashboard",   label: "Employers",       icon: "◫" },
    { id: "datahub",     label: "Data Hub",         icon: "◰" },
    { id: "exceptions",  label: "Exception Queue",  icon: "⚑" },
    { id: "filing",      label: "Filing Control",   icon: "◳" },
    { id: "confirmation",label: "Confirmations",    icon: "◲" },
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
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.id === "exceptions" && openExCount > 0 && (
                <span style={{ background: "#c2410c", color: "#fff", borderRadius: 999, fontSize: 10, fontWeight: 700, padding: "1px 6px", lineHeight: "16px" }}>
                  {openExCount}
                </span>
              )}
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
          <EmployerDashboard onSelectEmployer={(emp) => { setSelectedEmployer(emp); setScreen("datahub"); }} exceptions={exceptions} />
        )}
        {screen === "datahub" && (
          <DataHub employer={selectedEmployer || EMPLOYERS[0]} onBack={() => setScreen("dashboard")} exceptions={exceptions} />
        )}
        {screen === "exceptions" && (
          <ExceptionReviewQueue exceptions={exceptions} setExceptions={setExceptions} />
        )}
        {screen === "filing" && <FilingControlCenter exceptions={exceptions} />}
        {screen === "confirmation" && <ConfirmationTracker />}
      </div>
    </div>
  );
}
