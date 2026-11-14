import React, { useState } from 'react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { CheckCircle2, Plus } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'tokens' | 'system'>('general');
  const [tokens] = useState([
    {
      id: 'tok-1',
      name: 'CI/CD GitHub Actions Pipeline',
      prefix: 'vlg_live_4a9b...72e1',
      created: '2026-11-10',
      lastUsed: 'Just now',
    },
  ]);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
            Organization Settings & Governance
          </h1>
          <p className="text-[13px] text-[#6b7280] mt-0.5">
            Manage team memberships, API credentials, and multi-tenant isolation parameters.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#e5e7eb] text-[13px]">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2.5 font-semibold transition-colors ${
            activeTab === 'general'
              ? 'border-b-2 border-[#111827] text-[#111827]'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-2.5 font-semibold transition-colors ${
            activeTab === 'members'
              ? 'border-b-2 border-[#111827] text-[#111827]'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          Team & RBAC
        </button>
        <button
          onClick={() => setActiveTab('tokens')}
          className={`pb-2.5 font-semibold transition-colors ${
            activeTab === 'tokens'
              ? 'border-b-2 border-[#111827] text-[#111827]'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          API Tokens
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`pb-2.5 font-semibold transition-colors ${
            activeTab === 'system'
              ? 'border-b-2 border-[#111827] text-[#111827]'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          System & Storage
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'general' && (
        <div className="rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs space-y-4">
          <h2 className="text-[14px] font-bold text-[#111827]">Organization Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#6b7280] block mb-1">
                Organization Name
              </label>
              <input
                type="text"
                disabled
                value="Acme DevSec Corp"
                className="w-full h-8 px-2.5 text-[12px] bg-[#fafafa] border border-[#e5e7eb] rounded-[5px] text-[#374151]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6b7280] block mb-1">
                Identifier Slug
              </label>
              <input
                type="text"
                disabled
                value="acme-devsec"
                className="w-full h-8 px-2.5 text-[12px] font-mono bg-[#fafafa] border border-[#e5e7eb] rounded-[5px] text-[#374151]"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-[#111827]">Team Members & Roles (RBAC)</h2>
            <Button variant="secondary" size="sm">
              Invite Member
            </Button>
          </div>
          <div className="divide-y divide-[#f0f0f0]">
            <div className="py-3 flex items-center justify-between text-[12px]">
              <div>
                <span className="font-bold text-[#111827] block">Alex Rivera</span>
                <span className="text-[11px] text-[#6b7280]">founder@vulnledger.io</span>
              </div>
              <Badge variant="primary">Owner</Badge>
            </div>
            <div className="py-3 flex items-center justify-between text-[12px]">
              <div>
                <span className="font-bold text-[#111827] block">Security Reviewer Bot</span>
                <span className="text-[11px] text-[#6b7280]">ci-bot@vulnledger.io</span>
              </div>
              <Badge variant="neutral">Security Reviewer</Badge>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tokens' && (
        <div className="rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-bold text-[#111827]">CLI & API Tokens</h2>
              <p className="text-[11.5px] text-[#6b7280]">
                High-entropy bearer tokens for automated CLI execution and build systems.
              </p>
            </div>
            <button className="inline-flex items-center gap-1.5 h-8 px-3.5 text-[12px] font-semibold text-black bg-[#a3e635] hover:bg-[#84cc16] rounded-[6px] transition-colors shadow-xs">
              <Plus size={13} className="stroke-[2.5]" />
              Generate Token
            </button>
          </div>
          <div className="divide-y divide-[#f0f0f0]">
            {tokens.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between text-[12px]">
                <div>
                  <span className="font-bold text-[#111827] block">{t.name}</span>
                  <span className="font-mono text-[11px] text-[#6b7280]">{t.prefix}</span>
                </div>
                <div className="text-right text-[11px] text-[#9ca3af]">
                  <div>Created: {t.created}</div>
                  <div>Used: {t.lastUsed}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="rounded-[8px] border border-[#e5e7eb] bg-white p-5 shadow-2xs space-y-3.5">
          <h2 className="text-[14px] font-bold text-[#111827]">System Diagnostics & Health</h2>
          <div className="space-y-2.5 text-[12px]">
            <div className="flex items-center justify-between p-3 bg-[#fafafa] border border-[#e5e7eb] rounded-[6px]">
              <span className="font-bold text-[#111827]">API Gateway Service</span>
              <span className="text-[#15803d] font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Axum 0.8 / Tokio Operational
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#fafafa] border border-[#e5e7eb] rounded-[6px]">
              <span className="font-bold text-[#111827]">Artifact Storage Backend</span>
              <span className="text-[#15803d] font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Local Filesystem Storage (Verified)
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#fafafa] border border-[#e5e7eb] rounded-[6px]">
              <span className="font-bold text-[#111827]">Multi-Tenant Isolation Scopes</span>
              <span className="text-[#15803d] font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Strict Organization Scoping Active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
