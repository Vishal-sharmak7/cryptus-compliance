import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    step: "Step 1",
    title: "Select Framework",
    description:
      "Choose from ISO 27001, SOC 2, GDPR, PCI-DSS, HIPAA, NIST and other compliance frameworks supported by the platform.",
  },
  {
    step: "Step 2",
    title: "Assign Controls",
    description:
      "Assign controls to team members and define ownership. Track progress and accountability across departments.",
  },
  {
    step: "Step 3",
    title: "Upload Evidence",
    description:
      "Collect evidence and documentation in one place. Keep audit records organized and easily accessible.",
  },
  {
    step: "Step 4",
    title: "Pass Audit",
    description:
      "Generate reports, monitor readiness, and confidently complete audits with automated workflows.",
  },
];

const Howitswork = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll(".step-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(Number(entry.target.dataset.index));
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-10 py-20">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div className="relative">
          <h2 className="text-3xl font-bold text-gray-900 mb-20">
            How It Works
          </h2>

          {/* Timeline Line */}
          <div className="absolute left-5 top-32 bottom-20 w-[4px]">
            {/* Background */}
            <div className="absolute inset-0 bg-gray-200 rounded-full" />

            {/* Active Progress */}
            <motion.div
              className="absolute top-0 left-0 w-full bg-blue-600 rounded-full"
              animate={{
                height: `${((activeStep + 1) / steps.length) * 100}%`,
              }}
              transition={{
                duration: 0.5,
              }}
            />

            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent blur-sm" />
          </div>

          {steps.map((item, index) => (
            <div
              key={index}
              data-index={index}
              className="step-section h-[60vh] flex items-center"
            >
              <div className="flex gap-8 relative z-10">
                {/* Circle */}
                <div>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                      activeStep >= index
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-300"
                        : "bg-white border-2 border-gray-300 text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Text */}
                <div>
                  <span
                    className={`text-sm font-semibold transition-all duration-300 ${
                      activeStep === index
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {item.step}
                  </span>

                  <h3
                    className={`mt-4 text-[16px] font-bold transition-all duration-300 ${
                      activeStep === index
                        ? "text-gray-900"
                        : "text-gray-300"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`mt-4 max-w-md text-[13px] transition-all duration-300 ${
                      activeStep === index
                        ? "text-gray-600"
                        : "text-gray-300"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="relative">
          <div className="sticky top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                transition={{
                  duration: 0.45,
                }}
                className="bg-white border border-gray-200 rounded-2xl shadow-xl p-10 h-[300px] w-[300px]"
              >
                {/* Step Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-[10px] bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                    {activeStep + 1}
                  </div>

                  <span className="text-blue-600 font-semibold text-[13px]">
                    {steps[activeStep].step}
                  </span>
                </div>


                {/* Title */}
                <h3 className="text-[15px] font-bold text-gray-900 mt-8">
                  {steps[activeStep].title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-gray-600 leading-relaxed text-[13px]">
                  {steps[activeStep].description}
                </p>

                {/* Progress Indicators */}
                <div className="flex gap-2 mt-8">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= activeStep
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Howitswork;