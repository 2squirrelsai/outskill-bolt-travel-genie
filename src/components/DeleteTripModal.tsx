import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { Trip } from '../types';

interface DeleteTripModalProps {
  isOpen: boolean;
  trip: Trip | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteTripModal: React.FC<DeleteTripModalProps> = ({
  isOpen,
  trip,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleConfirm = async () => {
    if (confirmText.toLowerCase() !== 'delete') return;
    
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
      setConfirmText('');
    } catch (error) {
      console.error('Error deleting trip:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
      setConfirmText('');
    }
  };

  if (!isOpen || !trip) return null;

  const isConfirmValid = confirmText.toLowerCase() === 'delete';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Trip</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 font-medium mb-2">
              ⚠️ This action cannot be undone!
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm">
              You are about to permanently delete "<strong>{trip.title}</strong>" and all its activities, 
              itinerary data, budget information, and associated data.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              To confirm deletion, please type <strong className="text-red-600 dark:text-red-400">DELETE</strong> in the field below:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm deletion"
              disabled={isDeleting}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Trip Details:</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Destination:</strong> {trip.destination}</p>
              <p><strong>Duration:</strong> {trip.days.length} days</p>
              <p><strong>Activities:</strong> {trip.days.reduce((total, day) => total + day.activities.length, 0)} planned</p>
              <p><strong>Budget:</strong> ${trip.budget} (${trip.spentAmount} spent)</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmValid || isDeleting}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              'Delete Trip'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};