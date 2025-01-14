'use client';

import { ChatInterface } from '@/components/chat-interface';
import { SettingsDialog } from '@/components/settings-dialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { Brain } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  return (
		<main className="min-h-screen bg-background">
			<header className="border-b">
				<div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
					<div className="flex items-center space-x-2">
						<Brain className="h-6 w-6 text-primary" />
						<h1 className="text-xl font-bold">MindChat</h1>
					</div>
					<div className="flex items-center space-x-2">
						<ThemeToggle />
						<SettingsDialog
							apiKey={apiKey ?? ''}
							onApiKeyChange={setApiKey}
						/>
					</div>
				</div>
			</header>
			<div className="container mx-auto px-4 max-w-4xl">
				<ChatInterface apiKey={apiKey ?? ''} onApiKeyChange={setApiKey} />
			</div>
		</main>
  );
}