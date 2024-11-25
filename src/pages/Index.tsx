import { useState, useEffect, Suspense } from 'react';
import { useOSStore } from '@/store/os-store';
import Dock from '@/components/Dock';
import MovableWindow from '@/components/MovableWindow';
import { DesktopIcon } from '@/components/desktop/DesktopIcon';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bot,
  Settings as SettingsIcon,
  User,
  Gamepad2,
  Music as MusicIcon,
  FileText,
  CalendarDays,
} from 'lucide-react';

// Lazy load components
const Melani = React.lazy(() => import('@/components/melani/Melani'));
const Settings = React.lazy(() => import('@/components/settings/Settings'));
const Profile = React.lazy(() => import('@/components/profile/Profile'));
const Games = React.lazy(() => import('@/components/games/Games'));
const Music = React.lazy(() => import('@/components/music/Music'));
const TextEditor = React.lazy(() => import('@/components/editor/TextEditor'));
const Calendar = React.lazy(() => import('@/components/calendar/Calendar'));

// Loading fallback component
const WindowSkeleton = () => (
  <div className="w-full h-full p-4 space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-8 w-1/2" />
  </div>
);

export default function Index() {
  const { windows, actions } = useOSStore();
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [wallpaperLoaded, setWallpaperLoaded] = useState(false);

  const WALLPAPERS = [
    '/wallpapers/1.jpg',
    '/wallpapers/2.jpg',
    '/wallpapers/3.jpg',
  ];

  useEffect(() => {
    // Preload next wallpaper
    const nextIndex = (wallpaperIndex + 1) % WALLPAPERS.length;
    const img = new Image();
    img.src = WALLPAPERS[nextIndex];
  }, [wallpaperIndex]);

  // Change wallpaper every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setWallpaperIndex((prev) => (prev + 1) % WALLPAPERS.length);
      setWallpaperLoaded(false);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main 
      className="h-screen w-screen overflow-hidden relative"
      style={{
        backgroundImage: `url(${WALLPAPERS[wallpaperIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: wallpaperLoaded ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
      }}
      onLoad={() => setWallpaperLoaded(true)}
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 space-y-4">
        <DesktopIcon
          icon={Bot}
          label="Melani"
          onClick={() => actions.openWindow('melani')}
          size="lg"
        />
        <DesktopIcon
          icon={FileText}
          label="Text Editor"
          onClick={() => actions.openWindow('editor')}
          size="lg"
        />
      </div>

      {/* Windows */}
      {windows.melani.isOpen && (
        <MovableWindow
          title={windows.melani.title}
          onClose={() => actions.closeWindow('melani')}
          onMinimize={() => actions.minimizeWindow('melani')}
          isResizable
        >
          <Suspense fallback={<WindowSkeleton />}>
            <Melani />
          </Suspense>
        </MovableWindow>
      )}

      {windows.editor.isOpen && (
        <MovableWindow
          title={windows.editor.title}
          onClose={() => actions.closeWindow('editor')}
          onMinimize={() => actions.minimizeWindow('editor')}
          isResizable
        >
          <Suspense fallback={<WindowSkeleton />}>
            <TextEditor />
          </Suspense>
        </MovableWindow>
      )}

      {windows.calendar.isOpen && (
        <MovableWindow
          title={windows.calendar.title}
          onClose={() => actions.closeWindow('calendar')}
          onMinimize={() => actions.minimizeWindow('calendar')}
          isResizable
        >
          <Suspense fallback={<WindowSkeleton />}>
            <Calendar />
          </Suspense>
        </MovableWindow>
      )}

      {windows.settings.isOpen && (
        <MovableWindow
          title={windows.settings.title}
          onClose={() => actions.closeWindow('settings')}
          onMinimize={() => actions.minimizeWindow('settings')}
          isResizable
        >
          <Suspense fallback={<WindowSkeleton />}>
            <Settings />
          </Suspense>
        </MovableWindow>
      )}

      {windows.profile.isOpen && (
        <MovableWindow
          title={windows.profile.title}
          onClose={() => actions.closeWindow('profile')}
          onMinimize={() => actions.minimizeWindow('profile')}
          isResizable
        >
          <Suspense fallback={<WindowSkeleton />}>
            <Profile />
          </Suspense>
        </MovableWindow>
      )}

      {windows.games.isOpen && (
        <MovableWindow
          title={windows.games.title}
          onClose={() => actions.closeWindow('games')}
          onMinimize={() => actions.minimizeWindow('games')}
          isResizable
        >
          <Suspense fallback={<WindowSkeleton />}>
            <Games />
          </Suspense>
        </MovableWindow>
      )}

      {windows.music.isOpen && (
        <MovableWindow
          title={windows.music.title}
          onClose={() => actions.closeWindow('music')}
          onMinimize={() => actions.minimizeWindow('music')}
          isResizable
        >
          <Suspense fallback={<WindowSkeleton />}>
            <Music />
          </Suspense>
        </MovableWindow>
      )}

      {/* Dock */}
      <Dock>
        <DesktopIcon
          icon={Bot}
          label="Melani"
          onClick={() => actions.openWindow('melani')}
          variant="dock"
          size="lg"
        />
        <DesktopIcon
          icon={SettingsIcon}
          label="Settings"
          onClick={() => actions.openWindow('settings')}
          variant="dock"
          size="lg"
        />
        <DesktopIcon
          icon={User}
          label="Profile"
          onClick={() => actions.openWindow('profile')}
          variant="dock"
          size="lg"
        />
        <DesktopIcon
          icon={Gamepad2}
          label="Games"
          onClick={() => actions.openWindow('games')}
          variant="dock"
          size="lg"
        />
        <DesktopIcon
          icon={MusicIcon}
          label="Music"
          onClick={() => actions.openWindow('music')}
          variant="dock"
          size="lg"
        />
        <DesktopIcon
          icon={FileText}
          label="Text Editor"
          onClick={() => actions.openWindow('editor')}
          variant="dock"
          size="lg"
        />
        <DesktopIcon
          icon={CalendarDays}
          label="Calendar"
          onClick={() => actions.openWindow('calendar')}
          variant="dock"
          size="lg"
        />
      </Dock>
    </main>
  );
}