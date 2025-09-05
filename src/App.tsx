import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TripCreator } from './components/TripCreator';
import { ItineraryView } from './components/ItineraryView';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { Footer2 } from './components/ui/footer2';
import { useTrip } from './hooks/useTrip';
import { useAuth } from './hooks/useAuth';

function App() {
  const [showTripCreator, setShowTripCreator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { currentTrip, createTrip, addActivity, removeActivity, editActivity, loadTrips, loading } = useTrip();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      loadTrips();
    }
  }, [user, loadTrips, loading]);

  const handleCreateTrip = (
    title: string,
    destination: string,
    startDate: string,
    endDate: string,
    budget: number
  ) => {
    createTrip(title, destination, startDate, endDate, budget);
    setShowTripCreator(false);
  };

  const handleNewTrip = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowTripCreator(true);
  };

  const handleSignIn = () => {
    setShowAuthModal(true);
  };

  const handleShowSettings = () => {
    setShowSettingsModal(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="text-2xl">✈️</div>
          </div>
          <p className="text-gray-600">Loading TravelGenie...</p>
        </div>
      </div>
    );
  }

  if (showTripCreator) {
    return (
      <TripCreator
        onCreateTrip={handleCreateTrip}
        onCancel={() => setShowTripCreator(false)}
      />
    );
  }

  if (!user || !currentTrip) {
    return (
      <>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header currentTrip={null} onNewTrip={handleNewTrip} onSignIn={handleSignIn} onShowSettings={handleShowSettings} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="text-4xl">✈️</div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Plan Your Perfect Trip with TravelGenie
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {user 
                ? 'Create detailed itineraries, track your budget, and get AI-powered recommendations for unforgettable travel experiences.'
                : 'Sign in to create detailed itineraries, track your budget, and get AI-powered recommendations for unforgettable travel experiences.'
              }
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                  📅
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart Planning</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Organize your trip day by day with our intuitive itinerary builder
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  🤖
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Assistant</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get personalized recommendations from your dedicated TravelGenie
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  💰
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Budget Tracking</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Keep track of expenses and stay within your travel budget
                </p>
              </div>
            </div>
            <button
              onClick={handleNewTrip}
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              {user ? 'Start Planning Your Trip' : 'Sign In to Start Planning'}
            </button>
          </div>
        </div>
        <Footer2 />
      </div>
      
      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      </>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header currentTrip={currentTrip} onNewTrip={handleNewTrip} onSignIn={handleSignIn} onShowSettings={handleShowSettings} onDeleteTrip={handleDeleteTrip} />
      <ItineraryView
        trip={currentTrip}
        onAddActivity={addActivity}
        onRemoveActivity={removeActivity}
        onEditActivity={editActivity}
      />
      <Footer2 />
    </div>
    
    {/* Modals */}
    <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    <DeleteTripModal 
      isOpen={showDeleteTripModal} 
      trip={currentTrip}
      onClose={() => setShowDeleteTripModal(false)}
      onConfirm={handleConfirmDeleteTrip}
    />
    </>
  );
}

export default App;