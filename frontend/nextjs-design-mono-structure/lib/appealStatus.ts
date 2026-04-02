// Утилиты для работы со статусами обращений

export type AppealStatus = 'new' | 'in_progress' | 'waiting' | 'closed';

export interface StatusInfo {
  key: AppealStatus;
  label: string; // Понятное название для студентов
  description: string; // Что это значит
  color: string; // Цвет для отображения
  icon: string; // Иконка
}

export const STATUS_INFO: Record<AppealStatus, StatusInfo> = {
  new: {
    key: 'new',
    label: 'Принято',
    description: 'Ваше обращение получено и зарегистрировано. Мы начнём работу в ближайшее время.',
    color: '#3B82F6', // Синий
    icon: '📥',
  },
  in_progress: {
    key: 'in_progress',
    label: 'В работе',
    description: 'Обращение обрабатывается. Мы работаем над решением вашего вопроса.',
    color: '#F59E0B', // Жёлтый/Оранжевый
    icon: '⚙️',
  },
  waiting: {
    key: 'waiting',
    label: 'Нужна информация',
    description: 'Для решения вопроса нам нужна дополнительная информация. Пожалуйста, проверьте контакт, который вы указали.',
    color: '#EF4444', // Красный
    icon: '⏳',
  },
  closed: {
    key: 'closed',
    label: 'Решено',
    description: 'Обращение закрыто. Если вопрос решён не полностью, вы можете подать новое обращение.',
    color: '#10B981', // Зелёный
    icon: '✅',
  },
};

export function getStatusInfo(status: AppealStatus): StatusInfo {
  return STATUS_INFO[status] || STATUS_INFO.new;
}

export function getStatusLabel(status: AppealStatus): string {
  return getStatusInfo(status).label;
}

export function getStatusDescription(status: AppealStatus): string {
  return getStatusInfo(status).description;
}

export function getStatusColor(status: AppealStatus): string {
  return getStatusInfo(status).color;
}

