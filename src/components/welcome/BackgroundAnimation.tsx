
import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <motion.div 
        className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 15, 0],
          y: [0, -15, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute top-1/3 right-1/4 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
          y: [0, 20, 0]
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 10, 0],
          y: [0, -10, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 4
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;
