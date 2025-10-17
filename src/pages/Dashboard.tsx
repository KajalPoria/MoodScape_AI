import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MoodVisualization from "@/components/MoodVisualization";
import AdaptiveEnvironment from "@/components/AdaptiveEnvironment";
import ChatInput from "@/components/ChatInput";
import MicroActionPanel from "@/components/MicroActionPanel";
import MoodHistory from "@/components/MoodHistory";
import { LogOut, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Emotion = "calm" | "happy" | "anxious" | "sad" | "excited" | "neutral";

interface MoodState {
  emotion: Emotion;
  intensity: number;
  message: string;
  musicAction: string;
  visualAction: string;
  microAction: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [moodState, setMoodState] = useState<MoodState>({
    emotion: "neutral",
    intensity: 0.5,
    message: "Welcome! Tell me how you're feeling today...",
    musicAction: "",
    visualAction: "",
    microAction: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleMoodUpdate = async (newMood: MoodState) => {
    setMoodState(newMood);
    
    // Save to database
    if (user) {
      try {
        const sessionData: any = {
          user_id: user.id,
          emotion: newMood.emotion,
          intensity: newMood.intensity,
          input_text: newMood.message,
          music_action: newMood.musicAction,
          visual_action: newMood.visualAction,
          micro_action: newMood.microAction,
        };

        // @ts-ignore - mood_sessions table exists but types not yet regenerated
        const { error } = await supabase.from("mood_sessions").insert(sessionData);

        if (error) {
          console.error("Error saving mood session:", error);
          toast({
            title: "Error",
            description: "Failed to save mood session",
            variant: "destructive",
          });
        }
      } catch (e) {
        console.error("Exception saving mood:", e);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-animated flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-animated relative overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-panel border-b border-border/50 px-6 py-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="sm"
            className="hover:bg-primary/20 transition-smooth"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <User className="w-6 h-6 text-accent" />
          <span className="text-sm text-muted-foreground">
            {user?.email}
          </span>
        </div>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          size="sm"
          className="hover:bg-destructive/20 hover:text-destructive transition-smooth"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </motion.header>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-[300px_1fr_300px] gap-6 p-6 h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Panel - Mood Visualization */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-3xl p-6 flex flex-col gap-6 overflow-y-auto"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Mood
          </h2>
          <MoodVisualization emotion={moodState.emotion} intensity={moodState.intensity} />
          
          <div className="mt-auto space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current State</p>
              <div className="p-4 bg-card/50 rounded-xl">
                <p className="text-sm leading-relaxed">{moodState.message}</p>
              </div>
            </div>
            
            <MoodHistory userId={user?.id} />
          </div>
        </motion.div>

        {/* Center Panel - Adaptive Environment */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-3xl overflow-hidden relative"
        >
          <AnimatePresence mode="wait">
            <AdaptiveEnvironment key={moodState.emotion} emotion={moodState.emotion} />
          </AnimatePresence>
          
          {/* Chat Input at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <ChatInput onMoodUpdate={handleMoodUpdate} />
          </div>
        </motion.div>

        {/* Right Panel - Micro Actions */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-3xl p-6 overflow-y-auto"
        >
          <MicroActionPanel 
            emotion={moodState.emotion} 
            microAction={moodState.microAction}
            musicAction={moodState.musicAction}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
