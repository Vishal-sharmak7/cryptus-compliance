import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
  FaClock,
  FaHeadset,
  FaStar,
  FaLock,
  FaCalendarCheck,
  FaUserTie,
} from "react-icons/fa";
import logo1 from "../assets/logos/1.png"; // ISO 27001
import logo2 from "../assets/logos/2.png"; // SOC 2
import logo3 from "../assets/logos/3.png"; // GDPR
import logo5 from "../assets/logos/5.png"; // HIPAA

const frameworkOptions = [
  "ISO 27001",
  "SOC 2",
  "GDPR",
  "HIPAA",
  "PCI-DSS",
  "DPDPA",
  "Multiple Frameworks",
  "Not sure yet",
];

const valueProps = [
  "See your compliance dashboard live, tailored to your stack",
  "Get a personalised roadmap for your target framework(s)",
  "Ask questions directly to a compliance specialist",
  "No pressure, no credit card — just a walkthrough",
];

const trustBadges = [
  { name: "ISO 27001", logo: logo1 },
  { name: "SOC 2", logo: logo2 },
  { name: "GDPR", logo: logo3 },
  { name: "HIPAA", logo: logo5 },
];

const miniStats = [
  { value: "20 min", label: "Average call length", icon: FaClock },
  { value: "24 hrs", label: "Expert follow-up time", icon: FaUserTie },
  { value: "₹0", label: "Cost, no card required", icon: FaCalendarCheck },
];

const testimonials = [
  {
    quote: "The demo alone gave us a 6-month head start on our ISO 27001 journey.",
    name: "Aarav Kapoor",
    role: "CTO, FinEdge Technologies",
    rating: 5,
  },
  {
    quote: "Best 20 minutes I've spent on compliance in my entire career.",
    name: "Sneha Patel",
    role: "Head of Security, CloudNest",
    rating: 5,
  },
];

const initialForm = {
  fullName: "",
  workEmail: "",
  phone: "",
  company: "",
  framework: "",
  message: "",
};

export default function BookDemo() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  /* ── Per-field validation rules ───────────────────────────── */
  const validateField = (name, value) => {
    switch (name) {
      case "fullName": {
        const trimmed = value.trim();
        if (!trimmed) return "Full name is required.";
        if (trimmed.length < 2) return "Name must be at least 2 characters.";
        if (trimmed.length > 60) return "Name must be under 60 characters.";
        if (!/^[a-zA-Z\s'.\-]+$/.test(trimmed))
          return "Name can only contain letters, spaces, hyphens or apostrophes.";
        return null;
      }
      case "workEmail": {
        const trimmed = value.trim();
        if (!trimmed) return "Work email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed))
          return "Please enter a valid email address (e.g. you@company.com).";
        const personalDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
        const domain = trimmed.split("@")[1]?.toLowerCase();
        if (personalDomains.includes(domain))
          return "Please use your work email, not a personal email address.";
        return null;
      }
      case "phone": {
        const digits = value.replace(/[\s\-\(\)\+]/g, "");
        if (!value.trim()) return "Phone number is required.";
        if (!/^[0-9]{10,15}$/.test(digits))
          return "Enter a valid phone number (10–15 digits, e.g. +91 98765 43210).";
        return null;
      }
      case "company": {
        const trimmed = value.trim();
        if (!trimmed) return "Company name is required.";
        if (trimmed.length < 2) return "Company name must be at least 2 characters.";
        if (trimmed.length > 80) return "Company name must be under 80 characters.";
        return null;
      }
      default:
        return null;
    }
  };

  /* ── Validate all required fields at once ─────────────────── */
  const validateAll = () => {
    const fields = ["fullName", "workEmail", "phone", "company"];
    const er = {};
    fields.forEach((f) => {
      const msg = validateField(f, form[f]);
      if (msg) er[f] = msg;
    });
    return er;
  };

  /* ── Live change: update value + re-validate if already touched */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (touched[name]) {
      const msg = validateField(name, value);
      setErrors((er) => ({ ...er, [name]: msg || null }));
    }
  };

  /* ── On blur: mark as touched and validate immediately ─────── */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setFocusedField(null);
    const msg = validateField(name, value);
    setErrors((er) => ({ ...er, [name]: msg || null }));
  };

  /* ── Submit ─────────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Touch all required fields so errors show
    setTouched({ fullName: true, workEmail: true, phone: true, company: true });
    const er = validateAll();
    if (Object.keys(er).length > 0) {
      setErrors(er);
      // Scroll to first error
      const firstKey = Object.keys(er)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  /* ── Field strength indicator (for email/phone) ────────────── */
  const isValid = (field) => touched[field] && !errors[field] && form[field].trim();

  const inputBase =
    "w-full px-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none border-2 transition-all duration-200 bg-white/60 backdrop-blur-sm";

  const inputClass = (field) =>
    `${inputBase} ${
      errors[field]
        ? "border-red-300 bg-red-50/40 focus:border-red-400"
        : focusedField === field
        ? "border-indigo-400 bg-white shadow-md shadow-indigo-100/50"
        : "border-slate-200 hover:border-slate-300 focus:border-indigo-400"
    }`;

  return (
    <div className="min-h-screen relative">
      {/* ── Background Blobs ──────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-32 left-1/4 w-[600px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #155DFC, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 left-1/3 w-[500px] h-[300px] rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #0EA5E9, transparent 70%)" }}
        />
      </div>

      <section className="relative py-14 px-6">
        <div className="max-w-5xl mx-auto relative z-10 grid lg:grid-cols-2 gap-14 items-start">

          {/* ── Left Column ──────────────────────────────────────── */}
          <div className="animate-fade-up lg:pt-4">
            {/* Trust Badges top row */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                <FaStar className="text-amber-400" /> 4.9/5 average rating
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200">
                🎯 300+ audits delivered
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                ✓ Free, no commitment
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-slate-900">
              See your{" "}
              <span className="gradient-text">compliance timeline</span>{" "}
              in a live 20‑minute walkthrough
            </h1>

            <p className="mt-6 text-slate-500 text-base leading-relaxed max-w-lg">
              Tell us a little about your team and we'll show you exactly how
              Cryptus Compliance automates evidence collection, control
              tracking, and audit prep for your framework.
            </p>

            {/* Value Props */}
            <ul className="mt-8 space-y-4">
              {valueProps.map((v, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                    <FaCheckCircle className="text-indigo-600 text-xs" />
                  </div>
                  <span className="text-sm text-slate-700 leading-relaxed">{v}</span>
                </li>
              ))}
            </ul>

            {/* Mini Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {miniStats.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="clay-card rounded-2xl p-4 text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mx-auto mb-2">
                    <Icon className="text-indigo-500 text-sm" />
                  </div>
                  <p className="text-xl font-bold text-slate-900">{value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{label}</p>
                </div>
              ))}
            </div>

            {/* Framework Logos */}
            <div className="mt-8 pt-8 border-t border-slate-200/70">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Frameworks we help you get ready for
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {trustBadges.map((b) => (
                  <div
                    key={b.name}
                    className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center card-hover shadow-sm"
                    title={b.name}
                  >
                    <img src={b.logo} alt={b.name} className="w-8 h-8 object-contain" />
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-8 space-y-4">
              {testimonials.map((t, i) => (
                <div key={i} className="clay-card rounded-2xl p-5 flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <FaStar key={j} className="text-amber-400 text-xs" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 italic leading-relaxed">"{t.quote}"</p>
                    <p className="mt-1.5 text-[11px] font-semibold text-slate-700">
                      {t.name}{" "}
                      <span className="font-normal text-slate-400">— {t.role}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Column: Form Card ───────────────────────────── */}
          <div className="animate-fade-up lg:sticky lg:top-24">
            {submitted ? (
              /* ── Success State ─────────────────────────────────── */
              <div
                className="relative rounded-[28px] p-10 text-center overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 20px 60px -10px rgba(21,93,252,0.15), 0 4px 20px -4px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-30 rounded-[28px]"
                  style={{ background: "linear-gradient(135deg, #EEF2FF, #F5F3FF)" }}
                />
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
                    <FaCheckCircle className="text-3xl text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">You're all set! 🎉</h2>
                  <p className="mt-3 text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                    Thanks,{" "}
                    <span className="font-semibold text-slate-700">
                      {form.fullName.split(" ")[0]}
                    </span>
                    ! Our compliance specialist will reach out to{" "}
                    <span className="font-medium text-indigo-600">{form.workEmail}</span>{" "}
                    within 24 hours to schedule your walkthrough.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full hover:opacity-90 transition shadow-md shadow-indigo-200"
                      style={{ background: "linear-gradient(135deg, #155DFC, #4f46e5)" }}
                    >
                      Back to Home
                    </Link>
                    <Link
                      to="/resources"
                      className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 px-6 py-3 rounded-full border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-all bg-white/60"
                    >
                      Browse Resources
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Form State ────────────────────────────────────── */
              <div
                className="relative rounded-[28px] p-8 md:p-10 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 20px 60px -10px rgba(21,93,252,0.15), 0 4px 20px -4px rgba(0,0,0,0.08)",
                }}
              >
                {/* Decorative gradient blob inside card */}
                <div
                  className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ background: "radial-gradient(circle, #155DFC, transparent)" }}
                />

                <div className="relative z-10">
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 mb-3">
                        ✦ Free Demo Session
                      </span>
                      <h2 className="text-2xl font-bold text-slate-900">Book Your Free Demo</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Our expert will call you back within{" "}
                        <span className="text-indigo-600 font-semibold">24 hrs</span>.
                      </p>
                    </div>
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                      <FaCalendarCheck className="text-white text-lg" />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Full Name */}
                    <div id="field-fullName">
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="fullName"
                          id="input-fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("fullName")}
                          onBlur={handleBlur}
                          placeholder="Enter your full name"
                          className={inputClass("fullName")}
                          autoComplete="name"
                        />
                        {isValid("fullName") && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">✓</span>
                        )}
                      </div>
                      {errors.fullName && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 animate-fade-up">
                          ⚠ {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email + Phone */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div id="field-workEmail">
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                          Work Email <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="workEmail"
                            id="input-workEmail"
                            value={form.workEmail}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("workEmail")}
                            onBlur={handleBlur}
                            placeholder="you@company.com"
                            className={inputClass("workEmail")}
                            autoComplete="email"
                          />
                          {isValid("workEmail") && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">✓</span>
                          )}
                        </div>
                        {errors.workEmail && (
                          <p className="mt-1.5 text-xs text-red-500 animate-fade-up">⚠ {errors.workEmail}</p>
                        )}
                      </div>
                      <div id="field-phone">
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            id="input-phone"
                            value={form.phone}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("phone")}
                            onBlur={handleBlur}
                            placeholder="+91 98765 43210"
                            className={inputClass("phone")}
                            autoComplete="tel"
                          />
                          {isValid("phone") && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">✓</span>
                          )}
                        </div>
                        {errors.phone && (
                          <p className="mt-1.5 text-xs text-red-500 animate-fade-up">⚠ {errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Company */}
                    <div id="field-company">
                       <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                         Company Name <span className="text-red-400">*</span>
                       </label>
                       <div className="relative">
                         <input
                           type="text"
                           name="company"
                           id="input-company"
                           value={form.company}
                           onChange={handleChange}
                           onFocus={() => setFocusedField("company")}
                           onBlur={handleBlur}
                           placeholder="Your company name"
                           className={inputClass("company")}
                           autoComplete="organization"
                         />
                         {isValid("company") && (
                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">✓</span>
                         )}
                       </div>
                       {errors.company && (
                         <p className="mt-1.5 text-xs text-red-500 animate-fade-up">⚠ {errors.company}</p>
                       )}
                     </div>

                    {/* Framework */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Compliance Framework Interested In
                      </label>
                      <div className="relative">
                        <select
                          name="framework"
                          value={form.framework}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("framework")}
                          onBlur={() => setFocusedField(null)}
                          className={`${inputClass("framework")} appearance-none pr-10 cursor-pointer`}
                        >
                          <option value="">— Select a framework —</option>
                          {frameworkOptions.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Anything specific you'd like us to cover?{" "}
                        <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        rows={3}
                        placeholder="E.g. we need SOC 2 Type II before our next enterprise deal closes"
                        className={`${inputClass("message")} resize-none`}
                      />
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white py-4 rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                      style={{
                        background: "linear-gradient(135deg, #155DFC, #4f46e5)",
                        boxShadow: "0 8px 24px -4px rgba(21,93,252,0.45)",
                      }}
                    >
                      <span
                        className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                        aria-hidden="true"
                      />
                      <span className="relative z-10 flex items-center gap-2">
                        {submitting ? (
                          <>
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Booking your demo…
                          </>
                        ) : (
                          <>
                            Book Demo Now <FaArrowRight className="text-xs" />
                          </>
                        )}
                      </span>
                    </button>

                    {/* Trust row */}
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <FaClock className="text-slate-300" /> 20-min call
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaHeadset className="text-slate-300" /> Expert-led
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaLock className="text-slate-300" /> 100% confidential
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaShieldAlt className="text-slate-300" /> No spam, ever
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
