
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="container py-16">
      <motion.div 
        className="flex flex-col gap-4 text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold">About Lucky AI</h2>
        <p className="text-lg text-muted-foreground">
          Lucky is a powerful AI assistant designed to help you with everyday tasks, answer questions,
          provide information, and assist you in making decisions. Powered by state-of-the-art
          language models, Lucky gets smarter with every interaction.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <motion.div 
            className="rounded-lg p-6 glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
          >
            <h3 className="text-xl font-medium mb-2">Smart Conversations</h3>
            <p className="text-muted-foreground">Engage in natural, flowing conversations with an AI that understands context.</p>
          </motion.div>
          
          <motion.div 
            className="rounded-lg p-6 glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
          >
            <h3 className="text-xl font-medium mb-2">Always Learning</h3>
            <p className="text-muted-foreground">Our AI continuously improves through interactions, becoming more helpful over time.</p>
          </motion.div>
          
          <motion.div 
            className="rounded-lg p-6 glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
          >
            <h3 className="text-xl font-medium mb-2">Privacy Focused</h3>
            <p className="text-muted-foreground">Your conversations are private and secure. We take your data privacy seriously.</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
