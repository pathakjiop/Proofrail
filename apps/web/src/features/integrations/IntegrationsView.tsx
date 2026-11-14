import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  GitBranch,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const IntegrationsView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const githubActionYaml = `name: Proofrail Evidence Pipeline
on:
  push:
    tags: ['v*']

jobs:
  supply-chain-security:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Generate CycloneDX SBOM with Syft
        uses: anchore/sbom-action@v0
        with:
          format: cyclonedx-json
          output-file: ./sbom.json

      - name: Run Trivy Security Scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          format: 'json'
          output: 'trivy-results.json'

      - name: Ingest & Seal in Proofrail
        env:
          PROOFRAIL_API_URL: \${{ secrets.PROOFRAIL_API_URL }}
          PROOFRAIL_API_TOKEN: \${{ secrets.PROOFRAIL_TOKEN }}
        run: |
          curl -sSL https://get.proofrail.io | sh
          proofrail sbom upload --project \${{ vars.PROOFRAIL_PROJECT_ID }} --release \${{ github.ref_name }} ./sbom.json
          proofrail scan import --project \${{ vars.PROOFRAIL_PROJECT_ID }} --release \${{ github.ref_name }} ./trivy-results.json
          proofrail evidence export --project \${{ vars.PROOFRAIL_PROJECT_ID }} --release \${{ github.ref_name }} --out evidence.zip
`;

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
            Developer & CI/CD Integrations
          </h1>
          <p className="text-[13px] text-[#6b7280] mt-0.5">
            Connect your terminal, GitHub Actions, and container scanning pipelines to the Proofrail evidence engine.
          </p>
        </div>
      </div>

      {/* CLI Section */}
      <div className="rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[6px] bg-[#111827] text-white flex items-center justify-center shrink-0">
              <Terminal size={16} />
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold text-[#111827]">Proofrail Developer CLI</h2>
              <p className="text-[11.5px] text-[#6b7280]">
                High-performance Rust CLI for local terminal workflows and headless CI automation.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#ecfccb] text-[#3f6212] font-semibold border border-[#d9f99d]">
            v0.1.0 (Rust)
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider block">
            Install via Cargo
          </label>
          <div className="relative">
            <pre className="p-3.5 bg-[#111827] text-[#f3f4f6] font-mono text-[12px] rounded-[6px] overflow-x-auto">
              cargo install --path apps/cli
            </pre>
            <button
              onClick={() => copyToClipboard('cargo install --path apps/cli', 'cli-install')}
              className="absolute right-2.5 top-2.5 p-1.5 text-[#9ca3af] hover:text-white bg-[#1f2937] rounded transition-colors"
            >
              {copiedId === 'cli-install' ? <Check size={13} className="text-[#a3e635]" /> : <Copy size={13} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[12px]">
          <div className="p-3 border border-[#e5e7eb] rounded-[6px] bg-[#fafafa]">
            <span className="font-mono font-bold text-[#111827] block mb-1">proofrail doctor</span>
            <span className="text-[11.5px] text-[#6b7280]">Inspect local scanners (Syft, Trivy, OSV)</span>
          </div>
          <div className="p-3 border border-[#e5e7eb] rounded-[6px] bg-[#fafafa]">
            <span className="font-mono font-bold text-[#111827] block mb-1">proofrail sbom validate</span>
            <span className="text-[11.5px] text-[#6b7280]">Validate CycloneDX & SPDX packages</span>
          </div>
          <div className="p-3 border border-[#e5e7eb] rounded-[6px] bg-[#fafafa]">
            <span className="font-mono font-bold text-[#111827] block mb-1">proofrail evidence export</span>
            <span className="text-[11.5px] text-[#6b7280]">Download cryptographically sealed ZIP</span>
          </div>
        </div>
      </div>

      {/* GitHub Actions Workflow */}
      <div className="rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-[#111827]" />
            <h2 className="text-[14.5px] font-bold text-[#111827]">GitHub Actions Workflow</h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={copiedId === 'gh-yaml' ? <Check size={12} className="text-[#16a34a]" /> : <Copy size={12} />}
            onClick={() => copyToClipboard(githubActionYaml, 'gh-yaml')}
          >
            {copiedId === 'gh-yaml' ? 'Copied' : 'Copy Workflow'}
          </Button>
        </div>
        <p className="text-[12.5px] text-[#6b7280]">
          Add this to <span className="font-mono font-semibold text-[#111827]">.github/workflows/proofrail.yml</span> to automatically generate SBOMs, scan for vulnerabilities, and assemble evidence on every release.
        </p>

        <pre className="p-4 bg-[#fafafa] border border-[#e5e7eb] text-[#111827] font-mono text-[11.5px] rounded-[6px] overflow-x-auto leading-relaxed">
          {githubActionYaml}
        </pre>
      </div>
    </div>
  );
};
