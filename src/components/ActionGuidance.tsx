import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActionGuidanceProps {
  actionType: string;
  actionLabel: string;
  emotion: string;
  onClose: () => void;
}

const ActionGuidance = ({ actionType, actionLabel, emotion, onClose }: ActionGuidanceProps) => {
  const [guidance, setGuidance] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGuidance();
  }, []);

  const fetchGuidance = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("get-action-guidance", {
        body: { actionType, actionLabel, emotion }
      });

      if (error) throw error;

      setGuidance(data.guidance);
    } catch (error) {
      console.error("Error fetching guidance:", error);
      toast({
        title: "Error",
        description: "Failed to load guidance. Please try again.",
        variant: "destructive",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {actionLabel}
          </h3>
          <Button onClick={onClose} size="icon" variant="ghost">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {guidance}
              </div>
            </div>
          </ScrollArea>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActionGuidance;
