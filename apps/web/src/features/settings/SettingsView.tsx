import React, { useState } from 'react';
import { Settings, Users, Key, Shield, Database, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'tokens' | 'system'>('general');
  const [tokens, setTokens] = useState([
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
      <div className="border-b border-[#e5e7eb] pb-4">
        <h1 className="text-[18px] font-semibold text-[#111827]">Organization Settings & Governance</h1>
        <p className="text-[12px] text-[#6b7280] mt-0.5">
          Manage team memberships, API credentials, and multi-tenant isolation parameters.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#e5e7eb]">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3 py-2 text-[12px] font-medium border-b-2 transition-colors ${
            activeTab === 'general'
              ? 'border-[#1677ff] text-[#1677ff]'
              : 'border-transparent text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-3 py-2 text-[12px] font-medium border-b-2 transition-colors ${
            activeTab === 'members'
              ? 'border-[#1677ff] text-[#1677ff]'
              : 'border-transparent text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          Team & RBAC
        </button>
        <button
          onClick={() => setActiveTab('tokens')}
          className={`px-3 py-2 text-[12px] font-medium border-b-2 transition-colors ${
            activeTab === 'tokens'
              ? 'border-[#1677ff] text-[#1677ff]'
              : 'border-transparent text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          API Tokens
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`px-3 py-2 text-[12px] font-medium border-b-2 transition-colors ${
            activeTab === 'system'
              ? 'border-[#1677ff] text-[#1677ff]'
              : 'border-transparent text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          System & Storage
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'general' && (
        <div className="border border-[#e5e7eb] rounded-[4px] bg-white p-5 space-y-4">
          <h2 className="text-[13px] font-semibold text-[#111827]">Organization Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-medium text-[#6b7280] block mb-1">
                Organization Name
              </label>
              <input
                type="text"
                disabled
                value="Acme DevSec Corp"
                className="w-full h-8 px-2.5 text-[12px] bg-[#f7f8fa] border border-[#e5e7eb] rounded-[4px] text-[#374151]"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#6b7280] block mb-1">
                Identifier Slug
              </label>
              <input
                type="text"
                disabled
                value="acme-devsec"
                className="w-full h-8 px-2.5 text-[12px] font-mono bg-[#f7f8fa] border border-[#e5e7eb] rounded-[4px] text-[#374151]"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="border border-[#e5e7eb] rounded-[4px] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-[#111827]">Team Members & Roles (RBAC)</h2>
            <Button variant="secondary" size="sm">
              Invite Member
            </Button>
          </div>
          <div className="divide-y divide-[#e5e7eb]">
            <div className="py-2.5 flex items-center justify-between text-[12px]">
              <div>
                <span className="font-medium text-[#111827] block">Alex Rivera</span>
                <span className="text-[11px] text-[#6b7280]">founder@vulnledger.io</span>
              </div>
              <Badge variant="primary">Owner</Badge>
            </div>
            <div className="py-2.5 flex items-center justify-between text-[12px]">
              <div>
                <span className="font-medium text-[#111827] block">Security Reviewer Bot</span>
                <span className="text-[11px] text-[#6b7280]">ci-bot@vulnledger.io</span>
              </div>
              <Badge variant="neutral">Security Reviewer</Badge>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tokens' && (
        <div className="border border-[#e5e7eb] rounded-[4px] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-[#111827]">CLI & API Tokens</h2>
              <p className="text-[11px] text-[#6b7280]">
                High-entropy bearer tokens for automated CLI execution and build systems.
              </p>
            </div>
            <Button variant="primary" size="sm">
              Generate New Token
            </Button>
          </div>
          <div className="divide-y divide-[#e5e7eb]">
            {tokens.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between text-[12px]">
                <div>
                  <span className="font-medium text-[#111827] block">{t.name}</span>
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
        <div className="border border-[#e5e7eb] rounded-[4px] bg-white p-5 space-y-3">
          <h2 className="text-[13px] font-semibold text-[#111827]">System Diagnostics & Health</h2>
          <div className="space-y-2 text-[12px]">
            <div className="flex items-center justify-between p-2.5 bg-[#fbfbfc] border border-[#e5e7eb] rounded">
              <span className="font-medium text-[#111827]">API Gateway Service</span>
              <span className="text-[#16a34a] font-medium flex items-center gap-1">
                <CheckCircle2 size={13} /> Axum 0.8 / Tokio Operational
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#fbfbfc] border border-[#e5e7eb] rounded">
              <span className="font-medium text-[#111827]">Artifact Storage Backend</span>
              <span className="text-[#16a34a] font-medium flex items-center gap-1">
                <CheckCircle2 size={13} /> Local Filesystem Storage (Encrypted / Safe)
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#fbfbfc] border border-[#e5e7eb] rounded">
              <span className="font-medium text-[#111827]">Database Schema State</span>
              <span className="text-[#16a34a] font-medium flex items-center gap-1">
                <CheckCircle2 size={13} /> Multi-tenant Scopes Enforced
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
