import React, { useEffect, useState } from 'react';
import {
  Layers,
  Plus,
  ExternalLink,
  GitBranch,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Project, Release } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [releases, setReleases] = useState<Record<string, Release[]>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [productIdentifier, setProductIdentifier] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Release Modal State
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [releaseVersion, setReleaseVersion] = useState('');

  const loadData = async () => {
    const projs = await api.getProjects();
    setProjects(projs);
    for (const p of projs) {
      const rels = await api.getReleases(p.id);
      setReleases((prev) => ({ ...prev, [p.id]: rels }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    setSubmitting(true);
    await api.createProject(
      projectName,
      projectDesc,
      productIdentifier || `pkg:github/acme/${projectName.toLowerCase().replace(/\s+/g, '-')}`,
      repoUrl
    );
    setSubmitting(false);
    setIsCreateOpen(false);
    setProjectName('');
    setProjectDesc('');
    setProductIdentifier('');
    setRepoUrl('');
    loadData();
  };

  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !releaseVersion.trim()) return;
    setSubmitting(true);
    await api.createRelease(selectedProjectId, releaseVersion);
    setSubmitting(false);
    setIsReleaseModalOpen(false);
    setReleaseVersion('');
    loadData();
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.product_identifier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
            Projects & Repositories
          </h1>
          <p className="text-[13px] text-[#6b7280] mt-0.5">
            Manage software systems, map releases, and correlate security evidence across versions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-7 pr-3 text-[12px] bg-white border border-[#e5e7eb] rounded-[6px] focus:outline-none focus:border-[#111827] w-52 shadow-2xs"
            />
          </div>

          {/* Primary CTA (Lime Green) */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 text-[12.5px] font-semibold text-black bg-[#a3e635] hover:bg-[#84cc16] rounded-[6px] transition-colors shadow-xs"
          >
            <Plus size={14} className="stroke-[2.5]" />
            Create Project
          </button>
        </div>
      </div>

      {/* PROJECTS LIST */}
      <div className="space-y-3.5">
        {filteredProjects.map((p) => {
          const projectReleases = releases[p.id] || [];

          return (
            <div
              key={p.id}
              className="rounded-[8px] border border-[#e5e7eb] p-5 bg-white shadow-2xs hover:border-[#d1d5db] transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[6px] bg-[#f3f4f6] text-[#111827] flex items-center justify-center border border-[#e5e7eb] shrink-0">
                    <FolderGit2 size={16} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[14.5px] text-[#111827]">{p.name}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-[#f9fafb] text-[#4b5563] border border-[#e5e7eb] rounded-[4px]">
                      {p.product_identifier}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setIsReleaseModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 h-7.5 px-3 text-[12px] font-medium text-[#111827] bg-white border border-[#e5e7eb] rounded-[5px] hover:bg-[#f9fafb] shadow-2xs transition-colors"
                  >
                    <Plus size={13} /> Add Release
                  </button>

                  {p.repository_url && (
                    <a
                      href={p.repository_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-[#6b7280] hover:text-[#111827] border border-[#e5e7eb] rounded-[5px] hover:bg-[#f9fafb] shadow-2xs transition-colors"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              {p.description && (
                <p className="text-[12.5px] text-[#4b5563] mb-3.5 leading-relaxed">
                  {p.description}
                </p>
              )}

              {/* Footer */}
              <div className="pt-3 border-t border-[#f0f0f0] flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#6b7280]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 font-mono text-[11px] text-[#4b5563]">
                    <GitBranch size={12} /> {p.default_branch}
                  </span>
                  <span className="flex items-center gap-1 text-[11.5px] text-[#4b5563]">
                    <Layers size={13} /> {projectReleases.length || 1} Release{projectReleases.length !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1 text-[11.5px] text-[#16a34a] font-medium">
                    <CheckCircle2 size={13} /> Security Baseline Active
                  </span>
                </div>

                {projectReleases.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11.5px] text-[#6b7280]">Releases:</span>
                    {projectReleases.map((r) => (
                      <span
                        key={r.id}
                        className="text-[11px] font-mono px-2 py-0.5 bg-[#f3f4f6] text-[#111827] border border-[#e5e7eb] rounded-[4px] font-medium"
                      >
                        {r.version}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Software Project"
        description="Register a software system or repository for SBOM baseline and VEX governance."
      >
        <form onSubmit={handleCreateProject} className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Project Name <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Identity Service"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full h-8 px-2.5 text-[12px] border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Product Identifier (PURL or URI)
            </label>
            <input
              type="text"
              placeholder="pkg:github/acme/identity-service"
              value={productIdentifier}
              onChange={(e) => setProductIdentifier(e.target.value)}
              className="w-full h-8 px-2.5 text-[12px] font-mono border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Repository URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/acme/identity-service"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full h-8 px-2.5 text-[12px] border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Authentication, session handling, and identity management..."
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full p-2 text-[12px] border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e5e7eb]">
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <button
              type="submit"
              disabled={submitting}
              className="px-3.5 py-1.5 text-[12.5px] font-semibold text-black bg-[#a3e635] hover:bg-[#84cc16] rounded-[4px] transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Release Modal */}
      <Modal
        isOpen={isReleaseModalOpen}
        onClose={() => setIsReleaseModalOpen(false)}
        title="Register Project Release"
        description="Add a semantic release tag for version-specific SBOMs and VEX statements."
      >
        <form onSubmit={handleCreateRelease} className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Version Tag <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. v2.1.0 or 2026.1"
              value={releaseVersion}
              onChange={(e) => setReleaseVersion(e.target.value)}
              className="w-full h-8 px-2.5 text-[12px] font-mono border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e5e7eb]">
            <Button variant="secondary" onClick={() => setIsReleaseModalOpen(false)}>
              Cancel
            </Button>
            <button
              type="submit"
              disabled={submitting}
              className="px-3.5 py-1.5 text-[12.5px] font-semibold text-black bg-[#a3e635] hover:bg-[#84cc16] rounded-[4px] transition-colors"
            >
              Add Release
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
