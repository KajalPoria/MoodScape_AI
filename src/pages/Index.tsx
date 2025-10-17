import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Music, Brain, Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI Emotion Detection",
      desc: "Advanced AI analyzes your text input to understand your mood in real-time",
    },
    {
      icon: Music,
      title: "Adaptive Soundscapes",
      desc: "Music and audio that dynamically shifts based on your emotional state",
    },
    {
      icon: Heart,
      title: "Immersive Environments",
      desc: "Beautiful, reactive visuals that morph with your mood",
    },
    {
      icon: Sparkles,
      title: "Micro-Wellness Actions",
      desc: "Quick, science-backed exercises to enhance your emotional wellbeing",
    },
  ];

  return (
    <div className="min-h-screen gradient-animated overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100, Math.random() * window.innerHeight],
              x: [null, Math.random() * 100 - 50, null],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8"
        >
          <Sparkles className="w-24 h-24 text-accent glow-accent" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold text-center mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
        >
          MoodScape AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-center text-muted-foreground mb-4 max-w-2xl"
        >
          Your emotions, your music, your world
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base md:text-lg text-center text-muted-foreground/80 mb-12 max-w-xl"
        >
          Live, adaptive, and immersive emotional experiences powered by AI
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4"
        >
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-smooth pulse-glow text-lg px-8 py-6"
          >
            Get Started
          </Button>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            variant="outline"
            className="glass-panel border-primary/50 hover:border-primary transition-smooth text-lg px-8 py-6"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-32 grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-panel rounded-2xl p-6 transition-smooth hover:glow-primary"
              >
                <div className="p-3 bg-primary/20 rounded-xl w-fit mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-24 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Ready to transform your emotional wellbeing?
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            variant="ghost"
            className="hover:bg-primary/20 transition-smooth"
          >
            Start Your Journey →
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
