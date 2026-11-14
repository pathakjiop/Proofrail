import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Layers,
  Shield,
  Box,
  Code2,
  Package,
  CircleDot,
  GitFork,
  BookOpen,
  Settings,
  ChevronDown,
  Search,
  Bell,
  HelpCircle,
  MoreHorizontal,
  Building2,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  breadcrumbs = [{ label: 'Acme DevSec Corp' }, { label: 'Overview' }],
}) => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', to: '/', icon: Home },
    { label: 'Projects', to: '/projects', icon: Layers },
    { label: 'Vulnerabilities', to: '/vulnerabilities', icon: Shield, badge: '18' },
    { label: 'SBOM Inventory', to: '/sbom', icon: Box },
    { label: 'VEX Statements', to: '/vex', icon: Code2 },
    { label: 'Evidence Center', to: '/evidence', icon: Package },
    { label: 'CRA Readiness', to: '/cra-readiness', icon: CircleDot },
    { label: 'Integrations', to: '/integrations', icon: GitFork },
    { label: 'Documentation', to: '/docs', icon: BookOpen },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f9fafb] text-[#111827]">
      {/* LEFT SIDEBAR (Width ~235px) */}
      <aside className="w-[235px] shrink-0 border-r border-[#e5e7eb] flex flex-col justify-between bg-white select-none">
        <div>
          {/* Top Brand Logo */}
          <div className="p-4 pb-3">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-6 h-6 rounded-[5px] bg-[#a3e635] flex items-center justify-center text-black font-extrabold text-[12px] tracking-tight shadow-xs">
                VL
              </div>
              <span className="font-bold text-[16px] tracking-tight text-[#111827]">
                VulnLedger
              </span>
            </div>

            {/* Workspace Switcher Card */}
            <div className="flex items-center justify-between p-2 rounded-[6px] border border-[#e5e7eb] bg-white hover:bg-[#fbfbfc] cursor-pointer transition-colors shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded bg-[#f3f4f6] text-[#4b5563] flex items-center justify-center shrink-0">
                  <Building2 size={13} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-[#111827] truncate leading-tight">
                    Acme DevSec
                  </div>
                  <div className="text-[10px] text-[#6b7280] truncate leading-tight mt-0.5">
                    Enterprise Workspace
                  </div>
                </div>
              </div>
              <ChevronDown size={14} className="text-[#9ca3af] shrink-0 ml-1" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-0.5">
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
                  className={`flex items-center justify-between px-3 py-2 rounded-[6px] text-[12.5px] transition-colors ${
                    isActive
                      ? 'bg-[#ecfccb] text-[#111827] font-semibold'
                      : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      className={isActive ? 'text-[#111827]' : 'text-[#6b7280]'}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-[#f3f4f6] text-[#4b5563]">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div className="p-3 border-t border-[#e5e7eb]">
          <div className="flex items-center justify-between p-1.5 rounded-[6px] hover:bg-[#f3f4f6] transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#a3e635] text-black font-bold text-[11px] flex items-center justify-center shrink-0">
                AR
              </div>
              <div>
                <div className="text-[12px] font-semibold text-[#111827] leading-tight">
                  Alex Rivera
                </div>
                <div className="text-[10.5px] text-[#6b7280] leading-tight mt-0.5">
                  Platform Admin
                </div>
              </div>
            </div>
            <button className="text-[#9ca3af] hover:text-[#4b5563] p-1">
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f9fafb]">
        {/* Top Header Bar */}
        <header className="h-12 border-b border-[#e5e7eb] px-6 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2 text-[12.5px] text-[#6b7280]">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[#d1d5db]">/</span>}
                <span
                  className={
                    idx === breadcrumbs.length - 1
                      ? 'text-[#111827] font-semibold'
                      : 'hover:text-[#111827] cursor-pointer'
                  }
                >
                  {b.label}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af]"
              />
              <input
                type="text"
                placeholder="Search resources..."
                className="h-7 w-56 pl-7 pr-12 text-[12px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[5px] text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-[#111827] focus:bg-white transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-[#9ca3af] border border-[#e5e7eb] rounded px-1 bg-white font-mono">
                Ctrl K
              </div>
            </div>

            {/* Notification Bell with Orange Dot */}
            <button className="relative text-[#6b7280] hover:text-[#111827] p-1.5 rounded hover:bg-[#f3f4f6] transition-colors">
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f97316] ring-2 ring-white" />
            </button>

            {/* Help Question Icon */}
            <button className="text-[#6b7280] hover:text-[#111827] p-1.5 rounded hover:bg-[#f3f4f6] transition-colors">
              <HelpCircle size={15} />
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto px-7 py-6">
          <div className="max-w-[1300px] mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
