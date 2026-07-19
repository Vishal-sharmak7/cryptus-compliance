import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaSearch,
  FaBookOpen,
  FaClipboardList,
  FaVideo,
  FaDownload,
  FaMap,
  FaChevronDown,
  FaChevronUp,
  FaNewspaper,
  FaFileAlt,
  FaTag,
  FaClock,
  FaShieldAlt,
  FaLock,
  FaGlobe,
  FaTimes,
  FaCheckSquare,
  FaExternalLinkAlt,
} from "react-icons/fa";
import resourcesData from "../data/resourcesData";

/* ─── TYPE ICON MAP ───────────────────────────────────────────── */
const typeIcon = {
  guide: FaBookOpen,
  checklist: FaClipboardList,
  webinar: FaVideo,
};

/* ─── BLOG / ARTICLES DATA ────────────────────────────────────── */
const blogArticles = [
  {
    id: 1,
    category: "ISO 27001",
    categoryColor: "#155DFC",
    title: "How to Build a Risk Register That Survives Audit Season",
    excerpt:
      "A well-structured risk register is the backbone of ISO 27001. Learn how to create one that auditors love and your team can actually maintain.",
    readTime: "8 min read",
    date: "July 12, 2026",
    author: "Ananya Sharma",
    authorRole: "CISO Advisor",
    icon: FaShieldAlt,
    content: [
      {
        heading: "What Is a Risk Register and Why Does It Matter?",
        body: "A risk register is a living document that records every identified information security risk your organisation faces. For ISO 27001, it's not optional — Clause 6.1 requires you to identify, analyse, and evaluate information security risks before implementing any controls. Auditors will spend significant time reviewing your risk register, so getting it right matters.",
      },
      {
        heading: "Step 1: Identify Your Information Assets",
        body: "Start by cataloguing every asset that holds, processes, or transmits information of value — servers, laptops, SaaS tools, databases, paper records, and even people. Each asset needs an owner. Without asset ownership, your risk register has no accountability layer and will collapse during audit review.",
      },
      {
        heading: "Step 2: Identify Threats and Vulnerabilities",
        body: "For each asset, list the threats (what could go wrong) and vulnerabilities (weaknesses that allow threats to materialise). Common threats include ransomware, insider data theft, and vendor breaches. Common vulnerabilities include missing MFA, unpatched systems, and weak access controls.",
      },
      {
        heading: "Step 3: Score Likelihood and Impact",
        body: "Use a simple 1–5 scale for both likelihood (how probable is this risk?) and impact (how badly would it hurt?). Multiply them to get a risk score. This lets you prioritise — a score of 20 (5×4) demands immediate attention, while a score of 2 (1×2) can be monitored and accepted.",
      },
      {
        heading: "Step 4: Map Controls and Residual Risk",
        body: "For each risk above your acceptable threshold, document which Annex A control addresses it. Then re-score the likelihood and impact with that control in place — this gives you your residual risk. If residual risk is still above your threshold, you need additional controls or a formal risk acceptance decision from management.",
      },
      {
        heading: "Step 5: Keep It Alive",
        body: "A risk register reviewed once a year is a compliance theatre prop. Set quarterly review triggers: new vendor onboarded, major infrastructure change, security incident, or new regulatory obligation. Cryptus Compliance auto-flags stale risks and prompts assigned owners to re-evaluate — so your register stays current without calendar reminders.",
      },
    ],
    keyTakeaways: [
      "Your risk register must be reviewed at planned intervals — annual is the minimum, quarterly is better",
      "Every risk needs an owner; unowned risks will fail your audit",
      "Residual risk (after controls) must still be documented and accepted by management",
      "Link every control in your register back to an Annex A clause for audit traceability",
    ],
  },
  {
    id: 2,
    category: "SOC 2",
    categoryColor: "#7C3AED",
    title: "SOC 2 vs ISO 27001: Which Framework Should You Pursue First?",
    excerpt:
      "Both certifications build customer trust — but they serve different markets. Here's how to decide which one unlocks more value for your business.",
    readTime: "6 min read",
    date: "July 5, 2026",
    author: "Rohan Mehta",
    authorRole: "Compliance Lead",
    icon: FaLock,
    content: [
      {
        heading: "Who Asks for Each Certification?",
        body: "SOC 2 is primarily requested by US-based enterprise buyers and their legal/procurement teams. If your target market is US SaaS customers or you're selling to US financial institutions, SOC 2 Type II is typically non-negotiable. ISO 27001 is more globally recognised and is frequently required for European customers, government contracts, and enterprise procurement across Asia.",
      },
      {
        heading: "How Long Does Each Take?",
        body: "ISO 27001 certification typically takes 6–12 months from kickoff to receiving your certificate. SOC 2 Type I can be achieved in 3–4 months, but Type II requires a 6–12 month observation period on top of implementation — so realistically, SOC 2 Type II takes 9–15 months end-to-end. If speed matters, SOC 2 Type I can be achieved faster.",
      },
      {
        heading: "Cost Comparison",
        body: "ISO 27001 certification costs include a certification body audit (typically ₹3–8 lakh for a small company) plus implementation effort. SOC 2 audits by a US-licensed CPA firm typically cost $15,000–$50,000 for Type II. Both have ongoing annual costs for surveillance audits and re-certification.",
      },
      {
        heading: "The Overlap Advantage",
        body: "Here's where it gets interesting: ISO 27001 and SOC 2 share approximately 70% of their underlying control requirements. If you build your control framework for ISO 27001 first, achieving SOC 2 adds roughly 30% more work — not 100%. This makes a sequential or parallel approach extremely efficient.",
      },
      {
        heading: "Our Recommendation",
        body: "If your primary market is India or Europe: start with ISO 27001. If you're selling into US enterprise accounts: start with SOC 2 Type II. If you're targeting both: implement simultaneously with Cryptus Compliance's cross-framework mapping to avoid duplicating evidence work.",
      },
    ],
    keyTakeaways: [
      "SOC 2 is US-market focused; ISO 27001 is globally recognised",
      "SOC 2 Type II takes 9–15 months; ISO 27001 takes 6–12 months",
      "70% control overlap means doing both together is far more efficient",
      "Cryptus maps a single piece of evidence to both frameworks automatically",
    ],
  },
  {
    id: 3,
    category: "DPDPA",
    categoryColor: "#059669",
    title: "India's DPDPA 2023: What Tech Companies Must Do Before Q1 2027",
    excerpt:
      "The Digital Personal Data Protection Act is now enforceable. Here are the 7 most critical obligations SaaS and fintech companies are missing.",
    readTime: "10 min read",
    date: "June 28, 2026",
    author: "Priya Nair",
    authorRole: "Data Privacy Expert",
    icon: FaGlobe,
    content: [
      {
        heading: "What Is DPDPA and Who Does It Apply To?",
        body: "The Digital Personal Data Protection Act 2023 governs how organisations collect, store, process, and share the personal data of Indian residents. It applies to any entity — Indian or foreign — that handles digital personal data of people in India. Non-compliance can result in penalties of up to ₹250 crore per breach instance.",
      },
      {
        heading: "Obligation 1: Lawful Basis for Every Processing Activity",
        body: "You cannot process personal data without a lawful basis. For most companies, this means obtaining free, informed, specific, and unambiguous consent before collecting any data. Your consent notice must clearly state what data you collect, why, and who you share it with — in language the user understands.",
      },
      {
        heading: "Obligation 2: Data Principal Rights",
        body: "Every Indian user now has the right to access their data, correct inaccurate data, erase data, and withdraw consent. You must have operational workflows to fulfil these requests within 72 hours. Many companies have privacy policies that mention these rights but no actual mechanism to fulfil them.",
      },
      {
        heading: "Obligation 3: Data Localisation for Sensitive Categories",
        body: "Certain categories of sensitive data (financial data, health data, biometric data) face stricter cross-border transfer restrictions. If you transfer Indian user data to servers outside India, you need to verify whether your data categories require localisation or additional safeguards under DPDPA's notified cross-border transfer rules.",
      },
      {
        heading: "Obligation 4: Breach Notification",
        body: "In the event of a personal data breach, you must notify the Data Protection Board of India within 72 hours. Affected data principals must also be notified without undue delay. Most companies currently have no formal breach notification runbook tied specifically to DPDPA's timeline requirements.",
      },
      {
        heading: "Obligation 5: Data Retention Limits",
        body: "You may only retain personal data for as long as it's needed for the purpose it was collected. Once that purpose is fulfilled, data must be erased or anonymised. This requires a documented data retention policy with automated deletion triggers — something most SaaS companies have never implemented.",
      },
    ],
    keyTakeaways: [
      "DPDPA applies to all companies handling Indian resident data — regardless of HQ location",
      "Penalties reach ₹250 crore per breach instance",
      "Consent must be freely given, informed, and specific — blanket privacy policy acceptance is not sufficient",
      "72-hour breach notification is mandatory to the Data Protection Board",
    ],
  },
  {
    id: 4,
    category: "Automation",
    categoryColor: "#D97706",
    title: "Why Manual Evidence Collection is Costing You 200+ Hours Per Audit",
    excerpt:
      "Most compliance teams spend 60% of audit prep time gathering evidence that should already be in one place. Here's how to fix it permanently.",
    readTime: "5 min read",
    date: "June 20, 2026",
    author: "Kiran Joshi",
    authorRole: "Product Manager",
    icon: FaFileAlt,
    content: [
      {
        heading: "The Real Cost of Manual Evidence Collection",
        body: "In a typical SOC 2 Type II audit, a 10-person security team will spend an average of 220 hours over the 6-week audit preparation period gathering evidence. At a blended engineering + compliance rate of ₹3,000/hour, that's ₹6.6 lakh spent just on evidence collection — before the auditor has even started fieldwork.",
      },
      {
        heading: "Where the Time Actually Goes",
        body: "The biggest time sinks are: (1) chasing 15+ different SaaS tools to export access logs and configuration screenshots, (2) manually cross-referencing which control each piece of evidence satisfies, (3) reformatting evidence from tool-native formats into auditor-readable formats, and (4) repeating this process every time an auditor asks a follow-up question.",
      },
      {
        heading: "The Fix: Continuous, Automated Evidence Pipelines",
        body: "Instead of collecting evidence at audit time, Cryptus Compliance connects to your cloud providers, HR tools, and SaaS apps and pulls evidence continuously. Access reviews, configuration snapshots, vulnerability scan results, and change management records flow in automatically and are mapped to the relevant controls in real time.",
      },
      {
        heading: "What 'Always Audit-Ready' Actually Looks Like",
        body: "When you're always audit-ready, the auditor fieldwork phase shrinks from 6 weeks to under 2 weeks. Evidence is already timestamped, organised by control, and accessible through a shared auditor portal. The back-and-forth of 'can you send me X' is replaced by 'here's your read-only access to the evidence repository'.",
      },
      {
        heading: "ROI of Compliance Automation",
        body: "Teams using Cryptus Compliance report a 70–80% reduction in audit prep time. For a company running two frameworks annually, that's a saving of 300+ engineering hours — enough to fund the platform cost many times over, before accounting for the risk reduction value of always-on compliance monitoring.",
      },
    ],
    keyTakeaways: [
      "Manual evidence collection averages 200+ hours per audit cycle",
      "Continuous pipelines mean evidence is always current when the auditor asks",
      "Automated cross-framework mapping eliminates duplicate evidence work",
      "Teams using automation report 70–80% reduction in audit prep time",
    ],
  },
];

/* ─── GUIDES & DOWNLOADS — FULL CONTENT DATA ──────────────────── */
const guidesData = [
  {
    id: 1,
    type: "PDF Guide",
    typeIcon: FaFileAlt,
    color: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
    accentColor: "#155DFC",
    title: "ISO 27001 Complete Implementation Guide 2026",
    description:
      "Step-by-step implementation guide covering all 93 controls, gap analysis templates, and audit preparation checklists.",
    pages: "48 pages",
    downloads: "3,200+ downloads",
    framework: "ISO 27001",
    content: {
      intro:
        "This guide walks you through every phase of ISO 27001:2022 implementation — from scoping your ISMS to receiving your certificate. Whether you're starting from zero or improving an existing security programme, this roadmap gives your team a clear, auditor-tested path to certification.",
      sections: [
        {
          heading: "Phase 1 — Scope & Leadership Commitment",
          body: "Define the boundaries of your Information Security Management System (ISMS). Which departments, systems, locations, and third parties fall inside scope? A tightly scoped ISMS is easier to certify and cheaper to maintain. Secure written commitment from top management — ISO 27001 requires visible leadership involvement, not just IT buy-in.",
          checklist: [
            "Document ISMS scope statement",
            "Obtain signed management commitment letter",
            "Assign an ISMS lead with clear authority",
            "Set information security objectives aligned to business goals",
          ],
        },
        {
          heading: "Phase 2 — Gap Assessment Against Annex A",
          body: "Conduct a structured gap analysis to determine which of the 93 Annex A controls (across 4 themes) you have implemented, partially implemented, or not started. This baseline assessment tells you exactly how much work lies ahead and where your biggest risks are concentrated.",
          checklist: [
            "Download the Annex A control list (ISO 27001:2022)",
            "Score each control: Implemented / Partial / Not Implemented",
            "Identify top 10 highest-risk gaps",
            "Produce a remediation backlog with owners and deadlines",
          ],
        },
        {
          heading: "Phase 3 — Risk Assessment & Treatment",
          body: "Identify information assets, the threats facing them, and the vulnerabilities those threats could exploit. Score likelihood and impact to produce a risk register. For every risk above your acceptable threshold, document the treatment option: mitigate (implement a control), transfer (insurance/vendor), avoid, or accept (with formal management sign-off).",
          checklist: [
            "Complete asset inventory with owners",
            "Populate risk register with threat/vulnerability pairs",
            "Score and prioritise risks using likelihood × impact",
            "Produce Statement of Applicability (SoA) with control justifications",
          ],
        },
        {
          heading: "Phase 4 — Control Implementation",
          body: "Implement the controls identified in your risk treatment plan. This includes writing or updating policies (acceptable use, access control, incident response, supplier security), deploying technical controls (MFA, encryption, DLP, vulnerability scanning), and running role-specific security awareness training for all staff.",
          checklist: [
            "Draft and approve all mandatory ISO 27001 policies",
            "Enable MFA across all critical systems",
            "Deploy vulnerability scanning on a regular schedule",
            "Run and document security awareness training",
          ],
        },
        {
          heading: "Phase 5 — Internal Audit & Management Review",
          body: "Run a full internal audit covering all ISMS processes and controls before inviting the certification body. Internal audits should be conducted by someone independent of the area being audited. Document all findings, raise non-conformities, and track corrective actions to closure. Follow with a management review meeting to formally assess ISMS performance.",
          checklist: [
            "Schedule and conduct internal audit across all ISMS clauses",
            "Document all non-conformities and corrective actions",
            "Hold formal management review meeting",
            "Confirm all Stage 1 pre-requisites are met",
          ],
        },
        {
          heading: "Phase 6 — Certification Audit (Stage 1 & Stage 2)",
          body: "Stage 1 is a documentation review — the auditor checks that your ISMS documentation is complete and fit for purpose. Stage 2 is the on-site (or remote) assessment where auditors test whether your controls actually work in practice by interviewing staff, sampling evidence, and reviewing system configurations. Pass Stage 2 and you receive your certificate, valid for 3 years with annual surveillance audits.",
          checklist: [
            "Submit ISMS documentation package to certification body",
            "Clear all Stage 1 findings before Stage 2",
            "Prepare staff for auditor interviews",
            "Receive and respond to Stage 2 audit findings within agreed timelines",
          ],
        },
      ],
      keyTakeaways: [
        "ISO 27001:2022 has 93 controls across 4 themes (down from 114 in the 2013 version)",
        "Your Statement of Applicability is the single most scrutinised document",
        "Certification is valid for 3 years with annual surveillance audits",
        "Most organisations complete the journey in 6–12 months",
      ],
    },
  },
  {
    id: 2,
    type: "Checklist",
    typeIcon: FaClipboardList,
    color: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    textColor: "text-violet-700",
    accentColor: "#7C3AED",
    title: "SOC 2 Type II Evidence Checklist",
    description:
      "A printable, 64-point evidence checklist covering all Trust Services Criteria. Updated for 2026 audit cycles.",
    pages: "12 pages",
    downloads: "5,800+ downloads",
    framework: "SOC 2",
    content: {
      intro:
        "SOC 2 Type II audits test whether your controls operated effectively over an observation period — typically 6 to 12 months. This checklist covers every evidence category auditors expect for each Trust Services Criteria, so you know exactly what to collect, in what format, and how frequently.",
      sections: [
        {
          heading: "CC1–CC9: Common Criteria (Security) — Mandatory",
          body: "The Security criteria are mandatory for every SOC 2 report. They cover the control environment, communication, risk assessment, monitoring activities, logical access controls, system operations, and change management.",
          checklist: [
            "Access provisioning and de-provisioning logs (all audit period)",
            "Quarterly access reviews with manager sign-offs",
            "Onboarding/offboarding checklists showing system access removal",
            "Change management tickets (code deploys, infrastructure changes)",
            "Vulnerability scan reports — monthly minimum",
            "Penetration test report — annual minimum",
            "Incident response log and postmortems",
            "Security awareness training completion records",
            "MFA enforcement configuration exports",
            "Background check records for all new hires",
          ],
        },
        {
          heading: "A1: Availability Criteria",
          body: "If you've committed to uptime or availability SLAs in your service commitments, Availability criteria apply. Auditors will verify you actively monitor against those commitments.",
          checklist: [
            "Uptime monitoring dashboard exports (full audit period)",
            "Incident postmortems for any availability events",
            "Disaster recovery test results with RTO/RPO verification",
            "Capacity planning review documentation",
            "SLA performance reports",
          ],
        },
        {
          heading: "PI1: Processing Integrity Criteria",
          body: "Applies if your system processes transactions or data on behalf of customers and you've committed to processing accuracy, completeness, and timeliness.",
          checklist: [
            "Data validation rule documentation",
            "Error handling and exception logs",
            "QA sign-off records for releases",
            "Processing accuracy monitoring dashboards",
          ],
        },
        {
          heading: "C1: Confidentiality Criteria",
          body: "Applies if you process confidential information under contractual or regulatory obligation.",
          checklist: [
            "Data classification policy and procedure",
            "Encryption-at-rest configuration exports (all data stores)",
            "Encryption-in-transit configuration (TLS certificates, expiry dates)",
            "Signed NDAs/confidentiality agreements — employees and vendors",
            "Data retention and secure disposal records",
          ],
        },
        {
          heading: "P1–P8: Privacy Criteria",
          body: "Applies if you collect, use, retain, or disclose personal information. Often required for healthcare, fintech, and HR platforms.",
          checklist: [
            "Privacy notice published and version-controlled",
            "Consent collection records",
            "Data subject request log (access, deletion, correction requests)",
            "Data retention schedule with deletion evidence",
            "Third-party data processing agreements (DPAs)",
            "Privacy impact assessments for new features",
          ],
        },
      ],
      keyTakeaways: [
        "Only Security criteria are mandatory — all others depend on your service commitments",
        "Collect evidence continuously throughout the audit period, not at the end",
        "Every piece of evidence needs a timestamp and an owner",
        "Centralise evidence in one place your auditor can access directly",
      ],
    },
  },
  {
    id: 3,
    type: "Template",
    typeIcon: FaFileAlt,
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-700",
    accentColor: "#059669",
    title: "GDPR Data Mapping & Privacy Policy Templates",
    description:
      "Ready-to-use ROPA templates, data subject request workflows, and DPA agreement boilerplates for EU compliance.",
    pages: "22 pages",
    downloads: "2,100+ downloads",
    framework: "GDPR",
    content: {
      intro:
        "GDPR compliance starts with understanding exactly what personal data you hold, where it came from, where it goes, and why you're processing it. This template pack gives you the foundational documents your Data Protection Officer and legal team need to demonstrate GDPR compliance.",
      sections: [
        {
          heading: "Template 1: Record of Processing Activities (ROPA)",
          body: "Article 30 of GDPR requires controllers and processors with 250+ employees (or those processing high-risk data) to maintain a Record of Processing Activities. Even if you're below the threshold, having a ROPA is considered best practice and is expected by most EU enterprise buyers during due diligence.",
          checklist: [
            "Processing activity name and purpose",
            "Data categories being processed",
            "Data subjects affected (customers, employees, prospects)",
            "Lawful basis for processing (consent, contract, legitimate interest etc.)",
            "Retention period and deletion trigger",
            "Third countries data is transferred to, and transfer mechanism",
            "Technical and organisational security measures",
          ],
        },
        {
          heading: "Template 2: Data Subject Request (DSR) Workflow",
          body: "GDPR grants individuals the right to access, rectify, erase, restrict, and port their personal data. You must respond to valid requests within 30 days. This workflow template covers intake, identity verification, fulfilment, and logging steps for each request type.",
          checklist: [
            "DSR intake form (web form or email template)",
            "Identity verification procedure (prevent fraudulent requests)",
            "Request logging register with received date and deadline",
            "Internal escalation path for complex requests",
            "Response letter templates for each request type",
            "Evidence of timely response for audit/supervisory authority review",
          ],
        },
        {
          heading: "Template 3: Data Processing Agreement (DPA)",
          body: "When you share personal data with a third-party processor (e.g., a cloud hosting provider, payroll SaaS, or analytics tool), GDPR Article 28 requires a signed Data Processing Agreement. This template covers all mandatory DPA clauses.",
          checklist: [
            "Subject matter, duration, and nature of processing",
            "Processor obligations and rights",
            "Sub-processor engagement clause and approval mechanism",
            "Audit rights for the controller",
            "Data return and deletion obligations at contract end",
            "Breach notification obligations (72-hour requirement)",
          ],
        },
        {
          heading: "Template 4: Consent Records",
          body: "If you rely on consent as your lawful basis, you must be able to demonstrate that consent was freely given, specific, informed, and unambiguous. Blanket pre-ticked boxes don't qualify. This template gives you the consent capture and storage format required to demonstrate compliance.",
          checklist: [
            "Consent timestamp and version of notice shown",
            "Specific purpose consented to",
            "Withdrawal mechanism (as easy as giving consent)",
            "Consent refresh triggers (material change to purpose)",
            "Separate consent records per processing purpose",
          ],
        },
      ],
      keyTakeaways: [
        "ROPA is required by Article 30 for organisations processing high-risk or large-scale data",
        "DSRs must be responded to within 30 days, with one possible 60-day extension",
        "Every third-party processor must have a signed DPA in place",
        "Consent must be granular, specific, and as easy to withdraw as to give",
      ],
    },
  },
  {
    id: 4,
    type: "PDF Guide",
    typeIcon: FaFileAlt,
    color: "from-orange-500 to-amber-600",
    bgLight: "bg-orange-50",
    textColor: "text-orange-700",
    accentColor: "#D97706",
    title: "DPDPA Compliance Readiness Report Template",
    description:
      "Pre-built readiness assessment template aligned to India's Digital Personal Data Protection Act 2023 obligations.",
    pages: "18 pages",
    downloads: "1,400+ downloads",
    framework: "DPDPA",
    content: {
      intro:
        "India's Digital Personal Data Protection Act 2023 (DPDPA) is now enforceable, with penalties reaching ₹250 crore per breach instance. This readiness assessment template lets you evaluate your organisation's current compliance posture against all major DPDPA obligations and generate a gap report you can present to your board.",
      sections: [
        {
          heading: "Section 1: Data Inventory Assessment",
          body: "Before you can comply with DPDPA, you need to know what personal data you hold. This section of the assessment asks you to catalogue every system, database, and data flow that involves Indian residents' personal data.",
          checklist: [
            "List all systems storing Indian user personal data",
            "Classify data by sensitivity (general vs. sensitive personal data)",
            "Map data flows (collection → storage → processing → deletion)",
            "Identify all third parties receiving Indian personal data",
            "Document data retention periods per category",
          ],
        },
        {
          heading: "Section 2: Consent Mechanism Review",
          body: "DPDPA requires a 'notice and consent' model. Before collecting personal data, you must provide a clear notice in simple language and obtain explicit, granular consent. Assess your current consent flows against this requirement.",
          checklist: [
            "Review all data collection touchpoints (sign-up, checkout, forms)",
            "Verify consent notice meets DPDPA language requirements",
            "Confirm consent is recorded and time-stamped",
            "Check that consent withdrawal mechanism is equally accessible",
            "Review consent for minors (parental verification required)",
          ],
        },
        {
          heading: "Section 3: Data Principal Rights Readiness",
          body: "Data principals (users) in India now have statutory rights to access, correct, and erase their personal data, and to grieve against violations. Assess your operational readiness to fulfil these rights within required timelines.",
          checklist: [
            "Is there a functional mechanism for access requests?",
            "Can users correct inaccurate data themselves or via support?",
            "Is there a defined process for erasure requests?",
            "Is there a grievance redressal officer appointed?",
            "Is the grievance mechanism publicly disclosed?",
          ],
        },
        {
          heading: "Section 4: Cross-Border Transfer Assessment",
          body: "DPDPA restricts transfer of certain categories of personal data to jurisdictions not approved by the Indian government. Assess which of your data transfers require compliance attention.",
          checklist: [
            "List all countries where Indian user data is transferred/stored",
            "Identify whether transferred data falls in restricted categories",
            "Verify whether destination countries are on the approved list",
            "Implement additional safeguards for non-approved destinations",
            "Document transfer basis in your ROPA equivalent",
          ],
        },
        {
          heading: "Section 5: Breach Response Readiness",
          body: "DPDPA mandates notification to the Data Protection Board of India within 72 hours of a personal data breach. Affected data principals must also be notified. Assess whether your incident response plan covers DPDPA-specific notification requirements.",
          checklist: [
            "Does your IR plan include a DPDPA breach trigger?",
            "Is the 72-hour notification timeline documented?",
            "Is there a designated breach notification owner?",
            "Have notification templates (to Board and to users) been drafted?",
            "Have you tested this process with a tabletop exercise?",
          ],
        },
      ],
      keyTakeaways: [
        "DPDPA applies to all companies handling Indian resident data — domestic or foreign",
        "Penalties for non-compliance can reach ₹250 crore per breach",
        "Consent must be obtained in simple, clear language before data collection",
        "72-hour breach notification to the Data Protection Board is mandatory",
      ],
    },
  },
];

/* ─── COMPLIANCE ROADMAPS DATA ────────────────────────────────── */
const roadmapsData = [
  {
    id: 1,
    framework: "ISO 27001",
    color: "#155DFC",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    duration: "6–12 months",
    difficulty: "Medium",
    steps: [
      "Define ISMS Scope & Get Leadership Buy-In",
      "Run Gap Assessment Against Annex A",
      "Build Risk Register & Statement of Applicability",
      "Implement Controls & Train Team",
      "Internal Audit & Remediation",
      "Stage 1 & Stage 2 Certification Audit",
    ],
  },
  {
    id: 2,
    framework: "SOC 2",
    color: "#7C3AED",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    duration: "3–9 months",
    difficulty: "Medium",
    steps: [
      "Select Trust Services Criteria",
      "Scope System & Services",
      "Implement & Document Controls",
      "Begin Observation Period (6–12 months for Type II)",
      "Continuous Evidence Collection",
      "Auditor Fieldwork & Report Issuance",
    ],
  },
  {
    id: 3,
    framework: "DPDPA",
    color: "#059669",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    duration: "2–4 months",
    difficulty: "Low",
    steps: [
      "Data Inventory & Classification",
      "Identify Lawful Bases for Processing",
      "Draft Consent Notices & Privacy Policy",
      "Implement Data Subject Rights Workflows",
      "Appoint Data Protection Officer (if required)",
      "Deploy & Monitor Compliance Controls",
    ],
  },
];

/* ─── FAQ DATA ─────────────────────────────────────────────────── */
const faqData = [
  {
    id: 1,
    question: "How long does ISO 27001 certification typically take?",
    answer:
      "Most organisations complete the full ISO 27001 certification process in 6 to 12 months, depending on their starting point and internal resources. Companies with an existing security programme can often move faster. Cryptus Compliance reduces this timeline significantly by automating evidence collection and control tracking.",
  },
  {
    id: 2,
    question: "What's the difference between SOC 2 Type I and Type II?",
    answer:
      "SOC 2 Type I is a point-in-time report — it confirms your controls are designed correctly as of a specific date. SOC 2 Type II tests whether those controls actually operated effectively over an observation period, typically 6 to 12 months. Enterprise customers almost always require Type II before signing large contracts.",
  },
  {
    id: 3,
    question: "Can I pursue multiple compliance frameworks at the same time?",
    answer:
      "Yes, and there are significant efficiency gains in doing so. ISO 27001 and SOC 2 share approximately 70% of their underlying control requirements, so implementing them together can cut overall effort by 30–40%. Cryptus Compliance's cross-framework mapping engine maps a single piece of evidence to multiple frameworks automatically.",
  },
  {
    id: 4,
    question: "Does DPDPA apply to my company if we're not based in India?",
    answer:
      "The Digital Personal Data Protection Act 2023 applies to any organisation that processes the personal data of Indian residents, regardless of where the organisation is headquartered — similar to how GDPR works for EU residents. If you process data from Indian users, you need to comply.",
  },
  {
    id: 5,
    question: "How does Cryptus Compliance automate evidence collection?",
    answer:
      "Cryptus integrates directly with your cloud infrastructure (AWS, GCP, Azure), HR tools, ticketing systems, and SaaS apps. Evidence is pulled automatically and mapped to the relevant controls in your chosen framework — so when audit time comes, everything is already organised, timestamped, and reviewer-ready.",
  },
  {
    id: 6,
    question: "Is my data safe when using Cryptus Compliance?",
    answer:
      "Cryptus Compliance is itself ISO 27001 certified and SOC 2 Type II attested. Your data is encrypted in transit and at rest, access is role-based, and we conduct regular penetration tests. We never share your compliance data with third parties.",
  },
];

/* ─── DOWNLOAD HELPER ──────────────────────────────────────────── */
function buildDownloadText(guide) {
  const c = guide.content;
  let text = `${guide.title}\n${"=".repeat(guide.title.length)}\n`;
  text += `Framework: ${guide.framework} | Type: ${guide.type} | ${guide.pages}\n\n`;
  text += `INTRODUCTION\n${"-".repeat(60)}\n${c.intro}\n\n`;
  c.sections.forEach((sec, i) => {
    text += `${i + 1}. ${sec.heading}\n${"-".repeat(60)}\n${sec.body}\n\n`;
    if (sec.checklist && sec.checklist.length > 0) {
      text += `Checklist:\n`;
      sec.checklist.forEach((item) => { text += `  ☐ ${item}\n`; });
      text += "\n";
    }
  });
  text += `KEY TAKEAWAYS\n${"-".repeat(60)}\n`;
  c.keyTakeaways.forEach((t) => { text += `• ${t}\n`; });
  text += `\n---\nProvided by Cryptus Compliance | cryptuscyber.com\n`;
  return text;
}

function downloadGuide(guide) {
  const text = buildDownloadText(guide);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${guide.framework.replace(/\s+/g, "-")}-${guide.type.replace(/\s+/g, "-")}-Cryptus.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── GUIDE READER MODAL ───────────────────────────────────────── */
function GuideModal({ guide, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!guide) return null;
  const c = guide.content;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.97)",
          borderRadius: "28px 28px 28px 28px",
          boxShadow: "0 32px 80px -10px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="shrink-0 px-7 py-5 flex items-start justify-between gap-4"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${guide.color} flex items-center justify-center`}
            >
              <FaFileAlt className="text-white text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${guide.bgLight} ${guide.textColor}`}
                >
                  {guide.type}
                </span>
                <span className="text-[11px] text-slate-400">{guide.framework}</span>
                <span className="text-[11px] text-slate-400">· {guide.pages}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 leading-snug">{guide.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => downloadGuide(guide)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-full transition-all"
              style={{ background: guide.accentColor }}
            >
              <FaDownload className="text-[10px]" /> Download
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <FaTimes className="text-slate-500 text-xs" />
            </button>
          </div>
        </div>

        {/* Modal Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-8">
          {/* Intro */}
          <div className="p-5 rounded-2xl" style={{ background: guide.accentColor + "0D", border: `1px solid ${guide.accentColor}25` }}>
            <p className="text-sm text-slate-700 leading-relaxed">{c.intro}</p>
          </div>

          {/* Sections */}
          {c.sections.map((sec, i) => (
            <div key={i}>
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0"
                  style={{ background: guide.accentColor }}
                >
                  {i + 1}
                </span>
                {sec.heading}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 ml-8">{sec.body}</p>

              {sec.checklist && sec.checklist.length > 0 && (
                <div className="ml-8 space-y-2">
                  {sec.checklist.map((item, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <FaCheckSquare
                        className="shrink-0 mt-0.5 text-sm"
                        style={{ color: guide.accentColor }}
                      />
                      <span className="text-xs text-slate-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {i < c.sections.length - 1 && (
                <div className="mt-6 border-t border-slate-100" />
              )}
            </div>
          ))}

          {/* Key Takeaways */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">📌 Key Takeaways</h3>
            <div className="space-y-2">
              {c.keyTakeaways.map((t, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: guide.accentColor + "08", border: `1px solid ${guide.accentColor}18` }}
                >
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                    style={{ background: guide.accentColor }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="shrink-0 px-7 py-4 flex items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
        >
          <p className="text-[11px] text-slate-400">Provided by Cryptus Compliance</p>
          <button
            onClick={() => downloadGuide(guide)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white px-5 py-2.5 rounded-full transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${guide.accentColor}, ${guide.accentColor}CC)`,
              boxShadow: `0 4px 12px -2px ${guide.accentColor}50`,
            }}
          >
            <FaDownload className="text-[10px]" /> Download Full Guide (.txt)
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ARTICLE READER MODAL ─────────────────────────────────────── */
function ArticleModal({ article, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.97)",
          borderRadius: "28px 28px 28px 28px",
          boxShadow: "0 32px 80px -10px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="shrink-0 px-7 py-5 flex items-start justify-between gap-4"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                style={{
                  background: article.categoryColor + "15",
                  color: article.categoryColor,
                  border: `1px solid ${article.categoryColor}25`,
                }}
              >
                {article.category}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <FaClock className="text-[9px]" /> {article.readTime}
              </span>
              <span className="text-[11px] text-slate-400">{article.date}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">{article.title}</h2>
            <p className="text-[12px] text-slate-500 mt-1">
              By <span className="font-semibold text-slate-700">{article.author}</span> — {article.authorRole}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <FaTimes className="text-slate-500 text-xs" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">
          {/* Excerpt */}
          <div
            className="p-4 rounded-2xl text-sm text-slate-600 leading-relaxed italic"
            style={{ background: article.categoryColor + "08", borderLeft: `3px solid ${article.categoryColor}` }}
          >
            {article.excerpt}
          </div>

          {/* Sections */}
          {article.content.map((sec, i) => (
            <div key={i}>
              <h3 className="text-sm font-bold text-slate-900 mb-2">{sec.heading}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{sec.body}</p>
              {i < article.content.length - 1 && (
                <div className="mt-6 border-t border-slate-100" />
              )}
            </div>
          ))}

          {/* Takeaways */}
          {article.keyTakeaways && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">📌 Key Takeaways</h3>
              <div className="space-y-2">
                {article.keyTakeaways.map((t, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold mt-0.5"
                      style={{ background: article.categoryColor }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="shrink-0 px-7 py-4 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
        >
          <p className="text-[11px] text-slate-400">Cryptus Compliance · Expert Articles</p>
          <Link
            to="/book-demo"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-full"
            style={{ background: article.categoryColor }}
          >
            Book a Free Demo <FaArrowRight className="text-[9px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [openRoadmap, setOpenRoadmap] = useState(null);
  const [activeGuide, setActiveGuide] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);

  const toggleFaq = (id) => setOpenFaq(openFaq === id ? null : id);
  const toggleRoadmap = (id) => setOpenRoadmap(openRoadmap === id ? null : id);

  return (
    <div className="min-h-screen">

      {/* Modals */}
      {activeGuide && (
        <GuideModal guide={activeGuide} onClose={() => setActiveGuide(null)} />
      )}
      {activeArticle && (
        <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
      )}

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative py-16 px-6 overflow-hidden text-center">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-violet-400/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 mb-6">
            ✦ Resources &amp; Learning Hub
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Everything You Need to{" "}
            <span className="gradient-text">Master Compliance</span>
          </h1>
          <p className="mt-6 text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">
            Guides, checklists, roadmaps and expert articles to help your team go from zero to certified — faster.
          </p>
          <div className="mt-10 max-w-lg mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles, guides, frameworks…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-4 rounded-full bg-white/80 border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 shadow-sm transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Resources ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Featured Resources</h2>
        <p className="text-sm text-slate-500 mb-7">Hand-picked guides and checklists from our compliance team.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {resourcesData.map(({ slug, tag, type, title, summary, readTime }) => {
            const Icon = typeIcon[type] || FaBookOpen;
            return (
              <Link
                key={slug}
                to={`/resources/${slug}`}
                className="relative overflow-hidden rounded-3xl p-8 flex flex-col gap-4 card-hover cursor-pointer"
              >
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#155DFC,#1e40af)" }} />
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
                <div className="relative z-10 flex flex-col h-full">
                  <span className="inline-flex items-center gap-1.5 w-fit text-xs font-bold text-white/70 bg-white/20 px-3 py-1 rounded-full mb-3">
                    <Icon className="text-[10px]" /> {tag}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-snug">{title}</h3>
                  <p className="mt-3 text-white/75 text-xs leading-relaxed">{summary}</p>
                  <div className="mt-auto pt-5 flex items-center justify-between">
                    <span className="text-xs text-white/60">{readTime}</span>
                    <span className="text-white/80 text-xs flex items-center gap-1 font-medium">
                      Read more <FaArrowRight className="text-[10px]" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Blog / Articles ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 mb-3">
              <FaNewspaper /> Blog &amp; Articles
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Latest from Our Experts</h2>
            <p className="mt-1 text-sm text-slate-500 max-w-xl">
              Deep-dive articles written by certified compliance professionals. Click any card to read in full.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {blogArticles
            .filter(
              (a) =>
                query === "" ||
                a.title.toLowerCase().includes(query.toLowerCase()) ||
                a.category.toLowerCase().includes(query.toLowerCase())
            )
            .map((article) => {
              const Icon = article.icon;
              return (
                <div
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
                  className="clay-card group rounded-3xl p-6 flex flex-col gap-4 card-hover cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{
                        background: article.categoryColor + "15",
                        color: article.categoryColor,
                        border: `1px solid ${article.categoryColor}25`,
                      }}
                    >
                      <FaTag className="text-[9px]" /> {article.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                      <FaClock className="text-[9px]" /> {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{article.excerpt}</p>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{article.author}</p>
                      <p className="text-[11px] text-slate-400">{article.authorRole} · {article.date}</p>
                    </div>
                    <span className="text-xs font-medium text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Full <FaArrowRight className="text-[9px]" />
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* ── Guides & Downloads ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 mb-3">
          <FaDownload /> Guides &amp; Downloads
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Compliance Guides &amp; Downloads</h2>
        <p className="text-sm text-slate-500 mb-7 max-w-xl">
          Free guides, checklists, and templates. Click to read — or download instantly.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {guidesData
            .filter(
              (g) =>
                query === "" ||
                g.title.toLowerCase().includes(query.toLowerCase()) ||
                g.framework.toLowerCase().includes(query.toLowerCase())
            )
            .map((guide) => {
              const TypeIcon = guide.typeIcon;
              return (
                <div
                  key={guide.id}
                  className="clay-card group rounded-3xl p-6 flex gap-5 card-hover cursor-pointer"
                  onClick={() => setActiveGuide(guide)}
                >
                  <div
                    className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${guide.color} flex items-center justify-center shadow-md`}
                  >
                    <TypeIcon className="text-white text-lg" />
                  </div>

                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${guide.bgLight} ${guide.textColor}`}>
                        {guide.type}
                      </span>
                      <span className="text-[11px] text-slate-400">{guide.framework}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{guide.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>{guide.pages}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{guide.downloads}</span>
                      </div>
                      <button
                        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        style={{ color: guide.accentColor }}
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadGuide(guide);
                        }}
                      >
                        <FaDownload className="text-[10px]" /> Download Free
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* ── Compliance Roadmaps ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 mb-3">
          <FaMap /> Roadmaps
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Compliance Roadmaps</h2>
        <p className="text-sm text-slate-500 mb-7 max-w-xl">
          Step-by-step certification journeys — click to expand each framework's roadmap.
        </p>

        <div className="space-y-4">
          {roadmapsData.map((rm) => {
            const isOpen = openRoadmap === rm.id;
            return (
              <div
                key={rm.id}
                className={`clay-card rounded-3xl overflow-hidden transition-all duration-300 ${rm.borderColor} border`}
              >
                <button
                  onClick={() => toggleRoadmap(rm.id)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0"
                      style={{ background: rm.color }}
                    >
                      {rm.framework.split(" ")[0].slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{rm.framework} Certification Roadmap</h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] text-slate-500">⏱ {rm.duration}</span>
                        <span className="text-[11px] text-slate-500">Difficulty: {rm.difficulty}</span>
                        <span className="text-[11px] text-slate-500">{rm.steps.length} stages</span>
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-slate-400">
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </button>

                {isOpen && (
                  <div className={`px-6 pb-6 ${rm.bgColor} border-t border-slate-100`}>
                    <div className="pt-5 space-y-3">
                      {rm.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div
                            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold mt-0.5"
                            style={{ background: rm.color }}
                          >
                            {i + 1}
                          </div>
                          <p className="text-sm text-slate-700 font-medium pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link
                        to="/book-demo"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-all"
                        style={{ background: rm.color }}
                      >
                        Get a Personalised Roadmap <FaArrowRight className="text-[9px]" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-600 border border-violet-200 mb-3">
          ❓ FAQs
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Frequently Asked Questions</h2>
        <p className="text-sm text-slate-500 mb-7 max-w-xl">
          Answers to the questions our compliance team gets asked most often.
        </p>

        <div className="space-y-3">
          {faqData.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className={`clay-card rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "ring-2 ring-indigo-200" : ""}`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-800 leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isOpen ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isOpen ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 border-t border-slate-100">
                    <p className="pt-4 text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Newsletter CTA ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div
          className="relative rounded-[32px] overflow-hidden p-12 md:p-16 text-center"
          style={{ background: "linear-gradient(135deg, #155DFC, #4f46e5)" }}
        >
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Get Compliance Tips in Your Inbox</h2>
            <p className="mt-4 text-blue-100 max-w-lg mx-auto text-base leading-relaxed">
              Join 2,000+ compliance professionals. Weekly insights, framework updates and audit tips.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your work email"
                className="flex-1 px-4 py-3 rounded-full bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:border-white/60 transition"
              />
              <button className="bg-white text-indigo-600 font-semibold px-5 py-3 rounded-full hover:bg-indigo-50 transition shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
