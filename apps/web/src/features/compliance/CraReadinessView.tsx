import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Info,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  evidenceType: string;
  completed: boolean;
  reference: string;
}

export const CraReadinessView: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'cra-1',
      category: 'SBOM & Component Inventory',
      title: 'Machine-Readable SBOM for every release',
      description: 'Maintain an accurate, updated Software Bill of Materials in standard formats (CycloneDX or SPDX) covering direct and transitive dependencies.',
      evidenceType: 'SBOM Document (CycloneDX/SPDX)',
      completed: true,
      reference: 'EU Cyber Resilience Act, Annex I, Part I (2)',
    },
    {
      id: 'cra-2',
      category: 'Vulnerability Handling',
      title: 'Documented Coordinated Vulnerability Disclosure (CVD)',
      description: 'Publish clear vulnerability reporting contact channels, security.txt, and a documented intake/triaging procedure.',
      evidenceType: 'Security Policy Document',
      completed: true,
      reference: 'EU Cyber Resilience Act, Article 14',
    },
    {
      id: 'cra-3',
      category: 'Vulnerability Handling',
      title: 'Defensible Exploitability Assessments (VEX)',
      description: 'Track exploitability status of discovered CVEs with formal technical justification codes preventing false-positive panic.',
      evidenceType: 'VEX Statement (OpenVEX/CSAF)',
      completed: true,
      reference: 'EU Cyber Resilience Act, Annex I, Part II',
    },
    {
      id: 'cra-4',
      category: 'Release Evidence',
      title: 'Cryptographic Evidence Bundles & Retention',
      description: 'Produce tamper-evident release evidence packages sealed with cryptographic SHA-256 manifests for 10-year technical dossier archiving.',
      evidenceType: 'Evidence Package ZIP & SHA-256 Manifest',
      completed: true,
      reference: 'EU Cyber Resilience Act, Article 23',
    },
    {
      id: 'cra-5',
      category: 'Lifecycle Support',
      title: 'Defined Security Support Period',
      description: 'State expected support duration during which security patches and vulnerability updates will be provided to software users.',
      evidenceType: 'Technical Documentation',
      completed: false,
      reference: 'EU Cyber Resilience Act, Article 13 (8)',
    },
    {
      id: 'cra-6',
      category: 'Secure Development',
      title: 'Automated CI/CD Scanner Integration',
      description: 'Continuous dependency scanning integrated in build pipelines with automated detection of high/critical vulnerabilities.',
      evidenceType: 'CI/CD Pipeline Logs & Scanner Reports',
      completed: true,
      reference: 'EU Cyber Resilience Act, Annex I, Part I (1)',
    },
  ]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = items.filter((i) => i.completed).length;
  const percentage = Math.round((completedCount / items.length) * 100);

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
              EU Cyber Resilience Act (CRA) Technical Readiness
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#f3f4f6] text-[#4b5563]">
              Beta
            </span>
          </div>
          <p className="text-[13px] text-[#6b7280] mt-0.5">
            Organize technical evidence, SBOMs, and VEX statements required for supply chain regulation.
          </p>
        </div>
      </div>

      {/* NOTICE BOX */}
      <div className="p-3.5 bg-white border border-[#e5e7eb] rounded-[8px] flex items-start gap-3 text-[12.5px] text-[#374151] shadow-2xs">
        <Info size={17} className="shrink-0 mt-0.5 text-[#111827]" />
        <div>
          <span className="font-bold text-[#111827]">Technical Evidence Management Notice:</span> VulnLedger helps engineering teams collect, structure, and verify the technical evidence required under the Cyber Resilience Act. Completing this checklist assists with regulatory preparation but does not constitute automated legal certification.
        </div>
      </div>

      {/* READINESS PROGRESS CARD */}
      <div className="p-5 border border-[#e5e7eb] rounded-[8px] bg-white shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#111827]">
            Technical Evidence Completeness
          </span>
          <span className="text-[16px] font-extrabold text-[#111827]">{percentage}%</span>
        </div>

        <div className="w-full h-3 bg-[#f0f0f0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#a3e635] rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="text-[12px] text-[#6b7280] flex justify-between pt-1">
          <span>{completedCount} of {items.length} technical controls verified</span>
          <span className="text-[#15803d] font-semibold">Ready for Release Audit</span>
        </div>
      </div>

      {/* CHECKLIST */}
      <div className="border border-[#e5e7eb] rounded-[8px] bg-white overflow-hidden divide-y divide-[#f0f0f0] shadow-2xs">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="p-4.5 flex items-start gap-3.5 hover:bg-[#fbfbfc] cursor-pointer transition-colors"
          >
            <button className="mt-0.5 shrink-0">
              {item.completed ? (
                <CheckCircle2 size={18} className="text-[#16a34a]" />
              ) : (
                <Circle size={18} className="text-[#d1d5db]" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className={`text-[13.5px] font-bold ${item.completed ? 'text-[#111827]' : 'text-[#6b7280]'}`}>
                  {item.title}
                </span>
                <span className="text-[10.5px] font-mono text-[#6b7280] bg-[#f9fafb] px-2 py-0.5 rounded border border-[#e5e7eb]">
                  {item.reference}
                </span>
              </div>
              <p className="text-[12.5px] text-[#4b5563] mb-2 leading-relaxed">{item.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#9ca3af]">Target Evidence:</span>
                <Badge variant="neutral">{item.evidenceType}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
