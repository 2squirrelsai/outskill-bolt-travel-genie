import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TripCreator } from './components/TripCreator';
import { ItineraryView } from './components/ItineraryView';
import { TripsListView } from './components/TripsListView';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { DeleteTripModal } from './components/DeleteTripModal';
import { Footer2 } from './components/ui/footer2';
import SignInPageDemo from './components/ui/sign-in-demo';
import { MapPin } from 'lucide-react';
import { useTrip } from './hooks/useTrip';
import { useAuth } from './hooks/useAuth';

function App() {
  const [showTripCreator, setShowTripCreator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteTripModal, setShowDeleteTripModal] = useState(false);
  const [showSignInDemo, setShowSignInDemo] = useState(false);
  const { currentTrip, trips, createTrip, addActivity, removeActivity, editActivity, loadTrips, loading, deleteTrip, setCurrentTrip } = useTrip();
  const { user, loading: authLoading } = useAuth();

  // Test demo with URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'signin') {
      setShowSignInDemo(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadTrips();
    }
  }, [user, loadTrips]);

  const handleCreateTrip = (
    title: string,
    destination: string,
    startDate: string,
    endDate: string,
    budget: number
  ) => {
    const newTrip = createTrip(title, destination, startDate, endDate, budget);
    setShowTripCreator(false);
    if (newTrip) {
      setCurrentTrip(newTrip);
    }
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

  const handleDeleteTrip = () => {
    setShowDeleteTripModal(true);
  };

  const handleConfirmDeleteTrip = async () => {
    if (currentTrip) {
      try {
        await deleteTrip(currentTrip.id);
        setShowDeleteTripModal(false);
        setCurrentTrip(null); // Go back to trips list
        // Optional: Show success message
        console.log('Trip deleted successfully');
      } catch (error) {
        console.error('Failed to delete trip:', error);
        // Keep modal open on error so user can try again
      }
    }
  };

  const handleSelectTrip = (trip: any) => {
    setCurrentTrip(trip);
  };

  const handleBackToTripsList = () => {
    setCurrentTrip(null);
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

  // Show SignIn demo if requested
  if (showSignInDemo) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowSignInDemo(false)}
          className="absolute top-4 right-4 z-50 bg-black/20 hover:bg-black/40 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
        >
          ← Back to App
        </button>
        <SignInPageDemo />
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

  // Show trips list if user is logged in but no current trip is selected
  if (user && !currentTrip) {
    return (
      <>
        <Header currentTrip={null} onNewTrip={handleNewTrip} onSignIn={handleSignIn} onShowSettings={handleShowSettings} onDeleteTrip={undefined} />
        <TripsListView 
          trips={trips}
          onSelectTrip={handleSelectTrip}
          onNewTrip={handleNewTrip}
          onDeleteTrip={deleteTrip}
          loading={loading}
        />
        <Footer2 />
        
        {/* Modals */}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      </>
    );
  }

  // Show landing page if not logged in
  if (!user) {
    return (
      <>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header currentTrip={null} onNewTrip={handleNewTrip} onSignIn={handleSignIn} onShowSettings={handleShowSettings} onDeleteTrip={undefined} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-8">
              <img src="/logo.png" alt="TravelGenie Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Plan Your Perfect Trip with TravelThread
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Sign in to create detailed itineraries, track your budget, and get AI-powered recommendations for unforgettable travel experiences.
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
                  Get personalized recommendations from your dedicated TravelThread
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
              Sign In to Start Planning
            </button>
            
            {/* Demo button for testing */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                Want to see our new sign-in experience?
              </p>
              <button
                onClick={() => setShowSignInDemo(true)}
                className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-violet-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                View SignIn Demo
              </button>
            </div>
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

  // Show current trip itinerary
  return (
    <>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header currentTrip={currentTrip} onNewTrip={handleNewTrip} onSignIn={handleSignIn} onShowSettings={handleShowSettings} onDeleteTrip={handleDeleteTrip} />
      <ItineraryView
        trip={currentTrip}
        onAddActivity={addActivity}
        onRemoveActivity={removeActivity}
        onEditActivity={editActivity}
        onBackToTripsList={handleBackToTripsList}
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