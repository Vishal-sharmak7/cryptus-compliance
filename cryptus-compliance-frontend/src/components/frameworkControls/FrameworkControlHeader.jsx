import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";

export default function FrameworkControlHeader({ framework, totalControls }) {
  const navigate = useNavigate();

  return (
    <div className="relative py-12 border-b border-slate-200 overflow-hidden bg-slate-50/50">
      <div className="absolute -top-40 left-1/4 w-[400px] h-[300px] bg-indigo-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-[300px] h-[200px] bg-violet-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <button
          onClick={() => navigate(`/framework-card/${framework.slug}`)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6 group font-medium"
        >
          <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
          Back to {framework.name} Details
        </button>

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${framework.color} flex items-center justify-center shrink-0 shadow-md`}>
            <img
              src={framework.logo}
              alt={framework.name}
              className="w-10 h-10 object-contain"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                {framework.category}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <FaShieldAlt className="text-[10px]" /> {totalControls} Real Controls
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              {framework.name} Compliance Controls
            </h1>
            <p className="mt-2 text-slate-500 text-sm max-w-3xl leading-relaxed">
              Explore the real operational and technical control requirements required to achieve and maintain compliance for {framework.name}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
