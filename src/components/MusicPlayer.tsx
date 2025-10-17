import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { Emotion } from "@/pages/Dashboard";

interface MusicPlayerProps {
  emotion: Emotion;
  isPlaying: boolean;
  onToggle: () => void;
}

const MusicPlayer = ({ emotion, isPlaying, onToggle }: MusicPlayerProps) => {
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Mood-based frequencies and parameters
  const moodMusic: Record<Emotion, { frequency: number; waveform: OscillatorType; detune: number }> = {
    calm: { frequency: 220, waveform: "sine", detune: 0 },
    happy: { frequency: 440, waveform: "triangle", detune: 10 },
    anxious: { frequency: 330, waveform: "sine", detune: -5 },
    sad: { frequency: 196, waveform: "sine", detune: -10 },
    excited: { frequency: 523, waveform: "sawtooth", detune: 15 },
    neutral: { frequency: 261.63, waveform: "sine", detune: 0 },
  };

  useEffect(() => {
    // Initialize Web Audio API
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }

    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Stop existing oscillator
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }

    // Start new oscillator if playing
    if (isPlaying) {
      const musicParams = moodMusic[emotion];
      const oscillator = audioContextRef.current.createOscillator();
      oscillator.type = musicParams.waveform;
      oscillator.frequency.setValueAtTime(musicParams.frequency, audioContextRef.current.currentTime);
      oscillator.detune.setValueAtTime(musicParams.detune, audioContextRef.current.currentTime);
      
      oscillator.connect(gainNodeRef.current);
      oscillator.start();
      oscillatorRef.current = oscillator;
    }
  }, [isPlaying, emotion]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume * 0.1, // Scale down volume for pleasant listening
        audioContextRef.current!.currentTime
      );
    }
  }, [volume, isMuted]);

  return (
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

        <div className="flex-1">
          <p className="text-sm font-medium">Mood Music</p>
          <p className="text-xs text-muted-foreground capitalize">{emotion} soundscape</p>
        </div>

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
    </motion.div>
  );
};

export default MusicPlayer;
