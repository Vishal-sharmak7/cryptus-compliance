// Content for the Resources "Featured" cards. Each entry powers both the
// listing card on /resources and the full detail page at /resources/:slug.

const resourcesData = [
  {
    slug: "iso-27001-roadmap",
    tag: "Guide",
    type: "guide",
    title: "ISO 27001 Certification: The Complete 2026 Roadmap",
    summary:
      "Everything your team needs to achieve ISO 27001 certification — from gap analysis to the final audit. Includes free checklist download.",
    readTime: "12 min read",
    intro:
      "ISO 27001 remains the gold standard for information security management, and demand for certification keeps climbing as customers push it into procurement checklists. This roadmap walks you through every stage of the journey — from your first gap assessment to the Stage 2 certification audit — so your team knows exactly what to expect and when.",
    sections: [
      {
        heading: "1. Define Scope and Get Leadership Buy-In",
        body:
          "Before any control work begins, decide which systems, teams, and locations fall inside your ISMS boundary. A narrow, well-justified scope is easier to defend during audit than an overly broad one. Pair this with visible commitment from leadership — auditors specifically look for evidence that information security is a management priority, not just an IT initiative.",
      },
      {
        heading: "2. Run a Gap Assessment Against Annex A",
        body:
          "Map your current controls against the 114 Annex A controls across 14 domains. Most teams find their biggest gaps in supplier risk management, asset inventory, and incident response documentation. Score each control as implemented, partially implemented, or missing, and use this to build your remediation backlog.",
      },
      {
        heading: "3. Build Your Risk Register",
        body:
          "Identify information assets, the threats facing them, and the likelihood and impact of each risk materialising. This risk register becomes the backbone of your Statement of Applicability (SoA) — the document that justifies which Annex A controls you've implemented and which you've formally excluded.",
      },
      {
        heading: "4. Implement Controls and Train Your Team",
        body:
          "Write or update the policies your gap assessment flagged, then implement the technical and procedural controls behind them. Role-specific security training is mandatory — auditors will ask staff direct questions about their responsibilities, so training needs to stick, not just tick a box.",
      },
      {
        heading: "5. Internal Audit, Then Certification",
        body:
          "Run a full internal audit before inviting your certification body in. This is where most non-conformities should surface and get fixed. The certification audit itself happens in two stages: Stage 1 reviews your documentation, and Stage 2 tests whether your controls actually work in practice.",
      },
    ],
    keyTakeaways: [
      "Most organisations complete ISO 27001 certification in 6–12 months",
      "Your Statement of Applicability is the single most scrutinised document in the audit",
      "Internal audits catch the majority of non-conformities before the real audit does",
      "Certification is valid for 3 years, with annual surveillance audits required",
    ],
    relatedFrameworkSlug: "iso-27001",
  },
  {
    slug: "soc2-evidence-checklist",
    tag: "Checklist",
    type: "checklist",
    title: "SOC 2 Type II Evidence Checklist",
    summary:
      "A definitive, printable checklist covering all 64 common criteria across the five Trust Services Criteria. Updated for 2026.",
    readTime: "5 min read",
    intro:
      "A SOC 2 Type II audit tests whether your controls actually operated effectively over an observation period — usually 6 to 12 months. That means evidence collection can't be a last-minute scramble; it needs to be continuous. This checklist breaks down exactly what evidence auditors expect for each Trust Services Criteria category.",
    sections: [
      {
        heading: "Security (Common Criteria) — Mandatory for every audit",
        body:
          "Collect access review logs, onboarding/offboarding records, change management tickets, vulnerability scan reports, and penetration test results. Auditors want to see these artefacts generated consistently throughout the audit window, not produced retroactively.",
      },
      {
        heading: "Availability",
        body:
          "Uptime monitoring dashboards, incident postmortems, disaster recovery test results, and capacity planning reviews. If you commit to an SLA, you need evidence you're actively monitoring against it.",
      },
      {
        heading: "Processing Integrity",
        body:
          "Data validation logs, error-handling records, and QA sign-offs demonstrating that system processing is complete, accurate, and authorised.",
      },
      {
        heading: "Confidentiality & Privacy",
        body:
          "Data classification policies, encryption configuration exports, data retention/deletion logs, and signed confidentiality agreements with employees and vendors handling sensitive data.",
      },
      {
        heading: "Evidence Hygiene Tips",
        body:
          "Timestamp everything, store evidence in a centralised repository your auditor can access directly, and assign an evidence owner per control so nothing falls through the cracks mid-audit period.",
      },
    ],
    keyTakeaways: [
      "SOC 2 Type II evidence must be collected continuously, not gathered retroactively",
      "Security criteria are mandatory; the other four are selected based on your service commitments",
      "Centralising evidence collection is the single biggest time-saver during audit prep",
      "A missing evidence owner is the most common reason controls fail during fieldwork",
    ],
    relatedFrameworkSlug: "soc-2",
  },
  {
    slug: "compliance-automation-2026",
    tag: "Webinar",
    type: "webinar",
    title: "Compliance Automation in 2026 — Live Q&A Recording",
    summary:
      "Watch our experts discuss how AI-powered compliance tools are eliminating manual audit work and cutting prep time by 70%.",
    readTime: "45 min watch",
    intro:
      "In this session, our compliance specialists sat down for a live Q&A on how automation is reshaping audit preparation — from continuous evidence collection to AI-assisted policy drafting. Below is a summary of the key discussion points covered in the recording.",
    sections: [
      {
        heading: "Why manual compliance work doesn't scale",
        body:
          "Panelists opened by breaking down where most compliance teams lose time: chasing evidence across disconnected tools, re-answering the same vendor security questionnaires, and manually mapping one framework's controls to another. These repetitive tasks are exactly what automation is best suited to remove.",
      },
      {
        heading: "Continuous evidence collection vs. point-in-time audits",
        body:
          "The panel discussed the shift from once-a-year audit scrambles to always-on evidence pipelines that pull directly from cloud infrastructure, HR systems, and ticketing tools — reducing prep time dramatically because evidence is already current when the auditor asks for it.",
      },
      {
        heading: "Where AI genuinely helps (and where it doesn't)",
        body:
          "AI is effective at drafting first-pass policies, flagging control gaps, and mapping overlapping requirements across frameworks like ISO 27001 and SOC 2. It's not a substitute for human judgment on risk acceptance decisions or for the auditor relationship itself.",
      },
      {
        heading: "Audience Q&A highlights",
        body:
          "Common questions covered how to handle multi-framework compliance without duplicating evidence work, how small teams can stay audit-ready without a dedicated compliance hire, and how to evaluate whether a compliance automation platform will actually reduce workload versus just adding another tool to check.",
      },
    ],
    keyTakeaways: [
      "Automation's biggest win is eliminating duplicate evidence work across frameworks",
      "Continuous evidence pipelines cut audit prep time significantly compared to annual scrambles",
      "AI accelerates policy drafting and gap analysis but doesn't replace human risk decisions",
      "Cross-framework control mapping is one of the highest-leverage automation use cases",
    ],
    relatedFrameworkSlug: null,
  },
];

export default resourcesData;
