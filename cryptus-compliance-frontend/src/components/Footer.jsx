import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaLinkedinIn, FaGithub, FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const footerLinks = {
  Product: [
    { label: "Features",   to: "/features"   },
    { label: "Frameworks", to: "/frameworks" },
    { label: "Book Demo",  to: "/book-demo"  },
    { label: "Security",   to: "#"           },
  ],
  Resources: [
    { label: "Documentation", to: "/resources" },
    { label: "Blog",          to: "#"          },
    { label: "Guides",        to: "/resources" },
    { label: "Help Center",   to: "#"          },
  ],
  Company: [
    { label: "About",          to: "#" },
    { label: "Contact",        to: "#" },
    { label: "Careers",        to: "#" },
    { label: "Privacy Policy", to: "#" },
  ],
};

const socials = [
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn"  },
  { icon: FaXTwitter,   href: "#", label: "X/Twitter" },
  { icon: FaInstagram,  href: "#", label: "Instagram"  },
];

const Footer = () => {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* ── Gradient glow top ───────────────────────── */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#155DFC]/60 to-transparent" />

      {/* ── Dark glass surface ──────────────────────── */}
      <div className="">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-10">

          {/* ── Grid ───────────────────────────────────── */}
          <div className="grid md:grid-cols-5 gap-12">

            {/* Brand */}
            <div className="md:col-span-2">
              <img src={logo} alt="Logo" className="h-10 object-contain" />

              <p className="mt-5 text-slate-600 leading-relaxed max-w-xs text-sm">
                Simplify compliance management, automate audits, manage evidence,
                and stay continuously compliant across multiple frameworks.
              </p>

              {/* Socials */}
              <div className="mt-8 flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600
                               border border-white/10 hover:border-indigo-400/60
                               hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
                  >
                    <Icon className="text-sm" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h3 className="text-black font-semibold text-sm uppercase tracking-wider mb-5">
                  {group}
                </h3>
                <ul className="space-y-3">
                  {links.map(({ label, to }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="text-slate-600 text-sm hover:text-indigo-400 transition-colors duration-200"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Bottom bar ─────────────────────────────── */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">
              © 2026 Cryptus Compliance. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm text-slate-500">
              {["Terms", "Privacy", "Cookies"].map((t) => (
                <a key={t} href="#" className="hover:text-indigo-400 transition-colors">
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;