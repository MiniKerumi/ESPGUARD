import { Shield, Settings, AlertTriangle } from "lucide-react";
import { SystemState } from "@/hooks/useBluetooth";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  state: SystemState;
  isConnected: boolean;
}

export const StatusIndicator = ({ state, isConnected }: StatusIndicatorProps) => {
  const getStateConfig = () => {
    switch (state) {
      case 'NORMAL':
        return {
          icon: Shield,
          text: 'System Normal',
          color: 'text-status-active',
          bgColor: 'bg-status-active/10',
          borderColor: 'border-status-active',
          pulse: false,
        };
      case 'MAINT':
        return {
          icon: Settings,
          text: 'Maintenance Mode',
          color: 'text-status-service',
          bgColor: 'bg-status-service/10',
          borderColor: 'border-status-service',
          pulse: false,
        };
      case 'ALARM':
        return {
          icon: AlertTriangle,
          text: 'ALARM — Object Detected!',
          color: 'text-status-motion',
          bgColor: 'bg-status-motion/20',
          borderColor: 'border-status-motion',
          pulse: true,
        };
      default:
        return {
          icon: Shield,
          text: isConnected ? 'Connected — Waiting for status...' : 'Awaiting Connection',
          color: isConnected ? 'text-status-active' : 'text-muted-foreground',
          bgColor: isConnected ? 'bg-status-active/10' : 'bg-muted',
          borderColor: isConnected ? 'border-status-active' : 'border-muted',
          pulse: false,
        };
    }
  };

  const config = getStateConfig();
  const Icon = config.icon;

  return (
    <div className={cn(
      "rounded-2xl border-2 p-8 transition-all duration-300",
      config.bgColor,
      config.borderColor,
      config.pulse && "animate-alarm-pulse"
    )}>
      <div className="flex flex-col items-center gap-4">
        <Icon className={cn("h-16 w-16", config.color, config.pulse && "animate-bounce")} />
        <h2 className={cn("text-3xl font-bold", config.color)}>
          {config.text}
        </h2>
        {state === 'MAINT' && (
          <p className="text-sm text-status-service/80">
            IR sensor disabled · Scan authorized tag to exit
          </p>
        )}
        {state === 'ALARM' && (
          <p className="text-sm text-status-motion/80 animate-pulse">
            IR sensor triggered · Immediate attention required
          </p>
        )}
      </div>
    </div>
  );
};
