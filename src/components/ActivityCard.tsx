import React from 'react';
import { Activity } from '../types';
import { Clock, DollarSign, MapPin, X, Star, Edit } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onRemove: () => void;
  onEdit: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onRemove, onEdit }) => {
  const getActivityIcon = (type: string) => {
    const iconProps = "w-4 h-4";
    switch (type) {
      case 'attraction': return <Star className={iconProps} />;
      case 'restaurant': return <div className={iconProps + " bg-current rounded-full"} />;
      case 'transportation': return <div className={iconProps + " bg-current rounded"} />;
      default: return <MapPin className={iconProps} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'attraction': return 'bg-purple-100 text-purple-800';
      case 'restaurant': return 'bg-green-100 text-green-800';
      case 'transportation': return 'bg-blue-100 text-blue-800';
      case 'entertainment': return 'bg-pink-100 text-pink-800';
      case 'shopping': return 'bg-indigo-100 text-indigo-800';
      case 'outdoor': return 'bg-emerald-100 text-emerald-800';
      case 'cultural': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
              <span className="capitalize">{activity.type}</span>
            </span>
            {activity.isRecommendation && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <Star className="w-3 h-3" />
                <span>Recommended</span>
              </span>
            )}
          </div>
          
          <h4 className="font-medium text-gray-900 mb-1">{activity.name}</h4>
          
          {activity.description && (
            <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(activity.startTime)} • {formatDuration(activity.duration)}</span>
            </div>
            
            {activity.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{activity.location}</span>
              </div>
            )}
            
            {activity.cost > 0 && (
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatCurrency(activity.cost)}</span>
              </div>
            )}
          </div>
          
          {activity.notes && (
            <p className="text-sm text-gray-600 mt-2 italic">{activity.notes}</p>
          )}
        </div>
        
        <div className="ml-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit activity"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Remove activity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};