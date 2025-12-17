import { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white/80 border-white/20',
    success: 'bg-green-500/20 text-green-300 border-green-500/40',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    error: 'bg-red-500/20 text-red-300 border-red-500/40',
    info: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

