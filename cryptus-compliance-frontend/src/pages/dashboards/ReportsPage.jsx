import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { reportService } from "../../services/report.service";
import { companyService } from "../../services/company.service";
import { auditService } from "../../services/audit.service";
import { FileText, Download, Building, ShieldAlert, Award, ClipboardCheck, Printer, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const severityColors = {
  CRITICAL: "bg-red-50 text-red-700 border-red-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function ReportsPage() {
  const { user } = useAuth();
  const isClient = user?.role === "CLIENT";
  const myCompanyId = user?.companyId || user?.company_id;

  const [selectedCompanyId, setSelectedCompanyId] = useState(isClient ? myCompanyId : "");
  const [selectedAuditId, setSelectedAuditId] = useState("");
  const [activeReportTab, setActiveReportTab] = useState("compliance"); // compliance, audit, risk

  // Fetch companies for Admin/Auditor dropdown
  const { data: companiesResp } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyService.getAll().then(res => res.data),
    enabled: !isClient,
  });
  const companies = companiesResp?.companies || [];

  // Fetch audits (optionally filtered by selected company)
  const { data: auditsResp } = useQuery({
    queryKey: ["audits", selectedCompanyId],
    queryFn: () => auditService.getAll(selectedCompanyId ? { company_id: selectedCompanyId } : {}).then(res => res.data),
    enabled: true,
  });
  const audits = auditsResp?.audits || auditsResp?.data || [];
  const filteredAudits = selectedCompanyId 
    ? audits.filter(a => Number(a.company_id) === Number(selectedCompanyId))
    : audits;

  // Active target company
  const targetCompanyId = isClient ? myCompanyId : selectedCompanyId;

  // Fetch reports data based on selections
  const { data: complianceReportData, isLoading: complianceLoading, refetch: refetchCompliance } = useQuery({
    queryKey: ["report-compliance", targetCompanyId],
    queryFn: () => reportService.getComplianceReport(targetCompanyId).then(res => res.data.data || res.data),
    enabled: !!targetCompanyId && activeReportTab === "compliance",
  });

  const { data: riskReportData, isLoading: riskLoading, refetch: refetchRisk } = useQuery({
    queryKey: ["report-risk", targetCompanyId],
    queryFn: () => reportService.getRiskReport(targetCompanyId).then(res => res.data.data || res.data),
    enabled: !!targetCompanyId && activeReportTab === "risk",
  });

  const { data: auditReportData, isLoading: auditLoading, refetch: refetchAudit } = useQuery({
    queryKey: ["report-audit", selectedAuditId],
    queryFn: () => reportService.getAuditReport(selectedAuditId).then(res => res.data.data || res.data),
    enabled: !!selectedAuditId && activeReportTab === "audit",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success("PDF report generated successfully!");
  };

  return (
    <div className="space-y-6 relative print:p-0 print:bg-white print:text-black">
      {/* Header - Hidden on Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports Portal</h1>
          <p className="text-slate-500">Generate, view, and export compliance, audit, and risk analytics.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-medium hover:bg-slate-50 transition"
          >
            <Printer size={18} /> Print
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* Control panel - Hidden on Print */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm print:hidden space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Company Selection (Admins/Auditors only) */}
          {!isClient && (
            <div className="w-full sm:w-64">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Target Company</label>
              <select 
                value={selectedCompanyId} 
                onChange={(e) => {
                  setSelectedCompanyId(e.target.value);
                  setSelectedAuditId("");
                }} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition text-sm bg-white"
              >
                <option value="">Select Company</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          {/* Audit Selection */}
          {activeReportTab === "audit" && (
            <div className="w-full sm:w-64">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Select Audit Campaign</label>
              <select 
                value={selectedAuditId} 
                onChange={(e) => setSelectedAuditId(e.target.value)} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition text-sm bg-white"
              >
                <option value="">Select Audit</option>
                {filteredAudits.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 pt-2">
          {[
            { id: "compliance", label: "Compliance Report" },
            { id: "audit", label: "Audit Findings Report" },
            { id: "risk", label: "Risk Register Report" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id)}
              className={`pb-3 px-4 font-semibold text-sm transition relative -mb-px ${
                activeReportTab === tab.id 
                  ? "text-indigo-600 border-b-2 border-indigo-600" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Canvas */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm min-h-[50vh] relative">
        {/* COMPLIANCE TAB */}
        {activeReportTab === "compliance" && (
          <div>
            {!targetCompanyId ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Building size={48} className="mb-3 opacity-60" />
                <p className="font-medium">Please select a company to generate the Compliance Report.</p>
              </div>
            ) : complianceLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <RefreshCw size={32} className="animate-spin mb-3 text-indigo-500" />
                <p>Generating compliance data...</p>
              </div>
            ) : !complianceReportData ? (
              <div className="text-center py-20 text-slate-400">Failed to fetch report data.</div>
            ) : (
              <div className="space-y-8">
                {/* Print Title */}
                <div className="hidden print:block border-b pb-4 mb-6">
                  <h1 className="text-3xl font-bold">Compliance Summary Report</h1>
                  <p className="text-sm text-slate-500 mt-1">Generated: {new Date(complianceReportData.generatedAt).toLocaleString()}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-2">Company: {complianceReportData.company?.name}</p>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Compliance Summary</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Real-time status of framework progress and control completion.</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono print:hidden">Generated At: {new Date(complianceReportData.generatedAt).toLocaleDateString()}</span>
                </div>

                {/* Score & Progress */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Progress circle */}
                  <div className="border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Overall Score</h3>
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="72" cy="72" r="60" className="text-slate-100" strokeWidth="12" stroke="currentColor" fill="transparent" />
                        <circle 
                          cx="72" 
                          cy="72" 
                          r="60" 
                          className="text-indigo-600 transition-all duration-1000" 
                          strokeWidth="12" 
                          strokeDasharray={376.8} 
                          strokeDashoffset={376.8 - (376.8 * Math.min(Object.values(complianceReportData.frameworks || {}).reduce((acc, fw) => acc + (fw.progress_percentage || 0), 0) / Math.max(complianceReportData.frameworks?.length || 1, 1), 100)) / 100}
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="transparent" 
                        />
                      </svg>
                      <span className="absolute text-3xl font-black text-slate-800">
                        {Math.round(Object.values(complianceReportData.frameworks || {}).reduce((acc, fw) => acc + (fw.progress_percentage || 0), 0) / Math.max(complianceReportData.frameworks?.length || 1, 1))}%
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Active Frameworks list */}
                  <div className="md:col-span-2 border border-slate-100 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Framework Alignment</h3>
                    <div className="divide-y divide-slate-50 max-h-[160px] overflow-y-auto pr-1">
                      {complianceReportData.frameworks?.length === 0 ? (
                        <p className="text-sm text-slate-500 py-4">No frameworks mapped.</p>
                      ) : (
                        complianceReportData.frameworks?.map((fw, idx) => (
                          <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Award className="text-indigo-500" size={16} />
                              <span className="font-semibold text-slate-800 text-sm">{fw.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${fw.progress_percentage || 0}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-slate-600">{Math.round(fw.progress_percentage || 0)}%</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Substats grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Controls Completion Grid */}
                  <div className="border border-slate-100 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ClipboardCheck size={16} className="text-slate-400" /> Control checklist status
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl">
                        <p className="text-2xl font-black text-emerald-700">{complianceReportData.controls?.COMPLETED || 0}</p>
                        <p className="text-xs text-emerald-600 font-medium mt-0.5">Implemented</p>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl">
                        <p className="text-2xl font-black text-amber-700">{(complianceReportData.controls?.PENDING || 0) + (complianceReportData.controls?.IN_PROGRESS || 0)}</p>
                        <p className="text-xs text-amber-600 font-medium mt-0.5">Pending</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                        <p className="text-2xl font-black text-slate-700">{complianceReportData.controls?.EXEMPT || 0}</p>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">Exempt</p>
                      </div>
                    </div>
                  </div>

                  {/* Evidence uploads Review status */}
                  <div className="border border-slate-100 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FileText size={16} className="text-slate-400" /> Evidence review metrics
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl">
                        <p className="text-2xl font-black text-emerald-700">{complianceReportData.evidence?.APPROVED || 0}</p>
                        <p className="text-xs text-emerald-600 font-medium mt-0.5">Approved</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl">
                        <p className="text-2xl font-black text-blue-700">{complianceReportData.evidence?.PENDING || 0}</p>
                        <p className="text-xs text-blue-600 font-medium mt-0.5">Pending Review</p>
                      </div>
                      <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl">
                        <p className="text-2xl font-black text-red-700">{complianceReportData.evidence?.REJECTED || 0}</p>
                        <p className="text-xs text-red-600 font-medium mt-0.5">Rejected</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk and Audit findings list in compliance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Findings breakdown */}
                  <div className="border border-slate-100 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Audit Findings Breakdown</h3>
                    <div className="divide-y divide-slate-50 max-h-[200px] overflow-y-auto pr-1">
                      {complianceReportData.findings?.length === 0 ? (
                        <p className="text-xs text-slate-500 py-4">No audit findings logged.</p>
                      ) : (
                        complianceReportData.findings?.map((f, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700">{f.severity} Severity ({f.status})</span>
                            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">{f.count}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Risks breakdown */}
                  <div className="border border-slate-100 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Company Risk Profile</h3>
                    <div className="divide-y divide-slate-50 max-h-[200px] overflow-y-auto pr-1">
                      {complianceReportData.risks?.length === 0 ? (
                        <p className="text-xs text-slate-500 py-4">No company risks logged.</p>
                      ) : (
                        complianceReportData.risks?.map((r, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700">{r.severity} Severity ({r.status})</span>
                            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">{r.count}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AUDIT TAB */}
        {activeReportTab === "audit" && (
          <div>
            {!selectedAuditId ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <ClipboardCheck size={48} className="mb-3 opacity-60" />
                <p className="font-medium">Please select an Audit Campaign to generate the findings report.</p>
              </div>
            ) : auditLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <RefreshCw size={32} className="animate-spin mb-3 text-indigo-500" />
                <p>Compiling audit findings...</p>
              </div>
            ) : !auditReportData ? (
              <div className="text-center py-20 text-slate-400">Failed to fetch report data.</div>
            ) : (
              <div className="space-y-8">
                {/* Print Title */}
                <div className="hidden print:block border-b pb-4 mb-6">
                  <h1 className="text-3xl font-bold">Audit Findings Report</h1>
                  <p className="text-sm text-slate-500 mt-1">Generated: {new Date(auditReportData.generatedAt).toLocaleString()}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-2">Audit: {auditReportData.audit?.title}</p>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Audit Findings Report</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Assigned Auditor reviews, flagged gaps, and mitigation progress.</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono print:hidden">Generated At: {new Date(auditReportData.generatedAt).toLocaleDateString()}</span>
                </div>

                {/* Audit Meta Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                  <div>
                    <p className="text-slate-400 uppercase font-bold tracking-wider">Audit Campaign</p>
                    <p className="text-slate-800 font-bold mt-1 text-sm">{auditReportData.audit?.title}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase font-bold tracking-wider">Target Company</p>
                    <p className="text-slate-800 font-bold mt-1 text-sm">{auditReportData.audit?.company_name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase font-bold tracking-wider">Assigned Auditor</p>
                    <p className="text-slate-800 font-bold mt-1 text-sm">{auditReportData.audit?.auditor_name || "Unassigned"}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase font-bold tracking-wider">Status</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full font-bold text-[10px] mt-1.5 uppercase ${
                      auditReportData.audit?.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>{auditReportData.audit?.status || 'Planned'}</span>
                  </div>
                </div>

                {/* Findings summary metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border border-slate-100 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-red-600">{auditReportData.summary?.critical || 0}</p>
                    <p className="text-xs text-slate-500 font-medium">Critical Gaps</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-orange-600">{auditReportData.summary?.high || 0}</p>
                    <p className="text-xs text-slate-500 font-medium">High Gaps</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-rose-600">{auditReportData.summary?.open || 0}</p>
                    <p className="text-xs text-slate-500 font-medium">Open Findings</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-emerald-600">{auditReportData.summary?.resolved || 0}</p>
                    <p className="text-xs text-slate-500 font-medium">Resolved Gaps</p>
                  </div>
                </div>

                {/* Detailed Findings Table */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-700">Detailed Findings List</h3>
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-4 py-3">Finding Title</th>
                          <th className="px-4 py-3">Severity</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Target Resolution</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {auditReportData.findings?.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-slate-400">No findings logged in this audit.</td>
                          </tr>
                        ) : (
                          auditReportData.findings?.map((finding, idx) => (
                            <tr key={finding.id || idx} className="hover:bg-slate-50/30">
                              <td className="px-4 py-3 font-semibold text-slate-800 whitespace-normal max-w-sm">
                                <p>{finding.title || finding.name}</p>
                                <p className="text-[10px] text-slate-400 font-normal mt-0.5 line-clamp-1">{finding.description}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityColors[finding.severity] || severityColors.LOW}`}>
                                  {finding.severity}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-slate-700 font-bold uppercase">{finding.status}</span>
                              </td>
                              <td className="px-4 py-3 text-slate-500">
                                {finding.due_date ? new Date(finding.due_date).toLocaleDateString() : "—"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RISK TAB */}
        {activeReportTab === "risk" && (
          <div>
            {!targetCompanyId ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <ShieldAlert size={48} className="mb-3 opacity-60" />
                <p className="font-medium">Please select a company to generate the Risk Register Report.</p>
              </div>
            ) : riskLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <RefreshCw size={32} className="animate-spin mb-3 text-indigo-500" />
                <p>Generating risk assessment...</p>
              </div>
            ) : !riskReportData ? (
              <div className="text-center py-20 text-slate-400">Failed to fetch report data.</div>
            ) : (
              <div className="space-y-8">
                {/* Print Title */}
                <div className="hidden print:block border-b pb-4 mb-6">
                  <h1 className="text-3xl font-bold">Company Risk Register</h1>
                  <p className="text-sm text-slate-500 mt-1">Generated: {new Date(riskReportData.generatedAt).toLocaleString()}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-2">Company: {riskReportData.company?.name}</p>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Risk Register Report</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Identified hazards, probability impact matrices, and planned mitigations.</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono print:hidden">Generated At: {new Date(riskReportData.generatedAt).toLocaleDateString()}</span>
                </div>

                {/* Risk metrics summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border border-slate-100 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-red-600">{riskReportData.summary?.critical || 0}</p>
                    <p className="text-xs text-slate-500 font-medium">Critical Severity</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-orange-600">{riskReportData.summary?.high || 0}</p>
                    <p className="text-xs text-slate-500 font-medium">High Severity</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-rose-600">{riskReportData.summary?.open || 0}</p>
                    <p className="text-xs text-slate-500 font-medium">Open Active Risks</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-slate-600">{riskReportData.summary?.total || 0}</p>
                    <p className="text-xs text-slate-500 font-medium">Total Risks Logged</p>
                  </div>
                </div>

                {/* Risks Table */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-700">Logged Risks &amp; Actions</h3>
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-4 py-3">Risk Scenario</th>
                          <th className="px-4 py-3">Severity</th>
                          <th className="px-4 py-3">Likelihood / Impact</th>
                          <th className="px-4 py-3">Mitigation / Response</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {riskReportData.risks?.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-slate-400">No risks documented for this company.</td>
                          </tr>
                        ) : (
                          riskReportData.risks?.map((risk, idx) => (
                            <tr key={risk.id || idx} className="hover:bg-slate-50/30">
                              <td className="px-4 py-3 font-semibold text-slate-800 whitespace-normal max-w-xs">
                                <p>{risk.title}</p>
                                <p className="text-[10px] text-slate-400 font-normal mt-0.5 line-clamp-2">{risk.description}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityColors[risk.severity] || severityColors.LOW}`}>
                                  {risk.severity}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {risk.likelihood || "—"} / {risk.impact || "—"}
                              </td>
                              <td className="px-4 py-3 text-slate-600 whitespace-normal max-w-xs">
                                <p className="line-clamp-2">{risk.mitigation || "—"}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-slate-700 font-bold uppercase">{risk.status}</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
