import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

const SAMPLE_SONGS: Song[] = [
  { id: 1, title: "Digital Dreams", artist: "Electronic Minds", duration: "3:45" },
  { id: 2, title: "Neon Nights", artist: "Synthwave Collective", duration: "4:20" },
  { id: 3, title: "Cyber Soul", artist: "Digital Pulse", duration: "3:55" },
  { id: 4, title: "Future Funk", artist: "Retro Wave", duration: "4:10" },
  { id: 5, title: "Binary Sunset", artist: "Code Breakers", duration: "3:30" },
];

const Music = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [volume, setVolume] = useState([75]);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {SAMPLE_SONGS.map((song) => (
            <div
              key={song.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                currentSong?.id === song.id
                  ? 'bg-primary/10'
                  : 'hover:bg-secondary/50'
              }`}
              onClick={() => handlePlaySong(song)}
            >
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentSong?.id === song.id) {
                      setIsPlaying(!isPlaying);
                    } else {
                      handlePlaySong(song);
                    }
                  }}
                >
                  {currentSong?.id === song.id && isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-muted-foreground">{song.artist}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{song.duration}</span>
            </div>
          ))}
        </div>
      </ScrollArea>

      {currentSong && (
        <div className="border-t bg-background/50 backdrop-blur-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{currentSong.title}</p>
              <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button size="icon" variant="ghost">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-32"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Music;
