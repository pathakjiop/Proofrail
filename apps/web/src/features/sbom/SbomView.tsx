import React, { useEffect, useState } from 'react';
import {
  Upload,
  Hash,
  Search,
  Package,
} from 'lucide-react';
import { api } from '../../lib/api';
import { SbomDocument, Component, Project, Release } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const SbomView: React.FC = () => {
  const [sboms, setSboms] = useState<SbomDocument[]>([]);
  const [selectedSbom, setSelectedSbom] = useState<SbomDocument | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [searchComp, setSearchComp] = useState('');

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState('');
  const [targetReleaseId, setTargetReleaseId] = useState('');
  const [sbomFile, setSbomFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    const [sbomList, projList] = await Promise.all([
      api.getSboms(),
      api.getProjects(),
    ]);
    setSboms(sbomList);
    setProjects(projList);
    if (projList.length > 0) {
      setTargetProjectId(projList[0].id);
      const rels = await api.getReleases(projList[0].id);
      setReleases(rels);
      if (rels.length > 0) setTargetReleaseId(rels[0].id);
    }
    if (sbomList.length > 0 && !selectedSbom) {
      setSelectedSbom(sbomList[0]);
      const comps = await api.getComponents(sbomList[0].id);
      setComponents(comps);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectSbom = async (doc: SbomDocument) => {
    setSelectedSbom(doc);
    const comps = await api.getComponents(doc.id);
    setComponents(comps);
  };

  const handleUploadSbom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sbomFile || !targetProjectId) return;
    setUploading(true);
    const newDoc = await api.uploadSbom(targetProjectId, targetReleaseId || undefined, sbomFile);
    setUploading(false);
    setIsUploadOpen(false);
    setSbomFile(null);
    loadData();
    handleSelectSbom(newDoc);
  };

  const filteredComponents = components.filter((c) =>
    c.name.toLowerCase().includes(searchComp.toLowerCase()) ||
    (c.license && c.license.toLowerCase().includes(searchComp.toLowerCase())) ||
    (c.purl && c.purl.toLowerCase().includes(searchComp.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
            SBOM Inventory & Components
          </h1>
          <p className="text-[13px] text-[#6b7280] mt-0.5">
            Ingest, parse, and validate CycloneDX and SPDX Software Bills of Materials with cryptographic proof.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 h-8 px-3.5 text-[12.5px] font-semibold text-black bg-[#a3e635] hover:bg-[#84cc16] rounded-[6px] transition-colors shadow-xs"
        >
          <Upload size={14} className="stroke-[2.5]" />
          Upload SBOM
        </button>
      </div>

      {/* MAIN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: SBOM Documents List (Col 4) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-[12px] font-bold text-[#111827] px-1 flex items-center justify-between">
            <span>Uploaded SBOMs ({sboms.length})</span>
            <span className="text-[#6b7280] text-[11px] font-normal">CycloneDX & SPDX</span>
          </div>

          <div className="space-y-2.5">
            {sboms.map((s) => {
              const isSelected = selectedSbom?.id === s.id;
              const formatLabel = s.format === 'cyclonedx_json' ? 'CycloneDX JSON' : 'SPDX JSON';

              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSbom(s)}
                  className={`p-3.5 rounded-[8px] border cursor-pointer transition-all shadow-2xs ${
                    isSelected
                      ? 'border-[#111827] bg-[#f7fee7]/40 ring-1 ring-[#111827]'
                      : 'border-[#e5e7eb] bg-white hover:bg-[#fbfbfc]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant={s.format === 'cyclonedx_json' ? 'primary' : 'neutral'}>
                      {formatLabel} v{s.spec_version}
                    </Badge>
                    <span className="text-[11.5px] font-bold text-[#111827]">
                      {s.component_count} components
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6b7280] mt-2 truncate">
                    <Hash size={12} className="shrink-0 text-[#9ca3af]" />
                    <span className="truncate">{s.sha256_hash}</span>
                  </div>

                  <div className="mt-2 text-[10.5px] text-[#9ca3af] flex justify-between">
                    <span>Size: {(s.file_size_bytes / 1024).toFixed(1)} KB</span>
                    <span>{new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Extracted Components Table (Col 8) */}
        <div className="lg:col-span-8 rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Search Bar & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0f0f0] mb-3">
              <div className="flex items-center gap-2">
                <Package size={17} className="text-[#111827]" />
                <h2 className="text-[14.5px] font-bold text-[#111827]">
                  Extracted Components ({filteredComponents.length})
                </h2>
              </div>

              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="text"
                  placeholder="Filter components..."
                  value={searchComp}
                  onChange={(e) => setSearchComp(e.target.value)}
                  className="h-7.5 w-48 pl-7 pr-2.5 text-[11.5px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[5px] focus:outline-none focus:border-[#111827] focus:bg-white"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider pb-2 border-b border-[#f5f5f5]">
                    <th className="pb-2">NAME</th>
                    <th className="pb-2">VERSION</th>
                    <th className="pb-2">LICENSE</th>
                    <th className="pb-2">SUPPLIER</th>
                    <th className="pb-2">TYPE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f5] text-[12px]">
                  {filteredComponents.map((c) => (
                    <tr key={c.id} className="hover:bg-[#fbfbfc] transition-colors">
                      <td className="py-2.5 font-bold text-[#111827]">
                        <div>{c.name}</div>
                        {c.purl && (
                          <div className="text-[10px] font-mono text-[#6b7280] truncate max-w-xs font-normal">
                            {c.purl}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 font-mono text-[#4b5563]">
                        {c.version}
                      </td>
                      <td className="py-2.5">
                        {c.license ? (
                          <Badge variant="neutral">{c.license}</Badge>
                        ) : (
                          <span className="text-[11px] text-[#9ca3af]">None</span>
                        )}
                      </td>
                      <td className="py-2.5 text-[#4b5563]">
                        {c.supplier || '—'}
                      </td>
                      <td className="py-2.5 text-[11px] text-[#6b7280] capitalize">
                        {c.component_type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Upload SBOM Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Software Bill of Materials (SBOM)"
        description="Provide a CycloneDX or SPDX JSON document. The platform extracts components, licenses, and Package URLs."
      >
        <form onSubmit={handleUploadSbom} className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Target Project <span className="text-[#dc2626]">*</span>
            </label>
            <select
              value={targetProjectId}
              onChange={(e) => setTargetProjectId(e.target.value)}
              className="w-full h-8 px-2 text-[12px] border border-[#e5e7eb] rounded-[4px] bg-white focus:outline-none focus:border-[#111827]"
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
              Product Release Version
            </label>
            <select
              value={targetReleaseId}
              onChange={(e) => setTargetReleaseId(e.target.value)}
              className="w-full h-8 px-2 text-[12px] border border-[#e5e7eb] rounded-[4px] bg-white focus:outline-none focus:border-[#111827]"
            >
              <option value="">(None / General Baseline)</option>
              {releases.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.version}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Select SBOM Document File (.json) <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="file"
              accept=".json"
              required
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSbomFile(e.target.files[0]);
                }
              }}
              className="w-full text-[12px] file:mr-3 file:py-1 file:px-2.5 file:rounded-[4px] file:border file:border-[#e5e7eb] file:text-[11px] file:font-semibold file:bg-[#f9fafb] file:text-[#374151] hover:file:bg-[#eceef2] text-[#6b7280]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e5e7eb]">
            <Button variant="secondary" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <button
              type="submit"
              disabled={uploading}
              className="px-3.5 py-1.5 text-[12.5px] font-semibold text-black bg-[#a3e635] hover:bg-[#84cc16] rounded-[4px] transition-colors"
            >
              Upload & Parse
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
