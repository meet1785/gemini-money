import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, PieChart, TrendingUp, Calculator, BookOpen, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, cardHover } from "@/lib/animations";

const Features = () => {
  const features = [
    {
      icon: Bot,
      title: "AI Financial Advisor",
      description: "Get personalized financial advice through natural conversations. Ask questions in plain English and receive expert guidance.",
      gradient: "bg-gradient-primary"
    },
    {
      icon: PieChart,
      title: "Smart Expense Tracking",
      description: "Upload bank statements and let AI categorize your expenses automatically. Get insights into spending patterns.",
      gradient: "bg-gradient-success"
    },
    {
      icon: TrendingUp,
      title: "Investment Planning",
      description: "Simulate different investment strategies and see projected returns. Plan for your financial goals with confidence.",
      gradient: "bg-gradient-hero"
    },
    {
      icon: Calculator,
      title: "What-If Scenarios",
      description: "Ask 'What if' questions about your finances and get detailed projections with charts and explanations.",
      gradient: "bg-gradient-primary"
    },
    {
      icon: BookOpen,
      title: "Financial Education",
      description: "Learn complex financial concepts explained in simple terms. From compound interest to portfolio diversification.",
      gradient: "bg-gradient-success"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and secure. We never store sensitive information without your consent.",
      gradient: "bg-gradient-hero"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl font-bold mb-4">Powerful Financial Tools</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to take control of your finances, powered by advanced AI technology
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover="hover"
              className="h-full"
            >
              <motion.div
                variants={cardHover}
                className="h-full"
              >
                <Card className="shadow-card hover:shadow-glow transition-all duration-300 border-0 h-full backdrop-blur-sm bg-white/80">
                  <CardHeader>
                    <motion.div 
                      className={`w-12 h-12 rounded-lg ${feature.gradient} p-3 mb-4`}
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
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;