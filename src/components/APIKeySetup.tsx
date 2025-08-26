import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Key, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

const APIKeySetup = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");
  
  const currentApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const isConfigured = currentApiKey && currentApiKey !== 'your_gemini_api_key_here' && currentApiKey.trim() !== '';
  
  const copyEnvTemplate = () => {
    const envTemplate = `# Add this to your .env file
VITE_GEMINI_API_KEY=your_actual_api_key_here

# App Configuration  
VITE_APP_NAME=FinanceGPT
VITE_APP_VERSION=1.0.0`;
    
    navigator.clipboard.writeText(envTemplate);
    toast.success("Environment template copied to clipboard!");
  };

  const steps = [
    {
      title: "Get Your Gemini API Key",
      description: "Visit Google AI Studio to create your free API key",
      action: (
        <Button variant="outline" size="sm" asChild>
          <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3 w-3 mr-1" />
            Get API Key
          </a>
        </Button>
      )
    },
    {
      title: "Update Your Environment File", 
      description: "Add your API key to the .env file in your project root",
      action: (
        <Button variant="outline" size="sm" onClick={copyEnvTemplate}>
          <Copy className="h-3 w-3 mr-1" />
          Copy Template
        </Button>
      )
    },
    {
      title: "Restart Development Server",
      description: "Restart your development server to load the new environment variables",
      action: (
        <Badge variant="outline">npm run dev</Badge>
      )
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">AI Configuration Setup</h2>
          <p className="text-muted-foreground text-lg">
            Configure your Gemini AI API key to enable full AI capabilities
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Current Status */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Key Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className={isConfigured ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
                <div className="flex items-center gap-2">
                  {isConfigured ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  )}
                  <AlertDescription className={isConfigured ? 'text-green-800' : 'text-orange-800'}>
                    {isConfigured ? (
                      <div className="flex items-center justify-between w-full">
                        <span>✅ Gemini AI is configured and ready to use!</span>
                        <Badge variant="default" className="bg-green-600">
                          Connected
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span>⚠️ Gemini API key not configured. Using fallback responses.</span>
                        <Badge variant="secondary">
                          Setup Required
                        </Badge>
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </Alert>

              {isConfigured && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current API Key:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <code className="text-xs text-muted-foreground break-all">
                    {showApiKey ? currentApiKey : `${currentApiKey?.substring(0, 8)}...${currentApiKey?.substring(-8)}`}
                  </code>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup Steps */}
          {!isConfigured && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Setup Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      {step.action}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Features Available */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                AI Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">With API Key:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Real-time AI financial advice
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Personalized investment strategies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Advanced expense analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Custom financial planning
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Without API Key:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-orange-600" />
                      Basic pre-written responses
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-orange-600" />
                      General financial tips
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-orange-600" />
                      Standard dashboard features
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-orange-600" />
                      Limited personalization
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="shadow-card border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-blue-800">Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700 text-sm space-y-2">
              <p>• Your API key is stored locally in environment variables and never shared</p>
              <p>• Gemini API is free for basic usage with generous quotas</p>
              <p>• The app works in limited mode without an API key</p>
              <p>• Restart your development server after adding the API key</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default APIKeySetup;