import { useState } from "react";
import { CoachSchedulingCard } from "@/components/ui/coach-scheduling-card";

export default function CoachSchedulingCardDemo() {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{day: string, time: string} | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const handleTimeSlotSelect = (day: string, time: string) => {
    setSelectedTimeSlot({ day, time });
    console.log(`Selected: ${day} at ${time}`);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    console.log(`Location changed to: ${location}`);
  };

  const handleWeekChange = (direction: "prev" | "next") => {
    console.log(`Week navigation: ${direction}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Book a Local Guide
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Schedule your perfect travel experience
          </p>
        </div>
        
        <div className="flex justify-center">
          <CoachSchedulingCard
            onTimeSlotSelect={handleTimeSlotSelect}
            onLocationChange={handleLocationChange}
            onWeekChange={handleWeekChange}
          />
        </div>
      </div>
    </div>
  );
}

export { CoachSchedulingCardDemo as DemoOne };