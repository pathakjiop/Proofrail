import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Search,
  ExternalLink,
  FileCheck2,
  Filter,
} from 'lucide-react';
import { api } from '../../lib/api';
import { VulnerabilityFinding } from '../../types';
import { SeverityBadge, RemediationBadge } from '../../components/common/Badge';

export const VulnerabilitiesView: React.FC = () => {
  const navigate = useNavigate();
  const [findings, setFindings] = useState<VulnerabilityFinding[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFinding, setSelectedFinding] = useState<VulnerabilityFinding | null>(null);

  useEffect(() => {
    api.getFindings().then((data) => {
      setFindings(data);
      if (data.length > 0) setSelectedFinding(data[0]);
    });
  }, []);

  const filteredFindings = findings.filter((f) => {
    const matchesSearch =
      f.vuln_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.affected_package.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      severityFilter === 'all' || f.severity === severityFilter;

    const matchesStatus =
      statusFilter === 'all' || f.remediation_status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
            Vulnerability Findings
          </h1>
          <p className="text-[13px] text-[#6b7280] mt-0.5">
            Correlated CVEs, advisories, and scanner detections mapped to specific releases and components.
          </p>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-[#e5e7eb] rounded-[8px] shadow-2xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search CVE, package name, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-7 pr-3 text-[12px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px] focus:outline-none focus:border-[#111827] focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="h-8 px-2.5 text-[12px] bg-white border border-[#e5e7eb] rounded-[6px] text-[#374151] focus:outline-none focus:border-[#111827]"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 text-[12px] bg-white border border-[#e5e7eb] rounded-[6px] text-[#374151] focus:outline-none focus:border-[#111827]"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="mitigated">Mitigated</option>
            <option value="under_review">In Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Findings Table (Col 7 or 8) */}
        <div className="lg:col-span-7 rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider pb-2.5 border-b border-[#f0f0f0]">
                  <th className="pb-2.5">CVE ID</th>
                  <th className="pb-2.5">SEVERITY</th>
                  <th className="pb-2.5">COMPONENT</th>
                  <th className="pb-2.5">STATUS</th>
                  <th className="pb-2.5">SCANNER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f5] text-[12px]">
                {filteredFindings.map((f) => {
                  const isSelected = selectedFinding?.id === f.id;
                  return (
                    <tr
                      key={f.id}
                      onClick={() => setSelectedFinding(f)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#f7fee7]/60' : 'hover:bg-[#fbfbfc]'
                      }`}
                    >
                      <td className="py-3 font-mono font-bold text-[#111827] text-[12px]">
                        {f.vuln_id}
                      </td>
                      <td className="py-3">
                        <SeverityBadge severity={f.severity} />
                      </td>
                      <td className="py-3 font-mono text-[#4b5563] text-[11.5px]">
                        {f.affected_package}@{f.affected_version}
                      </td>
                      <td className="py-3">
                        <RemediationBadge status={f.remediation_status} />
                      </td>
                      <td className="py-3 text-[11.5px] text-[#6b7280] capitalize">
                        {f.scanner_source}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Finding Inspection Card (Col 5) */}
        <div className="lg:col-span-5">
          {selectedFinding ? (
            <div className="rounded-[8px] border border-[#e5e7eb] p-5 bg-white shadow-2xs space-y-4">
              <div className="flex items-start justify-between border-b border-[#f0f0f0] pb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[15px] text-[#111827]">
                      {selectedFinding.vuln_id}
                    </span>
                    <SeverityBadge severity={selectedFinding.severity} />
                  </div>
                  <div className="text-[11.5px] text-[#6b7280] mt-1">
                    Detected by {selectedFinding.scanner_source}
                  </div>
                </div>

                {selectedFinding.advisory_url && (
                  <a
                    href={selectedFinding.advisory_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#6b7280] hover:text-[#111827] border border-[#e5e7eb] rounded-[5px] hover:bg-[#f9fafb] shadow-2xs"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider block mb-1">
                  Description
                </label>
                <p className="text-[12.5px] text-[#374151] leading-relaxed">
                  {selectedFinding.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[11.5px] bg-[#fafafa] p-3 rounded-[6px] border border-[#f0f0f0]">
                <div>
                  <span className="text-[#6b7280] block text-[10.5px]">Package</span>
                  <span className="font-mono font-bold text-[#111827]">
                    {selectedFinding.affected_package}
                  </span>
                </div>
                <div>
                  <span className="text-[#6b7280] block text-[10.5px]">Installed Version</span>
                  <span className="font-mono font-bold text-[#111827]">
                    {selectedFinding.affected_version}
                  </span>
                </div>
                {selectedFinding.fixed_version && (
                  <div className="col-span-2 pt-1 border-t border-[#f0f0f0]">
                    <span className="text-[#6b7280] block text-[10.5px]">Fixed In Version</span>
                    <span className="font-mono font-bold text-[#16a34a]">
                      {selectedFinding.fixed_version}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() =>
                    navigate(`/vex?vuln=${encodeURIComponent(selectedFinding.vuln_id)}&pkg=${encodeURIComponent(selectedFinding.affected_package)}`)
                  }
                  className="w-full inline-flex items-center justify-center gap-1.5 h-8.5 px-3 text-[12.5px] font-semibold text-black bg-[#a3e635] hover:bg-[#84cc16] rounded-[6px] transition-colors shadow-xs"
                >
                  <FileCheck2 size={14} className="stroke-[2.2]" />
                  Create VEX Statement
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-dashed border-[#e5e7eb] rounded-[8px] text-center text-[#9ca3af] text-[12px] bg-white">
              Select a vulnerability finding to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
