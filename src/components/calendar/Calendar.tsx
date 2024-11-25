import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, X } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useOSStore } from '@/store/os-store';

interface Event {
  id: string;
  title: string;
  date: Date;
  isHoliday?: boolean;
}

// Sample holidays for 2024
const HOLIDAYS: Event[] = [
  { id: 'new-year', title: "New Year's Day", date: new Date(2024, 0, 1), isHoliday: true },
  { id: 'mlk', title: "Martin Luther King Jr. Day", date: new Date(2024, 0, 15), isHoliday: true },
  { id: 'presidents', title: "Presidents' Day", date: new Date(2024, 1, 19), isHoliday: true },
  { id: 'memorial', title: "Memorial Day", date: new Date(2024, 4, 27), isHoliday: true },
  { id: 'independence', title: "Independence Day", date: new Date(2024, 6, 4), isHoliday: true },
  { id: 'labor', title: "Labor Day", date: new Date(2024, 8, 2), isHoliday: true },
  { id: 'thanksgiving', title: "Thanksgiving Day", date: new Date(2024, 10, 28), isHoliday: true },
  { id: 'christmas', title: "Christmas Day", date: new Date(2024, 11, 25), isHoliday: true },
];

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([...HOLIDAYS]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const { toast } = useToast();
  const updateCalendarState = useOSStore((state) => state.actions.updateCalendarState);

  // Update global calendar state whenever events or date changes
  useEffect(() => {
    updateCalendarState({
      currentDate: date,
      events: events,
      holidays: HOLIDAYS,
    });
  }, [date, events, updateCalendarState]);

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event title",
        variant: "destructive",
      });
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      title: newEventTitle,
      date: date,
    };

    setEvents(prev => [...prev, newEvent]);
    setNewEventTitle('');
    setShowAddEvent(false);

    toast({
      title: "Event Added",
      description: `Added "${newEventTitle}" to ${date.toLocaleDateString()}`,
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const getDayEvents = (day: Date) => {
    return events.filter(event => 
      event.date.getFullYear() === day.getFullYear() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getDate() === day.getDate()
    );
  };

  return (
    <div className="flex h-full bg-background/95 backdrop-blur-sm">
      <div className="w-[350px] border-r p-4">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          modifiers={{
            event: (date) => getDayEvents(date).length > 0,
          }}
          modifiersStyles={{
            event: { fontWeight: 'bold', textDecoration: 'underline' },
          }}
        />
        <Button 
          className="w-full mt-4"
          onClick={() => setShowAddEvent(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="flex-1 p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          Events for {date.toLocaleDateString()}
        </h3>
        
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-2">
            {getDayEvents(date).map(event => (
              <div
                key={event.id}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  event.isHoliday ? 'bg-primary/10' : 'bg-secondary/50'
                }`}
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  {event.isHoliday && (
                    <span className="text-sm text-muted-foreground">Holiday</span>
                  )}
                </div>
                {!event.isHoliday && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Input
                placeholder="Event title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddEvent(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>
                Add Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
