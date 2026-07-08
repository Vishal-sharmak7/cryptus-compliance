import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function ControlsEmptyState({ onClear }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto my-8 shadow-sm animate-fade-up">
      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
        <FaSearch className="text-xl" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">No controls found</h3>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">
        We couldn't find any controls matching your search query or selected category. Try adjusting your filters or search terms.
      </p>
      {onClear && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 transition"
        >
          <FaTimes className="text-xs" /> Clear Filters
        </button>
      )}
    </div>
  );
}
