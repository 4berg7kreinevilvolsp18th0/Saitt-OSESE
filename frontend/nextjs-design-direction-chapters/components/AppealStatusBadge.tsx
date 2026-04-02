import { AppealStatus, getStatusInfo } from '../lib/appealStatus';

interface AppealStatusBadgeProps {
  status: AppealStatus;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function AppealStatusBadge({ 
  status, 
  showDescription = false,
  size = 'md' 
}: AppealStatusBadgeProps) {
  const statusInfo = getStatusInfo(status);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg font-medium border ${sizeClasses[size]} light:border-gray-300`}
        style={{
          backgroundColor: `${statusInfo.color}20`,
          borderColor: `${statusInfo.color}40`,
          color: statusInfo.color,
        }}
      >
        <span>{statusInfo.icon}</span>
        <span>{statusInfo.label}</span>
      </span>
      {showDescription && (
        <p className="text-xs text-white/60 light:text-gray-500 max-w-md">
          {statusInfo.description}
        </p>
      )}
    </div>
  );
}

