import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'sm',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-1.5 font-semibold transition-colors duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variantStyles = {
    primary:
      'bg-[#a3e635] hover:bg-[#84cc16] text-[#111827] border border-transparent shadow-xs',
    secondary:
      'bg-white hover:bg-[#f9fafb] text-[#111827] border border-[#e5e7eb] shadow-2xs font-medium',
    danger:
      'bg-[#dc2626] hover:bg-[#b91c1c] text-white border border-transparent shadow-xs font-medium',
    ghost:
      'bg-transparent hover:bg-[#f3f4f6] text-[#4b5563] hover:text-[#111827] border border-transparent font-medium',
  };

  const sizeStyles = {
    sm: 'text-[12px] px-3 py-1.5 rounded-[6px] h-8',
    md: 'text-[12.5px] px-3.5 py-1.5 rounded-[6px] h-8.5',
    lg: 'text-[13px] px-4 py-2 rounded-[6px] h-9',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="inline-flex shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};
