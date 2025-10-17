import { motion } from "framer-motion";
import { Smile, Frown, Meh, Zap, Wind } from "lucide-react";
import type { Emotion } from "@/pages/Dashboard";

interface MoodVisualizationProps {
  emotion: Emotion;
  intensity: number;
}

const emotionConfig = {
  calm: { icon: Wind, color: "hsl(200 80% 60%)", emoji: "😌", label: "Calm" },
  happy: { icon: Smile, color: "hsl(45 100% 60%)", emoji: "😊", label: "Happy" },
  anxious: { icon: Zap, color: "hsl(280 60% 55%)", emoji: "😰", label: "Anxious" },
  sad: { icon: Frown, color: "hsl(220 50% 45%)", emoji: "😔", label: "Sad" },
  excited: { icon: Zap, color: "hsl(330 85% 65%)", emoji: "🤩", label: "Excited" },
  neutral: { icon: Meh, color: "hsl(210 40% 70%)", emoji: "😐", label: "Neutral" },
};

const MoodVisualization = ({ emotion, intensity }: MoodVisualizationProps) => {
  const config = emotionConfig[emotion];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      {/* Emoji Display */}
      <motion.div
        key={emotion}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex justify-center"
      >
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center text-6xl breathe"
          style={{
            background: `radial-gradient(circle, ${config.color}40 0%, transparent 70%)`,
            boxShadow: `0 0 60px ${config.color}60`,
          }}
        >
          {config.emoji}
        </div>
      </motion.div>

      {/* Emotion Label */}
      <motion.div
        key={`${emotion}-label`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-3xl font-bold mb-2" style={{ color: config.color }}>
          {config.label}
        </h3>
        <p className="text-sm text-muted-foreground">
          Intensity: {Math.round(intensity * 100)}%
        </p>
      </motion.div>

      {/* Intensity Bar */}
      <div className="space-y-2">
        <div className="h-3 bg-card/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${intensity * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${config.color}, ${config.color}dd)`,
              boxShadow: `0 0 20px ${config.color}80`,
            }}
          />
        </div>
      </div>

      {/* Animated Icon */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex justify-center opacity-30"
      >
        <Icon className="w-24 h-24" style={{ color: config.color }} />
      </motion.div>
    </div>
  );
};

export default MoodVisualization;
