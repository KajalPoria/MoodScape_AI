import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Wind, Zap, Music, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Emotion } from "@/pages/Dashboard";
import BreathingExercise from "./BreathingExercise";
import MusicPlayer from "./MusicPlayer";

interface MicroActionPanelProps {
  emotion: Emotion;
  microAction: string;
  musicAction: string;
}

const MicroActionPanel = ({ emotion, microAction, musicAction }: MicroActionPanelProps) => {
  const [breathingPattern, setBreathingPattern] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const { toast } = useToast();
  const handleAction = (label: string, desc: string) => {
    if (label.includes("Breathing") || label.includes("Breath")) {
      const pattern = desc.includes("4-7-8") ? "4-7-8" : desc.includes("Slow") ? "slow" : "4-4-4-4";
      setBreathingPattern(pattern);
    } else if (label.includes("Music") || label.includes("Dance")) {
      setIsMusicPlaying(true);
      toast({
        title: "🎵 Music Started",
        description: "Let the rhythm move you!",
      });
    } else {
      toast({
        title: `✨ ${label}`,
        description: desc,
      });
    }
  };

  const quickActions = {
    calm: [
      { icon: Wind, label: "Box Breathing", desc: "4-4-4-4 pattern" },
      { icon: Heart, label: "Body Scan", desc: "Release tension" },
      { icon: Activity, label: "Gentle Stretch", desc: "Neck & shoulders" },
    ],
    happy: [
      { icon: Zap, label: "Gratitude", desc: "List 3 things" },
      { icon: Music, label: "Dance Break", desc: "Move freely" },
      { icon: Heart, label: "Share Joy", desc: "Text a friend" },
    ],
    anxious: [
      { icon: Wind, label: "4-7-8 Breath", desc: "Calming technique" },
      { icon: Activity, label: "Ground Yourself", desc: "5-4-3-2-1 method" },
      { icon: Heart, label: "Self-Compassion", desc: "Kind words" },
    ],
    sad: [
      { icon: Heart, label: "Self-Care", desc: "Be gentle" },
      { icon: Wind, label: "Slow Breathing", desc: "Find rhythm" },
      { icon: Activity, label: "Mini Journal", desc: "Express feelings" },
    ],
    excited: [
      { icon: Zap, label: "Channel Energy", desc: "Quick workout" },
      { icon: Activity, label: "Create", desc: "Start something" },
      { icon: Music, label: "Move", desc: "Physical expression" },
    ],
    neutral: [
      { icon: Heart, label: "Check In", desc: "How do you feel?" },
      { icon: Wind, label: "Mindful Breath", desc: "Notice sensations" },
      { icon: Activity, label: "Explore", desc: "Try something new" },
    ],
  };

  const actions = quickActions[emotion];

  return (
    <div className="h-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Micro Actions
      </h2>

      {/* Current Action */}
      {microAction && (
        <motion.div
          key={microAction}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-primary/30 pulse-glow"
        >
          <p className="text-sm text-muted-foreground mb-2">Suggested for you</p>
          <p className="text-base leading-relaxed">{microAction}</p>
        </motion.div>
      )}

      {/* Music Action */}
      {musicAction && (
        <motion.div
          key={musicAction}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-card/50 rounded-xl flex items-start gap-3"
        >
          <Music className="w-5 h-5 text-accent mt-1" />
          <div>
            <p className="text-xs text-muted-foreground mb-1">Music</p>
            <p className="text-sm">{musicAction}</p>
          </div>
        </motion.div>
      )}

      {/* Quick Actions Grid */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Quick Actions</p>
        <div className="grid gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAction(action.label, action.desc)}
                className="p-4 bg-card/30 hover:bg-card/50 rounded-xl flex items-start gap-3 transition-smooth text-left cursor-pointer"
              >
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Music Player */}
      <MusicPlayer 
        emotion={emotion}
        isPlaying={isMusicPlaying}
        onToggle={() => setIsMusicPlaying(!isMusicPlaying)}
      />

      {/* Trend Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-auto p-4 bg-card/30 rounded-xl"
      >
        <p className="text-xs text-muted-foreground mb-2">Session Activity</p>
        <div className="flex gap-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="flex-1 h-12 bg-primary/20 rounded animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </motion.div>

      {/* Breathing Exercise Modal */}
      <AnimatePresence>
        {breathingPattern && (
          <BreathingExercise
            pattern={breathingPattern}
            onClose={() => setBreathingPattern(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MicroActionPanel;
