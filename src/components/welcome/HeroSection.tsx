
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="container py-20 flex flex-col md:flex-row items-center gap-8 md:gap-12">
      <motion.div 
        className="flex flex-col gap-4 flex-1"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gradient">
          Your AI Assistant, <br />Designed for Everyone
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Discover the power of AI with Lucky, your personal assistant for everyday tasks.
        </p>
        
        <motion.div 
          className="flex mt-6 max-w-md w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ask me anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-20 py-6 rounded-full"
            />
            <Link to={searchQuery ? `/chat?q=${encodeURIComponent(searchQuery)}` : "/chat"}>
              <Button 
                className="absolute right-1 top-1 rounded-full" 
                size="sm"
                disabled={!searchQuery}
              >
                Get Answer
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="flex-1 flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.4,
          type: "spring",
          stiffness: 100
        }}
      >
        <div className="w-full max-w-md aspect-square relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-full"></div>
          <motion.img 
            src="/bot.gif" 
            alt="Lucky AI Assistant" 
            className="w-full h-full object-contain p-8 rounded-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: [10, 0, 10],
              scale: [0.95, 1, 0.95]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
