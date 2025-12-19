'use client';

import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
}

export default function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Проверка размера
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Файл "${file.name}" слишком большой. Максимальный размер: ${maxSizeMB}MB`;
    }

    // Проверка типа (базовая)
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isAccepted = acceptedTypes.some((type) => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type || fileExtension === type;
    });

    if (!isAccepted) {
      return `Файл "${file.name}" имеет неподдерживаемый тип. Разрешены: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    // Проверка лимита файлов
    if (files.length + selectedFiles.length > maxFiles) {
      newErrors.push(`Можно загрузить не более ${maxFiles} файлов`);
      setErrors(newErrors);
      return;
    }

    selectedFiles.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      setErrors([]);
    }

    // Сброс input для возможности повторной загрузки того же файла
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    setErrors([]);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs sm:text-sm font-medium mb-2 light:text-gray-700">
          Вложения (опционально)
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || files.length >= maxFiles}
            className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed light:bg-white light:border-gray-300 light:hover:bg-gray-50 light:text-gray-900"
          >
            {files.length >= maxFiles ? 'Достигнут лимит файлов' : 'Выбрать файлы'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || files.length >= maxFiles}
          />
          {files.length > 0 && (
            <span className="text-xs sm:text-sm text-white/60 light:text-gray-500 self-center">
              Загружено: {files.length} / {maxFiles}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-white/50 light:text-gray-400">
          Максимум {maxFiles} файлов, до {maxSizeMB}MB каждый. Разрешены: изображения, PDF, документы
        </p>
      </div>

      {errors.length > 0 && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs sm:text-sm text-red-400 light:bg-red-50 light:border-red-200 light:text-red-700">
          {errors.map((error, i) => (
            <div key={i}>{error}</div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5 light:bg-gray-50 light:border-gray-200"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center light:bg-gray-200">
                  <svg className="w-5 h-5 text-white/60 light:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-medium truncate light:text-gray-900">{file.name}</div>
                  <div className="text-xs text-white/50 light:text-gray-500">{formatFileSize(file.size)}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={disabled}
                className="ml-3 p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition disabled:opacity-50"
                aria-label="Удалить файл"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

