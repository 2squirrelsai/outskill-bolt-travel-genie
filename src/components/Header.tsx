import React from 'react';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';
import { Trip } from '../types';

interface HeaderProps {
  currentTrip: Trip | null;
  onNewTrip: () => void;
  onSignIn: () => void;
  onShowSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTrip, onNewTrip, onSignIn, onShowSettings }) => {
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const budgetPercentage = currentTrip 
    ? Math.min((currentTrip.spentAmount / currentTrip.budget) * 100, 100)
    : 0;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TravelGenie</h1>
            </div>
            
            {currentTrip && (
              <div className="hidden sm:flex items-center space-x-6 ml-8 text-sm">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{currentTrip.destination}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateRange(currentTrip.startDate, currentTrip.endDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <DollarSign className="w-4 h-4" />
                  <div className="flex items-center space-x-2">
                    <span>{formatCurrency(currentTrip.spentAmount)} / {formatCurrency(currentTrip.budget)}</span>
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          budgetPercentage > 90 ? 'bg-red-500' : 
                          budgetPercentage > 70 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${budgetPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {user ? (
              <>
                <button
                  onClick={onNewTrip}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  {currentTrip ? 'New Trip' : 'Start Planning'}
                </button>
                <UserMenu onShowSettings={onShowSettings} />
              </>
            ) : (
              <button
                onClick={onSignIn}
                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};