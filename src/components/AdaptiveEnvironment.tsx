import { motion } from "framer-motion";
import type { Emotion } from "@/pages/Dashboard";

interface AdaptiveEnvironmentProps {
  emotion: Emotion;
  
}

const environmentConfig = {
  calm: {
    gradient: "linear-gradient(135deg, hsl(200 80% 60%) 0%, hsl(180 90% 65%) 100%)",
    particles: 15,
    speed: 20,
  },
  happy: {
    gradient: "linear-gradient(135deg, hsl(45 100% 60%) 0%, hsl(30 100% 65%) 100%)",
    particles: 25,
    speed: 10,
  },
  anxious: {
    gradient: "linear-gradient(135deg, hsl(280 60% 55%) 0%, hsl(150 50% 50%) 100%)",
    particles: 30,
    speed: 5,
  },
  sad: {
    gradient: "linear-gradient(135deg, hsl(220 50% 45%) 0%, hsl(240 40% 35%) 100%)",
    particles: 10,
    speed: 25,
  },
  excited: {
    gradient: "linear-gradient(135deg, hsl(330 85% 65%) 0%, hsl(45 95% 60%) 100%)",
    particles: 35,
    speed: 7,
  },
  neutral: {
    gradient: "linear-gradient(135deg, hsl(250 50% 50%) 0%, hsl(200 50% 50%) 100%)",
    particles: 12,
    speed: 15,
  },
};

const AdaptiveEnvironment = ({ emotion }: AdaptiveEnvironmentProps) => {
  const config = environmentConfig[emotion];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Animated Background */}
      <motion.div
        key={`bg-${emotion}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          background: config.gradient,
          backgroundSize: "200% 200%",
        }}
      >
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: config.speed,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-full h-full"
          style={{
            background: config.gradient,
            backgroundSize: "200% 200%",
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(config.particles)].map((_, i) => (
          <motion.div
            key={`${emotion}-particle-${i}`}
            className="absolute rounded-full bg-white/20 backdrop-blur-sm"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 40 - 20, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Center Message Overlay */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-center px-8"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl mb-4">
            {emotion === "calm" && "Find Your Peace"}
            {emotion === "happy" && "Embrace The Joy"}
            {emotion === "anxious" && "Breathe & Release"}
            {emotion === "sad" && "It's Okay To Feel"}
            {emotion === "excited" && "Ride The Energy"}
            {emotion === "neutral" && "Explore Your Mood"}
          </h2>
          <p className="text-xl md:text-2xl text-white/80 drop-shadow-lg">
            {emotion === "calm" && "Let the waves wash over you..."}
            {emotion === "happy" && "Celebrate this moment..."}
            {emotion === "anxious" && "Ground yourself..."}
            {emotion === "sad" && "Allow yourself to process..."}
            {emotion === "excited" && "Channel your passion..."}
            {emotion === "neutral" && "What are you feeling today?"}
          </p>
        </motion.div>
      </motion.div>

      {/* Ambient Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>
    </div>
  );
};

export default AdaptiveEnvironment;
