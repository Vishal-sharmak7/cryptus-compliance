import { Link } from "react-router-dom";
import logo1 from "../assets/logos/1.png";
import logo2 from "../assets/logos/2.png";
import logo3 from "../assets/logos/3.png";
import logo4 from "../assets/logos/4.png";
import logo5 from "../assets/logos/5.png";
import logo6 from "../assets/logos/6.png";
import logo7 from "../assets/logos/7.png";
import logo8 from "../assets/logos/8.png";

export default function Hero() {
  const frameworks = [
    { name: "ISO 27001", logo: logo1 },
    { name: "SOC 2", logo: logo2 },
    { name: "GDPR", logo: logo3 },
    { name: "PCI-DSS", logo: logo4 },
    { name: "HIPAA", logo: logo5 },
    { name: "DPDPA", logo: logo6 },
    { name: "CMMC", logo: logo7 },
    { name: "NIST", logo: logo8 },
  ];

  return (
    <section className="relative max-w-5xl  overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 ml-60 pt-10 pb-10  mt-5">
        {/* Heading */}
        <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
          Automate <span className="text-blue-600">Compliance.</span>
          <br />
          Reduce Audit Stress.
          <br />
          Stay Continuously Compliant.
        </h1>

        {/* Description */}
        <p className="max-w-3xl mx-auto mt-8 text-lg text-gray-600 leading-relaxed">
          Manage ISO 27001, SOC 2, GDPR, PCI-DSS and other compliance frameworks
          from a single platform. Track controls, collect evidence, monitor
          risks, and prepare for audits with confidence.
        </p>

        {/* CTA */}
        <div className="mt-12 flex ">
          <Link
            to="/book-demo"
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-full font-medium shadow-lg shadow-blue-200/60 transition cursor-pointer"
          >
            Book Demo
            <span className="text-xl">→</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap  gap-12 mt-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">500+</h3>
            <p className="text-sm text-gray-500 mt-1">Controls Managed</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-gray-900">300+</h3>
            <p className="text-sm text-gray-500 mt-1">Compliance Audits</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-gray-900">12+</h3>
            <p className="text-sm text-gray-500 mt-1">Frameworks Supported</p>
          </div>
        </div>

        {/* Supported Frameworks */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Supported Frameworks
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {frameworks.map((framework) => (
              <div
                key={framework.name}
                className="p-6 text-center"
              >
                <img
                  src={framework.logo}
                  alt={framework.name}
                  className="w-20 h-20 object-contain mx-auto mb-4"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
