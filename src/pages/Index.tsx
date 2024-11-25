import { useState, useEffect } from 'react';
import SystemBar from '@/components/SystemBar';
import Dock from '@/components/Dock';
import MovableWindow from '@/components/MovableWindow';
import Games from '@/components/games/Games';
import Settings from '@/components/settings/Settings';
import Profile from '@/components/profile/Profile';
import Melani from '@/components/melani/Melani';
import { Bot, AppWindow, UserRound, Gamepad2, FileText, Settings as SettingsIcon } from 'lucide-react';

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
  top: number;
}

const DesktopIcon = ({ icon: Icon, label, onClick, top }: DesktopIconProps) => {
  return (
    <div
      className="desktop-icon"
      style={{
        left: '24px',
        top: `${top}px`
      }}
      onClick={onClick}
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
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMelani, setShowMelani] = useState(false);

  const handleGamesClick = () => {
    setShowGames(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="dynamic-bg"
        style={{ 
          backgroundImage: `url(${currentWallpaper})`,
        }} 
      />
      <SystemBar onSettingsClick={() => setShowSettings(true)} />
      
      <DesktopIcon
        icon={Gamepad2}
        label="Games"
        onClick={handleGamesClick}
        top={120}
      />

      <DesktopIcon
        icon={UserRound}
        label="Profile"
        onClick={() => setShowProfile(true)}
        top={220}
      />

      <DesktopIcon
        icon={Bot}
        label="Melani"
        onClick={() => setShowMelani(true)}
        top={320}
      />

      {showGames && (
        <MovableWindow
          title="Games"
          onMinimize={() => setShowGames(false)}
          onClose={() => setShowGames(false)}
        >
          <Games />
        </MovableWindow>
      )}

      {showSettings && (
        <MovableWindow
          title="Settings"
          onMinimize={() => setShowSettings(false)}
          onClose={() => setShowSettings(false)}
        >
          <Settings />
        </MovableWindow>
      )}

      {showProfile && (
        <MovableWindow
          title="Profile"
          onMinimize={() => setShowProfile(false)}
          onClose={() => setShowProfile(false)}
        >
          <Profile />
        </MovableWindow>
      )}

      {showMelani && (
        <MovableWindow
          title="Melani"
          onMinimize={() => setShowMelani(false)}
          onClose={() => setShowMelani(false)}
        >
          <Melani />
        </MovableWindow>
      )}

      <Dock 
        onSettingsClick={() => setShowSettings(true)}
        onFilesClick={() => {}}
      />
    </div>
  );
};

export default Index;