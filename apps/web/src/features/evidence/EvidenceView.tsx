import React, { useEffect, useState } from 'react';
import {
  PackageCheck,
  Download,
  Plus,
  ShieldCheck,
  Hash,
  FileText,
  FileCode,
  Archive,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../lib/api';
import { EvidencePackage, Project, Release } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const EvidenceView: React.FC = () => {
  const [packages, setPackages] = useState<EvidencePackage[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<EvidencePackage | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState('');
  const [targetReleaseId, setTargetReleaseId] = useState('');
  const [generating, setGenerating] = useState(false);

  const loadData = async () => {
    const [pkgList, projList] = await Promise.all([
      api.getEvidencePackages(),
      api.getProjects(),
    ]);
    setPackages(pkgList);
    setProjects(projList);
    if (projList.length > 0) {
      setTargetProjectId(projList[0].id);
      const rels = await api.getReleases(projList[0].id);
      setReleases(rels);
      if (rels.length > 0) setTargetReleaseId(rels[0].id);
    }
    if (pkgList.length > 0 && !selectedPkg) {
      setSelectedPkg(pkgList[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProjectId || !targetReleaseId) return;
    setGenerating(true);
    const newPkg = await api.generateEvidencePackage(targetProjectId, targetReleaseId);
    setGenerating(false);
    setIsGenerateOpen(false);
    loadData();
    setSelectedPkg(newPkg);
  };

  const handleDownload = (pkg: EvidencePackage) => {
    // Direct link to backend download endpoint
    window.location.href = `/api/v1/evidence/packages/${pkg.id}/download`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e7eb] pb-4">
        <div>
          <h1 className="text-[18px] font-semibold text-[#111827]">Security Evidence Center</h1>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            Assemble, verify, and export tamper-evident release packages with cryptographic SHA-256 manifests.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={13} />}
          onClick={() => setIsGenerateOpen(true)}
        >
          Generate Evidence Package
        </Button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Evidence Packages List */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-[12px] font-semibold text-[#374151] px-1 flex items-center justify-between">
            <span>Release Evidence Bundles ({packages.length})</span>
            <span className="text-[11px] text-[#16a34a] font-medium flex items-center gap-1">
              <CheckCircle2 size={12} /> Verified
            </span>
          </div>

          <div className="space-y-2">
            {packages.map((pkg) => {
              const isSelected = selectedPkg?.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`p-3.5 rounded-[4px] border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#1677ff] bg-[#f0f7ff]/40 shadow-2xs'
                      : 'border-[#e5e7eb] bg-white hover:bg-[#fbfbfc]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-[13px] text-[#111827] flex items-center gap-1.5">
                      <Archive size={14} className="text-[#1677ff]" />
                      Release {pkg.package_version}
                    </span>
                    <Badge variant="success">SHA-256 Sealed</Badge>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6b7280] truncate mb-2">
                    <Hash size={12} className="shrink-0 text-[#9ca3af]" />
                    <span className="truncate">{pkg.sha256_hash}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6b7280]">
                    <span>{pkg.file_entries.length} Artifacts</span>
                    <span>{new Date(pkg.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Evidence Package Manifest & Artifact Inspector */}
        <div className="lg:col-span-2">
          {selectedPkg ? (
            <div className="border border-[#e5e7eb] rounded-[4px] bg-white p-5 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e7eb] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-semibold text-[#111827]">
                      Evidence Package: {selectedPkg.package_version}
                    </h2>
                    <Badge variant="primary">ZIP Archive</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6b7280] mt-1">
                    <Hash size={12} /> {selectedPkg.sha256_hash}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<Download size={13} />}
                  onClick={() => handleDownload(selectedPkg)}
                >
                  Download Bundle (.zip)
                </Button>
              </div>

              {/* Package Manifest Table */}
              <div>
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#6b7280] mb-2">
                  Package Manifest & Artifact Integrity
                </h3>
                <div className="border border-[#e5e7eb] rounded-[4px] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e7eb] bg-[#f7f8fa] text-[11px] font-medium text-[#6b7280] uppercase tracking-wider">
                        <th className="px-3.5 py-2">Artifact File</th>
                        <th className="px-3.5 py-2">Type</th>
                        <th className="px-3.5 py-2">SHA-256 Checksum</th>
                        <th className="px-3.5 py-2">Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e7eb] text-[12px]">
                      {selectedPkg.file_entries.map((f, idx) => (
                        <tr key={idx} className="hover:bg-[#fbfbfc]">
                          <td className="px-3.5 py-2.5 font-mono text-[#111827] flex items-center gap-2">
                            <FileCode size={13} className="text-[#6b7280]" />
                            {f.file_name}
                          </td>
                          <td className="px-3.5 py-2.5">
                            <Badge variant="neutral">{f.file_type}</Badge>
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-[11px] text-[#6b7280] truncate max-w-xs">
                            {f.sha256_hash}
                          </td>
                          <td className="px-3.5 py-2.5 text-[#6b7280]">
                            {(f.size_bytes / 1024).toFixed(1)} KB
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Technical Description Box */}
              <div className="p-3 bg-[#fbfbfc] border border-[#e5e7eb] rounded-[4px] text-[11px] text-[#4b5563] space-y-1">
                <div className="font-semibold text-[#111827]">
                  Cryptographic Integrity Guarantee:
                </div>
                <div>
                  This release evidence package conforms to the VulnLedger Tamper-Evident Manifest Standard. Each individual artifact is hashed at build-time with SHA-256, sealed inside <span className="font-mono text-[#111827]">manifest.json</span>, and archived.
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-dashed border-[#e5e7eb] rounded text-center text-[#9ca3af] text-[12px]">
              Select a release evidence package to inspect artifacts and download.
            </div>
          )}
        </div>
      </div>

      {/* Generate Evidence Package Modal */}
      <Modal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Generate Release Evidence Package"
        description="Bundle the release SBOM, active VEX statements, scanner logs, and manifest into a downloadable cryptographic archive."
      >
        <form onSubmit={handleGenerate} className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Select Project <span className="text-[#dc2626]">*</span>
            </label>
            <select
              value={targetProjectId}
              onChange={async (e) => {
                setTargetProjectId(e.target.value);
                const rels = await api.getReleases(e.target.value);
                setReleases(rels);
                if (rels.length > 0) setTargetReleaseId(rels[0].id);
              }}
              className="w-full h-8 px-2 text-[12px] border border-[#e5e7eb] rounded-[4px] bg-white focus:outline-none focus:border-[#1677ff]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Select Release Version <span className="text-[#dc2626]">*</span>
            </label>
            <select
              value={targetReleaseId}
              onChange={(e) => setTargetReleaseId(e.target.value)}
              className="w-full h-8 px-2 text-[12px] border border-[#e5e7eb] rounded-[4px] bg-white focus:outline-none focus:border-[#1677ff]"
            >
              {releases.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.version}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e5e7eb]">
            <Button variant="secondary" onClick={() => setIsGenerateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={generating}>
              Assemble & Fingerprint
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
