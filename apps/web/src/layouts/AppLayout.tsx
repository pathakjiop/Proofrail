import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  ShieldAlert,
  Boxes,
  FileCheck2,
  PackageCheck,
  Scale,
  Workflow,
  BookOpen,
  Settings,
  ChevronDown,
  Search,
  Bell,
  Command,
  HelpCircle,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  contextualSidebar?: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  primaryAction?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  contextualSidebar,
  title,
  breadcrumbs = [{ label: 'Acme DevSec Corp' }],
  primaryAction,
}) => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', to: '/', icon: LayoutDashboard },
    { label: 'Projects', to: '/projects', icon: FolderGit2 },
    { label: 'Vulnerabilities', to: '/vulnerabilities', icon: ShieldAlert },
    { label: 'SBOM Inventory', to: '/sbom', icon: Boxes },
    { label: 'VEX Statements', to: '/vex', icon: FileCheck2 },
    { label: 'Evidence Center', to: '/evidence', icon: PackageCheck },
    { label: 'CRA Readiness', to: '/cra-readiness', icon: Scale },
    { label: 'Integrations', to: '/integrations', icon: Workflow },
    { label: 'Documentation', to: '/docs', icon: BookOpen },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-[#111827]">
      {/* COLUMN 1: Primary Navigation (~176px wide) */}
      <aside className="w-[176px] shrink-0 border-r border-[#e5e7eb] flex flex-col justify-between bg-white select-none">
        <div>
          {/* Brand & Workspace Switcher */}
          <div className="p-3 border-b border-[#e5e7eb]">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded-[4px] bg-[#1677ff] flex items-center justify-center text-white font-bold text-[11px] tracking-tight shadow-2xs">
                VL
              </div>
              <span className="font-semibold text-[13px] tracking-tight text-[#111827]">
                VulnLedger
              </span>
            </div>

            <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-[4px] text-[12px] bg-[#f7f8fa] hover:bg-[#f1f2f5] border border-[#e5e7eb] text-[#374151] transition-colors">
              <span className="truncate font-medium">Acme DevSec</span>
              <ChevronDown size={13} className="text-[#9ca3af] shrink-0" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#f3f4f6] text-[#111827] font-semibold'
                      : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f9fafb]'
                  }`}
                >
                  <Icon
                    size={14}
                    className={isActive ? 'text-[#1677ff]' : 'text-[#6b7280]'}
                  />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-2.5 border-t border-[#e5e7eb]">
          <div className="flex items-center gap-2 px-1.5 py-1 rounded-[4px] hover:bg-[#f7f8fa] transition-colors cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-[#e0e7ff] text-[#4338ca] font-semibold text-[11px] flex items-center justify-center shrink-0">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-[#111827] truncate">
                Alex Rivera
              </div>
              <div className="text-[10px] text-[#6b7280] truncate">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* COLUMN 2: Contextual Sidebar (~176px wide) */}
      {contextualSidebar && (
        <aside className="w-[176px] shrink-0 border-r border-[#e5e7eb] bg-[#fbfbfc] flex flex-col overflow-y-auto">
          {contextualSidebar}
        </aside>
      )}

      {/* COLUMN 3: Main Workspace (Flexible remaining width) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Top Header */}
        <header className="h-12 border-b border-[#e5e7eb] px-6 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5 text-[12px] text-[#6b7280] truncate">
              {breadcrumbs.map((b, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span>/</span>}
                  <span
                    className={
                      idx === breadcrumbs.length - 1
                        ? 'text-[#111827] font-medium'
                        : 'hover:text-[#111827] transition-colors'
                    }
                  >
                    {b.label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Command/Search Bar */}
            <div className="relative hidden md:block">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af]"
              />
              <input
                type="text"
                placeholder="Search resources..."
                className="h-7 w-48 pl-7 pr-8 text-[12px] bg-[#f7f8fa] border border-[#e5e7eb] rounded-[4px] text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#1677ff] focus:bg-white transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-[#9ca3af] border border-[#e5e7eb] rounded px-1 bg-white">
                <Command size={10} />K
              </div>
            </div>

            <button className="text-[#6b7280] hover:text-[#111827] p-1.5 rounded-[4px] hover:bg-[#f7f8fa] transition-colors">
              <Bell size={14} />
            </button>
            <button className="text-[#6b7280] hover:text-[#111827] p-1.5 rounded-[4px] hover:bg-[#f7f8fa] transition-colors">
              <HelpCircle size={14} />
            </button>

            {primaryAction && <div className="ml-1">{primaryAction}</div>}
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="max-w-[1200px] mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};
