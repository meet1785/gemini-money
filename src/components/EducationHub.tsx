import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock,
  Star,
  TrendingUp,
  DollarSign,
  PieChart,
  Shield,
  Calculator
} from "lucide-react";

const EducationHub = () => {
  const [completedLessons, setCompletedLessons] = useState<string[]>(["1", "3"]);

  const courses = [
    {
      id: "basics",
      title: "Financial Basics",
      description: "Learn fundamental concepts of personal finance",
      lessons: 8,
      duration: "2 hours",
      difficulty: "Beginner",
      icon: BookOpen,
      color: "bg-gradient-primary"
    },
    {
      id: "investing",
      title: "Investment Strategies",
      description: "Master different investment approaches and portfolio building",
      lessons: 12,
      duration: "4 hours", 
      difficulty: "Intermediate",
      icon: TrendingUp,
      color: "bg-gradient-success"
    },
    {
      id: "planning",
      title: "Financial Planning",
      description: "Create comprehensive financial plans for your future",
      lessons: 10,
      duration: "3 hours",
      difficulty: "Advanced",
      icon: Calculator,
      color: "bg-gradient-hero"
    }
  ];

  const lessons = [
    {
      id: "1",
      title: "What is Compound Interest?",
      description: "Learn how your money grows exponentially over time",
      duration: "5 min",
      type: "Article",
      difficulty: "Beginner",
      icon: DollarSign
    },
    {
      id: "2", 
      title: "Building Your Emergency Fund",
      description: "Why you need 6 months of expenses saved",
      duration: "8 min",
      type: "Video",
      difficulty: "Beginner",
      icon: Shield
    },
    {
      id: "3",
      title: "Diversification Explained",
      description: "Don't put all your eggs in one basket - here's why",
      duration: "12 min",
      type: "Interactive",
      difficulty: "Intermediate",
      icon: PieChart
    },
    {
      id: "4",
      title: "SIP vs Lump Sum Investment",
      description: "Which investment strategy works better?",
      duration: "10 min",
      type: "Video",
      difficulty: "Intermediate",
      icon: TrendingUp
    },
    {
      id: "5",
      title: "Tax Saving Investments",
      description: "Save money while building wealth",
      duration: "15 min",
      type: "Article",
      difficulty: "Advanced",
      icon: Calculator
    }
  ];

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const calculateProgress = (courseId: string) => {
    const courseLessons = lessons.filter(lesson => 
      (courseId === "basics" && ["1", "2"].includes(lesson.id)) ||
      (courseId === "investing" && ["3", "4"].includes(lesson.id)) ||
      (courseId === "planning" && ["5"].includes(lesson.id))
    );
    const completed = courseLessons.filter(lesson => completedLessons.includes(lesson.id));
    return courseLessons.length > 0 ? (completed.length / courseLessons.length) * 100 : 0;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-secondary text-white";
      case "Intermediate": return "bg-yellow-500 text-white";
      case "Advanced": return "bg-destructive text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video": return Play;
      case "Interactive": return Star;
      default: return BookOpen;
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Financial Education Hub</h2>
          <p className="text-muted-foreground text-lg">
            Learn complex financial concepts explained in simple terms by AI
          </p>
        </div>

        {/* Courses Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {courses.map((course) => {
            const IconComponent = course.icon;
            const progress = calculateProgress(course.id);
            
            return (
              <Card key={course.id} className="shadow-card hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${course.color} p-3 mb-3`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{course.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {course.lessons} lessons
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.duration}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <Button variant="hero" className="w-full">
                    {progress > 0 ? "Continue Learning" : "Start Course"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Individual Lessons */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Latest Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {lessons.map((lesson) => {
                const TypeIcon = getTypeIcon(lesson.type);
                const LessonIcon = lesson.icon;
                const isCompleted = completedLessons.includes(lesson.id);

                return (
                  <div 
                    key={lesson.id} 
                    className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                      isCompleted ? 'bg-secondary/5 border-secondary' : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isCompleted ? 'bg-secondary' : 'bg-gradient-primary'}`}>
                        <LessonIcon className="h-4 w-4 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {lesson.title}
                          </h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleLessonComplete(lesson.id)}
                            className="h-6 w-6 p-0"
                          >
                            <CheckCircle className={`h-4 w-4 ${isCompleted ? 'text-secondary' : 'text-muted-foreground'}`} />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {lesson.description}
                        </p>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {lesson.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {lesson.duration}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                            {lesson.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* AI Learning Assistant */}
        <Card className="shadow-glow bg-gradient-hero text-white mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              AI Learning Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Personalized Learning Path</h3>
                <p className="text-white/90 text-sm mb-4">
                  Based on your financial profile, we recommend starting with "Building Your Emergency Fund" 
                  and then moving to "Investment Strategies".
                </p>
                <Button variant="secondary" size="sm">
                  View Recommendations
                </Button>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Ask Questions</h3>
                <p className="text-white/90 text-sm mb-4">
                  Don't understand something? Ask our AI tutor to explain any financial concept 
                  in simple terms tailored to your level.
                </p>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Ask AI Tutor
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EducationHub;