import { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export const AnimatedCounter = ({ 
  value, 
  duration = 2, 
  prefix = "", 
  suffix = "",
  className = "",
  decimals = 0
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeOut * value);
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      // Cleanup
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [inView, value, duration]);

  const formatValue = (val: number) => {
    if (decimals > 0) {
      return val.toFixed(decimals);
    }
    return val.toLocaleString();
  };

  return (
    <motion.span 
      ref={ref}
      className={className}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.1
      }}
    >
      {prefix}{formatValue(displayValue)}{suffix}
    </motion.span>
  );
};