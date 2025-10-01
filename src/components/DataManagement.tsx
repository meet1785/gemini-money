import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, Trash2, FileJson, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportData, importData, clearAllStorage } from "@/lib/storage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DataManagement = () => {
  const { toast } = useToast();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financeGPT-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your financial data has been exported successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const success = importData(content);
          
          if (success) {
            toast({
              title: "Data Imported",
              description: "Your financial data has been imported successfully. Please refresh the page.",
            });
            // Refresh page to reload data
            setTimeout(() => window.location.reload(), 2000);
          } else {
            throw new Error('Import failed');
          }
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Failed to import data. Please check the file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearData = () => {
    clearAllStorage();
    toast({
      title: "Data Cleared",
      description: "All your financial data has been cleared. Page will refresh.",
    });
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <section className="py-8">
      <div className="container">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5 text-primary" />
              Data Management
            </CardTitle>
            <CardDescription>
              Backup, restore, or clear your financial data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your data is stored locally in your browser. We recommend exporting your data regularly as a backup.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="text-sm">Export Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleExport} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export as JSON
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Download all your data as a JSON file
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="text-sm">Import Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleImport} 
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import from JSON
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Restore data from a backup file
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="text-sm">Clear All Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setShowClearDialog(true)} 
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Delete all stored data permanently
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your
              financial data including expenses, goals, and investments from your browser's
              local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearData} className="bg-red-600 hover:bg-red-700">
              Yes, clear all data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default DataManagement;
