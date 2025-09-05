import React, { useState } from 'react';
import { Trip } from '../types';
import { Calendar, MapPin, DollarSign, Users, Plus, Trash2, Edit } from 'lucide-react';
import { DeleteTripModal } from './DeleteTripModal';

interface TripsListViewProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onNewTrip: () => void;
  onDeleteTrip: (tripId: string) => Promise<void>;
  loading: boolean;
}

export const TripsListView: React.FC<TripsListViewProps> = ({
  trips,
  onSelectTrip,
  onNewTrip,
  onDeleteTrip,
  loading
}) => {
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined
    };
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  const getDaysCount = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getActivitiesCount = (trip: Trip) => {
    return trip.days.reduce((total, day) => total + day.activities.length, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 90) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Over Budget' };
    if (percentage > 70) return { color: 'text-orange-600', bg: 'bg-orange-100', label: 'High Spending' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'On Track' };
  };

  const sortedTrips = [...trips].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const handleDeleteTrip = async () => {
    if (tripToDelete) {
      try {
        await onDeleteTrip(tripToDelete.id);
        setTripToDelete(null);
      } catch (error) {
        console.error('Failed to delete trip:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-spin">
            <img src="/logo.png" alt="TravelGenie Logo" className="w-full h-full object-contain" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Trips</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {trips.length === 0 
                  ? 'Start planning your first adventure' 
                  : `${trips.length} trip${trips.length === 1 ? '' : 's'} planned`
                }
              </p>
            </div>
            <button
              onClick={onNewTrip}
              className="bg-brand-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Trip</span>
            </button>
          </div>

          {trips.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-8">
                <img src="/logo.png" alt="TravelThread Logo" className="w-full h-full object-contain opacity-50" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                No trips yet
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Create your first trip to start planning amazing adventures with TravelThread's AI-powered recommendations.
              </p>
              <button
                onClick={onNewTrip}
                className="bg-brand-orange text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Plan Your First Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTrips.map((trip) => {
                const budgetStatus = getBudgetStatus(trip.spentAmount, trip.budget);
                const activitiesCount = getActivitiesCount(trip);
                const daysCount = getDaysCount(trip.startDate, trip.endDate);
                
                return (
                  <div
                    key={trip.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-brand-orange dark:group-hover:text-brand-orange transition-colors">
                            {trip.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{trip.destination}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTripToDelete(trip);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete trip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                          <span className="text-gray-400">•</span>
                          <span>{daysCount} day{daysCount === 1 ? '' : 's'}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <Users className="w-4 h-4" />
                          <span>{activitiesCount} activit{activitiesCount === 1 ? 'y' : 'ies'} planned</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm">
                            <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            <span className="text-gray-900 dark:text-white font-medium">
                              {formatCurrency(trip.spentAmount)} / {formatCurrency(trip.budget)}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${budgetStatus.bg} ${budgetStatus.color}`}>
                            {Math.round((trip.spentAmount / trip.budget) * 100)}%
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              (trip.spentAmount / trip.budget) > 0.9 ? 'bg-red-500' : 
                              (trip.spentAmount / trip.budget) > 0.7 ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((trip.spentAmount / trip.budget) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectTrip(trip)}
                        className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium group-hover:bg-orange-50 group-hover:text-brand-orange dark:group-hover:bg-orange-900/20 dark:group-hover:text-brand-orange"
                      >
                        View Trip
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DeleteTripModal 
        isOpen={!!tripToDelete} 
        trip={tripToDelete}
        onClose={() => setTripToDelete(null)}
        onConfirm={handleDeleteTrip}
      />
    </>
  );
};