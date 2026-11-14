import React, { useEffect, useState } from 'react';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  GitBranch,
  Calendar,
  Layers,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Project, Release } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [releases, setReleases] = useState<Record<string, Release[]>>({});
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
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
      productIdentifier || `pkg:custom/${projectName.toLowerCase().replace(/\s+/g, '-')}`,
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e7eb] pb-4">
        <div>
          <h1 className="text-[18px] font-semibold text-[#111827]">Projects & Repositories</h1>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            Manage software systems, map releases, and correlate security evidence across versions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-7 pr-3 text-[12px] border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#1677ff]"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={13} />}
            onClick={() => setIsCreateOpen(true)}
          >
            Create Project
          </Button>
        </div>
      </div>

      {/* Projects Table / Card List */}
      <div className="space-y-3">
        {filteredProjects.map((p) => {
          const projectReleases = releases[p.id] || [];

          return (
            <div
              key={p.id}
              className="border border-[#e5e7eb] rounded-[4px] p-4 bg-white hover:border-[#d1d5db] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[4px] bg-[#f0f5ff] text-[#1677ff] flex items-center justify-center border border-[#d6e4ff]">
                    <FolderGit2 size={15} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[14px] text-[#111827]">{p.name}</span>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 bg-[#f7f8fa] text-[#4b5563] border border-[#e5e7eb] rounded">
                        {p.product_identifier}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Plus size={12} />}
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setIsReleaseModalOpen(true);
                    }}
                  >
                    Add Release
                  </Button>
                  {p.repository_url && (
                    <a
                      href={p.repository_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-[#6b7280] hover:text-[#111827] border border-[#e5e7eb] rounded hover:bg-[#f7f8fa]"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>

              {p.description && (
                <p className="text-[12px] text-[#4b5563] mb-3">{p.description}</p>
              )}

              {/* Releases & Metadata Footer */}
              <div className="pt-3 border-t border-[#f0f0f0] flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#6b7280]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <GitBranch size={13} /> {p.default_branch}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Layers size={13} /> {projectReleases.length} Release{projectReleases.length !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-[#16a34a]">
                    <ShieldCheck size={13} /> Security Baseline Active
                  </span>
                </div>

                {projectReleases.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px]">Releases:</span>
                    {projectReleases.map((r) => (
                      <span
                        key={r.id}
                        className="text-[11px] font-mono px-1.5 py-0.5 bg-[#eff6ff] text-[#1677ff] border border-[#bfdbfe] rounded"
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
        description="Register a software system or component for SBOM and VEX governance."
      >
        <form onSubmit={handleCreateProject} className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Project Name <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Identity Auth Service"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full h-8 px-2.5 text-[12px] border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#1677ff]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Product Identifier (PURL or URI)
            </label>
            <input
              type="text"
              placeholder="pkg:github/org/repo or urn:uuid:..."
              value={productIdentifier}
              onChange={(e) => setProductIdentifier(e.target.value)}
              className="w-full h-8 px-2.5 text-[12px] font-mono border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#1677ff]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Repository URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/organization/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full h-8 px-2.5 text-[12px] border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#1677ff]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Core security and business functions..."
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full p-2 text-[12px] border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#1677ff]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e5e7eb]">
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Release Modal */}
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
              placeholder="e.g. v1.5.0 or 2026.1"
              value={releaseVersion}
              onChange={(e) => setReleaseVersion(e.target.value)}
              className="w-full h-8 px-2.5 text-[12px] font-mono border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#1677ff]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e5e7eb]">
            <Button variant="secondary" onClick={() => setIsReleaseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              Add Release
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
