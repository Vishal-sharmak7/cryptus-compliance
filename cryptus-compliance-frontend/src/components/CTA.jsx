import React from "react";
import { FaArrowRight } from "react-icons/fa";

const CTA = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-5 md:p-5">

        {/* Blur Effects */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white text-[10px] font-medium mb-6">
            Get Started Today
          </span>

          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            Ready to Simplify Compliance?
          </h2>

          <p className="mt-6 text-sm text-blue-100 max-w-2xl mx-auto">
            Automate audits, manage controls, track evidence,
            and stay compliant with confidence from a single platform.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
              Start Free Trial
            </button>

            <button className="flex items-center justify-center gap-3 px-4 py-2 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition">
              Book Demo
              <FaArrowRight />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-8 text-blue-100 text-[10px]">
            <span>✓ No Credit Card Required</span>
            <span>✓ Setup in Minutes</span>
            <span>✓ Trusted by Compliance Teams</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;