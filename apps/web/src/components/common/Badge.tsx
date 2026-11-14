import React from 'react';
import { Severity, VexStatus, RemediationStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
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
    default: 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]',
    primary: 'bg-[#ecfccb] text-[#3f6212] border-[#d9f99d]',
    success: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]',
    warning: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]',
    danger: 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]',
    info: 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]',
    neutral: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 leading-none font-medium rounded-[4px]',
    md: 'text-[12px] px-2.5 py-1 leading-none font-medium rounded-[5px]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
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
      return (
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-[4px] border bg-[#fef9c3] text-[#a16207] border-[#fef08a]">
          Medium
        </span>
      );
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
      return <Badge variant="info">Fixed</Badge>;
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
      return <Badge variant="info">Mitigated</Badge>;
    case 'under_review':
      return <Badge variant="info">In Review</Badge>;
    case 'open':
      return <Badge variant="danger">Open</Badge>;
    case 'ignored':
      return <Badge variant="neutral">Ignored</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};
