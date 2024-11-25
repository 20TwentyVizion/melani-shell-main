import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Bot, User, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

const GREETING_MESSAGE = "Hello! I'm Melani, your personal AI assistant. How can I help you today?";

const Melani = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Show greeting message with typing animation when component mounts
    const showGreeting = async () => {
      setMessages([{ role: 'assistant', content: '', isTyping: true }]);
      
      // Wait for 1.5 seconds to simulate typing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessages([{ role: 'assistant', content: GREETING_MESSAGE }]);
    };

    showGreeting();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please set your Google Gemini API key in the .env file",
        variant: "destructive",
      });
      return;
    }

    // Add user message
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Add typing indicator for assistant
    setMessages(prev => [...prev, { role: 'assistant', content: '', isTyping: true }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: input
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        // Remove typing indicator and add actual response
        setMessages(prev => {
          const newMessages = prev.slice(0, -1); // Remove typing indicator
          return [...newMessages, {
            role: 'assistant',
            content: data.candidates[0].content.parts[0].text
          }];
        });
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      // Remove typing indicator on error
      setMessages(prev => prev.slice(0, -1));
      toast({
        title: "Error",
        description: "Failed to get response from Melani",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className={`p-3 rounded-lg max-w-[80%] ${
                message.role === 'assistant' 
                  ? 'bg-secondary/50 text-secondary-foreground' 
                  : 'bg-primary text-primary-foreground ml-auto'
              }`}>
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' ? (
                    <Bot className="w-5 h-5 mt-1 shrink-0" />
                  ) : (
                    <User className="w-5 h-5 mt-1 shrink-0" />
                  )}
                  <div className="min-w-[20px]">
                    {message.isTyping ? (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Type your message..."
            disabled={isLoading}
            className="bg-background"
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Melani;
