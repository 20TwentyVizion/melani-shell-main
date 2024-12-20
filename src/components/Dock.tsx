import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface DockProps {
  children?: ReactNode;
  className?: string;
}

const Dock: React.FC<DockProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-2xl",
      "bg-background/30 backdrop-blur-md border border-border/50 shadow-lg",
      "animate-fade-up",
      className
    )}>
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </div>
  );
};

export default Dock;