import React from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaFolderOpen,
  FaShieldAlt,
  FaClipboardCheck,
  FaSearch,
  FaBullseye,
  FaBell,
  FaLock,
  FaUsers,
} from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

const features = [
  {
    icon: FaChartLine,
    title: "Compliance Tracking",
    description:
      "Monitor framework progress in real-time with visual dashboards. Know your compliance posture at a glance across all active frameworks.",
    badge: "Core",
  },
  {
    icon: FaFolderOpen,
    title: "Evidence Management",
    description:
      "Upload, version, and organize audit evidence in one secure repository. Automatic linking to controls keeps your audits stress-free.",
    badge: "Core",
  },
  {
    icon: FaShieldAlt,
    title: "Risk Register",
    description:
      "Identify, assess and track security and compliance risks. Assign owners, set deadlines and monitor remediation progress continuously.",
    badge: "Pro",
  },
  {
    icon: FaClipboardCheck,
    title: "Audit Management",
    description:
      "Prepare for audits with complete end-to-end visibility. Collaborate with auditors, share evidence and track findings in real time.",
    badge: "Core",
  },
  {
    icon: FaSearch,
    title: "Findings Tracking",
    description:
      "Track remediation of audit findings and vulnerabilities. Set SLAs, assign owners, and auto-close findings when evidence is approved.",
    badge: "Pro",
  },
  {
    icon: FaBullseye,
    title: "Compliance Score",
    description:
      "Measure your readiness across all active frameworks with weighted scoring. Exportable reports for leadership and auditors.",
    badge: "Core",
  },
  {
    icon: FaBell,
    title: "Smart Notifications",
    description:
      "Get alerts before deadlines slip. Automated reminders for evidence expiry, control reviews, and upcoming audit dates.",
    badge: "Pro",
  },
  {
    icon: FaLock,
    title: "Access Controls",
    description:
      "Role-based permissions ensure the right people see only what they need. SOC 2 and ISO 27001 compliant access management built-in.",
    badge: "Pro",
  },
  {
    icon: FaUsers,
    title: "Team Collaboration",
    description:
      "Assign controls to teammates, leave comments, request evidence and track ownership across departments — all in one workspace.",
    badge: "Core",
  },
];

const badgeStyles = {
  Core: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  Pro:  "bg-violet-50  text-violet-600  border border-violet-200",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 mb-6">
            ✦ Platform Features
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Everything You Need to{" "}
            <span className="gradient-text">Stay Compliant</span>
          </h1>

          <p className="mt-6 text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            From evidence collection to audit reporting — Cryptus Compliance
            brings your entire compliance programme into one elegant, automated
            workspace.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/book-demo"
              className="flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full transition-all hover:opacity-90 hover:shadow-lg hover:shadow-indigo-300/40"
              style={{ background: "#155DFC" }}
            >
              Book Demo <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Grid ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, badge }, i) => (
            <div
              key={i}
              className="group bg-white/70 border border-white/80 rounded-2xl p-8 shadow-sm card-hover"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300">
                  <Icon className="text-2xl text-indigo-600 group-hover:text-white transition-all duration-300" />
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeStyles[badge]}`}>
                  {badge}
                </span>
              </div>

              <h3 className="text-m font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-slate-500 text-xs leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="relative rounded-[28px] overflow-hidden p-6 md:p-8 text-center"
          style={{ background: "#155DFC" }}
        >
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
            <p className="mt-4 text-blue-100 max-w-xl mx-auto text-xl">
              Join compliance teams that trust Cryptus to automate their programmes end to end.
            </p>
            <Link
              to="/book-demo"
              className="mt-8 inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-4 py-2 rounded-full hover:bg-indigo-50 transition"
            >
              Book Demo <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
