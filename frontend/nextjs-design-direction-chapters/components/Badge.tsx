import { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white/80 border-white/20 light:bg-gray-100 light:text-gray-700 light:border-gray-300',
    success: 'bg-green-500/20 text-green-300 border-green-500/40 light:bg-green-100 light:text-green-700 light:border-green-300',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 light:bg-yellow-100 light:text-yellow-700 light:border-yellow-300',
    error: 'bg-red-500/20 text-red-300 border-red-500/40 light:bg-red-100 light:text-red-700 light:border-red-300',
    info: 'bg-blue-500/20 text-blue-300 border-blue-500/40 light:bg-blue-100 light:text-blue-700 light:border-blue-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

