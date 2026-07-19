import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaBookOpen,
  FaClipboardList,
  FaVideo,
  FaPlay,
} from "react-icons/fa";
import resourcesData from "../data/resourcesData";
import frameworkData from "../data/frameworkData";

const typeMeta = {
  guide: { icon: FaBookOpen, label: "Guide" },
  checklist: { icon: FaClipboardList, label: "Checklist" },
  webinar: { icon: FaVideo, label: "Webinar" },
};

export default function ResourceDetail() {
  const { slug } = useParams();
  const resource = resourcesData.find((r) => r.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <FaBookOpen className="text-5xl text-slate-300 mb-6" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Resource Not Found</h1>
        <p className="text-slate-500 mb-8">
          We couldn't find a resource matching <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">{slug}</code>.
        </p>
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full hover:opacity-90 transition"
          style={{ background: "#155DFC" }}
        >
          <FaArrowLeft className="text-xs" /> Back to Resources
        </Link>
      </div>
    );
  }

  const Meta = typeMeta[resource.type] || typeMeta.guide;
  const relatedFramework = resource.relatedFrameworkSlug
    ? frameworkData.find((f) => f.slug === resource.relatedFrameworkSlug)
    : null;

  return (
    <div className="min-h-screen">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative py-14 px-6 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 animate-fade-up">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition mb-8"
          >
            <FaArrowLeft className="text-xs" /> Back to Resources
          </Link>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 mb-6">
            <Meta.icon className="text-xs" /> {Meta.label}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-slate-900">
            {resource.title}
          </h1>

          <div className="mt-5 flex items-center gap-4 text-sm text-slate-400">
            <span>{resource.readTime}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Cryptus Compliance Team</span>
          </div>

          <p className="mt-8 text-slate-600 text-base leading-relaxed">
            {resource.intro}
          </p>
        </div>
      </section>

      {/* ── Webinar video placeholder ───────────────────────── */}
      {resource.type === "webinar" && (
        <section className="max-w-3xl mx-auto px-6 mb-10">
          <div className="relative rounded-3xl overflow-hidden aspect-video flex items-center justify-center card-hover"
            style={{ background: "linear-gradient(135deg,#155DFC,#4f46e5)" }}
          >
            <button
              type="button"
              className="w-16 h-16 rounded-full bg-white/20 border border-white/40 flex items-center justify-center hover:bg-white/30 transition"
              aria-label="Play recording"
            >
              <FaPlay className="text-white text-xl ml-1" />
            </button>
            <span className="absolute bottom-4 right-5 text-white/70 text-xs font-medium">45 min recording</span>
          </div>
        </section>
      )}

      {/* ── Body sections ────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-10">
        <div className="space-y-10">
          {resource.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{s.heading}</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Key takeaways */}
        <div className="mt-14 bg-white/70 border border-white/80 rounded-3xl p-8 card-hover">
          <h3 className="text-lg font-bold text-slate-900 mb-5">Key Takeaways</h3>
          <ul className="space-y-3">
            {resource.keyTakeaways.map((t) => (
              <li key={t} className="flex items-start gap-3">
                <FaCheckCircle className="mt-0.5 shrink-0 text-indigo-500" />
                <span className="text-sm text-slate-700">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Related framework */}
        {relatedFramework && (
          <Link
            to={`/framework-card/${relatedFramework.slug}`}
            className="mt-8 flex items-center justify-between gap-4 bg-white/70 border border-white/80 rounded-2xl p-6 card-hover group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${relatedFramework.color} flex items-center justify-center shrink-0`}>
                <img src={relatedFramework.logo} alt={relatedFramework.name} className="w-7 h-7 object-contain" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Related framework</p>
                <p className="text-sm font-semibold text-slate-800">{relatedFramework.name}</p>
              </div>
            </div>
            <FaArrowRight className="text-slate-400 group-hover:text-indigo-500 transition" />
          </Link>
        )}
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div
          className="relative rounded-[32px] overflow-hidden p-10 md:p-12 text-center"
          style={{ background: "#155DFC" }}
        >
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Ready to put this into practice?
            </h2>
            <p className="mt-4 text-blue-100 max-w-lg mx-auto text-sm">
              Book a free walkthrough and see how Cryptus Compliance automates this entire process for your team.
            </p>
            <Link
              to="/book-demo"
              className="mt-8 inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full hover:bg-indigo-50 transition"
            >
              Book Demo <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
