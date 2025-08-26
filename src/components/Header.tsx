import { Button } from "@/components/ui/button";
import { Bot, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { buttonHover } from "@/lib/animations";

const Header = () => {
  return (
    <motion.header 
      className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className="bg-gradient-primary p-2 rounded-lg"
            whileHover={{ 
              rotate: 10,
              scale: 1.1 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25 
            }}
          >
            <Bot className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-foreground">FinanceGPT</h1>
            <p className="text-xs text-muted-foreground">Your AI Money Mentor</p>
          </div>
        </motion.div>
        <motion.nav 
          className="flex items-center gap-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="sm">Features</Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="sm">Pricing</Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" size="sm">Sign In</Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button variant="hero" size="sm">Get Started</Button>
          </motion.div>
        </motion.nav>
      </div>
    </motion.header>
  );
};

export default Header;