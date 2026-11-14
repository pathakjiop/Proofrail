import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#e5e7eb] rounded-[6px] bg-[#fafafa]/50">
      <div className="w-10 h-10 rounded-[6px] bg-white border border-[#e5e7eb] flex items-center justify-center text-[#6b7280] mb-3 shadow-2xs">
        {icon}
      </div>
      <h3 className="text-[13px] font-semibold text-[#111827]">{title}</h3>
      <p className="text-[12px] text-[#6b7280] max-w-sm mt-1 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
