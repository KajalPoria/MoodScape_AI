import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Emotion } from "@/pages/Dashboard";

interface ChatInputProps {
  onMoodUpdate: (mood: any) => void;
}

const ChatInput = ({ onMoodUpdate }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const detectEmotion = (text: string): { emotion: Emotion; intensity: number } => {
    const lowerText = text.toLowerCase();
    
    // Simple keyword-based emotion detection
    const emotionKeywords = {
      happy: ["happy", "joy", "great", "wonderful", "excited", "amazing", "love", "good"],
      sad: ["sad", "down", "depressed", "unhappy", "terrible", "awful", "bad"],
      anxious: ["anxious", "worried", "stress", "nervous", "panic", "overwhelmed"],
      calm: ["calm", "peaceful", "relaxed", "tranquil", "serene", "zen"],
      excited: ["excited", "energetic", "pumped", "hyped", "thrilled"],
    };

    let detectedEmotion: Emotion = "neutral";
    let maxMatches = 0;

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion as Emotion;
      }
    });

    // Calculate intensity based on text length and matches
    const intensity = Math.min(0.3 + (maxMatches * 0.2) + (text.length / 200), 1);

    return { emotion: detectedEmotion, intensity };
  };

  const generateResponse = (emotion: Emotion, intensity: number, text: string) => {
    const responses = {
      happy: {
        message: "I can feel your joy! Let's amplify this beautiful energy.",
        music: `Playing uplifting ${intensity > 0.7 ? "high-energy" : "cheerful"} music`,
        visual: "Environment shifting to warm, vibrant colors",
        microAction: "Take a moment to smile and appreciate this feeling",
      },
      sad: {
        message: "I'm here with you. It's okay to feel this way.",
        music: `Playing ${intensity > 0.7 ? "deeply soothing" : "gentle comforting"} music`,
        visual: "Creating a soft, embracing atmosphere",
        microAction: "Try a gentle breathing exercise: inhale for 4, hold for 4, exhale for 6",
      },
      anxious: {
        message: "Let's work through this together. You're safe here.",
        music: `Playing ${intensity > 0.7 ? "grounding" : "calming"} soundscapes`,
        visual: "Surrounding you with calming, flowing visuals",
        microAction: "Ground yourself: Name 5 things you can see, 4 you can touch",
      },
      calm: {
        message: "Beautiful. Let's maintain this peaceful state.",
        music: "Playing ambient, tranquil tones",
        visual: "Environment flowing with serene, ocean-like movements",
        microAction: "Take 3 deep, mindful breaths",
      },
      excited: {
        message: "Your energy is amazing! Let's channel it positively.",
        music: `Playing ${intensity > 0.7 ? "dynamic, energetic" : "motivating"} beats`,
        visual: "Environment pulsing with vibrant, energetic patterns",
        microAction: "Quick movement: stretch your arms wide and take a power pose",
      },
      neutral: {
        message: "Tell me more about how you're feeling...",
        music: "Playing balanced, exploratory sounds",
        visual: "Environment in balanced, exploratory mode",
        microAction: "Journal prompt: What's on your mind right now?",
      },
    };

    return responses[emotion];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const { emotion, intensity } = detectEmotion(input);
      const response = generateResponse(emotion, intensity, input);

      onMoodUpdate({
        emotion,
        intensity,
        message: response.message,
        musicAction: response.music,
        visualAction: response.visual,
        microAction: response.microAction,
      });

      toast({
        title: "Mood detected",
        description: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} • ${Math.round(intensity * 100)}%`,
      });

      setInput("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your input",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-panel rounded-2xl p-4 flex gap-3"
    >
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="How are you feeling right now?"
        disabled={loading}
        className="flex-1 bg-card/30 border-border/50 focus:border-primary focus:glow-primary transition-smooth placeholder:text-muted-foreground/60"
      />
      <Button
        type="submit"
        disabled={loading || !input.trim()}
        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-smooth pulse-glow"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </Button>
    </motion.form>
  );
};

export default ChatInput;
