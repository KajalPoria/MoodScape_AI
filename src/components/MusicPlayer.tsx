import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Music, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import type { Emotion } from "@/pages/Dashboard";

interface MusicPlayerProps {
  emotion: Emotion;
  isPlaying: boolean;
  onToggle: () => void;
}

interface Song {
  title: string;
  artist: string;
  url: string;
  emotion: Emotion;
}

// Curated songs for each emotion (English and Hindi songs with uplifting themes)
const emotionSongs: Record<Emotion, Song[]> = {
  calm: [
    { title: "Weightless", artist: "Marconi Union", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", emotion: "calm" },
    { title: "Tum Hi Ho (Instrumental)", artist: "Arijit Singh", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", emotion: "calm" },
    { title: "River Flows in You", artist: "Yiruma", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", emotion: "calm" },
    { title: "Kun Faya Kun", artist: "A.R. Rahman", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", emotion: "calm" },
  ],
  happy: [
    { title: "Happy", artist: "Pharrell Williams", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", emotion: "happy" },
    { title: "Badtameez Dil", artist: "Benny Dayal", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", emotion: "happy" },
    { title: "Don't Stop Me Now", artist: "Queen", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", emotion: "happy" },
    { title: "Gallan Goodiyaan", artist: "Yashita Sharma", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", emotion: "happy" },
  ],
  anxious: [
    { title: "Breathe Me", artist: "Sia", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", emotion: "anxious" },
    { title: "Kabira", artist: "Tochi Raina", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", emotion: "anxious" },
    { title: "Fix You", artist: "Coldplay", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", emotion: "anxious" },
    { title: "Hasi (Female)", artist: "Shreya Ghoshal", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", emotion: "anxious" },
  ],
  sad: [
    { title: "Someone Like You", artist: "Adele", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", emotion: "sad" },
    { title: "Phir Le Aya Dil", artist: "Arijit Singh", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", emotion: "sad" },
    { title: "The Scientist", artist: "Coldplay", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", emotion: "sad" },
    { title: "Channa Mereya", artist: "Arijit Singh", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", emotion: "sad" },
  ],
  excited: [
    { title: "Can't Stop", artist: "Red Hot Chili Peppers", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", emotion: "excited" },
    { title: "Zinda", artist: "Siddharth Mahadevan", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", emotion: "excited" },
    { title: "Eye of the Tiger", artist: "Survivor", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", emotion: "excited" },
    { title: "Apna Time Aayega", artist: "Ranveer Singh", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", emotion: "excited" },
  ],
  neutral: [
    { title: "Somewhere Only We Know", artist: "Keane", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", emotion: "neutral" },
    { title: "Ilahi", artist: "Arijit Singh", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", emotion: "neutral" },
    { title: "Viva La Vida", artist: "Coldplay", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", emotion: "neutral" },
    { title: "Nadaan Parindey", artist: "A.R. Rahman", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", emotion: "neutral" },
  ],
};

const MusicPlayer = ({ emotion, isPlaying, onToggle }: MusicPlayerProps) => {
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const currentSongs = emotionSongs[emotion];
  const currentSong = currentSongs[currentSongIndex];

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = false;
      audioRef.current.addEventListener('ended', handleSongEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleSongEnd);
      }
    };
  }, []);

  // Handle song changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.src = currentSong.url;
      audioRef.current.volume = isMuted ? 0 : volume;
      
      if (wasPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          toast({
            title: "Playback Error",
            description: "Unable to play the selected song",
            variant: "destructive",
          });
        });
      }
    }
  }, [currentSong, emotion]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSongEnd = () => {
    // Auto-play next song
    setCurrentSongIndex((prev) => (prev + 1) % currentSongs.length);
  };

  const skipToNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % currentSongs.length);
    toast({
      title: "Next Song",
      description: currentSongs[(currentSongIndex + 1) % currentSongs.length].title,
    });
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    setShowSuggestions(false);
    if (!isPlaying) {
      onToggle();
    }
    toast({
      title: "Now Playing",
      description: currentSongs[index].title,
    });
  };

  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-4 space-y-3"
      >
        <div className="flex items-center gap-3">
          <Button
            onClick={onToggle}
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentSong.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
          </div>

          <Button
            onClick={skipToNext}
            size="icon"
            variant="ghost"
            disabled={!isPlaying}
          >
            <SkipForward className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => setIsMuted(!isMuted)}
            size="icon"
            variant="ghost"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            onValueChange={(value) => setVolume(value[0] / 100)}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>

        {isPlaying && (
          <motion.div
            animate={{ scaleX: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-1 bg-gradient-to-r from-primary to-accent rounded-full"
          />
        )}

        <Button
          onClick={() => setShowSuggestions(!showSuggestions)}
          variant="outline"
          className="w-full"
        >
          <Music className="w-4 h-4 mr-2" />
          {showSuggestions ? "Hide" : "View"} Song Suggestions
        </Button>
      </motion.div>

      {/* Song Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <p className="text-xs text-muted-foreground px-2">
              Suggested for {emotion} mood
            </p>
            {currentSongs.map((song, index) => (
              <motion.button
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => selectSong(index)}
                className={`w-full p-3 rounded-xl text-left transition-smooth ${
                  index === currentSongIndex
                    ? "bg-primary/20 border border-primary/50"
                    : "bg-card/30 hover:bg-card/50"
                }`}
              >
                <p className="text-sm font-medium">{song.title}</p>
                <p className="text-xs text-muted-foreground">{song.artist}</p>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicPlayer;
