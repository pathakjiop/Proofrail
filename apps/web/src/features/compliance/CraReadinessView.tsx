import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  Circle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  FileText,
  Info,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e7eb] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] font-semibold text-[#111827]">
              EU Cyber Resilience Act (CRA) Technical Readiness
            </h1>
            <Badge variant="primary">Readiness Dossier</Badge>
          </div>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            Organize technical evidence, SBOMs, and VEX statements required for supply chain regulation.
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-3 bg-[#f0f5ff] border border-[#bfdbfe] rounded-[4px] flex items-start gap-2.5 text-[12px] text-[#1e40af]">
        <Info size={16} className="shrink-0 mt-0.5 text-[#2563eb]" />
        <div>
          <span className="font-semibold">Technical Evidence Management Notice:</span> VulnLedger helps engineering teams collect, structure, and verify the technical evidence required under the Cyber Resilience Act. Completing this checklist assists with regulatory preparation but does not constitute automated legal certification.
        </div>
      </div>

      {/* Readiness Progress Bar */}
      <div className="p-4 border border-[#e5e7eb] rounded-[4px] bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold text-[#111827]">
            Technical Evidence Completeness
          </span>
          <span className="text-[13px] font-bold text-[#1677ff]">{percentage}%</span>
        </div>
        <div className="w-full h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1677ff] rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-[11px] text-[#6b7280] mt-2 flex justify-between">
          <span>{completedCount} of {items.length} technical controls verified</span>
          <span className="text-[#16a34a] font-medium">Ready for Release Audit</span>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="border border-[#e5e7eb] rounded-[4px] bg-white overflow-hidden divide-y divide-[#e5e7eb]">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="p-4 flex items-start gap-3.5 hover:bg-[#fbfbfc] cursor-pointer transition-colors"
          >
            <button className="mt-0.5 text-[#1677ff] shrink-0">
              {item.completed ? (
                <CheckCircle2 size={17} className="text-[#16a34a]" />
              ) : (
                <Circle size={17} className="text-[#d1d5db]" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className={`text-[13px] font-semibold ${item.completed ? 'text-[#111827]' : 'text-[#4b5563]'}`}>
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-[#6b7280] bg-[#f7f8fa] px-1.5 py-0.5 rounded border border-[#e5e7eb]">
                  {item.reference}
                </span>
              </div>
              <p className="text-[12px] text-[#4b5563] mb-2">{item.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#6b7280]">Target Evidence:</span>
                <Badge variant="neutral">{item.evidenceType}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
