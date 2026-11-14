import React from 'react';
import { BookOpen, Shield, Code, Server } from 'lucide-react';

export const DocsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
            Documentation & Knowledge Base
          </h1>
          <p className="text-[13px] text-[#6b7280] mt-0.5">
            Guides, specifications, and architecture references for VulnLedger supply-chain governance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 border border-[#e5e7eb] rounded-[8px] bg-white shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#111827]">
            <BookOpen size={16} />
            <h2 className="font-bold text-[14px] text-[#111827]">SBOM & Format Standards</h2>
          </div>
          <p className="text-[12.5px] text-[#4b5563] leading-relaxed">
            Learn how CycloneDX and SPDX representations are parsed into Package URLs (PURLs), licenses, and component dependency graphs.
          </p>
        </div>

        <div className="p-5 border border-[#e5e7eb] rounded-[8px] bg-white shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#111827]">
            <Shield size={16} />
            <h2 className="font-bold text-[14px] text-[#111827]">VEX & Exploitability Workflows</h2>
          </div>
          <p className="text-[12.5px] text-[#4b5563] leading-relaxed">
            Understand the four core VEX statuses (<span className="font-mono text-[11px] font-semibold">not_affected</span>, <span className="font-mono text-[11px] font-semibold">affected</span>, <span className="font-mono text-[11px] font-semibold">fixed</span>, <span className="font-mono text-[11px] font-semibold">under_investigation</span>) and justification taxonomy.
          </p>
        </div>

        <div className="p-5 border border-[#e5e7eb] rounded-[8px] bg-white shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#111827]">
            <Code size={16} />
            <h2 className="font-bold text-[14px] text-[#111827]">CLI Reference & CI Automation</h2>
          </div>
          <p className="text-[12.5px] text-[#4b5563] leading-relaxed">
            Run <span className="font-mono text-[11px] font-semibold text-[#111827]">vulnledger</span> commands directly in local developer terminals and automated GitHub/GitLab build runners.
          </p>
        </div>

        <div className="p-5 border border-[#e5e7eb] rounded-[8px] bg-white shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#111827]">
            <Server size={16} />
            <h2 className="font-bold text-[14px] text-[#111827]">Self-Hosting & Docker Guide</h2>
          </div>
          <p className="text-[12.5px] text-[#4b5563] leading-relaxed">
            Deploy VulnLedger on your own infrastructure with Docker Compose, PostgreSQL, and local volume storage.
          </p>
        </div>
      </div>
    </div>
  );
};
