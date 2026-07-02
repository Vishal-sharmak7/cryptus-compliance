import React from "react";
import {
  FaClipboardCheck,
  FaTasks,
  FaFolderOpen,
  FaSearch,
  FaFileSignature,
  FaAward,
} from "react-icons/fa";

const journey = [
  {
    title: "Framework",
    description:
      "Choose the compliance framework you want to implement.",
    icon: FaClipboardCheck,
  },
  {
    title: "Controls",
    description:
      "Assign and manage controls required by the framework.",
    icon: FaTasks,
  },
  {
    title: "Evidence",
    description:
      "Collect and organize evidence for audit readiness.",
    icon: FaFolderOpen,
  },
  {
    title: "Review",
    description:
      "Review compliance status and identify gaps.",
    icon: FaSearch,
  },
  {
    title: "Audit",
    description:
      "Prepare and collaborate with auditors efficiently.",
    icon: FaFileSignature,
  },
  {
    title: "Certification",
    description:
      "Achieve certification and maintain compliance continuously.",
    icon: FaAward,
  },
];

const Workflow = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      {/* Heading */}
      <div className="mb-20">
        <span className="text-blue-600 font-semibold uppercase tracking-wider">
          Compliance Journey
        </span>

        <h2 className="mt-4 text-4xl font-bold text-gray-900">
          From Framework Selection to Certification
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl ">
          Follow a structured compliance journey that guides your
          organization through every stage of the process.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-100 -translate-x-1/2" />

        <div className="space-y-5">
          {journey.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className={`relative flex items-center ${
                  index % 2 === 0
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                {/* Card */}
                <div className="w-full md:w-[45%] bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <Icon className="text-blue-600 text-2xl" />
                    </div>

                    <div>
                      <h3 className="text-[15px] font-bold text-gray-900">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 mt-1 text-[13px]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center Circle */}
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-lg" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Workflow;