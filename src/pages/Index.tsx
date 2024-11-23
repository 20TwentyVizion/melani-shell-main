import { useState, useEffect } from 'react';
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

interface DesktopIconProps {
  icon: any;
  label: string;
  onClick: () => void;
  position: { x: number; y: number };
}

const DesktopIcon = ({ icon: Icon, label, onClick, position }: DesktopIconProps) => {
  return (
    <div
      className="desktop-icon"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onClick={onClick}
    >
      <Icon className="w-8 h-8 text-white/80" />
      <span className="text-xs mt-2 text-white/80">{label}</span>
    </div>
  );
};

const GamesWindow = ({ onClose, onMinimize }: { onClose: () => void; onMinimize: () => void }) => {
  return (
    <MovableWindow
      title="Games"
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={{ x: 100, y: 100 }}
    >
      <div className="w-[600px] h-[400px] p-4 bg-black/30">
        <p className="text-white/80">Games window content will go here...</p>
      </div>
    </MovableWindow>
  );
};

const Index = () => {
  const [currentWallpaper, setCurrentWallpaper] = useState<string | null>(null);
  const [showGames, setShowGames] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * WALLPAPERS.length);
    const img = new Image();
    img.onload = () => {
      setCurrentWallpaper(WALLPAPERS[randomIndex]);
    };
    img.onerror = () => {
      console.error('Failed to load wallpaper');
      setCurrentWallpaper(WALLPAPERS[0]); // Fallback to first wallpaper
    };
    img.src = WALLPAPERS[randomIndex];
  }, []);

  const handleGamesClick = () => {
    console.log('Games icon clicked, opening window');
    setShowGames(prev => !prev);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="dynamic-bg"
        style={{ 
          backgroundImage: currentWallpaper ? `url(${currentWallpaper})` : undefined,
          backgroundColor: '#000' // Fallback color while loading
        }} 
      />
      <SystemBar onSettingsClick={() => {}} />

      <DesktopIcon
        icon={Gamepad2}
        label="Games"
        onClick={handleGamesClick}
        position={{ x: 24, y: 48 }}
      />

      {showGames && (
        <GamesWindow
          onClose={() => setShowGames(false)}
          onMinimize={() => setShowGames(false)}
        />
      )}

      <Dock 
        onSettingsClick={() => {}}
        onFilesClick={() => {}}
      />
    </div>
  );
};

export default Index;