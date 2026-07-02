import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaBlog,
  FaQuestionCircle,
  FaVideo,
  FaFileAlt,
  FaTools,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";

const categories = [
  {
    icon: FaBook,
    title: "Documentation",
    description: "Comprehensive guides and API references for every feature on the platform.",
    color: "from-indigo-500/10 to-indigo-600/5",
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50 group-hover:bg-indigo-600",
    links: [
      "Getting Started Guide",
      "Framework Setup",
      "Evidence Management",
      "API Reference",
      "Webhooks & Integrations",
    ],
  },
  {
    icon: FaBlog,
    title: "Blog",
    description: "Insights, best practices and compliance news from our team of experts.",
    color: "from-violet-500/10 to-violet-600/5",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50 group-hover:bg-violet-600",
    links: [
      "What is ISO 27001?",
      "SOC 2 Checklist 2026",
      "GDPR vs DPDPA Compared",
      "Audit Preparation Tips",
      "Compliance Automation Trends",
    ],
  },
  {
    icon: FaVideo,
    title: "Video Tutorials",
    description: "Step-by-step walkthroughs to get you up and running in minutes.",
    color: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 group-hover:bg-blue-600",
    links: [
      "Platform Onboarding (10 min)",
      "Setting Up a Framework",
      "Collecting & Tagging Evidence",
      "Running an Internal Audit",
      "Generating Compliance Reports",
    ],
  },
  {
    icon: FaFileAlt,
    title: "Templates & Policies",
    description: "Ready-to-use policy templates and evidence checklists for every framework.",
    color: "from-green-500/10 to-green-600/5",
    iconColor: "text-green-600",
    iconBg: "bg-green-50 group-hover:bg-green-600",
    links: [
      "ISO 27001 Policy Pack",
      "SOC 2 Evidence Checklist",
      "GDPR Privacy Notice Template",
      "Risk Assessment Template",
      "Incident Response Plan",
    ],
  },
  {
    icon: FaQuestionCircle,
    title: "Help Center",
    description: "Find answers to common questions and troubleshoot issues quickly.",
    color: "from-orange-500/10 to-orange-600/5",
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50 group-hover:bg-orange-600",
    links: [
      "Account & Billing FAQ",
      "Framework Questions",
      "Evidence Upload Issues",
      "Team & Permissions",
      "Contact Support",
    ],
  },
  {
    icon: FaTools,
    title: "Integrations",
    description: "Connect Cryptus with your existing tools — Jira, Slack, AWS, GCP and more.",
    color: "from-cyan-500/10 to-cyan-600/5",
    iconColor: "text-cyan-600",
    iconBg: "bg-cyan-50 group-hover:bg-cyan-600",
    links: [
      "Jira Integration",
      "Slack Notifications",
      "AWS Config Connector",
      "Google Workspace SSO",
      "Zapier Integration",
    ],
  },
];

const featured = [
  {
    tag: "Guide",
    title: "ISO 27001 Certification: The Complete 2026 Roadmap",
    summary:
      "Everything your team needs to achieve ISO 27001 certification — from gap analysis to the final audit. Includes free checklist download.",
    readTime: "12 min read",
    gradient: "from-[#155DFC] to-[#155DFC]",
  },
  {
    tag: "Checklist",
    title: "SOC 2 Type II Evidence Checklist",
    summary:
      "A definitive, printable checklist covering all 64 common criteria across the five Trust Services Criteria. Updated for 2026.",
    readTime: "5 min read",
    gradient: "from-[#155DFC] to-[#155DFC]",
  },
  {
    tag: "Webinar",
    title: "Compliance Automation in 2026 — Live Q&A Recording",
    summary:
      "Watch our experts discuss how AI-powered compliance tools are eliminating manual audit work and cutting prep time by 70%.",
    readTime: "45 min watch",
    gradient: "from-[#155DFC] to-[#155DFC]",
  },
];

export default function ResourcesPage() {
  const [query, setQuery] = useState("");

  const filtered = categories.filter(
    (c) =>
      query === "" ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.links.some((l) => l.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative py-15 px-6 overflow-hidden text-center">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 mb-6">
            ✦ Resources & Learning
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Everything You Need to{" "}
            <span className="gradient-text">Master Compliance</span>
          </h1>

          <p className="mt-6 text-xm text-slate-500 max-w-2xl mx-auto">
            Guides, templates, videos and integrations to help your team go from zero to certified faster.
          </p>

          {/* Search */}
          <div className="mt-10 max-w-lg mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources, guides, templates…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-4 rounded-full bg-white/80 border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 shadow-sm transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Resources ─────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {featured.map(({ tag, title, summary, readTime, gradient }) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-3xl p-8 flex flex-col gap-4 card-hover cursor-pointer"
              style={{ background: `linear-gradient(135deg,${gradient.replace("from-", "").replace("to-", "")})`
                .replace(/\s*from-\w+-\d+/, "").replace(/\s*to-\w+-\d+/, "") }}
            >
              {/* Use a simple gradient approach */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                style={{ opacity: 1 }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />

              <div className="relative z-10">
                <span className="inline-block text-xs font-bold text-white/70 bg-white/20 px-3 py-1 rounded-full mb-3">
                  {tag}
                </span>
                <h3 className="text-xm font-bold text-white leading-snug">{title}</h3>
                <p className="mt-3 text-white/75 text-xs leading-relaxed">{summary}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-white/60">{readTime}</span>
                  <span className="text-white/80 text-xs flex items-center gap-1 font-medium">
                    Read more <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Category Grid ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse by Category</h2>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No results for "<span className="text-slate-600">{query}</span>"
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(({ icon: Icon, title, description, iconBg, iconColor, links }) => (
              <div
                key={title}
                className="group bg-white/70 border border-white/80 rounded-3xl p-8 card-hover"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${iconBg}`}>
                  <Icon className={`text-xl transition-colors duration-300 ${iconColor} group-hover:text-white`} />
                </div>

                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{description}</p>

                <ul className="mt-5 space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="flex items-center gap-2 text-xs text-slate-600 hover:text-indigo-600 transition-colors group/link"
                      >
                        <FaArrowRight className="text-[10px] text-slate-300 group-hover/link:text-indigo-400 transition-colors" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Newsletter CTA ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-15">
        <div
          className="relative rounded-[32px] overflow-hidden p-12 md:p-16 text-center"
          style={{ background: "#155DFC" }}
        >
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Get Compliance Tips in Your Inbox
            </h2>
            <p className="mt-4 text-blue-100 max-w-lg mx-auto text-xm">
              Join 2,000+ compliance professionals. Weekly insights, framework updates and audit tips.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your work email"
                className="flex-1 px-4 py-3 rounded-full bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:border-white/60 transition"
              />
              <button className="bg-white text-indigo-600 font-semibold px-4 py-3 rounded-full hover:bg-indigo-50 transition shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
