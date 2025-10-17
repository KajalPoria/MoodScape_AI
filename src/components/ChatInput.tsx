import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Emotion } from "@/pages/Dashboard";

interface ChatInputProps {
  onMoodUpdate: (mood: any) => void;
}

const ChatInput = ({ onMoodUpdate }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);

    try {
      console.log("Analyzing mood with AI...");
      
      const { data: result, error } = await supabase.functions.invoke('analyze-mood', {
        body: { text: input }
      });

      if (error) {
        console.error("Error calling analyze-mood:", error);
        throw error;
      }

      console.log("Mood analysis result:", result);

      onMoodUpdate({
        emotion: result.emotion,
        intensity: result.intensity,
        message: result.message,
        musicAction: result.musicAction,
        visualAction: result.visualAction,
        microAction: result.microAction,
      });

      toast({
        title: "Mood detected",
        description: `${result.emotion.charAt(0).toUpperCase() + result.emotion.slice(1)} • ${Math.round(result.intensity * 100)}%`,
      });

      setInput("");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: "Failed to process your input. Please try again.",
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
