import { useState } from 'react';
import SystemBar from '@/components/SystemBar';
import Dock from '@/components/Dock';
import { Bot, AppWindow, UserRound, FileText } from 'lucide-react';

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
  left?: number;
}

const DesktopIcon = ({ icon: Icon, label, onClick, top, left = 24 }: DesktopIconProps) => (
  <div 
    className="desktop-icon"
    style={{ 
      top: `${top + 48}px`,
      left: `${left}px`
    }}
    onClick={(e) => {
      e.preventDefault();
      console.log(`Clicking ${label} icon`);
      onClick();
    }}
  >
    <Icon className="w-8 h-8 text-white/80" />
    <span className="text-xs mt-2 text-white/80">{label}</span>
  </div>
);

const Index = () => {
  const [currentWallpaper] = useState(() => {
    const randomIndex = Math.floor(Math.random() * WALLPAPERS.length);
    return WALLPAPERS[randomIndex];
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="dynamic-bg"
        style={{ 
          backgroundImage: `url(${currentWallpaper})`,
        }} 
      />
      <SystemBar onSettingsClick={() => {}} />

      <Dock 
        onSettingsClick={() => {}}
        onFilesClick={() => {}}
      />
    </div>
  );
};

export default Index;