import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  ExternalLink,
  FileCheck2,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { VulnerabilityFinding, Severity, RemediationStatus } from '../../types';
import { SeverityBadge, RemediationBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const VulnerabilitiesView: React.FC = () => {
  const navigate = useNavigate();
  const [findings, setFindings] = useState<VulnerabilityFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFinding, setSelectedFinding] = useState<VulnerabilityFinding | null>(null);

  useEffect(() => {
    api.getFindings().then((data) => {
      setFindings(data);
      if (data.length > 0) setSelectedFinding(data[0]);
      setLoading(false);
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e7eb] pb-4">
        <div>
          <h1 className="text-[18px] font-semibold text-[#111827]">Vulnerability Findings</h1>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            Correlated CVEs, advisories, and scanner detections mapped to specific releases and components.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#fbfbfc] border border-[#e5e7eb] rounded-[4px]">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search CVE, package name, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-7 pr-3 text-[12px] bg-white border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#1677ff]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="h-8 px-2.5 text-[12px] bg-white border border-[#e5e7eb] rounded-[4px] text-[#374151] focus:outline-none focus:border-[#1677ff]"
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
            className="h-8 px-2.5 text-[12px] bg-white border border-[#e5e7eb] rounded-[4px] text-[#374151] focus:outline-none focus:border-[#1677ff]"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="mitigated">Mitigated</option>
            <option value="resolved">Resolved</option>
            <option value="under_review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Split Finding Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Findings List (2 cols) */}
        <div className="lg:col-span-2 border border-[#e5e7eb] rounded-[4px] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f7f8fa] text-[11px] font-medium text-[#6b7280] uppercase tracking-wider">
                  <th className="px-3.5 py-2">Identifier</th>
                  <th className="px-3.5 py-2">Severity</th>
                  <th className="px-3.5 py-2">Affected Component</th>
                  <th className="px-3.5 py-2">Status</th>
                  <th className="px-3.5 py-2">Scanner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb] text-[12px]">
                {filteredFindings.map((f) => {
                  const isSelected = selectedFinding?.id === f.id;
                  return (
                    <tr
                      key={f.id}
                      onClick={() => setSelectedFinding(f)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#eff6ff]/50' : 'hover:bg-[#fbfbfc]'
                      }`}
                    >
                      <td className="px-3.5 py-2.5 font-mono font-medium text-[#111827]">
                        {f.vuln_id}
                        {f.cvss_score && (
                          <span className="ml-1.5 text-[10px] text-[#6b7280]">
                            ({f.cvss_score.toFixed(1)})
                          </span>
                        )}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <SeverityBadge severity={f.severity} />
                      </td>
                      <td className="px-3.5 py-2.5 font-mono text-[#374151]">
                        {f.affected_package}@{f.affected_version}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <RemediationBadge status={f.remediation_status} />
                      </td>
                      <td className="px-3.5 py-2.5 text-[11px] text-[#6b7280] capitalize">
                        {f.scanner_source}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Finding Inspection Card (1 col) */}
        <div className="lg:col-span-1">
          {selectedFinding ? (
            <div className="border border-[#e5e7eb] rounded-[4px] p-4 bg-white space-y-4">
              <div className="flex items-start justify-between border-b border-[#e5e7eb] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[14px] text-[#111827]">
                      {selectedFinding.vuln_id}
                    </span>
                    <SeverityBadge severity={selectedFinding.severity} />
                  </div>
                  <div className="text-[11px] text-[#6b7280] mt-0.5">
                    Detected by {selectedFinding.scanner_source}
                  </div>
                </div>

                {selectedFinding.advisory_url && (
                  <a
                    href={selectedFinding.advisory_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-[#6b7280] hover:text-[#1677ff] rounded hover:bg-[#f7f8fa]"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wider block mb-1">
                  Description
                </label>
                <p className="text-[12px] text-[#374151] leading-relaxed">
                  {selectedFinding.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#f7f8fa] p-2.5 rounded-[4px] border border-[#e5e7eb]">
                <div>
                  <span className="text-[#6b7280] block">Package</span>
                  <span className="font-mono font-medium text-[#111827]">
                    {selectedFinding.affected_package}
                  </span>
                </div>
                <div>
                  <span className="text-[#6b7280] block">Installed Version</span>
                  <span className="font-mono font-medium text-[#111827]">
                    {selectedFinding.affected_version}
                  </span>
                </div>
                {selectedFinding.fixed_version && (
                  <div className="col-span-2">
                    <span className="text-[#6b7280] block">Fixed In Version</span>
                    <span className="font-mono font-medium text-[#16a34a]">
                      {selectedFinding.fixed_version}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  icon={<FileCheck2 size={13} />}
                  onClick={() =>
                    navigate(`/vex?vuln=${encodeURIComponent(selectedFinding.vuln_id)}&pkg=${encodeURIComponent(selectedFinding.affected_package)}`)
                  }
                >
                  Create VEX Statement
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-dashed border-[#e5e7eb] rounded text-center text-[#9ca3af] text-[12px]">
              Select a vulnerability finding to inspect details and author VEX.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
