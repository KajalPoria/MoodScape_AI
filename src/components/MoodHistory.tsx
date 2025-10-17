import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Emotion } from "@/pages/Dashboard";
import { Clock } from "lucide-react";

interface MoodHistoryProps {
  userId: string;
}

interface MoodRecord {
  id: string;
  emotion: Emotion;
  intensity: number;
  created_at: string;
}

const MoodHistory = ({ userId }: MoodHistoryProps) => {
  const [history, setHistory] = useState<MoodRecord[]>([]);

  useEffect(() => {
    loadMoodHistory();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('mood-history')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mood_sessions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log("New mood session:", payload);
          loadMoodHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const loadMoodHistory = async () => {
    const result = await supabase
      // @ts-ignore - mood_sessions table exists but types not yet regenerated
      .from("mood_sessions")
      .select("id, emotion, intensity, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(7);

    const { data, error } = result;

    if (error) {
      console.error("Error loading mood history:", error);
    } else if (data) {
      setHistory(data as MoodRecord[]);
    }
  };

  const getEmotionColor = (emotion: Emotion) => {
    const colors = {
      calm: "bg-blue-500",
      happy: "bg-yellow-500",
      anxious: "bg-orange-500",
      sad: "bg-indigo-500",
      excited: "bg-pink-500",
      neutral: "bg-gray-500",
    };
    return colors[emotion];
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Recent Sessions</span>
      </div>
      <div className="flex gap-2">
        {history.length === 0 ? (
          <div className="text-xs text-muted-foreground">No mood history yet</div>
        ) : (
          history.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-1"
            >
              <div 
                className={`h-16 rounded-lg ${getEmotionColor(record.emotion)} transition-all hover:scale-105`}
                style={{ opacity: 0.3 + (record.intensity * 0.7) }}
                title={`${record.emotion} - ${Math.round(record.intensity * 100)}%`}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MoodHistory;
