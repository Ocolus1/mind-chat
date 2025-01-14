'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SettingsDialog({ apiKey, onApiKeyChange }: { apiKey: string; onApiKeyChange: (apiKey: string) => void }) {

  const [open, setOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai-api-key');
    if (savedApiKey) {
      onApiKeyChange(savedApiKey);
    }
  }, [onApiKeyChange]);

  const validateApiKey = async (key: string) => {
    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key }),
      });

      const data = await response.json();
      return data.valid;
    } catch (error) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast({
        title: 'Invalid API Key',
        description: 'Please enter a valid OpenAI API key starting with "sk-"',
        variant: 'destructive',
      });
      return;
    }

    setIsValidating(true);

    try {
      const isValid = await validateApiKey(apiKey);
      
      if (!isValid) {
        toast({
          title: 'Invalid API Key',
          description: 'The API key could not be validated with OpenAI',
          variant: 'destructive',
        });
        return;
      }

      localStorage.setItem('openai-api-key', apiKey);
      toast({
        title: 'Settings saved',
        description: 'Your API key has been validated and saved successfully.',
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to validate API key',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="sk-..."
            />
            <p className="text-sm text-muted-foreground">
              Enter your OpenAI API key. You can find it in your{' '}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                OpenAI dashboard
              </a>
              .
            </p>
          </div>
          <Button onClick={handleSave} className="w-full" disabled={isValidating}>
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}