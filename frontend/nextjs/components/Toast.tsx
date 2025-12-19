'use client';

import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export default function ToastComponent({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const typeStyles = {
    success: 'bg-green-500/20 border-green-500/40 text-green-400 light:bg-green-50 light:border-green-200 light:text-green-700',
    error: 'bg-red-500/20 border-red-500/40 text-red-400 light:bg-red-50 light:border-red-200 light:text-red-700',
    info: 'bg-blue-500/20 border-blue-500/40 text-blue-400 light:bg-blue-50 light:border-blue-200 light:text-blue-700',
    warning: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400 light:bg-yellow-50 light:border-yellow-200 light:text-yellow-700',
  };

  const icons = {
