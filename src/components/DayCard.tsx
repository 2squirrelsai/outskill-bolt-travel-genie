import React, { useState } from 'react';
import { Day, Activity, ActivityType } from '../types';
import { Clock, DollarSign, MapPin, Plus, X, Calendar, Sparkles } from 'lucide-react';
import { ActivityCard } from './ActivityCard';
import { AddActivityModal } from './AddActivityModal';
import { EditActivityModal } from './EditActivityModal';

interface DayCardProps {
  day: Day;
  dayNumber: number;
  formatDate: (date: string) => string;
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onRemoveActivity: (activityId: string) => void;
  onEditActivity: (activityId: string, updatedActivity: Activity) => void;
  onSelectForAssistant: () => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  dayNumber,
  formatDate,
  onAddActivity,
  onRemoveActivity,
  onEditActivity,
  onSelectForAssistant,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const totalCost = day.activities.reduce((sum, activity) => sum + activity.cost, 0);
  const totalDuration = day.activities.reduce((sum, activity) => sum + activity.duration, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {dayNumber}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Day {dayNumber}</h3>
                <p className="text-sm text-gray-600">{formatDate(day.date)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {totalCost > 0 && (
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatCurrency(totalCost)}</span>
              </div>
            )}
            {totalDuration > 0 && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(totalDuration)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {day.activities.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No activities planned for this day</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Activity</span>
              </button>
              <button
                onClick={onSelectForAssistant}
                className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Suggestions</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {day.activities
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onRemove={() => onRemoveActivity(activity.id)}
                  onEdit={() => setEditingActivity(activity)}
                />
              ))}
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-3 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Activity</span>
              </button>
              <button
                onClick={onSelectForAssistant}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-2 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Suggestions</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddActivityModal
          onAdd={onAddActivity}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingActivity && (
        <EditActivityModal
          activity={editingActivity}
          onSave={(updatedActivity) => {
            onEditActivity(editingActivity.id, updatedActivity);
            setEditingActivity(null);
          }}
          onClose={() => setEditingActivity(null)}
        />
      )}
    </div>
  );
};