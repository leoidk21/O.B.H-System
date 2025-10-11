import React, { createContext, useContext, useState, ReactNode } from "react";

interface EventContextType {
  eventData: Record<string, any>;
  updateEvent: (key: string, value: any) => void;
  saveEventToBackend: () => Promise<void>;
  calculateCountdown: (eventDate: string) => { days: number; hours: number; minutes: number };
}

const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [eventData, setEventData] = useState<Record<string, any>>({});

  const updateEvent = (key: string, value: any) => {
    setEventData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const calculateCountdown = (eventDate: string) => {
    const now = new Date().getTime();
    const eventTime = new Date(eventDate).getTime();
    const difference = eventTime - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  const saveEventToBackend = async () => {
    try {
      // This will be implemented to sync with front-event.js backend
      console.log('Saving event data to backend:', eventData);
      // API call will go here
    } catch (error) {
      console.error('Error saving event to backend:', error);
      throw error;
    }
  };

  return (
    <EventContext.Provider value={{ 
      eventData, 
      updateEvent, 
      saveEventToBackend,
      calculateCountdown 
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};