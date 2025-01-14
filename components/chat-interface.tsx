'use client';

import { useChat } from 'ai/react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRef, useEffect } from 'react';
import { toast } from 'sonner';

export function ChatInterface({
	apiKey,
	onApiKeyChange,
}: {
	apiKey: string | null;
	onApiKeyChange: (apiKey: string | null) => void;
}) {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const savedKey = localStorage.getItem('openai-api-key');
		onApiKeyChange(savedKey);

		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'openai-api-key') {
				onApiKeyChange(e.newValue);
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [apiKey, onApiKeyChange]);

	const { messages, input, handleInputChange, handleSubmit, isLoading } =
		useChat({
			api: '/api/chat',
			initialMessages: [
				{
					id: 'welcome',
					role: 'assistant',
					content:
						"Hello! I'm here to listen and support you in a safe, non-judgmental space. How are you feeling today?",
				},
			],
			body: {
				apiKey: apiKey,
			},
			onError: (error) => {
				console.error('Chat error:', error);
				const errorMessage =
					error.message ||
					'An error occurred while sending your message';

				if (errorMessage.includes('API key')) {
					toast.error('API Key Error', {
						description:
							'Please check your OpenAI API key in settings.',
					});
				} else if (errorMessage.includes('rate limit')) {
					toast.error('Rate Limit Exceeded', {
						description:
							'Please wait a moment before sending another message.',
					});
				} else {
					toast.error('Error', {
						description: errorMessage,
					});
				}
			},
		});

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!apiKey) {
			toast.error('API Key Required', {
				description: 'Please add your OpenAI API key in settings.',
			});
			return;
		}
		if (!input.trim()) return;
		handleSubmit(e as React.FormEvent<HTMLFormElement>);
	};

	return (
		<div className="flex flex-col h-[calc(100vh-8rem)] bg-background">
			<ScrollArea className="flex-1 p-4">
				<div className="space-y-4">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${
								message.role === 'user'
									? 'justify-end'
									: 'justify-start'
							}`}
						>
							<Card
								className={`max-w-[80%] p-4 ${
									message.role === 'user'
										? 'bg-primary text-primary-foreground'
										: 'bg-muted'
								}`}
							>
								<div className="flex items-start gap-3">
									<Avatar className="w-8 h-8">
										<div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
											{message.role === 'user'
												? 'U'
												: 'AI'}
										</div>
									</Avatar>
									<p className="leading-relaxed whitespace-pre-wrap">
										{message.content}
									</p>
								</div>
							</Card>
						</div>
					))}
					{isLoading && (
						<div className="flex justify-start">
							<Card className="max-w-[80%] p-4 bg-muted">
								<div className="flex items-start gap-3">
									<Avatar className="w-8 h-8">
										<div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
											AI
										</div>
									</Avatar>
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
										<div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-.3s]" />
										<div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-.5s]" />
									</div>
								</div>
							</Card>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>
			</ScrollArea>
			<form onSubmit={handleFormSubmit} className="p-4 border-t">
				<div className="flex gap-2">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex-1">
									<Textarea
										value={input}
										onChange={handleInputChange}
										placeholder={
											apiKey
												? "Share what's on your mind..."
												: 'Please add your OpenAI API key in settings to start chatting'
										}
										className="min-h-[60px]"
										disabled={!apiKey || isLoading}
									/>
								</div>
							</TooltipTrigger>
							{!apiKey && (
								<TooltipContent
									side="top"
									className="max-w-[300px]"
								>
									<p>
										To start chatting, click the settings
										icon in the top right and enter your
										OpenAI API key. You can get one from the
										OpenAI website.
									</p>
								</TooltipContent>
							)}
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<span>
									<Button
										type="submit"
										size="icon"
										disabled={
											isLoading ||
											!input.trim() ||
											!apiKey
										}
									>
										<Send className="h-4 w-4" />
										<span className="sr-only">
											Send message
										</span>
									</Button>
								</span>
							</TooltipTrigger>
							{!apiKey && (
								<TooltipContent side="top">
									<p>API key required to send messages</p>
								</TooltipContent>
							)}
						</Tooltip>
					</TooltipProvider>
				</div>
			</form>
			<div className="p-4 text-center text-sm text-muted-foreground border-t">
				<p className="font-semibold mb-1">
					If you&apos;re experiencing a crisis, please contact your
					local emergency services or mental health crisis hotline.
				</p>
				<p>
					This AI chatbot is not a substitute for professional mental
					health care.
				</p>
			</div>
		</div>
	);
}
