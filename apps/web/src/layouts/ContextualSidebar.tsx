import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Clock,
  Shield,
  FileCheck2,
  PackageCheck,
  FolderGit2,
  Boxes,
  Sparkles,
} from 'lucide-react';

export const ContextualSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  if (path === '/') {
    return (
      <div className="p-3 space-y-4 text-[12px] select-none">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] block mb-2">
            Quick Actions
          </span>
          <div className="space-y-1">
            <button
              onClick={() => navigate('/projects')}
              className="w-full text-left px-2 py-1.5 rounded-[4px] hover:bg-[#f3f4f6] text-[#374151] flex items-center gap-1.5 transition-colors"
            >
              <Plus size={12} className="text-[#1677ff]" /> New Project
            </button>
            <button
              onClick={() => navigate('/sbom')}
              className="w-full text-left px-2 py-1.5 rounded-[4px] hover:bg-[#f3f4f6] text-[#374151] flex items-center gap-1.5 transition-colors"
            >
              <Boxes size={12} className="text-[#1677ff]" /> Ingest SBOM
            </button>
            <button
              onClick={() => navigate('/vex')}
              className="w-full text-left px-2 py-1.5 rounded-[4px] hover:bg-[#f3f4f6] text-[#374151] flex items-center gap-1.5 transition-colors"
            >
              <FileCheck2 size={12} className="text-[#1677ff]" /> Draft VEX
            </button>
            <button
              onClick={() => navigate('/evidence')}
              className="w-full text-left px-2 py-1.5 rounded-[4px] hover:bg-[#f3f4f6] text-[#374151] flex items-center gap-1.5 transition-colors"
            >
              <PackageCheck size={12} className="text-[#1677ff]" /> Export Evidence
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-[#e5e7eb]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] block mb-2">
            Posture Baseline
          </span>
          <div className="space-y-2 text-[11px] text-[#4b5563]">
            <div className="flex justify-between">
              <span>Critical CVEs:</span>
              <span className="font-semibold text-[#16a34a]">0</span>
            </div>
            <div className="flex justify-between">
              <span>High CVEs:</span>
              <span className="font-semibold text-[#d97706]">1</span>
            </div>
            <div className="flex justify-between">
              <span>VEX Decided:</span>
              <span className="font-semibold text-[#1677ff]">100%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (path.startsWith('/projects')) {
    return (
      <div className="p-3 space-y-4 text-[12px] select-none">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] block mb-2">
            Project Views
          </span>
          <div className="space-y-1">
            <button className="w-full text-left px-2 py-1.5 rounded-[4px] bg-[#f3f4f6] font-medium text-[#111827]">
              All Active Repos
            </button>
            <button className="w-full text-left px-2 py-1.5 rounded-[4px] hover:bg-[#f3f4f6] text-[#4b5563]">
              Cloud Gateways
            </button>
            <button className="w-full text-left px-2 py-1.5 rounded-[4px] hover:bg-[#f3f4f6] text-[#4b5563]">
              Microservices
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-[#e5e7eb]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] block mb-2">
            Recent Releases
          </span>
          <div className="space-y-1.5 text-[11px] font-mono text-[#4b5563]">
            <div className="p-1.5 rounded bg-white border border-[#e5e7eb]">
              v1.4.0 (Cloud Gateway)
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (path.startsWith('/vulnerabilities')) {
    return (
      <div className="p-3 space-y-4 text-[12px] select-none">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] block mb-2">
            Severity Filter
          </span>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#f3f4f6] cursor-pointer">
              <span className="flex items-center gap-1.5 text-[#dc2626] font-medium">● Critical</span>
              <span className="text-[#9ca3af]">0</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#f3f4f6] cursor-pointer">
              <span className="flex items-center gap-1.5 text-[#d97706] font-medium">● High</span>
              <span className="text-[#9ca3af]">1</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#f3f4f6] cursor-pointer">
              <span className="flex items-center gap-1.5 text-[#eab308] font-medium">● Medium</span>
              <span className="text-[#9ca3af]">1</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#f3f4f6] cursor-pointer">
              <span className="flex items-center gap-1.5 text-[#3b82f6] font-medium">● Low</span>
              <span className="text-[#9ca3af]">0</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#e5e7eb]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] block mb-2">
            Scanner Sources
          </span>
          <div className="space-y-1 text-[11px] text-[#4b5563]">
            <div className="px-2 py-1 rounded hover:bg-[#f3f4f6] cursor-pointer">Trivy (1)</div>
            <div className="px-2 py-1 rounded hover:bg-[#f3f4f6] cursor-pointer">OSV-Scanner (1)</div>
          </div>
        </div>
      </div>
    );
  }

  if (path.startsWith('/vex')) {
    return (
      <div className="p-3 space-y-4 text-[12px] select-none">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] block mb-2">
            Decision Status
          </span>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#f3f4f6] cursor-pointer">
              <span className="text-[#16a34a] font-medium">Not Affected</span>
              <span className="text-[#9ca3af]">1</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#f3f4f6] cursor-pointer">
              <span className="text-[#dc2626] font-medium">Affected</span>
              <span className="text-[#9ca3af]">0</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#f3f4f6] cursor-pointer">
              <span className="text-[#2563eb] font-medium">Fixed</span>
              <span className="text-[#9ca3af]">0</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#f3f4f6] cursor-pointer">
              <span className="text-[#d97706] font-medium">Under Review</span>
              <span className="text-[#9ca3af]">0</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#e5e7eb]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] block mb-2">
            Standards
          </span>
          <div className="text-[11px] text-[#6b7280] space-y-1">
            <div>OpenVEX v0.2.0</div>
            <div>CSAF 2.0 Compliant</div>
          </div>
        </div>
      </div>
    );
  }

  // Default contextual fallback for other routes
  return (
    <div className="p-3 space-y-4 text-[12px] select-none text-[#6b7280]">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] block">
        Workspace Context
      </span>
      <div className="text-[11px]">
        Contextually synchronized to active resource.
      </div>
    </div>
  );
};
