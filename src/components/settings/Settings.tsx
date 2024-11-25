import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envApiKey && envApiKey !== 'your_api_key_here') {
      setApiKey(envApiKey);
    }
  }, []);

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure your Google Gemini API key for Melani
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              The API key should be set in the .env file as VITE_GEMINI_API_KEY
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Current API Key Status</label>
            <div className="p-2 rounded-md bg-secondary/50">
              {apiKey ? (
                <span className="text-sm text-green-500">API key is configured ✓</span>
              ) : (
                <span className="text-sm text-yellow-500">No API key found. Please add it to your .env file.</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
