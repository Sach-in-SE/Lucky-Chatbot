
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const WelcomeHeader = () => {
  return (
    <motion.header 
      className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Lucky AI</span>
          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">Beta</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#about" className="text-foreground/70 hover:text-foreground transition-colors">About the Tool</a>
          <Link to="/chat" state={{ showContact: true }} className="text-foreground/70 hover:text-foreground transition-colors">Contact Us</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/signin">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
          <Link to="/chat">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default WelcomeHeader;
