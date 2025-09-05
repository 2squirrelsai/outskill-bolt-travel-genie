import React, { useState } from 'react';
import { Trip, Day } from '../types';
import { DayCard } from './DayCard';
import { TravelAssistant } from './TravelAssistant';
import { Calendar, MessageCircle, MapPin } from 'lucide-react';

interface ItineraryViewProps {
  trip: Trip;
  onAddActivity: (dayId: string, activity: any) => void;
  onRemoveActivity: (dayId: string, activityId: string) => void;
  onEditActivity: (dayId: string, activityId: string, updatedActivity: any) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  onAddActivity,
  onRemoveActivity,
  onEditActivity,
}) => {
  const [showAssistant, setShowAssistant] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDayNumber = (dayDate: string) => {
    const tripStart = new Date(trip.startDate);
    const dayDateObj = new Date(dayDate);
    const diffTime = dayDateObj.getTime() - tripStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.title}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{trip.destination}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{trip.days.length} days</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowAssistant(!showAssistant)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              showAssistant
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-orange-500 border border-orange-500 hover:bg-orange-50'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>TravelGenie</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {trip.days.map((day) => (
              <DayCard
                key={day.id}
                day={day}
                dayNumber={getDayNumber(day.date)}
                formatDate={formatDate}
                onAddActivity={(activity) => onAddActivity(day.id, activity)}
                onRemoveActivity={(activityId) => onRemoveActivity(day.id, activityId)}
                onEditActivity={(activityId, updatedActivity) => onEditActivity(day.id, activityId, updatedActivity)}
                onSelectForAssistant={() => {
                  setSelectedDay(day.id);
                  setShowAssistant(true);
                }}
              />
            ))}
          </div>
        </div>

        {showAssistant && (
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TravelAssistant
                trip={trip}
                selectedDay={selectedDay}
                onAddActivity={onAddActivity}
                onClose={() => setShowAssistant(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};