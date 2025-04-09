
import { Link } from 'react-router-dom';
import { Github, Linkedin } from 'lucide-react';

const WelcomeFooter = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm text-muted-foreground mb-2">
            © {new Date().getFullYear()} Lucky AI. All rights reserved.
          </p>
          <p className="footer-credit text-center text-white">
    Developed by Team - Sachin Kumar (Leader)<br></br>
     Arpit Sharma and Gyanendra Goswami
  </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-4">
          
          <div className="footer-social">
            <a href="https://github.com/Sach-in-SE" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/in/sachin-kumar-08b390359" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WelcomeFooter;
