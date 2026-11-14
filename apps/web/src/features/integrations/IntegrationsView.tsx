import React, { useState } from 'react';
import {
  Workflow,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  GitBranch,
  Boxes,
  Code2,
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

  const githubActionYaml = `name: VulnLedger Evidence Pipeline
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

      - name: Ingest & Seal in VulnLedger
        env:
          VULNLEDGER_API_URL: \${{ secrets.VULNLEDGER_API_URL }}
          VULNLEDGER_API_TOKEN: \${{ secrets.VULNLEDGER_TOKEN }}
        run: |
          curl -sSL https://get.vulnledger.io | sh
          vulnledger sbom upload --project \${{ vars.VL_PROJECT_ID }} --release \${{ github.ref_name }} ./sbom.json
          vulnledger scan import --project \${{ vars.VL_PROJECT_ID }} --release \${{ github.ref_name }} ./trivy-results.json
          vulnledger evidence export --project \${{ vars.VL_PROJECT_ID }} --release \${{ github.ref_name }} --out evidence.zip
`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#e5e7eb] pb-4">
        <h1 className="text-[18px] font-semibold text-[#111827]">Developer & CI/CD Integrations</h1>
        <p className="text-[12px] text-[#6b7280] mt-0.5">
          Connect your terminal, GitHub Actions, and container scanning pipelines to the VulnLedger evidence engine.
        </p>
      </div>

      {/* CLI Section */}
      <div className="border border-[#e5e7eb] rounded-[4px] bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-[#111827] text-white flex items-center justify-center">
              <Terminal size={15} />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[#111827]">VulnLedger Developer CLI</h2>
              <p className="text-[11px] text-[#6b7280]">
                High-performance Rust CLI for local terminal workflows and headless CI automation.
              </p>
            </div>
          </div>
          <Badge variant="primary">v0.1.0 (Rust)</Badge>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wider block">
            Install via Cargo
          </label>
          <div className="relative">
            <pre className="p-3 bg-[#111827] text-[#f3f4f6] font-mono text-[12px] rounded-[4px] overflow-x-auto">
              cargo install --path apps/cli
            </pre>
            <button
              onClick={() => copyToClipboard('cargo install --path apps/cli', 'cli-install')}
              className="absolute right-2.5 top-2.5 p-1 text-[#9ca3af] hover:text-white bg-[#1f2937] rounded transition-colors"
            >
              {copiedId === 'cli-install' ? <Check size={13} className="text-[#10b981]" /> : <Copy size={13} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 text-[12px]">
          <div className="p-2.5 border border-[#e5e7eb] rounded bg-[#fbfbfc]">
            <span className="font-mono font-semibold text-[#111827] block mb-0.5">vulnledger doctor</span>
            <span className="text-[11px] text-[#6b7280]">Inspect local scanners (Syft, Trivy, OSV)</span>
          </div>
          <div className="p-2.5 border border-[#e5e7eb] rounded bg-[#fbfbfc]">
            <span className="font-mono font-semibold text-[#111827] block mb-0.5">vulnledger sbom validate</span>
            <span className="text-[11px] text-[#6b7280]">Validate CycloneDX & SPDX packages</span>
          </div>
          <div className="p-2.5 border border-[#e5e7eb] rounded bg-[#fbfbfc]">
            <span className="font-mono font-semibold text-[#111827] block mb-0.5">vulnledger evidence export</span>
            <span className="text-[11px] text-[#6b7280]">Download cryptographically sealed ZIP</span>
          </div>
        </div>
      </div>

      {/* GitHub Actions Workflow */}
      <div className="border border-[#e5e7eb] rounded-[4px] bg-white p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch size={15} className="text-[#1677ff]" />
            <h2 className="text-[14px] font-semibold text-[#111827]">GitHub Actions Workflow</h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={copiedId === 'gh-yaml' ? <Check size={12} className="text-[#10b981]" /> : <Copy size={12} />}
            onClick={() => copyToClipboard(githubActionYaml, 'gh-yaml')}
          >
            {copiedId === 'gh-yaml' ? 'Copied' : 'Copy Workflow'}
          </Button>
        </div>
        <p className="text-[12px] text-[#6b7280]">
          Add this to <span className="font-mono text-[#111827]">.github/workflows/vulnledger.yml</span> to automatically generate SBOMs, scan for vulnerabilities, and assemble evidence on every release.
        </p>

        <pre className="p-3.5 bg-[#fbfbfc] border border-[#e5e7eb] text-[#1e293b] font-mono text-[11px] rounded-[4px] overflow-x-auto leading-relaxed">
          {githubActionYaml}
        </pre>
      </div>
    </div>
  );
};
