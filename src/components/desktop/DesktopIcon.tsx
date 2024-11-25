import { LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'desktop' | 'dock';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const variantClasses = {
  desktop: 'flex-col text-center space-y-1 hover:bg-background/20 rounded-lg p-2',
  dock: 'p-2 rounded-xl hover:bg-background/40 active:scale-95 transition-all duration-150',
};

export const DesktopIcon = ({ 
  icon: Icon, 
  label, 
  onClick, 
  className,
  size = 'md',
  variant = 'desktop'
}: DesktopIconProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "flex items-center transition-colors duration-200",
              variantClasses[variant],
              className
            )}
            onClick={onClick}
          >
            <Icon className={cn(sizeClasses[size], "text-foreground/80")} />
            {variant === 'desktop' && (
              <span className="text-sm font-medium text-foreground/80">{label}</span>
            )}
          </button>
        </TooltipTrigger>
        {variant === 'dock' && (
          <TooltipContent side="top">
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
