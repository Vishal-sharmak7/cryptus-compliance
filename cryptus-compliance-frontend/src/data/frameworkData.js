import logo1 from "../assets/logos/1.png";
import logo2 from "../assets/logos/2.png";
import logo3 from "../assets/logos/3.png";
import logo4 from "../assets/logos/4.png";
import logo5 from "../assets/logos/5.png";
import logo6 from "../assets/logos/6.png";
import logo7 from "../assets/logos/7.png";
import logo8 from "../assets/logos/8.png";

const frameworkData = [
  {
    id: 1,
    slug: "iso-27001",
    name: "ISO 27001",
    logo: logo1,
    category: "Information Security",
    controls: "114",
    color: "from-blue-500/10 to-blue-600/5",
    accent: "#3b82f6",
    shortDescription:
      "The internationally recognised standard for Information Security Management Systems (ISMS). Adopted by thousands of organisations globally to protect information assets systematically.",
    overview:
      "ISO/IEC 27001 is the world's best-known standard for information security management. Published by the International Organization for Standardization (ISO) and the International Electrotechnical Commission (IEC), it defines requirements for establishing, implementing, maintaining, and continually improving an ISMS. The standard takes a risk-based approach—organisations identify threats to their information assets, assess their likelihood and impact, and apply a proportionate set of controls drawn from Annex A. Certification to ISO 27001 provides independent assurance that an organisation manages information security to a high, internationally accepted level.",
    whyImportant: [
      "Demonstrates robust security posture to clients, partners, and regulators worldwide.",
      "Reduces the risk and cost of data breaches through structured risk management.",
      "Unlocks enterprise sales opportunities where certification is a procurement prerequisite.",
      "Aligns with GDPR and other data protection laws, simplifying compliance overlap.",
      "Provides a scalable, continuously improving security programme rather than a one-time audit.",
    ],
    keyRequirements: [
      {
        title: "Context of the Organisation",
        description:
          "Define internal and external issues, interested parties, and the ISMS scope relevant to your business objectives.",
      },
      {
        title: "Leadership & Commitment",
        description:
          "Top management must establish an information security policy, assign roles, and demonstrate visible commitment to the ISMS.",
      },
      {
        title: "Risk Assessment & Treatment",
        description:
          "Identify information security risks, assess their likelihood and impact, and select controls to treat them to an acceptable level.",
      },
      {
        title: "Annex A Controls",
        description:
          "Apply a subset of 114 controls across 14 domains—from asset management and access control to supplier relationships and incident management.",
      },
      {
        title: "Internal Audit & Management Review",
        description:
          "Conduct periodic internal audits and management reviews to verify effectiveness and drive continual improvement.",
      },
      {
        title: "Statement of Applicability (SoA)",
        description:
          "Document which Annex A controls are applicable, which are implemented, and justification for any exclusions.",
      },
    ],
    benefits: [
      "Globally recognised certification trusted by enterprise buyers",
      "Structured framework for managing all information security risks",
      "Competitive differentiation in tender and RFP processes",
      "Reduced likelihood and impact of cyber incidents",
      "Improved employee security awareness and culture",
      "Streamlined regulatory compliance across multiple frameworks",
    ],
    whoShouldUse: [
      "SaaS and cloud service providers",
      "Managed service providers (MSPs)",
      "Financial services organisations",
      "Government contractors and suppliers",
      "Healthcare IT providers",
      "Any business handling sensitive client data",
    ],
    implementationSteps: [
      {
        step: "01",
        title: "Define Scope & Context",
        description:
          "Identify the boundaries of your ISMS—which systems, locations, and business processes are in scope. Document interested parties and their requirements.",
      },
      {
        step: "02",
        title: "Conduct Gap Assessment",
        description:
          "Compare your current security controls against ISO 27001 requirements and Annex A to identify gaps and prioritise remediation effort.",
      },
      {
        step: "03",
        title: "Perform Risk Assessment",
        description:
          "Identify information assets, threats, and vulnerabilities. Score each risk by likelihood and impact and document in your risk register.",
      },
      {
        step: "04",
        title: "Develop Policies & Controls",
        description:
          "Write or update required security policies and implement the Annex A controls chosen in your risk treatment plan.",
      },
      {
        step: "05",
        title: "Train & Raise Awareness",
        description:
          "Deliver security awareness training to all staff and role-specific training for those with security responsibilities.",
      },
      {
        step: "06",
        title: "Run Internal Audit",
        description:
          "Conduct a full internal audit of the ISMS against ISO 27001 requirements to uncover non-conformities before the certification audit.",
      },
      {
        step: "07",
        title: "Stage 1 & Stage 2 Certification Audit",
        description:
          "An accredited certification body reviews documentation (Stage 1) then tests implementation effectiveness on-site or remotely (Stage 2).",
      },
    ],
    certificationProcess:
      "Certification is granted by an accredited third-party certification body (e.g., BSI, Bureau Veritas, SGS). The process involves a Stage 1 documentary review followed by a Stage 2 on-site effectiveness audit. Upon successful completion, a certificate valid for three years is issued, with annual surveillance audits to maintain it.",
    estimatedTimeline: "6 – 12 months",
    relatedFrameworks: ["soc-2", "gdpr", "cmmc", "nist-csf"],
  },

  {
    id: 2,
    slug: "soc-2",
    name: "SOC 2",
    logo: logo2,
    category: "Trust & Security",
    controls: "64",
    color: "from-indigo-500/10 to-indigo-600/5",
    accent: "#6366f1",
    shortDescription:
      "The AICPA's Trust Services Criteria framework for service organisations. SOC 2 reports provide customers with independent assurance that your systems are secure, available, and confidential.",
    overview:
      "System and Organisation Controls 2 (SOC 2) is an auditing standard developed by the American Institute of Certified Public Accountants (AICPA). It evaluates whether a service organisation's controls over security, availability, processing integrity, confidentiality, and privacy are suitably designed (Type I) and operating effectively over a period of time (Type II). Unlike prescriptive standards, SOC 2 is principles-based—organisations select which Trust Services Criteria apply to their services and design controls accordingly. The resulting audit report is shared with prospects and customers under NDA as evidence of security maturity.",
    whyImportant: [
      "Required by most enterprise and mid-market customers during vendor due diligence.",
      "Demonstrates operational controls go beyond basic security hygiene.",
      "Accelerates sales cycles by replacing long security questionnaires with a single report.",
      "Drives internal process improvement through structured control implementation.",
      "Builds customer trust in your ability to protect their data over time.",
    ],
    keyRequirements: [
      {
        title: "Security (Common Criteria)",
        description:
          "The mandatory criteria covering logical and physical access controls, change management, risk mitigation, and monitoring.",
      },
      {
        title: "Availability",
        description:
          "System uptime, performance monitoring, disaster recovery, and capacity management meet agreed service levels.",
      },
      {
        title: "Processing Integrity",
        description:
          "System processing is complete, valid, accurate, timely, and authorised to meet entity objectives.",
      },
      {
        title: "Confidentiality",
        description:
          "Information designated as confidential is protected as committed or agreed with customers and partners.",
      },
      {
        title: "Privacy",
        description:
          "Personal information is collected, used, retained, disclosed, and disposed of in conformity with the organisation's privacy notice.",
      },
      {
        title: "Evidence Collection",
        description:
          "Continuous, time-stamped evidence of controls in operation throughout the audit period (typically 6 or 12 months).",
      },
    ],
    benefits: [
      "Closes enterprise deals faster with a universally recognised report",
      "Type II report proves controls worked consistently over time",
      "Reduces the burden of answering individual customer security questionnaires",
      "Improves internal security posture and accountability",
      "Enables better vendor risk management practices",
      "Foundation for ISO 27001 or FedRAMP compliance",
    ],
    whoShouldUse: [
      "SaaS companies selling to enterprise customers",
      "Cloud infrastructure and data hosting providers",
      "B2B software platforms handling customer data",
      "Healthcare SaaS platforms (combined with HIPAA)",
      "Fintech platforms and payment processors",
      "Data analytics and AI/ML service providers",
    ],
    implementationSteps: [
      {
        step: "01",
        title: "Select Trust Services Criteria",
        description:
          "Determine which criteria apply—Security is mandatory; Availability, Confidentiality, Processing Integrity, and Privacy are optional add-ons.",
      },
      {
        step: "02",
        title: "Scope Your Systems",
        description:
          "Define which infrastructure, applications, and processes are in scope for the audit based on your service commitments.",
      },
      {
        step: "03",
        title: "Readiness Assessment",
        description:
          "Conduct a gap analysis against the selected criteria to identify missing or immature controls and build a remediation roadmap.",
      },
      {
        step: "04",
        title: "Implement Controls",
        description:
          "Build and document controls covering access management, encryption, logging, vulnerability management, incident response, and more.",
      },
      {
        step: "05",
        title: "Collect Evidence",
        description:
          "Gather continuous, timestamped evidence of controls in operation. The audit period typically spans 6 or 12 months for Type II.",
      },
      {
        step: "06",
        title: "Auditor Field Work",
        description:
          "A licensed CPA firm reviews your controls, samples evidence, interviews staff, and tests control effectiveness.",
      },
      {
        step: "07",
        title: "Receive & Share Report",
        description:
          "Obtain your SOC 2 report and share it under NDA with prospects and customers to accelerate security reviews.",
      },
    ],
    certificationProcess:
      "SOC 2 reports are issued by a licensed CPA firm. A Type I report gives a point-in-time opinion on control design. A Type II report covers a defined period (minimum 6 months) and opines on both design and operating effectiveness. Most enterprise buyers require a Type II report.",
    estimatedTimeline: "3 – 9 months",
    relatedFrameworks: ["iso-27001", "hipaa", "gdpr", "pci-dss"],
  },

  {
    id: 3,
    slug: "gdpr",
    name: "GDPR",
    logo: logo3,
    category: "Data Privacy",
    controls: "99",
    color: "from-violet-500/10 to-violet-600/5",
    accent: "#8b5cf6",
    shortDescription:
      "The European Union's General Data Protection Regulation — the world's toughest privacy and security law. Applies to any organisation that processes personal data of EU residents.",
    overview:
      "The General Data Protection Regulation (GDPR) came into effect on 25 May 2018 and fundamentally changed how organisations collect, process, store, and share personal data about EU residents. It applies regardless of where the organisation is based — if you process the personal data of people in the EU, GDPR applies to you. The regulation is built on seven core principles: lawfulness, fairness and transparency; purpose limitation; data minimisation; accuracy; storage limitation; integrity and confidentiality; and accountability. Non-compliance can result in fines of up to €20 million or 4% of global annual turnover, whichever is higher.",
    whyImportant: [
      "Mandatory for any organisation processing EU residents' personal data, regardless of location.",
      "Fines of up to €20M or 4% of global turnover make non-compliance extremely costly.",
      "Data subject rights (access, erasure, portability) must be honoured within strict time limits.",
      "Breach notification to supervisory authorities required within 72 hours of discovery.",
      "Builds trust with European customers and business partners.",
    ],
    keyRequirements: [
      {
        title: "Lawful Basis for Processing",
        description:
          "Every processing activity must have a documented lawful basis — consent, contract, legal obligation, vital interests, public task, or legitimate interests.",
      },
      {
        title: "Data Subject Rights",
        description:
          "Individuals have rights to access, rectify, erase, restrict processing, port data, and object. Each request must be fulfilled within one month.",
      },
      {
        title: "Privacy by Design & Default",
        description:
          "Data protection must be built into systems and processes from the start, with privacy-friendly defaults applied automatically.",
      },
      {
        title: "Data Protection Impact Assessments (DPIAs)",
        description:
          "Required before processing activities that are likely to result in a high risk to individuals' rights and freedoms.",
      },
      {
        title: "Data Breach Notification",
        description:
          "Personal data breaches must be reported to the relevant supervisory authority within 72 hours and, in serious cases, to affected individuals.",
      },
      {
        title: "Data Processing Agreements (DPAs)",
        description:
          "Contracts with processors must include specific GDPR-mandated clauses covering security obligations, subprocessor rules, and assistance to the controller.",
      },
    ],
    benefits: [
      "Legal certainty and reduced risk of regulatory enforcement action",
      "Enhanced brand reputation with privacy-conscious customers",
      "Cleaner, more accurate data through minimisation and accuracy obligations",
      "Reduced data breach impact through strong security and breach response processes",
      "Competitive advantage in European and global markets",
      "Foundation for CCPA, LGPD, and other international privacy law compliance",
    ],
    whoShouldUse: [
      "Any company with EU/EEA customers, users, or employees",
      "E-commerce and SaaS platforms serving European markets",
      "Marketing and advertising technology companies",
      "Healthcare and life sciences organisations",
      "HR software and people analytics platforms",
      "Any organisation with a website collecting cookies or analytics",
    ],
    implementationSteps: [
      {
        step: "01",
        title: "Data Mapping & Inventory",
        description:
          "Create a record of all personal data processed, where it comes from, how it's used, who it's shared with, and how long it's retained.",
      },
      {
        step: "02",
        title: "Establish Lawful Bases",
        description:
          "Document the lawful basis for each processing activity in your Record of Processing Activities (RoPA).",
      },
      {
        step: "03",
        title: "Update Privacy Notices",
        description:
          "Ensure all privacy notices are transparent, plain-language, and include all GDPR-required information.",
      },
      {
        step: "04",
        title: "Implement Data Subject Rights Processes",
        description:
          "Build workflows to receive, verify, and respond to data subject requests within the mandated one-month deadline.",
      },
      {
        step: "05",
        title: "Review Vendor Contracts",
        description:
          "Ensure all processor agreements include GDPR-compliant DPA clauses and that international transfer mechanisms are in place.",
      },
      {
        step: "06",
        title: "Security & Breach Response",
        description:
          "Implement appropriate technical and organisational security measures and establish a 72-hour breach notification procedure.",
      },
      {
        step: "07",
        title: "Appoint DPO if Required",
        description:
          "Determine whether a Data Protection Officer is mandatory for your organisation and appoint one if so.",
      },
    ],
    certificationProcess:
      "GDPR does not have a traditional certification model. Compliance is demonstrated through documentation, processes, and accountability measures assessed by EU Data Protection Authorities during investigations or audits. ISO 27701 (Privacy Information Management) can serve as a structured compliance framework aligned with GDPR.",
    estimatedTimeline: "3 – 6 months",
    relatedFrameworks: ["iso-27001", "iso-27701", "hipaa", "soc-2"],
  },

  {
    id: 4,
    slug: "pci-dss",
    name: "PCI-DSS",
    logo: logo4,
    category: "Payment Security",
    controls: "300+",
    color: "from-red-500/10 to-red-600/5",
    accent: "#ef4444",
    shortDescription:
      "The Payment Card Industry Data Security Standard — mandatory for all organisations that store, process, or transmit cardholder data. Version 4.0 introduces continuous compliance requirements.",
    overview:
      "PCI DSS is a global security standard administered by the PCI Security Standards Council (PCI SSC), a body founded by American Express, Discover, JCB, Mastercard, and Visa. Any organisation that stores, processes, or transmits cardholder data — or could impact its security — must comply. The standard is organised into 12 high-level requirements covering network security, cardholder data protection, vulnerability management, access control, monitoring, and security policies. Version 4.0, effective from March 2024, introduces a more flexible, outcome-based approach and adds new requirements around e-commerce security, multi-factor authentication, and customised implementations.",
    whyImportant: [
      "Mandatory contractual obligation imposed by card brands for any entity handling card payments.",
      "Non-compliance risks card brand fines, increased transaction fees, or loss of ability to process cards.",
      "Data breaches involving cardholder data carry severe financial and reputational consequences.",
      "PCI DSS v4.0 requires continuous compliance, not just point-in-time assessment.",
      "Strong controls protect customers and reduce fraud across the payment ecosystem.",
    ],
    keyRequirements: [
      {
        title: "Build & Maintain a Secure Network",
        description:
          "Install and maintain network security controls; do not use vendor-supplied defaults for system passwords and other security parameters.",
      },
      {
        title: "Protect Account Data",
        description:
          "Protect stored account data with strong encryption; protect cardholder data with strong cryptography during transmission over open networks.",
      },
      {
        title: "Maintain a Vulnerability Management Program",
        description:
          "Protect all systems against malware; develop and maintain secure systems and software through patching and vulnerability scanning.",
      },
      {
        title: "Implement Strong Access Controls",
        description:
          "Restrict access to system components and cardholder data by business need to know; apply least privilege principles.",
      },
      {
        title: "Regularly Monitor & Test Networks",
        description:
          "Log and monitor all access to network resources and cardholder data; regularly test security systems and processes.",
      },
      {
        title: "Maintain an Information Security Policy",
        description:
          "Support information security with organisational policies and programs that cover all personnel.",
      },
    ],
    benefits: [
      "Maintains the ability to accept major credit and debit card payments",
      "Reduces the probability and impact of payment card data breaches",
      "Builds customer confidence in payment security",
      "Structured framework strengthens overall cyber security posture",
      "Avoidance of significant card brand fines and penalties",
      "Compatibility with ISO 27001 reduces duplicated compliance effort",
    ],
    whoShouldUse: [
      "E-commerce merchants processing online card payments",
      "Brick-and-mortar retailers with point-of-sale systems",
      "Payment service providers and payment gateways",
      "Banks and financial institutions issuing or acquiring cards",
      "SaaS platforms with integrated billing and payment flows",
      "Third-party processors handling cardholder data on behalf of merchants",
    ],
    implementationSteps: [
      {
        step: "01",
        title: "Determine Your Merchant Level",
        description:
          "Your compliance requirements and validation method depend on your annual card transaction volume across Levels 1–4.",
      },
      {
        step: "02",
        title: "Define the Cardholder Data Environment (CDE)",
        description:
          "Map all systems, processes, and people that store, process, or transmit cardholder data to establish the compliance scope.",
      },
      {
        step: "03",
        title: "Scope Reduction",
        description:
          "Use network segmentation, tokenisation, and point-to-point encryption to reduce the number of in-scope systems and simplify compliance.",
      },
      {
        step: "04",
        title: "Gap Assessment",
        description:
          "Compare current controls against all 12 PCI DSS requirements to identify gaps and build a prioritised remediation plan.",
      },
      {
        step: "05",
        title: "Remediation",
        description:
          "Implement missing or deficient controls across network security, encryption, access control, logging, and vulnerability management.",
      },
      {
        step: "06",
        title: "Validation",
        description:
          "Complete a Self-Assessment Questionnaire (SAQ) or engage a Qualified Security Assessor (QSA) for a Report on Compliance (RoC) based on your merchant level.",
      },
      {
        step: "07",
        title: "Submit & Maintain",
        description:
          "Submit your compliance documentation to your acquiring bank and implement continuous monitoring to maintain compliance year-round.",
      },
    ],
    certificationProcess:
      "PCI DSS compliance is validated annually. Level 1 merchants (>6M transactions/year) require a Report on Compliance (RoC) from a QSA. Level 2–4 merchants complete a Self-Assessment Questionnaire (SAQ). All levels must provide an Attestation of Compliance (AoC) and quarterly network vulnerability scans by an Approved Scanning Vendor (ASV).",
    estimatedTimeline: "4 – 12 months",
    relatedFrameworks: ["soc-2", "iso-27001", "nist-csf", "hipaa"],
  },

  {
    id: 5,
    slug: "hipaa",
    name: "HIPAA",
    logo: logo5,
    category: "Healthcare",
    controls: "180+",
    color: "from-green-500/10 to-green-600/5",
    accent: "#22c55e",
    shortDescription:
      "The US Health Insurance Portability and Accountability Act — the cornerstone of healthcare data protection in the United States. Required for all covered entities and their business associates.",
    overview:
      "The Health Insurance Portability and Accountability Act (HIPAA), enacted in 1996, establishes national standards for protecting sensitive patient health information (Protected Health Information, or PHI). It applies to covered entities — healthcare providers, health plans, and healthcare clearinghouses — and their business associates. HIPAA's Privacy Rule governs how PHI may be used and disclosed, the Security Rule establishes administrative, physical, and technical safeguards for electronic PHI (ePHI), and the Breach Notification Rule requires prompt notification when PHI is exposed. The HITECH Act of 2009 strengthened enforcement and extended requirements to business associates.",
    whyImportant: [
      "Legally required for covered entities and business associates handling PHI in the US.",
      "Fines range from $100 to $50,000 per violation, up to $1.9M per violation category per year.",
      "Criminal penalties of up to 10 years imprisonment for wilful neglect or malicious disclosure.",
      "Health data is among the most valuable on the dark web, making healthcare a top breach target.",
      "Patient trust depends on confident, verifiable data protection practices.",
    ],
    keyRequirements: [
      {
        title: "Privacy Rule",
        description:
          "Governs how covered entities may use and disclose PHI. Patients have rights to access, amend, and obtain an accounting of disclosures of their health information.",
      },
      {
        title: "Security Rule — Administrative Safeguards",
        description:
          "Risk analysis and management, security management processes, workforce training, and contingency planning for ePHI.",
      },
      {
        title: "Security Rule — Physical Safeguards",
        description:
          "Facility access controls, workstation use policies, and device and media controls to protect systems containing ePHI.",
      },
      {
        title: "Security Rule — Technical Safeguards",
        description:
          "Access controls, audit controls, integrity controls, and transmission security (encryption) for ePHI systems.",
      },
      {
        title: "Breach Notification Rule",
        description:
          "Covered entities must notify affected individuals within 60 days and HHS within 60 days of discovering a breach. Breaches affecting >500 individuals require media notification.",
      },
      {
        title: "Business Associate Agreements (BAAs)",
        description:
          "Any vendor or contractor who creates, receives, maintains, or transmits ePHI on behalf of a covered entity must sign a HIPAA-compliant BAA.",
      },
    ],
    benefits: [
      "Legal compliance and avoidance of substantial civil and criminal penalties",
      "Strengthened patient trust and confidence in data protection",
      "Reduced risk of costly health data breaches",
      "Clear framework for managing PHI across complex healthcare ecosystems",
      "Foundation for broader healthcare IT security programmes",
      "Competitive requirement for selling to US healthcare organisations",
    ],
    whoShouldUse: [
      "Hospitals, clinics, and physician practices",
      "Health insurance plans and HMOs",
      "Healthcare SaaS and EHR platforms",
      "Telehealth and digital health companies",
      "Medical billing and coding services",
      "Any SaaS vendor signing a BAA with a healthcare customer",
    ],
    implementationSteps: [
      {
        step: "01",
        title: "Determine Covered Entity or Business Associate Status",
        description:
          "Establish whether your organisation is a covered entity, a business associate, or a subcontractor of a business associate — each has specific obligations.",
      },
      {
        step: "02",
        title: "Conduct a Risk Analysis",
        description:
          "Identify all ePHI your organisation creates, receives, maintains, or transmits and assess potential threats, vulnerabilities, and risks.",
      },
      {
        step: "03",
        title: "Develop Policies & Procedures",
        description:
          "Create and implement policies covering privacy, security, breach notification, minimum necessary use, and workforce sanctions.",
      },
      {
        step: "04",
        title: "Implement Technical Safeguards",
        description:
          "Deploy access controls, audit logging, encryption at rest and in transit, and automatic logoff for systems containing ePHI.",
      },
      {
        step: "05",
        title: "Train Workforce",
        description:
          "Provide HIPAA training to all workforce members who access PHI, with documented role-specific training records.",
      },
      {
        step: "06",
        title: "Execute BAAs with Vendors",
        description:
          "Identify all business associates and execute HIPAA-compliant Business Associate Agreements before sharing any PHI.",
      },
      {
        step: "07",
        title: "Establish Breach Response Procedures",
        description:
          "Build and test a breach response plan covering discovery, risk assessment, containment, notification, and post-incident review.",
      },
    ],
    certificationProcess:
      "HIPAA does not have a formal certification programme. Compliance is assessed by the HHS Office for Civil Rights (OCR) during investigations following breach reports or complaints. However, organisations commonly use third-party HIPAA assessments or audits to verify compliance readiness. Achieving SOC 2 with HIPAA criteria mapped is a common approach for technology vendors.",
    estimatedTimeline: "3 – 9 months",
    relatedFrameworks: ["soc-2", "gdpr", "iso-27001", "nist-csf"],
  },

  {
    id: 6,
    slug: "dpdpa",
    name: "DPDPA",
    logo: logo6,
    category: "Indian Data Privacy",
    controls: "40+",
    color: "from-orange-500/10 to-orange-600/5",
    accent: "#f97316",
    shortDescription:
      "India's Digital Personal Data Protection Act 2023 — the country's first comprehensive data protection law. Governs how organisations collect, process, and store the personal data of Indian citizens.",
    overview:
      "The Digital Personal Data Protection Act (DPDPA) 2023 is India's landmark data protection legislation, receiving Presidential assent on 11 August 2023. The Act establishes rights for data principals (individuals) and obligations for data fiduciaries (organisations processing personal data). It introduces consent-based processing as the primary lawful basis, alongside 'legitimate uses' for specific situations. Significant Data Fiduciaries — those processing large volumes or sensitive categories of data — face enhanced obligations. The Data Protection Board of India will be established to adjudicate complaints and enforce the law, with penalties of up to ₹250 crore per instance of non-compliance.",
    whyImportant: [
      "Mandatory for any organisation processing personal data of Indian data principals.",
      "Penalties of up to ₹250 crore for significant breaches and non-compliance.",
      "Children's data requires verifiable parental consent, with additional restrictions on processing.",
      "Cross-border data transfer restrictions require government-approved recipient countries.",
      "First comprehensive Indian data law replacing the fragmented IT Act regime.",
    ],
    keyRequirements: [
      {
        title: "Consent Framework",
        description:
          "Personal data may only be processed with the data principal's free, specific, informed, and unambiguous consent, or for a notified 'legitimate use'.",
      },
      {
        title: "Notice Requirements",
        description:
          "Data fiduciaries must provide clear, itemised notice of data collected, the purpose of processing, and the data principal's rights before collecting data.",
      },
      {
        title: "Data Principal Rights",
        description:
          "Individuals have rights to access information, correction, erasure, grievance redressal, and nomination of a representative.",
      },
      {
        title: "Data Fiduciary Obligations",
        description:
          "Organisations must ensure data accuracy, implement reasonable security safeguards, and notify the Board and affected individuals of data breaches.",
      },
      {
        title: "Children's Data",
        description:
          "Processing personal data of children under 18 requires verifiable parental consent; processing harmful to children's well-being is prohibited.",
      },
      {
        title: "Significant Data Fiduciary Requirements",
        description:
          "Designated Significant Data Fiduciaries must appoint a Data Protection Officer, conduct Data Protection Impact Assessments, and undergo independent audits.",
      },
    ],
    benefits: [
      "Legal compliance with India's primary data protection framework",
      "Avoidance of substantial financial penalties and enforcement actions",
      "Increased consumer trust through transparent data practices",
      "Competitive advantage in government and enterprise procurement",
      "Alignment with global privacy standards enabling cross-border operations",
      "Foundation for GDPR and other international privacy compliance",
    ],
    whoShouldUse: [
      "All companies doing business in India or processing Indian citizens' data",
      "Indian technology and SaaS companies",
      "E-commerce and consumer internet platforms",
      "Banks, fintech, and financial services providers in India",
      "Healthcare and health-tech platforms operating in India",
      "Global multinationals with Indian customers or employees",
    ],
    implementationSteps: [
      {
        step: "01",
        title: "Data Inventory & Mapping",
        description:
          "Map all personal data of Indian data principals — what is collected, where it's stored, how it's used, and who has access.",
      },
      {
        step: "02",
        title: "Consent Management Infrastructure",
        description:
          "Implement mechanisms to collect, record, manage, and withdraw consent in compliance with the Act's notice and consent requirements.",
      },
      {
        step: "03",
        title: "Update Privacy Notices",
        description:
          "Rewrite all privacy notices to meet DPDPA requirements — clear, itemised disclosure of data collected and processing purposes.",
      },
      {
        step: "04",
        title: "Data Principal Rights Workflows",
        description:
          "Build processes to handle access, correction, and erasure requests within timeframes specified in the implementing rules.",
      },
      {
        step: "05",
        title: "Children's Data Controls",
        description:
          "Implement age verification and parental consent mechanisms for any service accessible to individuals under 18.",
      },
      {
        step: "06",
        title: "Grievance Redressal Mechanism",
        description:
          "Establish an accessible grievance mechanism with a designated officer and publish contact details prominently.",
      },
      {
        step: "07",
        title: "Security & Breach Response",
        description:
          "Implement technical and organisational safeguards proportionate to risk and build a breach notification process for the Board and affected individuals.",
      },
    ],
    certificationProcess:
      "DPDPA does not prescribe a formal certification scheme. Compliance is enforced by the Data Protection Board of India. Significant Data Fiduciaries are subject to independent data audits. Organisations may use ISO 27701 (Privacy Information Management) as a structured framework for demonstrating DPDPA compliance.",
    estimatedTimeline: "4 – 8 months",
    relatedFrameworks: ["gdpr", "iso-27001", "iso-27701", "soc-2"],
  },

  {
    id: 7,
    slug: "cmmc",
    name: "CMMC",
    logo: logo7,
    category: "Defense",
    controls: "110",
    color: "from-slate-500/10 to-slate-600/5",
    accent: "#64748b",
    shortDescription:
      "Cybersecurity Maturity Model Certification — required for all US Department of Defense contractors and subcontractors that handle Controlled Unclassified Information (CUI).",
    overview:
      "The Cybersecurity Maturity Model Certification (CMMC) is a framework created by the US Department of Defense (DoD) to ensure contractors protecting Federal Contract Information (FCI) and Controlled Unclassified Information (CUI) have implemented adequate cybersecurity controls. CMMC 2.0 streamlines the original five-level model into three levels based on the sensitivity of information handled. Level 1 requires self-assessment against 17 basic safeguarding requirements. Level 2 aligns with NIST SP 800-171's 110 practices and requires triennial third-party assessments for critical programmes. Level 3 adds NIST SP 800-172 requirements for the most sensitive programmes and requires government-led assessments.",
    whyImportant: [
      "Mandatory for participation in DoD contracts — no CMMC, no contract.",
      "CMMC requirements flow down through the supply chain to all subcontractors.",
      "Protects sensitive defence information from nation-state and advanced persistent threats.",
      "Demonstrates cybersecurity maturity to DoD and prime contractors.",
      "Aligns with NIST 800-171, a widely adopted federal baseline.",
    ],
    keyRequirements: [
      {
        title: "Access Control (AC)",
        description:
          "Limit system access to authorised users, processes acting on behalf of authorised users, and devices including other systems.",
      },
      {
        title: "Incident Response (IR)",
        description:
          "Establish an incident-handling capability for organisational systems including preparation, detection, analysis, containment, recovery, and user response activities.",
      },
      {
        title: "Risk Assessment (RA)",
        description:
          "Periodically assess the risk to organisational operations, assets, and individuals resulting from system operation and associated information processing.",
      },
      {
        title: "System & Communications Protection (SC)",
        description:
          "Monitor, control, and protect communications at external boundaries and key internal boundaries of organisational systems.",
      },
      {
        title: "Identification & Authentication (IA)",
        description:
          "Identify system users, processes acting on behalf of users, and devices. Authenticate identities before allowing access to systems.",
      },
      {
        title: "Configuration Management (CM)",
        description:
          "Establish and maintain baseline configurations and inventories of organisational systems including hardware, software, firmware, and documentation.",
      },
    ],
    benefits: [
      "Eligibility to bid on and win DoD contracts",
      "Competitive differentiation in the Defense Industrial Base",
      "Robust cybersecurity posture protecting sensitive government information",
      "Alignment with NIST 800-171 and other federal security standards",
      "Supply chain security confidence for prime contractors",
      "Foundation for achieving FedRAMP or other federal authorisations",
    ],
    whoShouldUse: [
      "Prime contractors and subcontractors in the Defense Industrial Base (DIB)",
      "Manufacturers supplying components to defense programmes",
      "IT and managed service providers supporting DoD contractors",
      "Research universities and defence research institutions",
      "Logistics and supply chain companies in the defense sector",
      "Any company bidding on US federal contracts involving CUI",
    ],
    implementationSteps: [
      {
        step: "01",
        title: "Determine Your CMMC Level",
        description:
          "Identify whether your contracts involve FCI only (Level 1) or CUI (Level 2/3) by reviewing contract requirements and solicitations.",
      },
      {
        step: "02",
        title: "Define CUI Scope",
        description:
          "Identify all systems, applications, and environments that create, process, store, or transmit CUI to define the assessment boundary.",
      },
      {
        step: "03",
        title: "Conduct NIST 800-171 Self-Assessment",
        description:
          "Score your current implementation against NIST SP 800-171 practices using the DoD assessment methodology and document a System Security Plan (SSP).",
      },
      {
        step: "04",
        title: "Develop a Plan of Action & Milestones (POA&M)",
        description:
          "Document all unimplemented practices with remediation timelines, resource assignments, and milestones in a formal POA&M.",
      },
      {
        step: "05",
        title: "Remediate Gaps",
        description:
          "Implement missing security controls, update configurations, deploy missing technical capabilities, and update policies and procedures.",
      },
      {
        step: "06",
        title: "Third-Party Assessment (C3PAO)",
        description:
          "For Level 2 critical programmes, engage a CMMC Third Party Assessment Organisation (C3PAO) to conduct a formal assessment.",
      },
      {
        step: "07",
        title: "Maintain & Report",
        description:
          "Submit your SPRS score, maintain your SSP and POA&M, and re-assess on the required triennial cycle.",
      },
    ],
    certificationProcess:
      "CMMC Level 1 requires annual self-assessment with an affirmation by a senior company official submitted to the Supplier Performance Risk System (SPRS). Level 2 critical programmes require a triennial assessment by an accredited C3PAO. Level 3 programmes require a government-led assessment by the Defense Contract Management Agency (DCMA) Defense Industrial Base Cybersecurity Assessment Center (DIBCAC).",
    estimatedTimeline: "6 – 18 months",
    relatedFrameworks: ["nist-csf", "iso-27001", "soc-2", "pci-dss"],
  },

  {
    id: 8,
    slug: "nist-csf",
    name: "NIST CSF",
    logo: logo8,
    category: "Cybersecurity",
    controls: "108",
    color: "from-cyan-500/10 to-cyan-600/5",
    accent: "#06b6d4",
    shortDescription:
      "The NIST Cybersecurity Framework — a voluntary but widely adopted framework for improving cybersecurity risk management across all sectors. Version 2.0 released in 2024 adds a Govern function.",
    overview:
      "The NIST Cybersecurity Framework (CSF) was originally developed in 2014 at the direction of a US Presidential Executive Order, created through collaboration between the National Institute of Standards and Technology (NIST) and private industry. Despite being voluntary, it has been widely adopted by organisations of all sizes and sectors globally as a common language for cybersecurity risk management. The Framework organises security activities into six core Functions: Govern, Identify, Protect, Detect, Respond, and Recover. Within each function, Categories and Subcategories provide increasingly specific outcomes. Version 2.0 (2024) adds the Govern function, expands supply chain risk guidance, and provides clearer implementation examples.",
    whyImportant: [
      "Provides a common, flexible language for communicating cybersecurity risk to leadership and stakeholders.",
      "Adaptable to organisations of any size, sector, or cybersecurity maturity level.",
      "Widely referenced in regulations, contracts, and insurance requirements.",
      "Enables structured gap analysis and measurable improvement over time using Tiers and Profiles.",
      "CSF 2.0's Govern function elevates cybersecurity as a core enterprise risk management concern.",
    ],
    keyRequirements: [
      {
        title: "Govern (GV) — New in CSF 2.0",
        description:
          "Establish and monitor the organisation's cybersecurity risk management strategy, expectations, and policy at the leadership level.",
      },
      {
        title: "Identify (ID)",
        description:
          "Develop organisational understanding of cybersecurity risk to systems, people, assets, data, and capabilities.",
      },
      {
        title: "Protect (PR)",
        description:
          "Develop and implement appropriate safeguards to ensure delivery of critical services and limit the impact of a cybersecurity event.",
      },
      {
        title: "Detect (DE)",
        description:
          "Develop and implement appropriate activities to identify the occurrence of a cybersecurity event in a timely manner.",
      },
      {
        title: "Respond (RS)",
        description:
          "Develop and implement appropriate activities to take action regarding a detected cybersecurity incident.",
      },
      {
        title: "Recover (RC)",
        description:
          "Develop and implement appropriate activities to maintain plans for resilience and to restore capabilities impaired by a cybersecurity incident.",
      },
    ],
    benefits: [
      "Flexible framework adaptable to any industry and organisation size",
      "Common language for cybersecurity risk discussions with executives and boards",
      "Clear path from current state to target security profile",
      "Integrates with ISO 27001, NIST 800-53, and other standards",
      "Free to use with extensive NIST guidance and resources available",
      "Widely accepted by insurers and regulators as evidence of mature practices",
    ],
    whoShouldUse: [
      "Critical infrastructure operators (energy, water, finance, healthcare)",
      "US federal agencies and their contractors",
      "State and local government entities",
      "Enterprises building or maturing their security programme",
      "Organisations preparing for ISO 27001 or SOC 2",
      "Any organisation seeking a risk-based cybersecurity governance structure",
    ],
    implementationSteps: [
      {
        step: "01",
        title: "Prioritise & Scope",
        description:
          "Identify business objectives and the systems, assets, and data that support them. Determine the scope of the Framework implementation.",
      },
      {
        step: "02",
        title: "Orient",
        description:
          "Identify related systems, regulatory requirements, and risk approaches relevant to your sector and the systems in scope.",
      },
      {
        step: "03",
        title: "Create a Current Profile",
        description:
          "Assess your organisation's current cybersecurity outcomes against the Framework Core Categories and Subcategories.",
      },
      {
        step: "04",
        title: "Conduct a Risk Assessment",
        description:
          "Identify threats to and vulnerabilities of systems in scope and use the risk assessment to inform your Target Profile.",
      },
      {
        step: "05",
        title: "Create a Target Profile",
        description:
          "Define the desired cybersecurity outcomes — your Target Profile — based on risk assessment results and business priorities.",
      },
      {
        step: "06",
        title: "Determine, Analyse & Prioritise Gaps",
        description:
          "Compare Current and Target Profiles to identify gaps, then prioritise remediation based on business needs, risk, and available resources.",
      },
      {
        step: "07",
        title: "Implement Action Plan",
        description:
          "Execute the prioritised action plan, continuously monitor outcomes, and update profiles as the threat landscape and business evolve.",
      },
    ],
    certificationProcess:
      "The NIST CSF is voluntary and does not have a formal certification process. Organisations use it as a self-assessment and communication tool. Many organisations share their CSF profile or Tier with customers and regulators as evidence of cybersecurity maturity. Some sector-specific regulations (e.g., NERC CIP, HIPAA) reference CSF as an acceptable approach to meeting their requirements.",
    estimatedTimeline: "2 – 6 months",
    relatedFrameworks: ["iso-27001", "cmmc", "soc-2", "pci-dss"],
  },
];

export default frameworkData;
