import React, { useState } from 'react';
import { Activity, ActivityType } from '../types';
import { X, Clock, DollarSign, MapPin, FileText } from 'lucide-react';

interface AddActivityModalProps {
  onAdd: (activity: Omit<Activity, 'id'>) => void;
  onClose: () => void;
}

const activityTypes: { value: ActivityType; label: string }[] = [
  { value: 'attraction', label: 'Attraction' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'outdoor', label: 'Outdoor Activity' },
  { value: 'cultural', label: 'Cultural Experience' },
  { value: 'transportation', label: 'Transportation' },
];

export const AddActivityModal: React.FC<AddActivityModalProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'attraction' as ActivityType,
    description: '',
    location: '',
    startTime: '09:00',
    duration: 120,
    cost: 0,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Activity name is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (formData.duration < 15) newErrors.duration = 'Duration must be at least 15 minutes';
    if (formData.cost < 0) newErrors.cost = 'Cost cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAdd(formData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add Activity</h3>
          <button
            onClick={onClose}
            className="flex-1 bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Visit Tokyo Tower"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value as ActivityType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 inline mr-1" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              rows={3}
              placeholder="Brief description of the activity..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              placeholder="e.g., Minato City, Tokyo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${
                  errors.startTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${
                  errors.duration ? 'border-red-300' : 'border-gray-300'
                }`}
                min="15"
                step="15"
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Cost (USD)
            </label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${
                errors.cost ? 'border-red-300' : 'border-gray-300'
              }`}
              min="0"
              step="1"
              placeholder="0"
            />
            {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              rows={2}
              placeholder="Any additional notes or reminders..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};