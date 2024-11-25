import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Bell, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemBarProps {
  className?: string;
}

const SystemBar: React.FC<SystemBarProps> = ({ className }) => {
  const [time, setTime] = useState(new Date());
  const [isDaytime, setIsDaytime] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      setIsDaytime(now.getHours() >= 6 && now.getHours() < 18);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn(
      "fixed top-0 w-full h-10 px-4 flex items-center justify-between z-50",
      "bg-background/30 backdrop-blur-md border-b border-border/50",
      "animate-fade-down",
      className
    )}>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-semibold text-foreground/80">Melani OS</span>
        {isDaytime ? 
          <Sun className="w-4 h-4 text-yellow-500" /> : 
          <Moon className="w-4 h-4 text-blue-400" />
        }
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <Wifi className="w-4 h-4 text-foreground/60" />
          <Battery className="w-4 h-4 text-foreground/60" />
          <Bell className="w-4 h-4 text-foreground/60" />
        </div>
        <div className="text-sm font-medium text-foreground/80 min-w-[180px] text-right">
          {time.toLocaleTimeString()} • {time.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default SystemBar;