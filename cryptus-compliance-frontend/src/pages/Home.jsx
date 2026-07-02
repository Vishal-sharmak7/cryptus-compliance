import React from "react";

function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      
      {/* Hero Section */}
      <section className="text-center py-20">
        <span className="inline-block px-4 py-1 text-sm font-medium border rounded-full">
          Compliance Management Platform
        </span>

        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
          Simplify Compliance <br />
          Without The Chaos
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-gray-500 text-lg">
          Manage frameworks, controls, evidence, audits and compliance
          progress from a single platform.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="px-6 py-3 rounded-lg bg-black text-white">
            Get Started
          </button>

          <button className="px-6 py-3 rounded-lg border">
            View Demo
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid md:grid-cols-4 gap-6 py-16">
        <div className="border rounded-xl p-6">
          <h3 className="text-3xl font-bold">98%</h3>
          <p className="text-gray-500 mt-2">Compliance Score</p>
        </div>

        <div className="border rounded-xl p-6">
          <h3 className="text-3xl font-bold">120+</h3>
          <p className="text-gray-500 mt-2">Controls Managed</p>
        </div>

        <div className="border rounded-xl p-6">
          <h3 className="text-3xl font-bold">250+</h3>
          <p className="text-gray-500 mt-2">Evidence Files</p>
        </div>

        <div className="border rounded-xl p-6">
          <h3 className="text-3xl font-bold">15+</h3>
          <p className="text-gray-500 mt-2">Active Audits</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold">
            Everything You Need For Compliance
          </h2>

          <p className="mt-4 text-gray-500">
            Built to manage controls, evidence and audits efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-xl p-6">
            <h3 className="font-semibold text-xl">
              Framework Management
            </h3>
            <p className="text-gray-500 mt-3">
              Track ISO 27001, SOC 2, GDPR and other frameworks.
            </p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold text-xl">
              Evidence Collection
            </h3>
            <p className="text-gray-500 mt-3">
              Upload and organize audit evidence securely.
            </p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold text-xl">
              Audit Tracking
            </h3>
            <p className="text-gray-500 mt-3">
              Monitor findings, remediation and audit readiness.
            </p>
          </div>
        </div>
      </section>

      {/* Compliance Flow */}
      <section className="py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            Compliance Workflow
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="border rounded-xl p-6">
            <h3 className="font-semibold">Framework</h3>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold">Controls</h3>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold">Evidence</h3>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold">Audit</h3>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center border rounded-2xl">
        <h2 className="text-4xl font-bold">
          Stay Audit Ready
        </h2>

        <p className="mt-4 text-gray-500">
          Centralize compliance operations and reduce audit effort.
        </p>

        <button className="mt-8 px-6 py-3 rounded-lg bg-black text-white">
          Start Managing Compliance
        </button>
      </section>

    </main>
  );
}

export default Home;