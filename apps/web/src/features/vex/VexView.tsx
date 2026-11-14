import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Code2,
  Plus,
  Download,
  CheckCircle,
  Clock,
  User,
  History,
} from 'lucide-react';
import { api } from '../../lib/api';
import { VexStatement, VexStatus, VexJustification, Project, Release } from '../../types';
import { VexStatusBadge, Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const VexView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [vexList, setVexList] = useState<VexStatement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedVex, setSelectedVex] = useState<VexStatement | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState('');
  const [targetReleaseId, setTargetReleaseId] = useState('');
  const [vulnId, setVulnId] = useState('');
  const [status, setStatus] = useState<VexStatus>('not_affected');
  const [justification, setJustification] = useState<VexJustification>(
    'inline_mitigations_already_exist'
  );
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const [statements, projList] = await Promise.all([
      api.getVexStatements(),
      api.getProjects(),
    ]);
    setVexList(statements);
    setProjects(projList);
    if (projList.length > 0) {
      setTargetProjectId(projList[0].id);
      const rels = await api.getReleases(projList[0].id);
      setReleases(rels);
      if (rels.length > 0) setTargetReleaseId(rels[0].id);
    }
    if (statements.length > 0 && !selectedVex) {
      setSelectedVex(statements[0]);
    }
  };

  useEffect(() => {
    loadData();
    const queryVuln = searchParams.get('vuln');
    if (queryVuln) {
      setVulnId(queryVuln);
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const handleCreateVex = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProjectId || !vulnId.trim() || !notes.trim()) return;
    setSubmitting(true);
    const newStmt = await api.createVexStatement(
      targetProjectId,
      targetReleaseId || undefined,
      vulnId,
      status,
      status === 'not_affected' ? justification : undefined,
      notes
    );
    setSubmitting(false);
    setIsModalOpen(false);
    setNotes('');
    loadData();
    setSelectedVex(newStmt);
  };

  const handleExportJson = (stmt: VexStatement) => {
    const exportDoc = {
      "@context": "https://openvex.dev/ns/v0.2.0",
      "@id": `https://proofrail.io/vex/${stmt.id}`,
      "author": stmt.author_name,
      "timestamp": stmt.created_at,
      "version": stmt.decision_history.length,
      "statements": [
        {
          "vulnerability": {
            "name": stmt.vuln_id
          },
          "products": [
            {
              "@id": `pkg:proofrail/project/${stmt.project_id}`
            }
          ],
          "status": stmt.status,
          "justification": stmt.justification,
          "impact_statement": stmt.statement_notes
        }
      ]
    };

    const blob = new Blob([JSON.stringify(exportDoc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vex-${stmt.vuln_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
            VEX Exploitability Management
          </h1>
          <p className="text-[13px] text-[#6b7280] mt-0.5">
            Formulate, peer-review, and export standardized Vulnerability Exploitability eXchange (VEX) statements.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 h-8 px-3.5 text-[12.5px] font-semibold text-black bg-[#a3e635] hover:bg-[#84cc16] rounded-[6px] transition-colors shadow-xs"
        >
          <Plus size={14} className="stroke-[2.5]" />
          Create VEX Statement
        </button>
      </div>

      {/* MAIN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: VEX Decisions List (Col 4) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-[12px] font-bold text-[#111827] px-1 flex items-center justify-between">
            <span>Active Decisions ({vexList.length})</span>
            <span className="text-[11px] text-[#6b7280]">OpenVEX & CSAF</span>
          </div>

          <div className="space-y-2.5">
            {vexList.map((stmt) => {
              const isSelected = selectedVex?.id === stmt.id;
              return (
                <div
                  key={stmt.id}
                  onClick={() => setSelectedVex(stmt)}
                  className={`p-4 rounded-[8px] border cursor-pointer transition-all shadow-2xs ${
                    isSelected
                      ? 'border-[#111827] bg-[#f7fee7]/40 ring-1 ring-[#111827]'
                      : 'border-[#e5e7eb] bg-white hover:bg-[#fbfbfc]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-[13.5px] text-[#111827]">
                      {stmt.vuln_id}
                    </span>
                    <VexStatusBadge status={stmt.status} />
                  </div>

                  <p className="text-[12px] text-[#4b5563] line-clamp-2 mb-2.5 leading-relaxed">
                    {stmt.statement_notes}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#6b7280]">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {stmt.author_name}
                    </span>
                    {stmt.is_approved ? (
                      <span className="text-[#16a34a] font-medium flex items-center gap-1">
                        <CheckCircle size={12} /> Approved
                      </span>
                    ) : (
                      <span className="text-[#d97706] font-medium flex items-center gap-1">
                        <Clock size={12} /> Under Review
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: VEX Details & Audit History (Col 8) */}
        <div className="lg:col-span-8">
          {selectedVex ? (
            <div className="rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f0f0] pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-mono text-[16px] font-bold text-[#111827]">
                      {selectedVex.vuln_id}
                    </h2>
                    <VexStatusBadge status={selectedVex.status} />
                    {selectedVex.is_approved && (
                      <Badge variant="success">Approved</Badge>
                    )}
                  </div>
                  <div className="text-[11.5px] text-[#6b7280] mt-1">
                    Author: <span className="font-semibold text-[#111827]">{selectedVex.author_name}</span> • Created {new Date(selectedVex.created_at).toLocaleString()}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download size={13} />}
                  onClick={() => handleExportJson(selectedVex)}
                >
                  Export OpenVEX
                </Button>
              </div>

              {/* Justification & Impact */}
              <div className="space-y-3.5">
                {selectedVex.justification && (
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] block mb-1">
                      Formal Justification Code (CSAF / OpenVEX Standard)
                    </label>
                    <div className="text-[12px] font-mono bg-[#fafafa] border border-[#e5e7eb] px-3 py-2 rounded-[6px] text-[#111827]">
                      {selectedVex.justification}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] block mb-1">
                    Technical Evidence & Impact Statement
                  </label>
                  <div className="p-3 bg-[#fafafa] border border-[#e5e7eb] rounded-[6px] text-[12.5px] text-[#374151] leading-relaxed">
                    {selectedVex.statement_notes}
                  </div>
                </div>
              </div>

              {/* Decision Audit History Timeline */}
              <div className="pt-4 border-t border-[#f0f0f0]">
                <div className="flex items-center gap-2 mb-3.5">
                  <History size={15} className="text-[#111827]" />
                  <h3 className="text-[13.5px] font-bold text-[#111827]">Decision History & Audit Trail</h3>
                </div>

                <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#e5e7eb]">
                  {selectedVex.decision_history.map((record, idx) => (
                    <div key={record.id || idx} className="flex items-start gap-3 pl-5 relative">
                      <div className="w-2 h-2 rounded-full bg-[#111827] absolute left-1 top-1.5 -translate-x-1/2" />
                      <div className="flex-1 bg-[#f9fafb] p-3 rounded-[6px] border border-[#f0f0f0]">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-[#111827]">{record.author_name} ({record.author_email})</span>
                          <span className="text-[#9ca3af]">{new Date(record.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="text-[12px] text-[#4b5563]">{record.notes}</div>
                        {record.justification && (
                          <div className="text-[10px] font-mono text-[#6b7280] mt-1">
                            code: {record.justification}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-dashed border-[#e5e7eb] rounded-[8px] text-center text-[#9ca3af] text-[12px] bg-white">
              Select a VEX decision record to view justification evidence.
            </div>
          )}
        </div>
      </div>

      {/* Create VEX Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Author VEX Exploitability Statement"
        description="Record defensible security decisions with required formal justification codes."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateVex} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">
                Project <span className="text-[#dc2626]">*</span>
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
                Vulnerability Identifier <span className="text-[#dc2626]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="CVE-2023-xxxxx"
                value={vulnId}
                onChange={(e) => setVulnId(e.target.value)}
                className="w-full h-8 px-2.5 text-[12px] font-mono border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#111827]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">
                Exploitability Status <span className="text-[#dc2626]">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VexStatus)}
                className="w-full h-8 px-2 text-[12px] border border-[#e5e7eb] rounded-[4px] bg-white focus:outline-none focus:border-[#111827]"
              >
                <option value="not_affected">Not Affected</option>
                <option value="affected">Affected</option>
                <option value="fixed">Fixed</option>
                <option value="under_investigation">Under Investigation</option>
              </select>
            </div>

            {status === 'not_affected' && (
              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1">
                  Justification Code <span className="text-[#dc2626]">*</span>
                </label>
                <select
                  value={justification}
                  onChange={(e) => setJustification(e.target.value as VexJustification)}
                  className="w-full h-8 px-2 text-[12px] border border-[#e5e7eb] rounded-[4px] bg-white focus:outline-none focus:border-[#111827]"
                >
                  <option value="inline_mitigations_already_exist">
                    inline_mitigations_already_exist
                  </option>
                  <option value="vulnerable_code_cannot_be_controlled_by_adversary">
                    vulnerable_code_cannot_be_controlled_by_adversary
                  </option>
                  <option value="vulnerable_code_not_in_execute_path">
                    vulnerable_code_not_in_execute_path
                  </option>
                  <option value="component_not_present">
                    component_not_present
                  </option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">
              Technical Justification & Supporting Evidence <span className="text-[#dc2626]">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Explain why this vulnerability does not impact this product release..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 text-[12px] border border-[#e5e7eb] rounded-[4px] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e5e7eb]">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <button
              type="submit"
              disabled={submitting}
              className="px-3.5 py-1.5 text-[12.5px] font-semibold text-black bg-[#a3e635] hover:bg-[#84cc16] rounded-[4px] transition-colors"
            >
              Save VEX Decision
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
