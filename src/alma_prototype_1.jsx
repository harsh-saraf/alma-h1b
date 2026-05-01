import { useMemo, useState } from "react";

const clients = [
  {
    id: "acme",
    name: "Acme Robotics",
    petitionerEntity: "Acme Robotics Inc.",
    ein: "91-4820173",
    authorizedSignatory: "Maya Chen, VP People",
    attorneyOwner: "Nora Patel",
    legalOpsOwner: "Evan Brooks",
  },
  {
    id: "meridian",
    name: "Meridian Health Systems",
    petitionerEntity: "Meridian Health Corp.",
    ein: "84-2931847",
    authorizedSignatory: "Daniel Reiss, CHRO",
    attorneyOwner: "Leah Morgan",
    legalOpsOwner: "Camila Ortiz",
  },
  {
    id: "novabridge",
    name: "NovaBridge Analytics",
    petitionerEntity: "NovaBridge Analytics LLC",
    ein: "73-6192840",
    authorizedSignatory: "Owen Walsh, CFO",
    attorneyOwner: "Nora Patel",
    legalOpsOwner: "Evan Brooks",
  },
];

const initialBeneficiaries = [
  {
    id: "ben-001",
    name: "Priya Venkatesh",
    clientId: "acme",
    batchId: "B-001",
    passportStatus: "Complete",
    biographicStatus: "Complete",
    socOewsStatus: "Complete",
    areaStatus: "Complete",
    dataStatus: "Complete",
    duplicateRisk: "None",
    exceptionStatus: "None",
    attorneyReviewStatus: "Not Required",
    filingStatus: "Submitted",
    confirmationStatus: "Captured",
    confirmationNumber: "IOE-ACM-0001",
    uscisStatus: "Submitted",
    submittedAt: "2026-03-18 09:42 CT",
    auditStatus: "Complete",
  },
  {
    id: "ben-002",
    name: "Wei Zhang",
    clientId: "acme",
    batchId: "B-001",
    passportStatus: "Complete",
    biographicStatus: "Complete",
    socOewsStatus: "Complete",
    areaStatus: "Complete",
    dataStatus: "Complete",
    duplicateRisk: "Low",
    exceptionStatus: "None",
    attorneyReviewStatus: "Approved",
    filingStatus: "Submitted",
    confirmationStatus: "Missing",
    confirmationNumber: "",
    uscisStatus: "Confirmation missing",
    submittedAt: "2026-03-18 09:44 CT",
    auditStatus: "Incomplete",
  },
  {
    id: "ben-003",
    name: "Ravi Krishnan",
    clientId: "acme",
    batchId: "B-002",
    passportStatus: "Complete",
    biographicStatus: "Complete",
    socOewsStatus: "Complete",
    areaStatus: "Complete",
    dataStatus: "Complete",
    duplicateRisk: "High",
    exceptionStatus: "In Review",
    attorneyReviewStatus: "Required",
    filingStatus: "Draft",
    confirmationStatus: "Not Applicable",
    confirmationNumber: "",
    uscisStatus: "Not submitted",
    submittedAt: "",
    auditStatus: "Not Started",
  },
  {
    id: "ben-004",
    name: "Anika Sharma",
    clientId: "acme",
    batchId: "B-002",
    passportStatus: "Complete",
    biographicStatus: "Complete",
    socOewsStatus: "Missing Info",
    areaStatus: "Complete",
    dataStatus: "Missing Info",
    duplicateRisk: "None",
    exceptionStatus: "Open",
    attorneyReviewStatus: "Not Required",
    filingStatus: "Draft",
    confirmationStatus: "Not Applicable",
    confirmationNumber: "",
    uscisStatus: "Not submitted",
    submittedAt: "",
    auditStatus: "Not Started",
  },
  {
    id: "ben-005",
    name: "Sanjay Gupta",
    clientId: "acme",
    batchId: "B-002",
    passportStatus: "Missing Info",
    biographicStatus: "Complete",
    socOewsStatus: "Complete",
    areaStatus: "Complete",
    dataStatus: "Missing Info",
    duplicateRisk: "None",
    exceptionStatus: "Open",
    attorneyReviewStatus: "Not Required",
    filingStatus: "Draft",
    confirmationStatus: "Not Applicable",
    confirmationNumber: "",
    uscisStatus: "Not submitted",
    submittedAt: "",
    auditStatus: "Not Started",
  },
  {
    id: "ben-006",
    name: "Min-Jun Park",
    clientId: "acme",
    batchId: "B-002",
    passportStatus: "Complete",
    biographicStatus: "Invalid",
    socOewsStatus: "Complete",
    areaStatus: "Complete",
    dataStatus: "Invalid",
    duplicateRisk: "None",
    exceptionStatus: "Open",
    attorneyReviewStatus: "Not Required",
    filingStatus: "Draft",
    confirmationStatus: "Not Applicable",
    confirmationNumber: "",
    uscisStatus: "Not submitted",
    submittedAt: "",
    auditStatus: "Not Started",
  },
  {
    id: "ben-007",
    name: "Elena Popova",
    clientId: "meridian",
    batchId: "B-003",
    passportStatus: "Complete",
    biographicStatus: "Complete",
    socOewsStatus: "Complete",
    areaStatus: "Complete",
    dataStatus: "Complete",
    duplicateRisk: "Medium",
    exceptionStatus: "Resolved",
    attorneyReviewStatus: "Approved",
    filingStatus: "Submitted",
    confirmationStatus: "Captured",
    confirmationNumber: "IOE-MER-0007",
    uscisStatus: "Submitted",
    submittedAt: "2026-03-17 14:15 CT",
    auditStatus: "Complete",
  },
  {
    id: "ben-008",
    name: "Tomoko Hayashi",
    clientId: "novabridge",
    batchId: "B-004",
    passportStatus: "Complete",
    biographicStatus: "Complete",
    socOewsStatus: "Complete",
    areaStatus: "Complete",
    dataStatus: "Complete",
    duplicateRisk: "None",
    exceptionStatus: "None",
    attorneyReviewStatus: "Approved",
    filingStatus: "Submitted",
    confirmationStatus: "Captured",
    confirmationNumber: "IOE-NOV-0008",
    uscisStatus: "Submitted",
    submittedAt: "2026-03-16 10:22 CT",
    auditStatus: "Complete",
  },
];

const initialDuplicateRisks = [
  {
    id: "dup-001",
    beneficiaryId: "ben-003",
    matchType: "Same name + DOB",
    matchedRecord: "Ravi Krishnan - Horizon AI, passport R6291048",
    confidence: "High",
    riskReason: "High-confidence fuzzy match across employers with matching DOB.",
    status: "Unresolved",
    recommendedAction: "Attorney should compare passport records and exclude a duplicate if confirmed.",
  },
  {
    id: "dup-002",
    beneficiaryId: "ben-002",
    matchType: "Similar passport",
    matchedRecord: "Wei Zhang - prior FY2026 candidate archive",
    confidence: "Low",
    riskReason: "Same family name and nearby passport series; DOB does not match.",
    status: "Needs Review",
    recommendedAction: "Document as cleared if identity does not match.",
  },
  {
    id: "dup-003",
    beneficiaryId: "ben-007",
    matchType: "Same passport",
    matchedRecord: "Elena Popova - Meridian draft import duplicate",
    confidence: "Medium",
    riskReason: "Duplicate created by import retry.",
    status: "Resolved",
    recommendedAction: "Resolved by retaining the newest record.",
  },
];

const initialBatches = [
  {
    id: "B-001",
    clientId: "acme",
    beneficiaryCount: 2,
    status: "Submitted",
    attorneyReviewStatus: "Approved",
    g28Status: "Complete",
    companyAdminApprovalStatus: "Accepted",
    paymentStatus: "Complete",
    submissionStatus: "Submitted",
    confirmationCaptureStatus: "Missing",
    nextAction: "Capture missing confirmation numbers.",
    sentToAdminAt: "2026-03-17 15:30 CT",
    adminContact: "Maya Chen",
    feeTotal: "$430",
  },
  {
    id: "B-002",
    clientId: "acme",
    beneficiaryCount: 4,
    status: "Needs attorney review",
    attorneyReviewStatus: "Required",
    g28Status: "Draft",
    companyAdminApprovalStatus: "Not Sent",
    paymentStatus: "Not Ready",
    submissionStatus: "Not Started",
    confirmationCaptureStatus: "Not Applicable",
    nextAction: "Resolve open exceptions before USCIS upload.",
    sentToAdminAt: "",
    adminContact: "Maya Chen",
    feeTotal: "$860",
  },
  {
    id: "B-003",
    clientId: "meridian",
    beneficiaryCount: 1,
    status: "Ready for payment",
    attorneyReviewStatus: "Approved",
    g28Status: "Complete",
    companyAdminApprovalStatus: "Accepted",
    paymentStatus: "Pending",
    submissionStatus: "Not Started",
    confirmationCaptureStatus: "Not Applicable",
    nextAction: "Complete Pay.gov payment.",
    sentToAdminAt: "2026-03-18 08:10 CT",
    adminContact: "Daniel Reiss",
    feeTotal: "$215",
  },
  {
    id: "B-004",
    clientId: "novabridge",
    beneficiaryCount: 1,
    status: "Complete",
    attorneyReviewStatus: "Approved",
    g28Status: "Complete",
    companyAdminApprovalStatus: "Accepted",
    paymentStatus: "Complete",
    submissionStatus: "Submitted",
    confirmationCaptureStatus: "Complete",
    nextAction: "No action needed.",
    sentToAdminAt: "2026-03-15 12:05 CT",
    adminContact: "Owen Walsh",
    feeTotal: "$215",
  },
];

const initialExceptions = [
  {
    id: "EX-001",
    beneficiaryId: "ben-003",
    clientId: "acme",
    batchId: "B-002",
    issueType: "Possible duplicate passport",
    severity: "High",
    owner: "Attorney",
    status: "In Review",
    sourceField: "Name, DOB, passport fuzzy match",
    recommendedAction: "Compare source identity documents and approve as distinct or exclude from filing.",
  },
  {
    id: "EX-002",
    beneficiaryId: "ben-004",
    clientId: "acme",
    batchId: "B-002",
    issueType: "Missing OEWS wage level",
    severity: "Medium",
    owner: "Legal Ops",
    status: "Open",
    sourceField: "OEWS wage level",
    recommendedAction: "Request wage level from client HR and update the role data.",
  },
  {
    id: "EX-003",
    beneficiaryId: "ben-005",
    clientId: "acme",
    batchId: "B-002",
    issueType: "Missing passport number",
    severity: "High",
    owner: "Employer HR",
    status: "Open",
    sourceField: "Passport number",
    recommendedAction: "Request passport number before template generation.",
  },
  {
    id: "EX-004",
    beneficiaryId: "ben-006",
    clientId: "acme",
    batchId: "B-002",
    issueType: "Invalid country value",
    severity: "High",
    owner: "Legal Ops",
    status: "Open",
    sourceField: "Country of birth",
    recommendedAction: "Update country value to the USCIS accepted label.",
  },
  {
    id: "EX-005",
    beneficiaryId: "ben-002",
    clientId: "acme",
    batchId: "B-001",
    issueType: "Confirmation number missing",
    severity: "Low",
    owner: "Legal Ops",
    status: "Open",
    sourceField: "USCIS confirmation number",
    recommendedAction: "Log into USCIS and capture the missing confirmation number.",
  },
  {
    id: "EX-006",
    beneficiaryId: null,
    clientId: "meridian",
    batchId: "B-003",
    issueType: "Company admin rejected batch",
    severity: "High",
    owner: "Legal Ops",
    status: "Resolved",
    sourceField: "Company admin approval",
    recommendedAction: "Resolved after entity name correction and resend.",
  },
];

const auditEvents = [
  "Employer candidate uploaded",
  "Validation completed",
  "Duplicate check completed",
  "Template generated",
  "USCIS upload completed",
  "Batch created",
  "Attorney review completed",
  "G-28 completed",
  "Company admin accepted",
  "Payment completed",
  "Registration submitted",
  "Confirmation captured",
];

const tabCopy = {
  Prepare: "Clean and validate employer, beneficiary, and role data before USCIS upload.",
  Review: "Resolve exceptions that need attorney or legal ops judgment.",
  File: "Track USCIS batches through G-28, client approval, payment, and submission.",
  Track: "Capture confirmation numbers, statuses, and audit records after filing.",
};

const tone = {
  green: { bg: "#e9fbf4", color: "#0f7f5f", border: "#b5ecd7" },
  amber: { bg: "#fff7e8", color: "#a15c00", border: "#f1d8a6" },
  red: { bg: "#fff1ec", color: "#b43214", border: "#f4c8b9" },
  blue: { bg: "#eff4ff", color: "#2952cc", border: "#d8e2ff" },
  gray: { bg: "#f7f9fc", color: "#5d6b82", border: "#dbe3ee" },
};

function styleForStatus(value) {
  if (["Complete", "Captured", "Approved", "Accepted", "Submitted", "Resolved", "On Track"].includes(value)) return tone.green;
  if (["High", "Blocked", "Open", "Missing Info", "Invalid", "Missing", "Rejected", "At Risk"].includes(value)) return tone.red;
  if (["Medium", "Required", "In Review", "Pending", "Needs Review", "Not Ready"].includes(value)) return tone.amber;
  if (["Low", "Uploaded", "Draft"].includes(value)) return tone.blue;
  return tone.gray;
}

function Badge({ children, value }) {
  const s = styleForStatus(value || children);
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      borderRadius: 999,
      padding: "3px 9px",
      border: `1px solid ${s.border}`,
      background: s.bg,
      color: s.color,
      fontSize: 11,
      fontWeight: 700,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #dbe3ee",
      borderRadius: 8,
      boxShadow: "0 4px 18px rgba(23,43,77,0.05)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ minWidth: 116 }}>
      <div style={{ fontFamily: "'DM Mono', ui-monospace, monospace", fontSize: 24, fontWeight: 800, color: "#172033" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>{label}</div>
    </div>
  );
}

function getClientName(clientId) {
  return clients.find((c) => c.id === clientId)?.name || clientId;
}

function getBeneficiaryName(beneficiaryId, beneficiaries) {
  return beneficiaries.find((b) => b.id === beneficiaryId)?.name || "-";
}

function getClientState({ clientId, beneficiaries, exceptions, duplicateRisks, batches, templateGenerated }) {
  const clientBeneficiaries = beneficiaries.filter((b) => b.clientId === clientId);
  const clientExceptions = exceptions.filter((e) => e.clientId === clientId);
  const clientDuplicateRisks = duplicateRisks.filter((r) => {
    const beneficiary = beneficiaries.find((b) => b.id === r.beneficiaryId);
    return beneficiary?.clientId === clientId;
  });
  const clientBatches = batches.filter((b) => b.clientId === clientId);

  const requiredDataIssues = clientBeneficiaries.filter((b) => b.dataStatus !== "Complete");
  const invalidFields = clientBeneficiaries.filter((b) => b.dataStatus === "Invalid");
  const unresolvedHighDuplicates = clientDuplicateRisks.filter((r) => r.confidence === "High" && r.status !== "Resolved");
  const openExceptions = clientExceptions.filter((e) => e.status !== "Resolved");
  const highOrMediumExceptions = openExceptions.filter((e) => e.severity === "High" || e.severity === "Medium");
  const attorneyExceptions = openExceptions.filter((e) => e.owner === "Attorney" || e.issueType.includes("duplicate"));
  const pendingApprovalBatch = clientBatches.find((b) => b.companyAdminApprovalStatus === "Pending");
  const rejectedBatch = clientBatches.find((b) => b.companyAdminApprovalStatus === "Rejected");
  const acceptedUnpaidBatch = clientBatches.find((b) => b.companyAdminApprovalStatus === "Accepted" && b.paymentStatus !== "Complete");
  const submittedMissingConfirmations = clientBeneficiaries.filter((b) => b.filingStatus === "Submitted" && b.confirmationStatus === "Missing");
  const auditIncomplete = clientBeneficiaries.filter((b) => b.filingStatus === "Submitted" && b.auditStatus !== "Complete");
  const readyBeneficiaries = clientBeneficiaries.filter((b) =>
    b.dataStatus === "Complete" &&
    (b.duplicateRisk === "None" || b.duplicateRisk === "Low") &&
    !["Open", "In Review"].includes(b.exceptionStatus)
  );

  const prepareComplete = requiredDataIssues.length === 0 && unresolvedHighDuplicates.length === 0 && templateGenerated;
  const reviewComplete = highOrMediumExceptions.length === 0;
  const fileComplete = clientBatches.length > 0 && clientBatches.every((b) =>
    b.submissionStatus === "Submitted" &&
    b.paymentStatus === "Complete" &&
    b.companyAdminApprovalStatus === "Accepted" &&
    b.g28Status === "Complete" &&
    b.attorneyReviewStatus === "Approved"
  );
  const trackComplete = fileComplete && submittedMissingConfirmations.length === 0 && auditIncomplete.length === 0;

  let nextAction;
  if (requiredDataIssues.length > 0) {
    nextAction = { tab: "Prepare", text: `Resolve ${requiredDataIssues.length} missing or invalid beneficiary field${requiredDataIssues.length === 1 ? "" : "s"} before generating the template.`, cta: "Go to Prepare" };
  } else if (unresolvedHighDuplicates.length > 0) {
    nextAction = { tab: "Review", text: `Review ${unresolvedHighDuplicates.length} high-confidence duplicate match${unresolvedHighDuplicates.length === 1 ? "" : "es"} blocking template generation.`, cta: "Go to Review Queue" };
  } else if (attorneyExceptions.length > 0) {
    nextAction = { tab: "Review", text: `Attorney review required for ${attorneyExceptions.length} open exception${attorneyExceptions.length === 1 ? "" : "s"}.`, cta: "Go to Review Queue" };
  } else if (!templateGenerated) {
    nextAction = { tab: "Prepare", text: "All required data is complete. Generate USCIS template.", cta: "Generate Template" };
  } else if (pendingApprovalBatch) {
    nextAction = { tab: "File", text: `${pendingApprovalBatch.id} is pending company admin approval. Send reminder.`, cta: "Go to File" };
  } else if (rejectedBatch) {
    nextAction = { tab: "File", text: `${rejectedBatch.id} was rejected by company admin. View reason and resend.`, cta: "Go to File" };
  } else if (acceptedUnpaidBatch) {
    nextAction = { tab: "File", text: `${acceptedUnpaidBatch.id} accepted by client admin. Complete Pay.gov payment.`, cta: "Go to File" };
  } else if (submittedMissingConfirmations.length > 0) {
    nextAction = { tab: "Track", text: `${submittedMissingConfirmations.length} submitted registration${submittedMissingConfirmations.length === 1 ? " is" : "s are"} missing confirmation numbers.`, cta: "Go to Track" };
  } else if (auditIncomplete.length > 0) {
    nextAction = { tab: "Track", text: `${auditIncomplete.length} audit packet${auditIncomplete.length === 1 ? " is" : "s are"} incomplete.`, cta: "Go to Track" };
  } else {
    nextAction = { tab: "Track", text: "All filings complete.", cta: "View Track" };
  }

  let overallStatus = "On Track";
  if (trackComplete) overallStatus = "Complete";
  else if (openExceptions.some((e) => e.severity === "High") || rejectedBatch) overallStatus = "Blocked";
  else if (requiredDataIssues.length > 0 || unresolvedHighDuplicates.length > 0 || submittedMissingConfirmations.length > 0 || auditIncomplete.length > 0) overallStatus = "At Risk";

  const stageStatuses = {
    Prepare: prepareComplete ? "Complete" : requiredDataIssues.length > 0 || unresolvedHighDuplicates.length > 0 ? "Blocked" : "In Progress",
    Review: reviewComplete ? "Complete" : highOrMediumExceptions.some((e) => e.severity === "High") ? "Blocked" : "In Progress",
    File: fileComplete ? "Complete" : prepareComplete && reviewComplete ? "In Progress" : "Not Started",
    Track: trackComplete ? "Complete" : fileComplete ? (submittedMissingConfirmations.length > 0 || auditIncomplete.length > 0 ? "Blocked" : "In Progress") : "Not Started",
  };

  return {
    clientBeneficiaries,
    clientExceptions,
    clientDuplicateRisks,
    clientBatches,
    requiredDataIssues,
    invalidFields,
    unresolvedHighDuplicates,
    openExceptions,
    highOrMediumExceptions,
    submittedMissingConfirmations,
    auditIncomplete,
    readyBeneficiaries,
    nextAction,
    overallStatus,
    stageStatuses,
  };
}

function CommandCenter({ selectedClientId, setSelectedClientId, state, setActiveTab }) {
  const metrics = [
    ["Beneficiaries", state.clientBeneficiaries.length],
    ["Ready", state.readyBeneficiaries.length],
    ["Open exceptions", state.openExceptions.length],
    ["Duplicate risks", state.clientDuplicateRisks.filter((r) => r.status !== "Resolved").length],
    ["Batches", state.clientBatches.length],
    ["Submitted", state.clientBeneficiaries.filter((b) => b.filingStatus === "Submitted").length],
  ];

  return (
    <Card style={{ padding: 18, marginBottom: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1.4fr) minmax(320px, 2fr)", gap: 18, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>Client</div>
          <select
            value={selectedClientId}
            onChange={(event) => setSelectedClientId(event.target.value)}
            style={{ marginTop: 6, width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", color: "#172033", fontWeight: 800, fontSize: 16 }}
          >
            {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Overall status</span>
            <Badge value={state.overallStatus}>{state.overallStatus}</Badge>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>Next Best Action</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 7 }}>
            <div style={{ flex: 1, color: "#172033", fontWeight: 800, lineHeight: 1.35 }}>{state.nextAction.text}</div>
            <button onClick={() => setActiveTab(state.nextAction.tab)} style={primaryButton()}>{state.nextAction.cta}</button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(100px, 1fr))", gap: 10, marginTop: 18 }}>
        {metrics.map(([label, value]) => <Metric key={label} label={label} value={value} />)}
      </div>
    </Card>
  );
}

function WorkflowBar({ stageStatuses, activeTab, setActiveTab }) {
  const stages = ["Prepare", "Review", "File", "Track"];
  return (
    <Card style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {stages.map((stage, index) => {
          const status = stageStatuses[stage];
          const active = activeTab === stage;
          return (
            <button
              key={stage}
              onClick={() => setActiveTab(stage)}
              style={{
                border: `1px solid ${active ? "#2952cc" : "#dbe3ee"}`,
                background: active ? "#eff4ff" : "#fff",
                borderRadius: 8,
                padding: "12px 10px",
                textAlign: "left",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#172033", fontWeight: 900 }}>
                <span style={{ width: 22, height: 22, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", background: active ? "#2952cc" : "#eef2f7", color: active ? "#fff" : "#475569", fontSize: 12 }}>{index + 1}</span>
                {stage}
              </div>
              <div style={{ marginTop: 8 }}><Badge value={status}>{status}</Badge></div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function primaryButton(disabled = false) {
  return {
    border: "none",
    borderRadius: 8,
    padding: "9px 14px",
    background: disabled ? "#cbd5e1" : "#2952cc",
    color: disabled ? "#64748b" : "#fff",
    fontSize: 12,
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  };
}

function secondaryButton() {
  return {
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    padding: "8px 12px",
    background: "#fff",
    color: "#172033",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  };
}

function SectionHeader({ tab }) {
  return (
    <div style={{ margin: "4px 0 16px" }}>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#172033" }}>{tab}</h2>
      <p style={{ marginTop: 4, color: "#64748b", fontSize: 14 }}>{tabCopy[tab]}</p>
    </div>
  );
}

function SummaryGrid({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, minmax(130px, 1fr))`, gap: 12, marginBottom: 16 }}>
      {items.map((item) => {
        const s = item.tone || styleForStatus(item.status || item.label);
        return (
          <Card key={item.label} style={{ padding: 14, borderColor: s.border, background: s.bg }}>
            <div style={{ fontFamily: "'DM Mono', ui-monospace, monospace", color: s.color, fontWeight: 900, fontSize: 24 }}>{item.value}</div>
            <div style={{ color: s.color, fontSize: 12, fontWeight: 800 }}>{item.label}</div>
          </Card>
        );
      })}
    </div>
  );
}

function PrepareTab({ client, state, templateGenerated, setTemplateGenerated, setActiveTab }) {
  const [expandedRisk, setExpandedRisk] = useState(null);
  const blockers = state.requiredDataIssues.length + state.unresolvedHighDuplicates.length + state.openExceptions.filter((e) => e.severity === "High").length;
  const templateStatus = templateGenerated ? "Generated" : blockers > 0 ? "Not Ready" : "Ready";
  const duplicateStats = {
    total: state.clientDuplicateRisks.length,
    high: state.clientDuplicateRisks.filter((r) => r.confidence === "High").length,
    pending: state.clientDuplicateRisks.filter((r) => r.status !== "Resolved").length,
    resolved: state.clientDuplicateRisks.filter((r) => r.status === "Resolved").length,
  };

  return (
    <div>
      <SectionHeader tab="Prepare" />
      <Card style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          {[
            ["Client", client.name],
            ["Petitioner entity", client.petitionerEntity],
            ["EIN", client.ein],
            ["Authorized signatory", client.authorizedSignatory],
            ["Attorney owner", client.attorneyOwner],
            ["Legal ops owner", client.legalOpsOwner],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: "#64748b", fontWeight: 900 }}>{label}</div>
              <div style={{ marginTop: 3, fontSize: 13, color: "#172033", fontWeight: 800 }}>{value}</div>
            </div>
          ))}
        </div>
      </Card>

      <SummaryGrid items={[
        { label: "Required fields complete", value: `${state.clientBeneficiaries.length - state.requiredDataIssues.length}/${state.clientBeneficiaries.length}`, status: state.requiredDataIssues.length ? "At Risk" : "Complete" },
        { label: "Missing info", value: state.requiredDataIssues.filter((b) => b.dataStatus === "Missing Info").length, status: state.requiredDataIssues.length ? "Open" : "Complete" },
        { label: "Invalid fields", value: state.invalidFields.length, status: state.invalidFields.length ? "Invalid" : "Complete" },
        { label: "Duplicate risks", value: duplicateStats.pending, status: duplicateStats.pending ? "At Risk" : "Complete" },
        { label: "Template readiness", value: templateStatus, status: templateStatus },
      ]} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "start" }}>
        <Card style={{ overflow: "auto" }}>
          <table style={tableStyle(960)}>
            <thead>{tableHead(["Beneficiary name", "Passport status", "Biographic data", "SOC/OEWS", "Area of employment", "Duplicate risk", "Overall readiness", "Action"])}</thead>
            <tbody>
              {state.clientBeneficiaries.map((b) => {
                const ready = b.dataStatus === "Complete" && !["High", "Medium"].includes(b.duplicateRisk) && !["Open", "In Review"].includes(b.exceptionStatus);
                return (
                  <tr key={b.id} style={rowStyle()}>
                    <td style={cellStyle(true)}>{b.name}</td>
                    <td style={cellStyle()}><Badge value={b.passportStatus}>{b.passportStatus}</Badge></td>
                    <td style={cellStyle()}><Badge value={b.biographicStatus}>{b.biographicStatus}</Badge></td>
                    <td style={cellStyle()}><Badge value={b.socOewsStatus}>{b.socOewsStatus}</Badge></td>
                    <td style={cellStyle()}><Badge value={b.areaStatus}>{b.areaStatus}</Badge></td>
                    <td style={cellStyle()}><Badge value={b.duplicateRisk}>{b.duplicateRisk}</Badge></td>
                    <td style={cellStyle()}><Badge value={ready ? "Complete" : "Blocked"}>{ready ? "Ready for Template" : "Blocked"}</Badge></td>
                    <td style={cellStyle()}>
                      <button onClick={() => setActiveTab(ready ? "File" : "Review")} style={secondaryButton()}>{ready ? "Assign Batch" : "Review"}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <div style={{ display: "grid", gap: 16 }}>
          <Card style={{ padding: 16 }}>
            <h3 style={panelTitle()}>Duplicate Risk Summary</h3>
            {[
              ["Total duplicate risks", duplicateStats.total],
              ["High-confidence matches", duplicateStats.high],
              ["Pending attorney review", duplicateStats.pending],
              ["Resolved", duplicateStats.resolved],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eef2f7", fontSize: 13 }}>
                <span style={{ color: "#64748b", fontWeight: 700 }}>{label}</span>
                <strong style={{ color: "#172033" }}>{value}</strong>
              </div>
            ))}
            {state.clientDuplicateRisks.map((risk) => (
              <div key={risk.id} style={{ marginTop: 10 }}>
                <button onClick={() => setExpandedRisk(expandedRisk === risk.id ? null : risk.id)} style={{ ...secondaryButton(), width: "100%", textAlign: "left" }}>
                  {getBeneficiaryName(risk.beneficiaryId, state.clientBeneficiaries)} - {risk.confidence}
                </button>
                {expandedRisk === risk.id && (
                  <div style={{ padding: 10, fontSize: 12, color: "#475569", lineHeight: 1.45 }}>
                    <strong>{risk.matchType}:</strong> {risk.matchedRecord}<br />
                    {risk.riskReason}
                  </div>
                )}
              </div>
            ))}
          </Card>

          <Card style={{ padding: 16 }}>
            <h3 style={panelTitle()}>USCIS Template Generation</h3>
            <div style={{ display: "grid", gap: 8, fontSize: 13, color: "#475569", marginBottom: 14 }}>
              <div>Status: <Badge value={templateStatus}>{templateStatus}</Badge></div>
              <div>Beneficiary count included: <strong>{blockers ? state.readyBeneficiaries.length : state.clientBeneficiaries.length}</strong></div>
              <div>Last generated: <strong>{templateGenerated ? "2026-05-01 09:10 CT" : "Not generated"}</strong></div>
              <div>Generated by: <strong>{templateGenerated ? "Evan Brooks" : "-"}</strong></div>
            </div>
            <div style={{ padding: 10, borderRadius: 8, background: blockers ? "#fff1ec" : "#e9fbf4", border: `1px solid ${blockers ? "#f4c8b9" : "#b5ecd7"}`, color: blockers ? "#b43214" : "#0f7f5f", fontSize: 12, fontWeight: 800, marginBottom: 12 }}>
              {blockers ? state.nextAction.text : "All required data is complete. Generate USCIS template."}
            </div>
            <button disabled={blockers > 0} onClick={() => setTemplateGenerated(true)} style={{ ...primaryButton(blockers > 0), width: "100%" }}>
              Generate USCIS Bulk Upload Template
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ReviewTab({ state, exceptions, setExceptions, setDuplicateRisks, beneficiaries, setBeneficiaries }) {
  const [filters, setFilters] = useState({ severity: "All", owner: "All", status: "All" });
  const [selectedExceptionId, setSelectedExceptionId] = useState(null);
  const [note, setNote] = useState("");
  const selectedException = exceptions.find((e) => e.id === selectedExceptionId);
  const scopedExceptions = exceptions.filter((e) => e.clientId === state.clientBeneficiaries[0]?.clientId);
  const filtered = scopedExceptions.filter((e) =>
    (filters.severity === "All" || e.severity === filters.severity) &&
    (filters.owner === "All" || e.owner === filters.owner) &&
    (filters.status === "All" || e.status === filters.status)
  );

  const updateException = (id, patch) => {
    const exception = exceptions.find((e) => e.id === id);
    setExceptions((prev) => prev.map((e) => e.id === id ? { ...e, ...patch } : e));
    if (patch.status === "Resolved" && exception?.beneficiaryId) {
      setBeneficiaries((prev) => prev.map((b) => b.id === exception.beneficiaryId ? { ...b, exceptionStatus: "Resolved", attorneyReviewStatus: exception.owner === "Attorney" ? "Approved" : b.attorneyReviewStatus } : b));
      if (exception.issueType.includes("duplicate")) {
        setDuplicateRisks((prev) => prev.map((r) => r.beneficiaryId === exception.beneficiaryId ? { ...r, status: "Resolved" } : r));
      }
    }
  };

  const openReview = (exception) => {
    setSelectedExceptionId(exception.id);
    setNote("");
    if (exception.status === "Open" && exception.owner === "Attorney") updateException(exception.id, { status: "In Review" });
  };

  return (
    <div>
      <SectionHeader tab="Review" />
      <SummaryGrid items={[
        { label: "Total open exceptions", value: state.openExceptions.length, status: state.openExceptions.length ? "Open" : "Complete" },
        { label: "High severity", value: state.openExceptions.filter((e) => e.severity === "High").length, status: state.openExceptions.some((e) => e.severity === "High") ? "High" : "Complete" },
        { label: "Assigned to attorney", value: state.openExceptions.filter((e) => e.owner === "Attorney").length, status: "Required" },
        { label: "Waiting on client", value: state.openExceptions.filter((e) => e.owner === "Employer HR").length, status: "Pending" },
      ]} />

      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
        {[
          ["severity", ["All", "High", "Medium", "Low"]],
          ["owner", ["All", "Attorney", "Legal Ops", "Employer HR", "Company Admin"]],
          ["status", ["All", "Open", "In Review", "Resolved"]],
        ].map(([key, options]) => (
          <select key={key} value={filters[key]} onChange={(event) => setFilters((prev) => ({ ...prev, [key]: event.target.value }))} style={selectStyle()}>
            {options.map((option) => <option key={option} value={option}>{option === "All" ? `All ${key}` : option}</option>)}
          </select>
        ))}
        <span style={{ marginLeft: "auto", color: "#64748b", fontSize: 12, fontWeight: 700 }}>{filtered.length} shown</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedException ? "1fr 360px" : "1fr", gap: 16, alignItems: "start" }}>
        <Card style={{ overflow: "auto" }}>
          <table style={tableStyle(1100)}>
            <thead>{tableHead(["Beneficiary", "Client", "Batch ID", "Issue type", "Severity", "Owner", "Status", "Recommended action", "CTA"])}</thead>
            <tbody>
              {filtered.map((exception) => (
                <tr key={exception.id} style={{ ...rowStyle(), background: selectedExceptionId === exception.id ? "#f8fbff" : "#fff" }}>
                  <td style={cellStyle(true)}>{exception.beneficiaryId ? getBeneficiaryName(exception.beneficiaryId, beneficiaries) : "-"}</td>
                  <td style={cellStyle()}>{getClientName(exception.clientId)}</td>
                  <td style={monoCell()}>{exception.batchId || "-"}</td>
                  <td style={cellStyle(true)}>{exception.issueType}</td>
                  <td style={cellStyle()}><Badge value={exception.severity}>{exception.severity}</Badge></td>
                  <td style={cellStyle()}>{exception.owner}</td>
                  <td style={cellStyle()}><Badge value={exception.status}>{exception.status}</Badge></td>
                  <td style={{ ...cellStyle(), maxWidth: 250, color: "#64748b" }}>{exception.recommendedAction}</td>
                  <td style={cellStyle()}>
                    {exception.status === "Resolved"
                      ? <Badge value="Complete">Complete</Badge>
                      : <button onClick={() => openReview(exception)} style={secondaryButton()}>Review</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {selectedException && (
          <Card style={{ padding: 16, position: "sticky", top: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', ui-monospace, monospace", color: "#64748b", fontSize: 11 }}>{selectedException.id}</div>
                <h3 style={{ ...panelTitle(), marginTop: 4 }}>{selectedException.issueType}</h3>
              </div>
              <button onClick={() => setSelectedExceptionId(null)} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 18 }}>x</button>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              <Badge value={selectedException.severity}>{selectedException.severity}</Badge>
              <Badge value={selectedException.status}>{selectedException.status}</Badge>
            </div>
            <Detail label="Beneficiary" value={selectedException.beneficiaryId ? getBeneficiaryName(selectedException.beneficiaryId, beneficiaries) : "Batch-level issue"} />
            <Detail label="Client" value={getClientName(selectedException.clientId)} />
            <Detail label="Source field causing issue" value={selectedException.sourceField} />
            <Detail label="Suggested next step" value={selectedException.recommendedAction} />
            <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Notes" style={{ width: "100%", minHeight: 72, boxSizing: "border-box", border: "1px solid #cbd5e1", borderRadius: 8, padding: 10, fontFamily: "inherit", marginTop: 8 }} />
            <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
              <button onClick={() => updateException(selectedException.id, { status: "Resolved" })} style={primaryButton()}>Mark Resolved</button>
              <button onClick={() => updateException(selectedException.id, { owner: "Employer HR", status: "Open" })} style={secondaryButton()}>Request Info</button>
              <button onClick={() => updateException(selectedException.id, { owner: "Attorney", status: "In Review" })} style={secondaryButton()}>Escalate to Attorney</button>
              <button onClick={() => {
                updateException(selectedException.id, { status: "Resolved" });
                if (selectedException.beneficiaryId) setBeneficiaries((prev) => prev.map((b) => b.id === selectedException.beneficiaryId ? { ...b, filingStatus: "Not Started", exceptionStatus: "Resolved" } : b));
              }} style={secondaryButton()}>Exclude from Filing</button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function FileTab({ state, batches, setBatches, setActiveTab }) {
  const [selectedBatchId, setSelectedBatchId] = useState(state.clientBatches[0]?.id || null);
  const selectedBatch = batches.find((b) => b.id === selectedBatchId && state.clientBatches.some((scoped) => scoped.id === b.id));

  const updateBatch = (id, patch) => {
    setBatches((prev) => prev.map((batch) => batch.id === id ? { ...batch, ...patch } : batch));
  };

  return (
    <div>
      <SectionHeader tab="File" />
      <Card style={{ overflow: "auto", marginBottom: 16 }}>
        <table style={tableStyle(1200)}>
          <thead>{tableHead(["Client", "USCIS batch ID", "Beneficiary count", "Batch status", "Attorney review", "G-28", "Company admin approval", "Payment", "Submission", "Confirmation", "Next action"])}</thead>
          <tbody>
            {state.clientBatches.map((batch) => (
              <tr key={batch.id} onClick={() => setSelectedBatchId(batch.id)} style={{ ...rowStyle(), cursor: "pointer", background: selectedBatchId === batch.id ? "#f8fbff" : "#fff" }}>
                <td style={cellStyle(true)}>{getClientName(batch.clientId)}</td>
                <td style={monoCell()}>{batch.id}</td>
                <td style={monoCell()}>{batch.beneficiaryCount}</td>
                <td style={cellStyle()}><Badge value={batch.status}>{batch.status}</Badge></td>
                <td style={cellStyle()}><Badge value={batch.attorneyReviewStatus}>{batch.attorneyReviewStatus}</Badge></td>
                <td style={cellStyle()}><Badge value={batch.g28Status}>{batch.g28Status}</Badge></td>
                <td style={cellStyle()}><Badge value={batch.companyAdminApprovalStatus}>{batch.companyAdminApprovalStatus}</Badge></td>
                <td style={cellStyle()}><Badge value={batch.paymentStatus}>{batch.paymentStatus}</Badge></td>
                <td style={cellStyle()}><Badge value={batch.submissionStatus}>{batch.submissionStatus}</Badge></td>
                <td style={cellStyle()}><Badge value={batch.confirmationCaptureStatus}>{batch.confirmationCaptureStatus}</Badge></td>
                <td style={{ ...cellStyle(), color: "#64748b", maxWidth: 220 }}>{batch.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {selectedBatch && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
          <Card style={{ padding: 16 }}>
            <h3 style={panelTitle()}>{selectedBatch.id} Filing Readiness Checklist</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                ["USCIS upload complete", selectedBatch.status !== "Draft created" && selectedBatch.status !== "Needs attorney review"],
                ["Batch count reconciled", true],
                ["Duplicate check complete", state.unresolvedHighDuplicates.length === 0],
                ["Attorney review complete", selectedBatch.attorneyReviewStatus === "Approved"],
                ["G-28 complete", selectedBatch.g28Status === "Complete"],
                ["Company admin accepted", selectedBatch.companyAdminApprovalStatus === "Accepted"],
                ["Fee total calculated", !!selectedBatch.feeTotal],
                ["Payment complete", selectedBatch.paymentStatus === "Complete"],
                ["USCIS submitted", selectedBatch.submissionStatus === "Submitted"],
              ].map(([label, done]) => (
                <div key={label} style={{ display: "flex", gap: 8, alignItems: "center", padding: 9, borderRadius: 8, border: "1px solid #dbe3ee", background: done ? "#e9fbf4" : "#f7f9fc", color: done ? "#0f7f5f" : "#64748b", fontSize: 12, fontWeight: 800 }}>
                  <span>{done ? "OK" : "--"}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "#f8fbff", border: "1px solid #dbe3ee", color: "#475569", fontSize: 13 }}>
              Final payment and submission are completed in USCIS/Pay.gov.
            </div>
          </Card>

          <Card style={{ padding: 16 }}>
            <h3 style={panelTitle()}>Company Admin Approval</h3>
            <Detail label="Sent to admin at" value={selectedBatch.sentToAdminAt || "Not sent"} />
            <Detail label="Time pending" value={selectedBatch.companyAdminApprovalStatus === "Pending" ? "18 hours" : "-"} />
            <Detail label="Admin contact" value={selectedBatch.adminContact} />
            <Detail label="Deadline risk" value={selectedBatch.companyAdminApprovalStatus === "Pending" ? "Reminder recommended today" : "No current approval risk"} />
            {selectedBatch.companyAdminApprovalStatus === "Rejected" && (
              <div style={{ padding: 10, borderRadius: 8, background: "#fff1ec", border: "1px solid #f4c8b9", color: "#b43214", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>
                Rejected by company admin because petitioner entity did not match the selected account.
              </div>
            )}
            <div style={{ display: "grid", gap: 8 }}>
              {selectedBatch.companyAdminApprovalStatus === "Pending" && <button style={secondaryButton()}>Send Reminder</button>}
              {selectedBatch.companyAdminApprovalStatus === "Rejected" && <button style={secondaryButton()}>Edit Batch</button>}
              {selectedBatch.companyAdminApprovalStatus === "Rejected" && <button style={secondaryButton()}>Resend for Approval</button>}
              {selectedBatch.companyAdminApprovalStatus === "Accepted" && selectedBatch.paymentStatus !== "Complete" && (
                <button onClick={() => updateBatch(selectedBatch.id, { paymentStatus: "Complete", status: "Payment complete", nextAction: "Submit registrations in USCIS." })} style={primaryButton()}>
                  Complete Pay.gov Payment
                </button>
              )}
              {selectedBatch.paymentStatus === "Complete" && selectedBatch.submissionStatus !== "Submitted" && (
                <button onClick={() => updateBatch(selectedBatch.id, { submissionStatus: "Submitted", status: "Submitted", confirmationCaptureStatus: "Missing", nextAction: "Capture confirmation numbers." })} style={primaryButton()}>
                  Mark Submitted
                </button>
              )}
              {selectedBatch.submissionStatus === "Submitted" && <button onClick={() => setActiveTab("Track")} style={primaryButton()}>Capture Confirmations</button>}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function TrackTab({ state, beneficiaries, setBeneficiaries }) {
  const submitted = state.clientBeneficiaries.filter((b) => b.filingStatus === "Submitted");
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState(submitted[0]?.id || null);
  const [confirmationInput, setConfirmationInput] = useState("");
  const selectedBeneficiary = beneficiaries.find((b) => b.id === selectedBeneficiaryId);

  const updateBeneficiary = (id, patch) => {
    setBeneficiaries((prev) => prev.map((beneficiary) => beneficiary.id === id ? { ...beneficiary, ...patch } : beneficiary));
  };

  return (
    <div>
      <SectionHeader tab="Track" />
      <SummaryGrid items={[
        { label: "Submitted registrations", value: submitted.length, status: "Submitted" },
        { label: "Confirmations captured", value: submitted.filter((b) => b.confirmationStatus === "Captured").length, status: "Captured" },
        { label: "Missing confirmations", value: submitted.filter((b) => b.confirmationStatus === "Missing").length, status: submitted.some((b) => b.confirmationStatus === "Missing") ? "Missing" : "Complete" },
        { label: "Audit packets complete", value: submitted.filter((b) => b.auditStatus === "Complete").length, status: state.auditIncomplete.length ? "At Risk" : "Complete" },
      ]} />

      <div style={{ display: "grid", gridTemplateColumns: selectedBeneficiary ? "1fr 340px" : "1fr", gap: 16, alignItems: "start" }}>
        <Card style={{ overflow: "auto" }}>
          <table style={tableStyle(1080)}>
            <thead>{tableHead(["Beneficiary", "Client", "Batch ID", "USCIS confirmation number", "USCIS status", "Submitted timestamp", "Payment status", "Audit status", "Action"])}</thead>
            <tbody>
              {submitted.map((beneficiary) => (
                <tr key={beneficiary.id} style={{ ...rowStyle(), background: selectedBeneficiaryId === beneficiary.id ? "#f8fbff" : "#fff" }}>
                  <td style={cellStyle(true)}>{beneficiary.name}</td>
                  <td style={cellStyle()}>{getClientName(beneficiary.clientId)}</td>
                  <td style={monoCell()}>{beneficiary.batchId}</td>
                  <td style={monoCell()}>{beneficiary.confirmationNumber || "Missing"}</td>
                  <td style={cellStyle()}><Badge value={beneficiary.confirmationStatus === "Missing" ? "Missing" : beneficiary.uscisStatus}>{beneficiary.uscisStatus}</Badge></td>
                  <td style={monoCell()}>{beneficiary.submittedAt}</td>
                  <td style={cellStyle()}><Badge value="Complete">Complete</Badge></td>
                  <td style={cellStyle()}><Badge value={beneficiary.auditStatus}>{beneficiary.auditStatus}</Badge></td>
                  <td style={cellStyle()}><button onClick={() => setSelectedBeneficiaryId(beneficiary.id)} style={secondaryButton()}>View Audit Timeline</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {selectedBeneficiary && (
          <Card style={{ padding: 16, position: "sticky", top: 16 }}>
            <h3 style={panelTitle()}>{selectedBeneficiary.name}</h3>
            <Detail label="Batch" value={selectedBeneficiary.batchId} />
            <Detail label="Confirmation status" value={selectedBeneficiary.confirmationStatus} />
            <div style={{ display: "flex", gap: 8, margin: "8px 0 12px" }}>
              <input value={confirmationInput} onChange={(event) => setConfirmationInput(event.target.value)} placeholder="Confirmation number" style={{ flex: 1, border: "1px solid #cbd5e1", borderRadius: 8, padding: "8px 10px" }} />
              <button onClick={() => {
                if (!confirmationInput.trim()) return;
                updateBeneficiary(selectedBeneficiary.id, { confirmationStatus: "Captured", confirmationNumber: confirmationInput.trim(), uscisStatus: "Submitted" });
                setConfirmationInput("");
              }} style={primaryButton()}>Save</button>
            </div>
            <button onClick={() => updateBeneficiary(selectedBeneficiary.id, { auditStatus: "Complete" })} style={{ ...secondaryButton(), width: "100%", marginBottom: 12 }}>
              Mark Audit Packet Complete
            </button>
            <button style={{ ...secondaryButton(), width: "100%", marginBottom: 12 }}>Download Audit Packet</button>
            <h4 style={{ ...panelTitle(), fontSize: 12 }}>Audit Timeline</h4>
            <div style={{ display: "grid", gap: 7 }}>
              {auditEvents.map((event, index) => {
                const completeThrough = selectedBeneficiary.confirmationStatus === "Captured" ? auditEvents.length : auditEvents.length - 1;
                const done = index < completeThrough;
                return (
                  <div key={event} style={{ display: "flex", gap: 8, alignItems: "center", color: done ? "#0f7f5f" : "#64748b", fontSize: 12, fontWeight: 800 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? "#e9fbf4" : "#f7f9fc", border: `1px solid ${done ? "#b5ecd7" : "#dbe3ee"}` }}>{done ? "OK" : "--"}</span>
                    {event}
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: "#64748b", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
      <div style={{ marginTop: 3, color: "#172033", fontSize: 13, fontWeight: 800, lineHeight: 1.35 }}>{value}</div>
    </div>
  );
}

function selectStyle() {
  return { padding: "7px 10px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", color: "#172033", fontWeight: 700, fontFamily: "inherit" };
}

function tableStyle(minWidth) {
  return { width: "100%", minWidth, borderCollapse: "collapse", fontSize: 12 };
}

function tableHead(headers) {
  return (
    <tr style={{ background: "#f8fbff", borderBottom: "1px solid #dbe3ee" }}>
      {headers.map((header) => (
        <th key={header} style={{ padding: "10px 12px", textAlign: "left", fontSize: 10, color: "#50627a", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{header}</th>
      ))}
    </tr>
  );
}

function rowStyle() {
  return { borderBottom: "1px solid #eef2f7" };
}

function cellStyle(bold = false) {
  return { padding: "11px 12px", color: "#172033", fontWeight: bold ? 800 : 600, verticalAlign: "top" };
}

function monoCell() {
  return { ...cellStyle(), fontFamily: "'DM Mono', ui-monospace, monospace", fontSize: 11 };
}

function panelTitle() {
  return { margin: "0 0 12px", color: "#172033", fontSize: 15, fontWeight: 900 };
}

export default function AlmaPrototype() {
  const [activeTab, setActiveTab] = useState("Prepare");
  const [selectedClientId, setSelectedClientId] = useState("acme");
  const [beneficiaries, setBeneficiaries] = useState(initialBeneficiaries);
  const [exceptions, setExceptions] = useState(initialExceptions);
  const [duplicateRisks, setDuplicateRisks] = useState(initialDuplicateRisks);
  const [batches, setBatches] = useState(initialBatches);
  const [templateGeneratedByClient, setTemplateGeneratedByClient] = useState({ acme: false, meridian: true, novabridge: true });

  const selectedClient = clients.find((client) => client.id === selectedClientId) || clients[0];
  const state = useMemo(() => getClientState({
    clientId: selectedClientId,
    beneficiaries,
    exceptions,
    duplicateRisks,
    batches,
    templateGenerated: templateGeneratedByClient[selectedClientId],
  }), [selectedClientId, beneficiaries, exceptions, duplicateRisks, batches, templateGeneratedByClient]);

  const setTemplateGenerated = (value) => {
    setTemplateGeneratedByClient((prev) => ({ ...prev, [selectedClientId]: value }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fa", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#172033" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: 24 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>alma</div>
            <h1 style={{ margin: "2px 0 0", color: "#172033", fontSize: 30, lineHeight: 1.1, letterSpacing: 0, fontWeight: 900 }}>Alma H-1B Filing Cockpit</h1>
          </div>
          <div style={{ color: "#64748b", fontSize: 12, fontWeight: 800 }}>FY2027 Cap Season</div>
        </header>

        <CommandCenter selectedClientId={selectedClientId} setSelectedClientId={(id) => { setSelectedClientId(id); setActiveTab("Prepare"); }} state={state} setActiveTab={setActiveTab} />
        <WorkflowBar stageStatuses={state.stageStatuses} activeTab={activeTab} setActiveTab={setActiveTab} />

        <Card style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 8, borderBottom: "1px solid #e2e8f0", margin: "-2px -2px 16px", padding: "0 2px 12px" }}>
            {["Prepare", "Review", "File", "Track"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                border: `1px solid ${activeTab === tab ? "#2952cc" : "#dbe3ee"}`,
                background: activeTab === tab ? "#eff4ff" : "#fff",
                color: activeTab === tab ? "#2952cc" : "#475569",
                borderRadius: 8,
                padding: "9px 14px",
                fontWeight: 900,
                cursor: "pointer",
                fontFamily: "inherit",
              }}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Prepare" && (
            <PrepareTab
              client={selectedClient}
              state={state}
              templateGenerated={templateGeneratedByClient[selectedClientId]}
              setTemplateGenerated={setTemplateGenerated}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "Review" && (
            <ReviewTab
              state={state}
              exceptions={exceptions}
              setExceptions={setExceptions}
              setDuplicateRisks={setDuplicateRisks}
              beneficiaries={beneficiaries}
              setBeneficiaries={setBeneficiaries}
            />
          )}
          {activeTab === "File" && (
            <FileTab state={state} batches={batches} setBatches={setBatches} setActiveTab={setActiveTab} />
          )}
          {activeTab === "Track" && (
            <TrackTab state={state} beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} />
          )}
        </Card>
      </div>
    </div>
  );
}
