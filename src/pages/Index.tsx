import { useState, useEffect } from 'react';
import SystemBar from '@/components/SystemBar';
import Dock from '@/components/Dock';
import MovableWindow from '@/components/MovableWindow';
import Games from '@/components/games/Games';
import Settings from '@/components/settings/Settings';
import Profile from '@/components/profile/Profile';
import Melani from '@/components/melani/Melani';
import Music from '@/components/music/Music';
import TextEditor from '@/components/editor/TextEditor';
import Calendar from '@/components/calendar/Calendar';
import { Bot, AppWindow, UserRound, Gamepad2, FileText, Music as MusicIcon, CalendarDays } from 'lucide-react';
import { useOSStore } from '@/store/os-store';

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

  const { windows, actions } = useOSStore();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="dynamic-bg"
        style={{ 
          backgroundImage: `url(${currentWallpaper})`,
        }} 
      />
      <SystemBar onSettingsClick={() => actions.openWindow('settings')} />
      
      <DesktopIcon
        icon={Gamepad2}
        label="Games"
        onClick={() => actions.openWindow('games')}
        top={120}
      />

      <DesktopIcon
        icon={UserRound}
        label="Profile"
        onClick={() => actions.openWindow('profile')}
        top={220}
      />

      <DesktopIcon
        icon={Bot}
        label="Melani"
        onClick={() => actions.openWindow('melani')}
        top={320}
      />

      <DesktopIcon
        icon={FileText}
        label="Text Editor"
        onClick={() => actions.openWindow('editor')}
        top={420}
      />

      <DesktopIcon
        icon={CalendarDays}
        label="Calendar"
        onClick={() => actions.openWindow('calendar')}
        top={520}
      />

      {windows.games.isOpen && (
        <MovableWindow
          title="Games"
          onMinimize={() => actions.minimizeWindow('games')}
          onClose={() => actions.closeWindow('games')}
        >
          <Games />
        </MovableWindow>
      )}

      {windows.settings.isOpen && (
        <MovableWindow
          title="Settings"
          onMinimize={() => actions.minimizeWindow('settings')}
          onClose={() => actions.closeWindow('settings')}
        >
          <Settings />
        </MovableWindow>
      )}

      {windows.profile.isOpen && (
        <MovableWindow
          title="Profile"
          onMinimize={() => actions.minimizeWindow('profile')}
          onClose={() => actions.closeWindow('profile')}
        >
          <Profile />
        </MovableWindow>
      )}

      {windows.melani.isOpen && (
        <MovableWindow
          title="Melani"
          onMinimize={() => actions.minimizeWindow('melani')}
          onClose={() => actions.closeWindow('melani')}
        >
          <Melani />
        </MovableWindow>
      )}

      {windows.music.isOpen && (
        <MovableWindow
          title="Music"
          onMinimize={() => actions.minimizeWindow('music')}
          onClose={() => actions.closeWindow('music')}
        >
          <Music />
        </MovableWindow>
      )}

      {windows.editor.isOpen && (
        <MovableWindow
          title="Text Editor"
          onMinimize={() => actions.minimizeWindow('editor')}
          onClose={() => actions.closeWindow('editor')}
        >
          <TextEditor />
        </MovableWindow>
      )}

      {windows.calendar.isOpen && (
        <MovableWindow
          title="Calendar"
          onMinimize={() => actions.minimizeWindow('calendar')}
          onClose={() => actions.closeWindow('calendar')}
        >
          <Calendar />
        </MovableWindow>
      )}

      <Dock 
        onSettingsClick={() => actions.openWindow('settings')}
        onMusicClick={() => actions.openWindow('music')}
        onFilesClick={() => {}}
      />
    </div>
  );
};

export default Index;