import { useState, useRef } from 'react';
import { Minus, X } from 'lucide-react';

interface MovableWindowProps {
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  onMinimize?: () => void;
  onClose?: () => void;
}

const MovableWindow = ({ 
  title, 
  children, 
  initialPosition = { x: 100, y: 100 }, 
  onMinimize, 
  onClose 
}: MovableWindowProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={windowRef}
      className="movable-window"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: 'fixed',
        zIndex: 1000
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="window-header">
        <span className="text-sm font-medium text-white/80">{title}</span>
        <div className="window-controls">
          {onMinimize && (
            <button 
              className="window-control-button minimize-button"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
            >
              <Minus className="w-3 h-3" />
            </button>
          )}
          {onClose && (
            <button 
              className="window-control-button close-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      <div className="window-content bg-black/30 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};

export default MovableWindow;