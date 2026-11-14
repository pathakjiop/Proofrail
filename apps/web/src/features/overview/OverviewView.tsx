import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Layers,
  Shield,
  Fingerprint,
  Upload,
  Plus,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  FileText,
  Lock,
  GitBranch,
  ArrowRight,
  CircleDot,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { api } from '../../lib/api';

export const OverviewView: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'open' | 'review' | 'resolved'>('open');

  // Modal State for New Project and Upload SBOM
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  const findingsData = [
    {
      cve: 'CVE-2024-24576',
      description: 'Standard library command batch file...',
      component: 'tokio@1.37.0',
      severity: 'High',
      severityClass: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]',
      status: 'Open',
      statusClass: 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]',
    },
    {
      cve: 'CVE-2023-44487',
      description: 'HTTP/2 protocol allows a denial of...',
      component: 'axum@0.7.4',
      severity: 'Critical',
      severityClass: 'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]',
      status: 'In Review',
      statusClass: 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]',
    },
    {
      cve: 'CVE-2025-12345',
      description: 'Use of a weak cryptographic primitive...',
      component: 'openssl@3.2.1',
      severity: 'Medium',
      severityClass: 'bg-[#fef9c3] text-[#a16207] border-[#fef08a]',
      status: 'Open',
      statusClass: 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]',
    },
  ];

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    await api.createProject(
      projectName,
      projectDesc,
      `pkg:custom/${projectName.toLowerCase().replace(/\s+/g, '-')}`
    );
    setIsNewProjectOpen(false);
    setProjectName('');
    setProjectDesc('');
    navigate('/projects');
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
            Security Posture Overview
          </h1>
          <p className="text-[13px] text-[#6b7280] mt-0.5">
            Real-time supply chain security decisions, component coverage, and compliance evidence.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/sbom')}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 text-[12.5px] font-medium text-[#111827] bg-white border border-[#e5e7eb] rounded-[6px] hover:bg-[#f9fafb] transition-colors shadow-2xs"
          >
            <Upload size={14} className="text-[#4b5563]" />
            Upload SBOM
          </button>

          <button
            onClick={() => setIsNewProjectOpen(true)}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 text-[12.5px] font-semibold text-black bg-[#a3e635] hover:bg-[#84cc16] rounded-[6px] transition-colors shadow-xs"
          >
            <Plus size={14} className="stroke-[2.5]" />
            New Project
          </button>
        </div>
      </div>

      {/* 4 TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monitored Projects */}
        <div className="p-4 rounded-[8px] border border-[#e5e7eb] bg-white shadow-2xs">
          <div className="flex items-center gap-2 text-[#4b5563] text-[12.5px] font-medium mb-2.5">
            <Box size={16} className="text-[#111827]" />
            <span>Monitored Projects</span>
          </div>
          <div className="text-[28px] font-extrabold text-[#111827] tracking-tight leading-none mb-3">
            4
          </div>
          <div className="flex items-center gap-1 text-[11.5px] text-[#16a34a] font-medium">
            <CheckCircle2 size={13} className="shrink-0" />
            <span>All releases tracked</span>
          </div>
        </div>

        {/* Card 2: Components Tracked */}
        <div className="p-4 rounded-[8px] border border-[#e5e7eb] bg-white shadow-2xs">
          <div className="flex items-center gap-2 text-[#4b5563] text-[12.5px] font-medium mb-2.5">
            <Layers size={16} className="text-[#111827]" />
            <span>Components Tracked</span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[28px] font-extrabold text-[#111827] tracking-tight leading-none">
              1,284
            </span>
            <span className="text-[11px] font-semibold text-[#65a30d] bg-[#ecfccb] px-1.5 py-0.5 rounded">
              ↑ +12%
            </span>
          </div>
          <div className="text-[11.5px] text-[#6b7280]">
            Across 12 release SBOMs
          </div>
        </div>

        {/* Card 3: Open Findings */}
        <div className="p-4 rounded-[8px] border border-[#e5e7eb] bg-white shadow-2xs">
          <div className="flex items-center gap-2 text-[#4b5563] text-[12.5px] font-medium mb-2.5">
            <Shield size={16} className="text-[#111827]" />
            <span>Open Findings</span>
          </div>
          <div className="text-[28px] font-extrabold text-[#111827] tracking-tight leading-none mb-3">
            18
          </div>
          <div className="text-[11.5px] text-[#111827] font-medium">
            <span className="text-[#dc2626] font-semibold">2 Critical</span> • <span className="text-[#d97706] font-semibold">5 High</span>
          </div>
        </div>

        {/* Card 4: Evidence Packages */}
        <div className="p-4 rounded-[8px] border border-[#e5e7eb] bg-white shadow-2xs">
          <div className="flex items-center gap-2 text-[#4b5563] text-[12.5px] font-medium mb-2.5">
            <Fingerprint size={16} className="text-[#111827]" />
            <span>Evidence Packages</span>
          </div>
          <div className="text-[28px] font-extrabold text-[#111827] tracking-tight leading-none mb-3">
            6
          </div>
          <div className="flex items-center gap-1 text-[11.5px] text-[#16a34a] font-medium">
            <CheckCircle2 size={13} className="shrink-0" />
            <span>SHA-256 verified</span>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Vulnerability Findings & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Vulnerability Findings (Col-span 7 or 8) */}
        <div className="lg:col-span-7 rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield size={17} className="text-[#111827]" />
                <h2 className="text-[14.5px] font-bold text-[#111827]">
                  Vulnerability Findings
                </h2>
              </div>
              <button
                onClick={() => navigate('/vulnerabilities')}
                className="text-[12px] font-semibold text-[#111827] hover:text-[#6b7280] flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight size={13} />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4 border-b border-[#f0f0f0] mb-3 text-[12px]">
              <button
                onClick={() => setActiveTab('open')}
                className={`pb-2 font-semibold transition-colors ${
                  activeTab === 'open'
                    ? 'text-[#111827] border-b-2 border-[#111827]'
                    : 'text-[#6b7280] hover:text-[#111827]'
                }`}
              >
                Open (18)
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className={`pb-2 font-semibold transition-colors ${
                  activeTab === 'review'
                    ? 'text-[#111827] border-b-2 border-[#111827]'
                    : 'text-[#6b7280] hover:text-[#111827]'
                }`}
              >
                In Review (4)
              </button>
              <button
                onClick={() => setActiveTab('resolved')}
                className={`pb-2 font-semibold transition-colors ${
                  activeTab === 'resolved'
                    ? 'text-[#111827] border-b-2 border-[#111827]'
                    : 'text-[#6b7280] hover:text-[#111827]'
                }`}
              >
                Resolved (27)
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                    <th className="pb-2.5 font-semibold">CVE ID</th>
                    <th className="pb-2.5 font-semibold">DESCRIPTION</th>
                    <th className="pb-2.5 font-semibold">COMPONENT</th>
                    <th className="pb-2.5 font-semibold">SEVERITY</th>
                    <th className="pb-2.5 font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody className="text-[12px] divide-y divide-[#f5f5f5]">
                  {findingsData.map((f, idx) => (
                    <tr
                      key={idx}
                      onClick={() => navigate('/vulnerabilities')}
                      className="hover:bg-[#fbfbfc] cursor-pointer transition-colors"
                    >
                      <td className="py-3 font-mono font-bold text-[#111827] text-[12px]">
                        {f.cve}
                      </td>
                      <td className="py-3 text-[#4b5563] max-w-[200px] truncate pr-2">
                        {f.description}
                      </td>
                      <td className="py-3 font-mono text-[#4b5563] text-[11.5px]">
                        {f.component}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-[4px] border ${f.severityClass}`}
                        >
                          {f.severity}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-[4px] border ${f.statusClass}`}
                        >
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Card: Active Projects (Col-span 5) */}
        <div className="lg:col-span-5 rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers size={17} className="text-[#111827]" />
                <h2 className="text-[14.5px] font-bold text-[#111827]">
                  Active Projects
                </h2>
              </div>
              <button
                onClick={() => navigate('/projects')}
                className="text-[12px] font-semibold text-[#111827] hover:text-[#6b7280] flex items-center gap-1 transition-colors"
              >
                Manage Projects <ArrowRight size={13} />
              </button>
            </div>

            {/* Project Items */}
            <div className="space-y-3.5">
              {/* Item 1 */}
              <div
                onClick={() => navigate('/projects')}
                className="p-3 rounded-[6px] border border-[#f0f0f0] hover:border-[#e5e7eb] hover:bg-[#fbfbfc] transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[13px] text-[#111827]">
                    Cloud Gateway API
                  </div>
                  <div className="text-[11.5px] text-[#6b7280] mt-0.5">
                    Enterprise API gateway and security proxy
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-[#6b7280]">
                    <GitBranch size={12} /> main
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#15803d] bg-[#dcfce7] border border-[#bbf7d0] px-2 py-0.5 rounded-[4px]">
                    <CheckCircle2 size={11} /> Ready
                  </span>
                </div>
              </div>

              {/* Item 2 */}
              <div
                onClick={() => navigate('/projects')}
                className="p-3 rounded-[6px] border border-[#f0f0f0] hover:border-[#e5e7eb] hover:bg-[#fbfbfc] transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[13px] text-[#111827]">
                    Identity Service
                  </div>
                  <div className="text-[11.5px] text-[#6b7280] mt-0.5">
                    Authentication and identity management
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-[#6b7280]">
                    <GitBranch size={12} /> main
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#b91c1c] bg-[#fee2e2] border border-[#fecaca] px-2 py-0.5 rounded-[4px]">
                    <AlertCircle size={11} /> 1 Finding
                  </span>
                </div>
              </div>

              {/* Item 3 */}
              <div
                onClick={() => navigate('/projects')}
                className="p-3 rounded-[6px] border border-[#f0f0f0] hover:border-[#e5e7eb] hover:bg-[#fbfbfc] transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[13px] text-[#111827]">
                    Billing Worker
                  </div>
                  <div className="text-[11.5px] text-[#6b7280] mt-0.5">
                    Background jobs and billing processing
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-[#6b7280]">
                    <GitBranch size={12} /> release
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#15803d] bg-[#dcfce7] border border-[#bbf7d0] px-2 py-0.5 rounded-[4px]">
                    <CheckCircle2 size={11} /> Clean
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Evidence Integrity & CRA Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Evidence Integrity (Col-span 7 or 8) */}
        <div className="lg:col-span-7 rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Fingerprint size={17} className="text-[#111827]" />
              <h2 className="text-[14.5px] font-bold text-[#111827]">
                Evidence Integrity
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#15803d] bg-[#dcfce7] px-2.5 py-0.5 rounded-full">
                ● All checks passing
              </span>
              <span className="flex items-center gap-1 text-[11.5px] text-[#6b7280]">
                <RotateCw size={12} /> Last synced 4 min ago
              </span>
            </div>
          </div>

          {/* 3 Sub-Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Sub-card 1 */}
            <div className="p-3 rounded-[6px] border border-[#f0f0f0] bg-[#fafafa]">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#111827] mb-2">
                <FileText size={15} className="text-[#4b5563]" />
                <span>SBOM Ingestion</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#16a34a] font-medium">
                <CheckCircle2 size={12} />
                <span>CycloneDX + SPDX parsed</span>
              </div>
            </div>

            {/* Sub-card 2 */}
            <div className="p-3 rounded-[6px] border border-[#f0f0f0] bg-[#fafafa]">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#111827] mb-2">
                <Layers size={15} className="text-[#4b5563]" />
                <span>VEX Decisions</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#16a34a] font-medium">
                <CheckCircle2 size={12} />
                <span>Justifications recorded</span>
              </div>
            </div>

            {/* Sub-card 3 */}
            <div className="p-3 rounded-[6px] border border-[#f0f0f0] bg-[#fafafa]">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#111827] mb-2">
                <Lock size={15} className="text-[#4b5563]" />
                <span>Release Seal</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#16a34a] font-medium">
                <CheckCircle2 size={12} />
                <span>SHA-256 manifest verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: CRA Readiness (Col-span 5) */}
        <div className="lg:col-span-5 rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CircleDot size={17} className="text-[#111827]" />
                <h2 className="text-[14.5px] font-bold text-[#111827]">
                  CRA Readiness
                </h2>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#f3f4f6] text-[#4b5563]">
                Beta
              </span>
            </div>

            {/* Description */}
            <p className="text-[12px] text-[#6b7280] leading-relaxed mb-4">
              Track and organize the technical evidence required for the EU Cyber Resilience Act (CRA).
            </p>

            {/* Progress Bar & Percentage */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#a3e635] rounded-full transition-all duration-500"
                    style={{ width: '92%' }}
                  />
                </div>
                <span className="font-extrabold text-[14px] text-[#111827]">
                  92%
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11.5px] text-[#6b7280]">
                Readiness Score
              </span>
              <button
                onClick={() => navigate('/cra-readiness')}
                className="inline-flex items-center gap-1 px-3 py-1 text-[11.5px] font-semibold text-[#111827] bg-white border border-[#e5e7eb] rounded-[5px] hover:bg-[#f9fafb] transition-colors"
              >
                View CRA Checklist <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      <Modal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        title="Create New Project"
        description="Add a new repository or service to VulnLedger supply chain tracking."
      >
        <form onSubmit={handleCreateProject} className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Project Name <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Billing Worker"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full h-8 px-2.5 text-[12px] border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Background jobs and billing processing..."
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full p-2 text-[12px] border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e5e7eb]">
            <Button variant="secondary" onClick={() => setIsNewProjectOpen(false)}>
              Cancel
            </Button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-[12.5px] font-semibold text-black bg-[#a3e635] hover:bg-[#84cc16] rounded-[4px] transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
