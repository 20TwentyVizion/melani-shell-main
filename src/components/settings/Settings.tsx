import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem('gemini-api-key', apiKey);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Google Gemini API Key</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
            <Button onClick={handleSaveApiKey}>Save API Key</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
