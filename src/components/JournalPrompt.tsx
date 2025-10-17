import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface JournalPromptProps {
  prompt: string;
  onClose: () => void;
}

const JournalPrompt = ({ prompt, onClose }: JournalPromptProps) => {
  const [entry, setEntry] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (entry.trim()) {
      // Save to localStorage for now
      const existingEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
      existingEntries.push({
        prompt,
        entry,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem("journalEntries", JSON.stringify(existingEntries));
      
      toast({
        title: "✓ Saved",
        description: "Your journal entry has been saved",
      });
      onClose();
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
        className="glass-panel rounded-3xl p-6 max-w-2xl w-full space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Journal Prompt</h3>
          <Button onClick={onClose} size="icon" variant="ghost">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-muted-foreground">{prompt}</p>

        <Textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          className="min-h-[200px] bg-card/30 border-border/50 focus:border-primary"
        />

        <div className="flex gap-3 justify-end">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!entry.trim()}>
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JournalPrompt;
