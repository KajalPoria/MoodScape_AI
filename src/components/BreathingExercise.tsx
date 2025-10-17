import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreathingExerciseProps {
  pattern: string;
  onClose: () => void;
}

const BreathingExercise = ({ pattern, onClose }: BreathingExerciseProps) => {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "pause">("inhale");
  const [count, setCount] = useState(4);

  const patterns: Record<string, number[]> = {
    "4-4-4-4": [4, 4, 4, 4], // Box breathing
    "4-7-8": [4, 7, 8, 0],   // 4-7-8 technique
    "slow": [5, 2, 6, 2],    // Slow breathing
  };

  const timing = patterns[pattern] || patterns["4-4-4-4"];
  const [inhale, hold1, exhale, hold2] = timing;

  useEffect(() => {
    const allPhases = [
      { name: "inhale" as const, duration: inhale },
      { name: "hold" as const, duration: hold1 },
      { name: "exhale" as const, duration: exhale },
      { name: "pause" as const, duration: hold2 },
    ];
    const phases = allPhases.filter(p => p.duration > 0);

    let currentPhaseIndex = 0;
    let countdown = phases[0].duration;
    setCount(countdown);

    const interval = setInterval(() => {
      countdown--;
      setCount(countdown);

      if (countdown <= 0) {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        countdown = phases[currentPhaseIndex].duration;
        setPhase(phases[currentPhaseIndex].name);
        setCount(countdown);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pattern, inhale, hold1, exhale, hold2]);

  const getPhaseText = () => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      case "pause": return "Pause";
    }
  };

  const getScale = () => {
    if (phase === "inhale") return 1.5;
    if (phase === "exhale") return 0.8;
    return 1.2;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-panel rounded-3xl p-8 max-w-md w-full relative"
      >
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="text-center space-y-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Breathing Exercise
          </h3>

          <div className="relative h-64 flex items-center justify-center">
            <motion.div
              animate={{ scale: getScale() }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center"
            >
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">{count}</p>
                <p className="text-lg text-muted-foreground">{getPhaseText()}</p>
              </div>
            </motion.div>
          </div>

          <p className="text-sm text-muted-foreground">
            Follow the circle's rhythm to guide your breathing
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default BreathingExercise;
