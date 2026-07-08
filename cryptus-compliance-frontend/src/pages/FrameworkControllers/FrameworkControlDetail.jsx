import React, { useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaShieldAlt,
  FaFileAlt,
  FaCheckCircle,
  FaBookOpen,
  FaLightbulb,
} from "react-icons/fa";
import frameworkData from "../../data/frameworkData";
import frameworksControls from "../../data/frameworks";

export default function FrameworkControlDetail() {
  const { slug, controlId } = useParams();
  const navigate = useNavigate();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug, controlId]);

  // Find framework
  const framework = useMemo(() => {
    return frameworkData.find((f) => f.slug === slug);
  }, [slug]);

  // Find all controls
  const controls = useMemo(() => {
    return frameworksControls[slug] || [];
  }, [slug]);

  // Find specific control
  const control = useMemo(() => {
    return controls.find((c) => c.controlId === controlId);
  }, [controls, controlId]);

  if (!framework || !control) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <FaShieldAlt className="text-5xl text-slate-300 mb-6 animate-pulse" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Control Not Found</h1>
        <p className="text-slate-500 mb-8">
          We couldn't find the requested control details.
        </p>
        <button
          onClick={() => navigate(`/framework-card-controller/${slug}`)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full hover:opacity-90 transition bg-indigo-600"
        >
          <FaArrowLeft className="text-xs" /> Back to Controls List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero / Header banner */}
      <section className="relative py-12 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => navigate(`/framework-card-controller/${slug}`)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6 group font-medium"
          >
            <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
            Back to Controls List
          </button>

          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            <Link to="/frameworks" className="hover:text-slate-600">Frameworks</Link>
            <span>/</span>
            <Link to={`/framework-card/${slug}`} className="hover:text-slate-600">{framework.name}</Link>
            <span>/</span>
            <span className="text-slate-600">{control.controlId}</span>
          </nav>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-bold px-3 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-mono tracking-wider">
                {control.controlId}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {control.category}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
              {control.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-6 mt-10 space-y-6">
        
        {/* Description & Purpose */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaShieldAlt className="text-indigo-600 text-sm" /> Control Objective & Description
          </h2>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
              <p className="text-slate-700 text-sm leading-relaxed">{control.description}</p>
            </div>
            {control.purpose && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Control Purpose</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{control.purpose}</p>
              </div>
            )}
          </div>
        </div>

        {/* Implementation Guidance */}
        {control.implementationGuidance && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FaBookOpen className="text-indigo-600 text-sm" /> Implementation Guidance
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {control.implementationGuidance}
            </p>
          </div>
        )}

        {/* Required Documents & Evidence Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Required Documents */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-slate-950 mb-3 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <FaFileAlt className="text-indigo-500" /> Required Documents
            </h3>
            {control.requiredDocuments && control.requiredDocuments.length > 0 ? (
              <ul className="space-y-2 mt-2 flex-1">
                {control.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="text-xs font-medium text-slate-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">No specific documents specified.</p>
            )}
          </div>

          {/* Evidence Examples */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-slate-950 mb-3 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <FaCheckCircle className="text-indigo-500" /> Evidence Examples
            </h3>
            {control.evidenceExamples && control.evidenceExamples.length > 0 ? (
              <ul className="space-y-2 mt-2 flex-1">
                {control.evidenceExamples.map((evidence, idx) => (
                  <li key={idx} className="text-xs font-medium text-slate-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    {evidence}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">No specific evidence examples specified.</p>
            )}
          </div>
        </div>

        {/* Best Practices */}
        {control.bestPractices && control.bestPractices.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FaLightbulb className="text-indigo-600 text-sm" /> Recommended Best Practices
            </h2>
            <ul className="space-y-3">
              {control.bestPractices.map((bp, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 text-xs shrink-0 font-bold">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{bp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* References */}
        {control.references && control.references.length > 0 && (
          <div className="text-xs text-slate-400 flex items-center gap-2 pt-4">
            <span className="font-bold uppercase">Standards Mapping:</span>
            <span>{control.references.join(", ")}</span>
          </div>
        )}

      </div>
    </div>
  );
}
