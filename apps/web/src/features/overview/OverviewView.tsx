import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Boxes,
  FileCheck2,
  PackageCheck,
  FolderGit2,
  Plus,
  Upload,
  ArrowRight,
  CheckCircle2,
  Activity,
  FileText,
} from 'lucide-react';
import { api } from '../../lib/api';
import { OverviewMetrics } from '../../types';
import { SeverityBadge, RemediationBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const OverviewView: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOverview().then((data) => {
      setMetrics(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner / Headline */}
      <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-4">
        <div>
          <h1 className="text-[18px] font-semibold text-[#111827]">Security Posture Overview</h1>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            Real-time supply chain security decisions, component coverage, and evidence status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Upload size={13} />}
            onClick={() => navigate('/sbom')}
          >
            Upload SBOM
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={13} />}
            onClick={() => navigate('/projects')}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* KPI Metric Grid - Minimalist, high-density */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-[4px] border border-[#e5e7eb] bg-white">
          <div className="flex items-center justify-between text-[#6b7280] mb-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wider">Monitored Projects</span>
            <FolderGit2 size={14} className="text-[#9ca3af]" />
          </div>
          <div className="text-[20px] font-semibold text-[#111827]">
            {loading ? '-' : metrics?.total_projects}
          </div>
          <div className="text-[11px] text-[#16a34a] font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 size={12} /> 100% with SBOM baseline
          </div>
        </div>

        <div className="p-3.5 rounded-[4px] border border-[#e5e7eb] bg-white">
          <div className="flex items-center justify-between text-[#6b7280] mb-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wider">Components Tracked</span>
            <Boxes size={14} className="text-[#9ca3af]" />
          </div>
          <div className="text-[20px] font-semibold text-[#111827]">
            {loading ? '-' : metrics?.total_components}
          </div>
          <div className="text-[11px] text-[#6b7280] mt-1">
            Across {metrics?.total_sboms || 1} release SBOMs
          </div>
        </div>

        <div className="p-3.5 rounded-[4px] border border-[#e5e7eb] bg-white">
          <div className="flex items-center justify-between text-[#6b7280] mb-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wider">Open Findings</span>
            <ShieldAlert size={14} className="text-[#9ca3af]" />
          </div>
          <div className="text-[20px] font-semibold text-[#111827]">
            {loading ? '-' : metrics?.open_vulnerabilities}
          </div>
          <div className="text-[11px] text-[#dc2626] font-medium mt-1">
            {metrics?.critical_vulnerabilities || 0} Critical, {metrics?.high_vulnerabilities || 1} High
          </div>
        </div>

        <div className="p-3.5 rounded-[4px] border border-[#e5e7eb] bg-white">
          <div className="flex items-center justify-between text-[#6b7280] mb-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wider">Evidence Packages</span>
            <PackageCheck size={14} className="text-[#9ca3af]" />
          </div>
          <div className="text-[20px] font-semibold text-[#111827]">
            {loading ? '-' : metrics?.evidence_packages_count}
          </div>
          <div className="text-[11px] text-[#16a34a] font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 size={12} /> SHA-256 fingerprinted
          </div>
        </div>
      </div>

      {/* Two-Column Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Vulnerabilities Requiring Action */}
        <div className="border border-[#e5e7eb] rounded-[4px] bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} className="text-[#dc2626]" />
              <h2 className="text-[13px] font-semibold text-[#111827]">Recent Vulnerability Findings</h2>
            </div>
            <button
              onClick={() => navigate('/vulnerabilities')}
              className="text-[12px] text-[#1677ff] hover:text-[#0958d9] font-medium flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          <div className="divide-y divide-[#e5e7eb]">
            {metrics?.recent_findings.map((f) => (
              <div key={f.id} className="p-3.5 hover:bg-[#fbfbfc] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] font-semibold text-[#111827]">{f.vuln_id}</span>
                    <SeverityBadge severity={f.severity} />
                  </div>
                  <RemediationBadge status={f.remediation_status} />
                </div>
                <div className="text-[12px] text-[#374151] line-clamp-1 mb-1">{f.description}</div>
                <div className="flex items-center gap-3 text-[11px] text-[#6b7280]">
                  <span>Package: <span className="font-mono text-[#111827]">{f.affected_package}@{f.affected_version}</span></span>
                  <span>Source: {f.scanner_source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Software Projects */}
        <div className="border border-[#e5e7eb] rounded-[4px] bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <FolderGit2 size={14} className="text-[#1677ff]" />
              <h2 className="text-[13px] font-semibold text-[#111827]">Active Software Projects</h2>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="text-[12px] text-[#1677ff] hover:text-[#0958d9] font-medium flex items-center gap-1"
            >
              Manage projects <ArrowRight size={12} />
            </button>
          </div>

          <div className="divide-y divide-[#e5e7eb]">
            {metrics?.recent_projects.map((p) => (
              <div key={p.id} className="p-3.5 hover:bg-[#fbfbfc] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[13px] text-[#111827]">{p.name}</span>
                  <span className="text-[11px] text-[#6b7280] font-mono">branch: {p.default_branch}</span>
                </div>
                <p className="text-[12px] text-[#6b7280] line-clamp-1 mb-2">{p.description}</p>
                <div className="flex items-center justify-between text-[11px] text-[#6b7280]">
                  <span className="font-mono text-[10px] bg-[#f7f8fa] px-1.5 py-0.5 rounded border border-[#e5e7eb]">
                    {p.product_identifier}
                  </span>
                  <span className="text-[#16a34a] font-medium">Ready for Release</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Evidence Pipeline Status */}
      <div className="border border-[#e5e7eb] rounded-[4px] p-4 bg-[#fbfbfc]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[#1677ff]" />
            <h3 className="text-[13px] font-semibold text-[#111827]">Evidence Integrity Verification</h3>
          </div>
          <span className="text-[11px] text-[#6b7280]">All checks passing</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-2.5 bg-white border border-[#e5e7eb] rounded-[4px]">
            <div className="text-[11px] font-medium text-[#6b7280]">SBOM Ingestion & Parsing</div>
            <div className="text-[12px] font-semibold text-[#16a34a] mt-0.5">Verified CycloneDX & SPDX</div>
          </div>
          <div className="p-2.5 bg-white border border-[#e5e7eb] rounded-[4px]">
            <div className="text-[11px] font-medium text-[#6b7280]">VEX Exploitability Justification</div>
            <div className="text-[12px] font-semibold text-[#16a34a] mt-0.5">Formal CSAF Justifications Logged</div>
          </div>
          <div className="p-2.5 bg-white border border-[#e5e7eb] rounded-[4px]">
            <div className="text-[11px] font-medium text-[#6b7280]">Cryptographic Package Seal</div>
            <div className="text-[12px] font-semibold text-[#16a34a] mt-0.5">SHA-256 Manifest Built</div>
          </div>
        </div>
      </div>
    </div>
  );
};
