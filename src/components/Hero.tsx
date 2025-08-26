import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, TrendingUp, Calculator, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-finance.jpg";
import { motion } from "framer-motion";
import { fadeInUp, slideInLeft, slideInRight, floatAnimation, buttonHover } from "@/lib/animations";

const Hero = () => {
  return (
    <section className="py-20 bg-gradient-hero text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
        transition={{ delay: 1 }}
      />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-8"
            variants={slideInLeft}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="space-y-4"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Your AI Financial 
                <motion.span 
                  className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.6,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  Mentor
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-xl text-white/90 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Get personalized financial advice, track expenses intelligently, and plan your investments with the power of AI. No jargon, just clear guidance.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.div
                variants={buttonHover}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button variant="secondary" size="lg" className="text-lg">
                  <MessageCircle className="h-5 w-5" />
                  Start Chat with AI
                </Button>
              </motion.div>
              <motion.div
                variants={buttonHover}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Calculator className="h-5 w-5" />
                  Try Calculator
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-8 text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Bot className="h-5 w-5" />
                <span>AI-Powered</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <TrendingUp className="h-5 w-5" />
                <span>Real-time Analysis</span>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative"
            variants={slideInRight}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.02, 
                rotateY: 5,
                rotateX: 5 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              style={{
                transformStyle: "preserve-3d"
              }}
            >
              <Card className="bg-gradient-card shadow-glow border-0 p-6 backdrop-blur-sm bg-white/10">
                <motion.img 
                  src={heroImage} 
                  alt="AI Financial Dashboard"
                  className="w-full h-auto rounded-lg shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.6,
                    type: "spring",
                    stiffness: 200
                  }}
                />
              </Card>
            </motion.div>
            
            {/* Floating stats cards */}
            <motion.div
              className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-gray-800"
              initial={{ opacity: 0, scale: 0, rotate: 15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <div className="text-sm font-semibold text-green-600">+24.5%</div>
              <div className="text-xs text-gray-600">Portfolio Growth</div>
            </motion.div>
            
            <motion.div
              className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-gray-800"
              initial={{ opacity: 0, scale: 0, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, rotate: -5 }}
            >
              <div className="text-sm font-semibold text-blue-600">₹2.4L</div>
              <div className="text-xs text-gray-600">Monthly Savings</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;