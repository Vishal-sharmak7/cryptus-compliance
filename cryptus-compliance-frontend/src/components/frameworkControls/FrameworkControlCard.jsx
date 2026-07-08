import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaShieldAlt } from "react-icons/fa";

export default function FrameworkControlCard({ slug, control }) {
  const { controlId, title, category, description } = control;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider font-mono">
            {controlId}
          </span>
          <span className="text-xs text-slate-400 font-medium truncate max-w-[180px]" title={category}>
            {category}
          </span>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <Link
        to={`/framework-card-controller/${slug}/${controlId}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mt-auto self-start"
      >
        View Details <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
