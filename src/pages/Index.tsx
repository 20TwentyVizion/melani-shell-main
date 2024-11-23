import { useState, useRef } from 'react';
import SystemBar from '@/components/SystemBar';
import Dock from '@/components/Dock';
import MovableWindow from '@/components/MovableWindow';
import { Bot, AppWindow, UserRound, FileText, Gamepad2 } from 'lucide-react';

const WALLPAPERS = [
  'https://cdn.leonardo.ai/users/6cd4ea3f-13be-4f8f-8b23-66cb07a2d68b/generations/6e2d59d3-2cf4-4d7a-8484-446785cdfbe0/Leonardo_Kino_XL_A_beautiful_wallpaper_for_a_new_techbased_sle_3.jpg',
  'https://cdn.leonardo.ai/users/6cd4ea3f-13be-4f8f-8b23-66cb07a2d68b/generations/6e2d59d3-2cf4-4d7a-8484-446785cdfbe0/Leonardo_Kino_XL_A_beautiful_wallpaper_for_a_new_techbased_sle_2.jpg',
  'https://cdn.leonardo.ai/users/6cd4ea3f-13be-4f8f-8b23-66cb07a2d68b/generations/6e2d59d3-2cf4-4d7a-8484-446785cdfbe0/Leonardo_Kino_XL_A_beautiful_wallpaper_for_a_new_techbased_sle_1.jpg',
  'https://cdn.leonardo.ai/users/6cd4ea3f-13be-4f8f-8b23-66cb07a2d68b/generations/6e2d59d3-2cf4-4d7a-8484-446785cdfbe0/Leonardo_Kino_XL_A_beautiful_wallpaper_for_a_new_techbased_sle_0.jpg'
];

interface DraggableIconProps {
  icon: any;
  label: string;
  onClick: () => void;
  initialPosition: { x: number; y: number };
}

const DraggableIcon = ({ icon: Icon, label, onClick, initialPosition }: DraggableIconProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (iconRef.current) {
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={iconRef}
      className={`desktop-icon ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={() => !isDragging && onClick()}
    >
      <Icon className="w-8 h-8 text-white/80" />
      <span className="text-xs mt-2 text-white/80">{label}</span>
    </div>
  );
};

const Index = () => {
  const [currentWallpaper] = useState(() => {
    const randomIndex = Math.floor(Math.random() * WALLPAPERS.length);
    return WALLPAPERS[randomIndex];
  });

  const [showGames, setShowGames] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="dynamic-bg"
        style={{ 
          backgroundImage: `url(${currentWallpaper})`,
        }} 
      />
      <SystemBar onSettingsClick={() => {}} />

      <DraggableIcon
        icon={Gamepad2}
        label="Games"
        onClick={() => setShowGames(true)}
        initialPosition={{ x: 24, y: 48 }}
      />

      {showGames && (
        <MovableWindow
          title="Games"
          onClose={() => setShowGames(false)}
          onMinimize={() => setShowGames(false)}
        >
          <div className="w-[600px] h-[400px] p-4">
            <p className="text-white/80">Games window content will go here...</p>
          </div>
        </MovableWindow>
      )}

      <Dock 
        onSettingsClick={() => {}}
        onFilesClick={() => {}}
      />
    </div>
  );
};

export default Index;