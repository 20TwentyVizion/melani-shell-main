import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import { useOSStore } from '@/store/os-store';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  url: string;
}

// Free music from pixabay.com
const SAMPLE_SONGS: Song[] = [
  { 
    id: 1, 
    title: "Cyber Technology", 
    artist: "Lexin Music", 
    duration: "2:55",
    url: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3"
  },
  { 
    id: 2, 
    title: "Digital World", 
    artist: "SoundGallery", 
    duration: "3:12",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1a41.mp3"
  },
  { 
    id: 3, 
    title: "Future Technology", 
    artist: "AudioCoffee", 
    duration: "2:37",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8f0c67f.mp3"
  },
  { 
    id: 4, 
    title: "Neon Lights", 
    artist: "Zakhar", 
    duration: "3:05",
    url: "https://cdn.pixabay.com/download/audio/2023/06/08/audio_8e4afa1ee7.mp3"
  },
  { 
    id: 5, 
    title: "Digital Dreams", 
    artist: "Dream Factory", 
    duration: "2:45",
    url: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_fff0a0b2a5.mp3"
  },
];

const Music = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [volume, setVolume] = useState([75]);
  const [audio] = useState(new Audio());
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const osActions = useOSStore((state) => state.actions);

  useEffect(() => {
    audio.volume = volume[0] / 100;
  }, [volume, audio]);

  useEffect(() => {
    if (currentSong) {
      audio.src = currentSong.url;
      if (isPlaying) {
        audio.play();
        osActions.playSong(currentSong.title, currentSong.artist);
      }
    }
  }, [currentSong, audio, isPlaying, osActions]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      if (repeat) {
        audio.play();
      } else if (shuffle) {
        const randomSong = SAMPLE_SONGS[Math.floor(Math.random() * SAMPLE_SONGS.length)];
        handlePlaySong(randomSong);
      } else {
        const nextSongIndex = SAMPLE_SONGS.findIndex(song => song.id === currentSong?.id) + 1;
        if (nextSongIndex < SAMPLE_SONGS.length) {
          handlePlaySong(SAMPLE_SONGS[nextSongIndex]);
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio, currentSong, repeat, shuffle]);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audio.pause();
      osActions.pauseSong();
    } else {
      audio.play();
      if (currentSong) {
        osActions.resumeSong();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(value[0]);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background/95 to-primary/10 backdrop-blur-sm">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {SAMPLE_SONGS.map((song) => (
            <div
              key={song.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                currentSong?.id === song.id
                  ? 'bg-primary/20 border border-primary/30'
                  : 'hover:bg-secondary/50 border border-transparent'
              }`}
              onClick={() => handlePlaySong(song)}
            >
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-8 w-8 ${currentSong?.id === song.id ? 'text-primary' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentSong?.id === song.id) {
                      togglePlayPause();
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
              <Button 
                size="icon" 
                variant="ghost"
                className={shuffle ? 'text-primary' : ''}
                onClick={() => setShuffle(!shuffle)}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => {
                  const prevSongIndex = SAMPLE_SONGS.findIndex(song => song.id === currentSong.id) - 1;
                  if (prevSongIndex >= 0) {
                    handlePlaySong(SAMPLE_SONGS[prevSongIndex]);
                  }
                }}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="default"
                className="h-10 w-10 rounded-full"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => {
                  const nextSongIndex = SAMPLE_SONGS.findIndex(song => song.id === currentSong.id) + 1;
                  if (nextSongIndex < SAMPLE_SONGS.length) {
                    handlePlaySong(SAMPLE_SONGS[nextSongIndex]);
                  }
                }}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost"
                className={repeat ? 'text-primary' : ''}
                onClick={() => setRepeat(!repeat)}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Slider
            value={[progress]}
            onValueChange={handleProgressChange}
            max={100}
            step={0.1}
            className="w-full"
          />

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
