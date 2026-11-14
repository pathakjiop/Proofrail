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
    'inline-flex items-center justify-center gap-1.5 font-medium transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-[#1677ff] hover:bg-[#0958d9] text-white border border-transparent shadow-none focus:ring-[#1677ff]',
    secondary:
      'bg-white hover:bg-[#f7f8fa] text-[#111827] border border-[#e5e7eb] focus:ring-[#e5e7eb]',
    danger:
      'bg-[#dc2626] hover:bg-[#b91c1c] text-white border border-transparent focus:ring-[#dc2626]',
    ghost:
      'bg-transparent hover:bg-[#f7f8fa] text-[#4b5563] hover:text-[#111827] border border-transparent focus:ring-transparent',
  };

  const sizeStyles = {
    sm: 'text-[12px] px-2.5 py-1 rounded-[4px] h-7',
    md: 'text-[13px] px-3.5 py-1.5 rounded-[4px] h-8',
    lg: 'text-[14px] px-4 py-2 rounded-[5px] h-9',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="inline-flex shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};
