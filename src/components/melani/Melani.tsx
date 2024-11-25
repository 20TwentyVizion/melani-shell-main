import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Melani = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const apiKey = localStorage.getItem('gemini-api-key');
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please set your Google Gemini API key in settings",
        variant: "destructive",
      });
      return;
    }

    // Add user message
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
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
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.candidates[0].content.parts[0].text
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
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
    <div className="flex flex-col h-full p-4">
      <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className={`p-2 rounded-lg max-w-[80%] ${
                message.role === 'assistant' 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'bg-primary text-primary-foreground ml-auto'
              }`}>
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' ? (
                    <Bot className="w-4 h-4 mt-1" />
                  ) : (
                    <User className="w-4 h-4 mt-1" />
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button onClick={sendMessage} disabled={isLoading}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default Melani;
