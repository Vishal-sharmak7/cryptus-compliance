import {
  FaChartLine,
  FaFolderOpen,
  FaShieldAlt,
  FaClipboardCheck,
  FaSearch,
  FaBullseye,
} from "react-icons/fa";

const features = [
  {
    title: "Compliance Tracking",
    description: "Monitor framework progress in real-time.",
    icon: FaChartLine,
  },
  {
    title: "Evidence Management",
    description: "Upload and organize audit evidence securely.",
    icon: FaFolderOpen,
  },
  {
    title: "Risk Register",
    description: "Identify and track security and compliance risks.",
    icon: FaShieldAlt,
  },
  {
    title: "Audit Management",
    description: "Prepare for audits with complete visibility.",
    icon: FaClipboardCheck,
  },
  {
    title: "Findings Tracking",
    description: "Track remediation activities and vulnerabilities.",
    icon: FaSearch,
  },
  {
    title: "Compliance Score",
    description: "Measure readiness across frameworks.",
    icon: FaBullseye,
  },
];

const Features = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      {/* Heading */}
      <div className=" mb-16">
        <span className="text-blue-600 font-semibold uppercase tracking-wider">
          Core Features
        </span>

        <h2 className="mt-4 text-4xl font-bold text-gray-900">
          Everything You Need For Compliance
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl ">
          Streamline compliance management, evidence collection, audit
          readiness, and risk tracking from a single platform.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="
              group
              bg-white
              border
              border-gray-200
              rounded-3xl
              p-8
              shadow-sm
              hover:shadow-xl
              hover:border-blue-200
              hover:-translate-y-2
              transition-all
              duration-300
            "
          >
            <div className="w-10 h-10 rounded-[10px] bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
              <feature.icon className="text-2xl text-blue-600 group-hover:text-white transition-all duration-300" />
            </div>

            <h3 className="mt-4 text-[15px] font-bold text-gray-900">
              {feature.title}
            </h3>

            <p className="mt-2 text-gray-600 leading-relaxed text-[13px]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
