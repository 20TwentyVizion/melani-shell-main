import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Bot, User, Send } from 'lucide-react';
import { useOSStore } from '@/store/os-store';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

const GREETING_MESSAGE = "Hello! I'm Melani, your personal AI assistant. I can help you control the OS - try asking me to:\n• Open apps (e.g., 'open music')\n• Play music (e.g., 'play Neon Nights')\n• Open your profile\n\nHow can I assist you today?";

const Melani = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const osActions = useOSStore((state) => state.actions);
  const currentSong = useOSStore((state) => state.currentSong);
  const calendarState = useOSStore((state) => state.calendarState);

  useEffect(() => {
    // Show greeting message with typing animation when component mounts
    const showGreeting = async () => {
      setMessages([{ role: 'assistant', content: '', isTyping: true }]);
      
      // Wait for 1.5 seconds to simulate typing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessages([{ 
        role: 'assistant', 
        content: GREETING_MESSAGE 
      }]);
    };

    showGreeting();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOSCommand = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Music commands
    if (lowerMessage.includes('play') && lowerMessage.includes('music')) {
      const songTitle = message.split('play')[1].trim();
      osActions.openWindow('music');
      osActions.playSong(songTitle, 'Unknown Artist');
      return "Playing music: " + songTitle;
    }

    if (lowerMessage.includes('pause') && lowerMessage.includes('music')) {
      osActions.pauseSong();
      return "Paused music.";
    }

    if (lowerMessage.includes('resume') && lowerMessage.includes('music')) {
      osActions.resumeSong();
      return "Resumed music.";
    }

    // Window commands
    const windowCommands = {
      'open music': 'music',
      'open games': 'games',
      'open settings': 'settings',
      'open profile': 'profile',
      'open editor': 'editor',
      'open text editor': 'editor',
      'open calendar': 'calendar',
      'open notepad': 'editor',
    };

    for (const [command, windowId] of Object.entries(windowCommands)) {
      if (lowerMessage.includes(command)) {
        osActions.openWindow(windowId as keyof typeof windowCommands);
        return "Opened " + windowId + ".";
      }
    }

    // Calendar-specific commands
    if (lowerMessage.includes('what day is') || lowerMessage.includes('what\'s the date')) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return `Today is ${formattedDate}`;
    }

    if (lowerMessage.includes('any events') || lowerMessage.includes('what\'s happening')) {
      const today = new Date();
      const todayEvents = calendarState.events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === today.getDate() &&
               eventDate.getMonth() === today.getMonth() &&
               eventDate.getFullYear() === today.getFullYear();
      });

      if (todayEvents.length === 0) {
        return "You don't have any events scheduled for today.";
      }

      const eventList = todayEvents.map(event => event.title).join(', ');
      return `Today's events: ${eventList}`;
    }

    if (lowerMessage.includes('next holiday')) {
      const today = new Date();
      const nextHoliday = calendarState.holidays
        .filter(holiday => new Date(holiday.date) > today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

      if (nextHoliday) {
        const holidayDate = new Date(nextHoliday.date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        });
        return `The next holiday is ${nextHoliday.title} on ${holidayDate}`;
      }
      
      return "I couldn't find any upcoming holidays.";
    }

    return null;
  };

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
    
    // Check for OS commands first
    const osResponse = handleOSCommand(input);
    if (osResponse) {
      setMessages(prev => [...prev, { role: 'assistant', content: osResponse }]);
      return;
    }

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
