import React from 'react';
import { Severity, VexStatus, RemediationStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-[#f7f8fa] text-[#4b5563] border-[#e5e7eb]',
    primary: 'bg-[#eff6ff] text-[#1677ff] border-[#bfdbfe]',
    success: 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]',
    warning: 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]',
    danger: 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]',
    neutral: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.5 leading-none font-medium',
    md: 'text-[12px] px-2 py-1 leading-none font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[3px] border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  switch (severity) {
    case 'critical':
      return <Badge variant="danger">Critical</Badge>;
    case 'high':
      return <Badge variant="warning">High</Badge>;
    case 'medium':
      return <Badge variant="neutral">Medium</Badge>;
    case 'low':
      return <Badge variant="default">Low</Badge>;
    default:
      return <Badge variant="default">Unknown</Badge>;
  }
};

export const VexStatusBadge: React.FC<{ status: VexStatus }> = ({ status }) => {
  switch (status) {
    case 'not_affected':
      return <Badge variant="success">Not Affected</Badge>;
    case 'affected':
      return <Badge variant="danger">Affected</Badge>;
    case 'fixed':
      return <Badge variant="primary">Fixed</Badge>;
    case 'under_investigation':
      return <Badge variant="warning">Under Investigation</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

export const RemediationBadge: React.FC<{ status: RemediationStatus }> = ({ status }) => {
  switch (status) {
    case 'resolved':
      return <Badge variant="success">Resolved</Badge>;
    case 'mitigated':
      return <Badge variant="primary">Mitigated</Badge>;
    case 'under_review':
      return <Badge variant="warning">Under Review</Badge>;
    case 'open':
      return <Badge variant="danger">Open</Badge>;
    case 'ignored':
      return <Badge variant="neutral">Ignored</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};
