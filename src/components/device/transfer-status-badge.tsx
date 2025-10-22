import { Badge } from "@/components/ui/badge"
import { IconClock, IconCheck, IconX, IconAlertCircle, IconCircleCheck } from "@tabler/icons-react"

interface TransferStatusBadgeProps {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'COMPLETED';
  className?: string;
}

export function TransferStatusBadge({ status, className }: TransferStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pending',
          variant: 'secondary' as const,
          icon: IconClock,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'ACCEPTED':
        return {
          label: 'Accepted',
          variant: 'default' as const,
          icon: IconCheck,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          variant: 'destructive' as const,
          icon: IconX,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'EXPIRED':
        return {
          label: 'Expired',
          variant: 'outline' as const,
          icon: IconAlertCircle,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          variant: 'default' as const,
          icon: IconCircleCheck,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      default:
        return {
          label: 'Unknown',
          variant: 'outline' as const,
          icon: IconAlertCircle,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className || ''}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
