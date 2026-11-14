import React from 'react';
import { BookOpen, Shield, Code, Server, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const DocsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-[#e5e7eb] pb-4">
        <h1 className="text-[18px] font-semibold text-[#111827]">Documentation & Knowledge Base</h1>
        <p className="text-[12px] text-[#6b7280] mt-0.5">
          Guides, specifications, and architecture references for VulnLedger supply-chain governance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-[#e5e7eb] rounded-[4px] bg-white space-y-2">
          <div className="flex items-center gap-2 text-[#1677ff]">
            <BookOpen size={16} />
            <h2 className="font-semibold text-[13px] text-[#111827]">SBOM & Format Standards</h2>
          </div>
          <p className="text-[12px] text-[#4b5563]">
            Learn how CycloneDX and SPDX representations are parsed into Package URLs (PURLs), licenses, and component graphs.
          </p>
        </div>

        <div className="p-4 border border-[#e5e7eb] rounded-[4px] bg-white space-y-2">
          <div className="flex items-center gap-2 text-[#1677ff]">
            <Shield size={16} />
            <h2 className="font-semibold text-[13px] text-[#111827]">VEX & Exploitability Workflows</h2>
          </div>
          <p className="text-[12px] text-[#4b5563]">
            Understand the four core VEX statuses (<span className="font-mono text-[11px]">not_affected</span>, <span className="font-mono text-[11px]">affected</span>, <span className="font-mono text-[11px]">fixed</span>, <span className="font-mono text-[11px]">under_investigation</span>) and justification taxonomy.
          </p>
        </div>

        <div className="p-4 border border-[#e5e7eb] rounded-[4px] bg-white space-y-2">
          <div className="flex items-center gap-2 text-[#1677ff]">
            <Code size={16} />
            <h2 className="font-semibold text-[13px] text-[#111827]">CLI Reference & CI Automation</h2>
          </div>
          <p className="text-[12px] text-[#4b5563]">
            Run <span className="font-mono text-[11px]">vulnledger</span> commands directly in local developer environments and automated GitHub/GitLab runners.
          </p>
        </div>

        <div className="p-4 border border-[#e5e7eb] rounded-[4px] bg-white space-y-2">
          <div className="flex items-center gap-2 text-[#1677ff]">
            <Server size={16} />
            <h2 className="font-semibold text-[13px] text-[#111827]">Self-Hosting & Docker Guide</h2>
          </div>
          <p className="text-[12px] text-[#4b5563]">
            Deploy VulnLedger on your own infrastructure with Docker Compose, PostgreSQL, and local volume storage.
          </p>
        </div>
      </div>
    </div>
  );
};
