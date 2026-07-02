import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

// ── Framework data ────────────────────────────────────────────────────
import logo1 from "../assets/logos/1.png";
import logo2 from "../assets/logos/2.png";
import logo3 from "../assets/logos/3.png";
import logo4 from "../assets/logos/4.png";
import logo5 from "../assets/logos/5.png";
import logo6 from "../assets/logos/6.png";
import logo7 from "../assets/logos/7.png";
import logo8 from "../assets/logos/8.png";

const frameworks = [
  {
    name: "ISO 27001",
    logo: logo1,
    category: "Information Security",
    controls: "114",
    color: "from-blue-500/10 to-blue-600/5",
    accent: "#3b82f6",
    description:
      "International standard for information security management systems. Widely adopted globally for structured ISMS implementation.",
    features: ["Risk Assessment", "ISMS Controls", "Continuous Monitoring", "Certification Audit"],
  },
  {
    name: "SOC 2",
    logo: logo2,
    category: "Trust & Security",
    controls: "64",
    color: "from-indigo-500/10 to-indigo-600/5",
    accent: "#6366f1",
    description:
      "AICPA framework covering security, availability, processing integrity, confidentiality and privacy of customer data.",
    features: ["Trust Criteria", "Evidence Collection", "Auditor Collaboration", "Type I & II"],
  },
  {
    name: "GDPR",
    logo: logo3,
    category: "Data Privacy",
    controls: "99",
    color: "from-violet-500/10 to-violet-600/5",
    accent: "#8b5cf6",
    description:
      "EU regulation governing data protection and privacy for individuals within the European Union and European Economic Area.",
    features: ["Data Mapping", "Consent Management", "Breach Notification", "DPO Support"],
  },
  {
    name: "PCI-DSS",
    logo: logo4,
    category: "Payment Security",
    controls: "300+",
    color: "from-red-500/10 to-red-600/5",
    accent: "#ef4444",
    description:
      "Payment Card Industry Data Security Standard for organisations that handle branded credit cards.",
    features: ["12 Requirements", "Network Security", "Cardholder Data", "Penetration Testing"],
  },
  {
    name: "HIPAA",
    logo: logo5,
    category: "Healthcare",
    controls: "180+",
    color: "from-green-500/10 to-green-600/5",
    accent: "#22c55e",
    description:
      "US regulation protecting sensitive patient health information from being disclosed without patient consent.",
    features: ["PHI Protection", "Security Rule", "Privacy Rule", "BAA Management"],
  },
  {
    name: "DPDPA",
    logo: logo6,
    category: "Indian Data Privacy",
    controls: "40+",
    color: "from-orange-500/10 to-orange-600/5",
    accent: "#f97316",
    description:
      "India's Digital Personal Data Protection Act governing collection, processing and storage of personal data.",
    features: ["Consent Framework", "Data Fiduciary", "Grievance Redressal", "Cross-border Data"],
  },
  {
    name: "CMMC",
    logo: logo7,
    category: "Defense",
    controls: "110",
    color: "from-slate-500/10 to-slate-600/5",
    accent: "#64748b",
    description:
      "Cybersecurity Maturity Model Certification for US Department of Defense contractors across 5 maturity levels.",
    features: ["Maturity Levels", "NIST 800-171", "DIB Sector", "Continuous Assessment"],
  },
  {
    name: "NIST CSF",
    logo: logo8,
    category: "Cybersecurity",
    controls: "108",
    color: "from-cyan-500/10 to-cyan-600/5",
    accent: "#06b6d4",
    description:
      "NIST Cybersecurity Framework for improving critical infrastructure cybersecurity across Identify, Protect, Detect, Respond, Recover.",
    features: ["5 Core Functions", "Risk Management", "Tiers & Profiles", "Gap Analysis"],
  },
];

const categories = ["All", ...new Set(frameworks.map((f) => f.category))];

export default function FrameworksPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFramework, setActiveFramework] = useState(null);

  const filtered =
    activeCategory === "All"
      ? frameworks
      : frameworks.filter((f) => f.category === activeCategory);

  const detail = activeFramework
    ? frameworks.find((f) => f.name === activeFramework)
    : null;

  return (
    <div className="min-h-screen">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden text-center">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 mb-6">
            ✦ Supported Frameworks
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            One Platform.{" "}
            <span className="gradient-text">Every Framework.</span>
          </h1>

          <p className="mt-6 text-xm text-slate-500 max-w-2xl mx-auto">
            Manage ISO 27001, SOC 2, GDPR, PCI-DSS and more from a single workspace.
            Switch frameworks or run multiple simultaneously.
          </p>
        </div>
      </section>

      {/* ── Category Filter ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "text-white shadow-md"
                  : "bg-white/60 text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
              style={
                activeCategory === cat
                  ? { background: "#155DFC" }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Framework Cards ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((fw) => (
            <button
              key={fw.name}
              onClick={() =>
                setActiveFramework(activeFramework === fw.name ? null : fw.name)
              }
              className={`text-left bg-white/70 border rounded-3xl p-6 card-hover transition-all duration-200 ${
                activeFramework === fw.name
                  ? "border-indigo-300 shadow-lg shadow-indigo-100/50"
                  : "border-white/80"
              }`}
            >
              {/* Logo */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${fw.color} flex items-center justify-center mb-5`}>
                <img src={fw.logo} alt={fw.name} className="w-10 h-10 object-contain" />
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                {fw.category}
              </span>

              <h3 className="mt-3 text-lg font-bold text-slate-900">{fw.name}</h3>

              <p className="mt-2 text-slate-500 text-sm line-clamp-2">{fw.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">{fw.controls} controls</span>
                <span className="text-xs font-medium text-indigo-600 flex items-center gap-1">
                  Details <FaArrowRight className="text-[10px]" />
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* ── Detail Panel ─────────────────────────────────── */}
        {detail && (
          <div className="mt-8 bg-white/80 border border-indigo-200/60 rounded-3xl p-8 md:p-10 shadow-xl shadow-indigo-100/30 animate-fade-up">
            <div className="flex flex-col md:flex-row gap-8">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${detail.color} flex items-center justify-center shrink-0`}>
                <img src={detail.logo} alt={detail.name} className="w-12 h-12 object-contain" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-slate-900">{detail.name}</h2>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                    {detail.category}
                  </span>
                  <span className="text-xs font-medium text-slate-400">{detail.controls} controls</span>
                </div>

                <p className="text-slate-600 leading-relaxed mb-6">{detail.description}</p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {detail.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <FaCheckCircle className="text-indigo-500 shrink-0" />
                      <span className="text-sm text-slate-700">{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/register"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full transition hover:opacity-90"
                  style={{ background: "#155DFC" }}
                >
                  Start with {detail.name} <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-6">
        <div
          className="relative rounded-[32px] overflow-hidden p-12 text-center"
          style={{ background: "#155DFC" }}
        >
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <h2 className="relative text-2xl md:text-3xl font-bold text-white">
            Don't see your framework?
          </h2>
          <p className="relative mt-3 text-blue-100 max-w-lg mx-auto">
            We're continuously adding new frameworks. Contact us and we'll prioritise yours.
          </p>
          <Link
            to="/register"
            className="relative mt-6 inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full hover:bg-indigo-50 transition"
          >
            Talk to Us <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}