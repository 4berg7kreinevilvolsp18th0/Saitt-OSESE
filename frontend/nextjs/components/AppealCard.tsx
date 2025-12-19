'use client';

import React, { useState } from 'react';
import AppealStatusBadge from './AppealStatusBadge';
import { AppealStatus } from '../lib/appealStatus';

interface Appeal {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  status: AppealStatus;
  contact_value?: string;
  direction_id?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  deadline?: string;
  assigned_to?: string;
  assigned_user_name?: string;
}

interface AppealCardProps {
  appeal: Appeal;
  onMove: (id: string, status: AppealStatus) => void;
  onAssign?: (id: string, userId: string | null) => void;
  onSetPriority?: (id: string, priority: string) => void;
  onSetDeadline?: (id: string, deadline: string | null) => void;
  availableUsers?: Array<{ id: string; email: string; name?: string }>;
  columns: Array<{ key: AppealStatus; title: string }>;
}

const priorityColors = {
  low: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
  normal: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  high: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  urgent: 'bg-red-500/20 text-red-300 border-red-500/40',
};

const priorityLabels = {
  low: 'Низкий',
  normal: 'Обычный',
  high: 'Высокий',
  urgent: 'Срочный',
};

export default function AppealCard({
  appeal,
  onMove,
  onAssign,
  onSetPriority,
  onSetDeadline,
  availableUsers = [],
  columns,
}: AppealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showDeadlineInput, setShowDeadlineInput] = useState(false);
  const [deadlineValue, setDeadlineValue] = useState(appeal.deadline || '');

  const handleDeadlineSubmit = () => {
    if (onSetDeadline) {
      onSetDeadline(appeal.id, deadlineValue || null);
    }
    setShowDeadlineInput(false);
  };

  const isOverdue = appeal.deadline && new Date(appeal.deadline) < new Date() && appeal.status !== 'closed';

  return (
    <div className={`rounded-xl border p-3 transition-all ${
      isOverdue 
        ? 'border-red-500/50 bg-red-500/10' 
        : 'border-white/10 bg-oss-dark/40'
    } light:bg-white light:border-gray-200`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium line-clamp-2 light:text-gray-900">{appeal.title}</div>
          <div className="mt-1 text-xs text-white/60 light:text-gray-500">
            {new Date(appeal.created_at).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
        <AppealStatusBadge status={appeal.status} size="sm" />
      </div>

      {expanded && (
        <div className="mt-2 text-xs text-white/70 line-clamp-3 light:text-gray-600">{appeal.description}</div>
      )}

      {/* Приоритет и дедлайн */}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        {appeal.priority && (
          <span className={`text-xs px-2 py-0.5 rounded border ${priorityColors[appeal.priority] || priorityColors.normal} light:border-gray-300`}>
            {priorityLabels[appeal.priority] || appeal.priority}
          </span>
        )}
        {appeal.deadline && (
          <span className={`text-xs px-2 py-0.5 rounded ${
            isOverdue ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-white/60'
          } light:bg-gray-100 light:text-gray-700`}>
            {isOverdue ? '⚠️ ' : ''}
            {new Date(appeal.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
          </span>
        )}
        {appeal.assigned_user_name && (
          <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60 light:bg-gray-100 light:text-gray-700">
            👤 {appeal.assigned_user_name}
          </span>
        )}
      </div>

      {/* Действия */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-white/60 hover:text-white/80 light:text-gray-500 light:hover:text-gray-700"
        >
          {expanded ? 'Свернуть' : 'Подробнее'}
        </button>

        {/* Назначить ответственного */}
        {onAssign && (
          <div className="relative">
            <button
              onClick={() => setShowAssignMenu(!showAssignMenu)}
              className="text-xs px-2 py-1 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition light:border-gray-300 light:text-gray-700 light:hover:bg-gray-50"
            >
              {appeal.assigned_user_name ? '👤' : '➕'} Ответственный
            </button>
            {showAssignMenu && (
              <div className="absolute z-10 mt-1 w-48 rounded-lg border border-white/20 bg-oss-dark shadow-lg p-2 light:bg-white light:border-gray-200">
                <button
                  onClick={() => {
                    onAssign(appeal.id, null);
                    setShowAssignMenu(false);
                  }}
                  className="w-full text-left text-xs px-2 py-1 rounded hover:bg-white/10 light:hover:bg-gray-50"
                >
                  Снять назначение
                </button>
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onAssign(appeal.id, user.id);
                      setShowAssignMenu(false);
                    }}
                    className="w-full text-left text-xs px-2 py-1 rounded hover:bg-white/10 light:hover:bg-gray-50"
                  >
                    {user.name || user.email}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Приоритет */}
        {onSetPriority && (
          <div className="relative">
            <button
              onClick={() => setShowPriorityMenu(!showPriorityMenu)}
              className="text-xs px-2 py-1 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition light:border-gray-300 light:text-gray-700 light:hover:bg-gray-50"
            >
              ⚡ Приоритет
            </button>
            {showPriorityMenu && (
              <div className="absolute z-10 mt-1 w-40 rounded-lg border border-white/20 bg-oss-dark shadow-lg p-2 light:bg-white light:border-gray-200">
                {(['low', 'normal', 'high', 'urgent'] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      onSetPriority(appeal.id, priority);
                      setShowPriorityMenu(false);
                    }}
                    className="w-full text-left text-xs px-2 py-1 rounded hover:bg-white/10 light:hover:bg-gray-50"
                  >
                    {priorityLabels[priority]}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Дедлайн */}
        {onSetDeadline && (
          <div className="relative">
            {showDeadlineInput ? (
              <div className="absolute z-10 mt-1 w-56 rounded-lg border border-white/20 bg-oss-dark shadow-lg p-2 light:bg-white light:border-gray-200">
                <input
                  type="date"
                  value={deadlineValue}
                  onChange={(e) => setDeadlineValue(e.target.value)}
                  className="w-full text-xs px-2 py-1 rounded bg-white/10 border border-white/20 text-white light:bg-white light:border-gray-300 light:text-gray-900"
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleDeadlineSubmit}
                    className="flex-1 text-xs px-2 py-1 rounded bg-oss-red hover:bg-oss-red/90 text-white"
                  >
                    ОК
                  </button>
                  <button
                    onClick={() => {
                      setShowDeadlineInput(false);
                      setDeadlineValue(appeal.deadline || '');
                    }}
                    className="flex-1 text-xs px-2 py-1 rounded border border-white/20 hover:bg-white/10"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeadlineInput(true)}
                className="text-xs px-2 py-1 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition light:border-gray-300 light:text-gray-700 light:hover:bg-gray-50"
              >
                📅 Дедлайн
              </button>
            )}
          </div>
        )}
      </div>

      {/* Перемещение между статусами */}
      <div className="mt-3 flex flex-wrap gap-2">
        {columns
          .filter((x) => x.key !== appeal.status)
          .map((x) => (
            <button
              key={x.key}
              onClick={() => onMove(appeal.id, x.key)}
              className="text-xs px-2 py-1 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition light:border-gray-300 light:text-gray-700 light:hover:bg-gray-50"
            >
              → {x.title}
            </button>
          ))}
      </div>
    </div>
  );
}

