import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaSearch, FaTimes, FaShieldAlt, FaArrowLeft } from "react-icons/fa";
import frameworkData from "../../data/frameworkData";
import frameworksControls from "../../data/frameworks";
import FrameworkControlHeader from "../../components/frameworkControls/FrameworkControlHeader";
import FrameworkControlCard from "../../components/frameworkControls/FrameworkControlCard";
import ControlsEmptyState from "../../components/frameworkControls/ControlsEmptyState";
import ControlsPagination from "../../components/frameworkControls/ControlsPagination";

export default function FrameworkControlsPage() {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Scroll to top on page load/change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug, currentPage, selectedCategory]);

  // Find the framework metadata
  const framework = useMemo(() => {
    return frameworkData.find((f) => f.slug === slug);
  }, [slug]);

  // Load the controls list
  const controls = useMemo(() => {
    return frameworksControls[slug] || [];
  }, [slug]);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    if (!controls.length) return ["All"];
    const unique = new Set(controls.map((c) => c.category).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [controls]);

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Filter controls based on search and category
  const filteredControls = useMemo(() => {
    return controls.filter((control) => {
      const matchesSearch =
        control.controlId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (control.description && control.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || control.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [controls, searchQuery, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredControls.length / itemsPerPage);
  const paginatedControls = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredControls.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredControls, currentPage]);

  if (!framework) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <FaShieldAlt className="text-5xl text-slate-300 mb-6 animate-pulse" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Framework Not Found</h1>
        <p className="text-slate-500 mb-8">
          We couldn't find a framework matching <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">{slug}</code>.
        </p>
        <Link
          to="/frameworks"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full hover:opacity-90 transition"
          style={{ background: "#155DFC" }}
        >
          <FaArrowLeft className="text-xs" /> Back to Frameworks
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <FrameworkControlHeader framework={framework} totalControls={controls.length} />

      <div className="max-w-7xl mx-auto px-6 mt-10">
        {/* Search and Filters panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 animate-fade-up">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search by ID, title, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            {/* Total Results Label */}
            <div className="text-sm font-semibold text-slate-500 shrink-0">
              Showing {filteredControls.length} of {controls.length} controls
            </div>
          </div>

          {/* Category filter chips */}
          {categories.length > 2 && (
            <div className="mt-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Filter by Category
              </span>
              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                {categories.map((category) => {
                  const isActive = category === selectedCategory;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        isActive
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Controls Grid */}
        {filteredControls.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up">
              {paginatedControls.map((control) => (
                <FrameworkControlCard
                  key={control.id}
                  slug={slug}
                  control={control}
                />
              ))}
            </div>

            {/* Pagination */}
            <ControlsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <ControlsEmptyState
            onClear={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
          />
        )}
      </div>
    </div>
  );
}
