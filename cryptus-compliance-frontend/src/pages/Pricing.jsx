import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimes, FaArrowRight, FaCrown } from "react-icons/fa";

const plans = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    description: "Perfect for individuals and small teams getting started with compliance.",
    badge: null,
    gradient: null,
    features: [
      "1 Active Framework",
      "Up to 50 Controls",
      "Evidence Uploads (5 GB)",
      "1 Audit Workspace",
      "Email Support",
      "Compliance Score Dashboard",
    ],
    notIncluded: [
      "Multiple Frameworks",
      "Risk Register",
      "Team Collaboration",
      "Auditor Portal",
      "API Access",
    ],
    cta: "Get Started Free",
    ctaTo: "/register",
  },
  {
    name: "Growth",
    monthly: 49,
    annual: 39,
    description: "For growing teams managing compliance across multiple frameworks.",
    badge: "Most Popular",
    gradient: "#155DFC",
    features: [
      "3 Active Frameworks",
      "Unlimited Controls",
      "Evidence Uploads (100 GB)",
      "5 Audit Workspaces",
      "Risk Register",
      "Team Collaboration (up to 10)",
      "Priority Email & Chat Support",
      "Auditor Portal",
      "Compliance Score Dashboard",
    ],
    notIncluded: [
      "Unlimited Frameworks",
      "API Access",
      "Custom Branding",
    ],
    cta: "Start 14-Day Trial",
    ctaTo: "/register",
  },
  {
    name: "Enterprise",
    monthly: null,
    annual: null,
    description: "Tailored for large organisations with complex compliance requirements.",
    badge: "Custom",
    gradient: null,
    features: [
      "Unlimited Frameworks",
      "Unlimited Controls",
      "Unlimited Evidence Storage",
      "Unlimited Audit Workspaces",
      "Advanced Risk Register",
      "Unlimited Team Members",
      "Dedicated Account Manager",
      "Auditor Portal",
      "API Access",
      "Custom Branding",
      "SSO / SAML",
      "SLA Guarantee",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    ctaTo: "/register",
  },
];

const faqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes. You can upgrade or downgrade your plan at any time from your account settings. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Growth plan includes a 14-day free trial with no credit card required. You'll have full access to all Growth features during the trial.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit cards (Visa, Mastercard, Amex) and bank transfers for annual Enterprise contracts.",
  },
  {
    q: "Can I add more users to my plan?",
    a: "Starter includes 1 seat, Growth includes 10 seats with additional seats available at ₹499/seat/month. Enterprise has unlimited seats.",
  },
  {
    q: "Do you offer discounts for nonprofits or startups?",
    a: "Yes! We offer 50% off Growth plans for registered nonprofits and accepted startup accelerator members. Contact us to apply.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual]   = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative py-15 px-6 overflow-hidden text-center">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 mb-6">
            ✦ Simple, Transparent Pricing
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Plans That{" "}
            <span className="gradient-text">Scale With You</span>
          </h1>

          <p className="mt-6 text-xm text-slate-500 max-w-xl mx-auto">
            No hidden fees. No per-auditor seats. Start free and upgrade when you're ready.
          </p>

          {/* Toggle */}
          <div className="mt-10 inline-flex items-center gap-3 bg-white/70 border border-slate-200 rounded-full p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                !annual ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                annual ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Plans ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isPro = plan.badge === "Most Popular";
            const price = plan.monthly === null
              ? null
              : annual
              ? plan.annual
              : plan.monthly;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 ${
                  isPro
                    ? "shadow-2xl shadow-indigo-200/60 border-indigo-300"
                    : "bg-white/70 border-white/80 shadow-sm card-hover"
                }`}
              >
                {/* Pro gradient header */}
                {isPro && (
                  <div
                    className="px-8 pt-8 pb-6"
                    style={{ background: plan.gradient }}
                  >
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 bg-white/20 px-3 py-1 rounded-full mb-4">
                      <FaCrown className="text-yellow-300" /> {plan.badge}
                    </span>
                    <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                    <p className="mt-2 text-blue-100 text-sm">{plan.description}</p>
                    <div className="mt-6 flex items-end gap-1">
                      <span className="text-5xl font-bold text-white">
                        {price === 0 ? "Free" : price !== null ? `$${price}` : "Custom"}
                      </span>
                      {price !== null && price !== 0 && (
                        <span className="text-blue-200 text-sm mb-2">/mo</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Non-pro header */}
                {!isPro && (
                  <div className="px-8 pt-8 pb-6">
                    {plan.badge && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full mb-4">
                        {plan.badge}
                      </span>
                    )}
                    <h2 className="text-2xl font-bold text-slate-900">{plan.name}</h2>
                    <p className="mt-2 text-slate-500 text-sm">{plan.description}</p>
                    <div className="mt-6 flex items-end gap-1">
                      <span className="text-5xl font-bold text-slate-900">
                        {price === 0 ? "Free" : price !== null ? `$${price}` : "Custom"}
                      </span>
                      {price !== null && price !== 0 && (
                        <span className="text-slate-400 text-sm mb-2">/mo</span>
                      )}
                    </div>
                    {annual && price !== null && price !== 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        Billed annually (${price * 12}/yr)
                      </p>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div className={`px-8 pb-6 ${isPro ? "bg-gradient-to-b from-indigo-600/5 to-transparent" : ""}`}>
                  <Link
                    to={plan.ctaTo}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold transition-all ${
                      isPro
                        ? "text-white hover:opacity-90 mt-4"
                        : "text-slate-700 border border-slate-200 bg-white hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                    style={isPro ? { background: "#155DFC" } : {}}
                  >
                    {plan.cta} <FaArrowRight className="text-xs" />
                  </Link>
                </div>

                {/* Features */}
                <div className="px-8 pb-10 flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    What's included
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <FaCheckCircle className={`mt-0.5 shrink-0 ${isPro ? "text-indigo-500" : "text-green-500"}`} />
                        <span className="text-sm text-slate-700">{f}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 opacity-40">
                        <FaTimes className="mt-0.5 shrink-0 text-slate-400" />
                        <span className="text-sm text-slate-500">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-28">
        <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white/70 border border-white/80 rounded-2xl overflow-hidden card-hover"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-7 py-5 text-left"
              >
                <span className="font-semibold text-slate-800 text-xm">{faq.q}</span>
                <span
                  className={`text-slate-400 transition-transform duration-200 ${
                    openFaq === i ? "rotate-45" : ""
                  }`}
                >
                  ✕
                </span>
              </button>

              {openFaq === i && (
                <div className="px-7 pb-5 text-slate-500 text-xs leading-relaxed animate-fade-up">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-15">
        <div
          className="relative rounded-[32px] overflow-hidden p-12 text-center"
          style={{ background: "#155DFC" }}
        >
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <h2 className="relative text-2xl md:text-4xl font-bold text-white">
            Still have questions?
          </h2>
          <p className="relative mt-3 text-sx text-blue-100 max-w-lg mx-auto">
            Our team is happy to walk you through the right plan for your organisation.
          </p>
          <Link
            to="/register"
            className="relative mt-6 inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full hover:bg-indigo-50 transition"
          >
            Talk to Sales <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
