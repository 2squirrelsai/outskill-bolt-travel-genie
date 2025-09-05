import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Trip, Day, Activity, TravelPreferences } from '../types';

const defaultPreferences: TravelPreferences = {
  travelStyle: [],
  interests: [],
  budgetRange: 'mid-range',
  groupSize: 1,
  accessibility: []
};

export const useTrip = () => {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createTrip = useCallback((
    title: string,
    destination: string,
    startDate: string,
    endDate: string,
    budget: number
  ) => {
    if (!user) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days: Day[] = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        id: `day-${d.toISOString().split('T')[0]}`,
        date: d.toISOString().split('T')[0],
        activities: [],
        notes: ''
      });
    }

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title,
      destination,
      startDate,
      endDate,
      budget,
      spentAmount: 0,
      days,
      preferences: defaultPreferences
    };

    // Save to Supabase
    const saveTrip = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('trips')
          .insert({
            name: title,
            destination,
            start_date: startDate,
            end_date: endDate,
            budget,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving trip:', error);
          return;
        }

        // Update the trip with the database ID
        const updatedTrip = { ...newTrip, id: data.id };
        setCurrentTrip(updatedTrip);
        setTrips(prev => [...prev, updatedTrip]);
      } catch (error) {
        console.error('Error creating trip:', error);
      } finally {
        setLoading(false);
      }
    };

    saveTrip();
    setCurrentTrip(newTrip);
    setTrips(prev => [...prev, newTrip]);
    return newTrip;
  }, [user]);

  const addActivity = useCallback((dayId: string, activity: Omit<Activity, 'id'>) => {
    if (!currentTrip || !user) return;

    const newActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Calculate day number
    const day = currentTrip.days.find(d => d.id === dayId);
    if (!day) return;
    
    const tripStart = new Date(currentTrip.startDate);
    const dayDate = new Date(day.date);
    const dayNumber = Math.ceil((dayDate.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Save to Supabase
    const saveActivity = async () => {
      try {
        const { data, error } = await supabase
          .from('activities')
          .insert({
            trip_id: currentTrip.id,
            name: activity.name,
            location: activity.location,
            day_number: dayNumber,
            start_time: activity.startTime,
            duration: activity.duration,
            estimated_cost: activity.cost,
            notes: activity.notes,
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving activity:', error);
          return;
        }

        // Update the activity with the database ID
        const updatedActivity = { ...newActivity, id: data.id };
        
        setCurrentTrip(prev => {
          if (!prev) return null;
          
          const updatedTrip = {
            ...prev,
            days: prev.days.map(day =>
              day.id === dayId
                ? { ...day, activities: [...day.activities, updatedActivity] }
                : day
            ),
            spentAmount: prev.spentAmount + activity.cost
          };

          setTrips(prevTrips => 
            prevTrips.map(trip => trip.id === prev.id ? updatedTrip : trip)
          );

          return updatedTrip;
        });
      } catch (error) {
        console.error('Error adding activity:', error);
      }
    };

    saveActivity();

    setCurrentTrip(prev => {
      if (!prev) return null;
      
      const updatedTrip = {
        ...prev,
        days: prev.days.map(day =>
          day.id === dayId
            ? { ...day, activities: [...day.activities, newActivity] }
            : day
        ),
        spentAmount: prev.spentAmount + activity.cost
      };

      setTrips(prevTrips => 
        prevTrips.map(trip => trip.id === prev.id ? updatedTrip : trip)
      );

      return updatedTrip;
    });
  }, [currentTrip, user]);

  const removeActivity = useCallback((dayId: string, activityId: string) => {
    if (!currentTrip || !user) return;

    // Remove from Supabase
    const deleteActivity = async () => {
      try {
        const { error } = await supabase
          .from('activities')
          .delete()
          .eq('id', activityId);

        if (error) {
          console.error('Error deleting activity:', error);
          return;
        }
      } catch (error) {
        console.error('Error removing activity:', error);
      }
    };

    deleteActivity();

    setCurrentTrip(prev => {
      if (!prev) return null;

      const dayToUpdate = prev.days.find(day => day.id === dayId);
      const activityToRemove = dayToUpdate?.activities.find(a => a.id === activityId);
      
      const updatedTrip = {
        ...prev,
        days: prev.days.map(day =>
          day.id === dayId
            ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
            : day
        ),
        spentAmount: prev.spentAmount - (activityToRemove?.cost || 0)
      };

      setTrips(prevTrips => 
        prevTrips.map(trip => trip.id === prev.id ? updatedTrip : trip)
      );

      return updatedTrip;
    });
  }, [currentTrip, user]);

  const editActivity = useCallback((dayId: string, activityId: string, updatedActivity: Activity) => {
    if (!currentTrip || !user) return;

    // Update in Supabase
    const updateActivity = async () => {
      try {
        const { error } = await supabase
          .from('activities')
          .update({
            name: updatedActivity.name,
            location: updatedActivity.location,
            start_time: updatedActivity.startTime,
            duration: updatedActivity.duration,
            estimated_cost: updatedActivity.cost,
            notes: updatedActivity.notes,
          })
          .eq('id', activityId);

        if (error) {
          console.error('Error updating activity:', error);
          return;
        }
      } catch (error) {
        console.error('Error editing activity:', error);
      }
    };

    updateActivity();

    setCurrentTrip(prev => {
      if (!prev) return null;

      const dayToUpdate = prev.days.find(day => day.id === dayId);
      const originalActivity = dayToUpdate?.activities.find(a => a.id === activityId);
      const costDifference = updatedActivity.cost - (originalActivity?.cost || 0);
      
      const updatedTrip = {
        ...prev,
        days: prev.days.map(day =>
          day.id === dayId
            ? { 
                ...day, 
                activities: day.activities.map(a => 
                  a.id === activityId ? updatedActivity : a
                ) 
              }
            : day
        ),
        spentAmount: prev.spentAmount + costDifference
      };

      setTrips(prevTrips => 
        prevTrips.map(trip => trip.id === prev.id ? updatedTrip : trip)
      );

      return updatedTrip;
    });
  }, [currentTrip, user]);
  const deleteTrip = useCallback(async (tripId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting trip:', error);
        return;
      }

      // Update local state
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      
      // If we deleted the current trip, clear it
      if (currentTrip?.id === tripId) {
        setCurrentTrip(null);
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    } finally {
      setLoading(false);
    }
  }, [user, currentTrip]);

  const updatePreferences = useCallback((preferences: Partial<TravelPreferences>) => {
    if (!currentTrip || !user) return;

    setCurrentTrip(prev => {
      if (!prev) return null;
      
      const updatedTrip = {
        ...prev,
        preferences: { ...prev.preferences, ...preferences }
      };

      setTrips(prevTrips => 
        prevTrips.map(trip => trip.id === prev.id ? updatedTrip : trip)
      );

      return updatedTrip;
    });
  }, [currentTrip, user]);

  const loadTrips = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tripsError) {
        console.error('Error loading trips:', tripsError);
        return;
      }

      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .in('trip_id', tripsData.map(trip => trip.id))
        .order('day_number', { ascending: true })
        .order('order_index', { ascending: true });

      if (activitiesError) {
        console.error('Error loading activities:', activitiesError);
        return;
      }

      // Convert database trips to app format
      const convertedTrips: Trip[] = tripsData.map(dbTrip => {
        const start = new Date(dbTrip.start_date);
        const end = new Date(dbTrip.end_date);
        const days: Day[] = [];
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dayActivities = activitiesData
            .filter(activity => 
              activity.trip_id === dbTrip.id && 
              activity.day_number === Math.ceil((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
            )
            .map(dbActivity => ({
              id: dbActivity.id,
              name: dbActivity.name,
              type: 'attraction' as const,
              description: '',
              location: dbActivity.location || '',
              startTime: dbActivity.start_time || '09:00',
              duration: dbActivity.duration || 60,
              cost: dbActivity.estimated_cost || 0,
              notes: dbActivity.notes || '',
            }));

          days.push({
            id: `day-${d.toISOString().split('T')[0]}`,
            date: d.toISOString().split('T')[0],
            activities: dayActivities,
            notes: ''
          });
        }

        const spentAmount = activitiesData
          .filter(activity => activity.trip_id === dbTrip.id)
          .reduce((sum, activity) => sum + (activity.estimated_cost || 0), 0);

        return {
          id: dbTrip.id,
          title: dbTrip.name,
          destination: dbTrip.destination,
          startDate: dbTrip.start_date,
          endDate: dbTrip.end_date,
          budget: dbTrip.budget || 0,
          spentAmount,
          days,
          preferences: defaultPreferences
        };
      });

      setTrips(convertedTrips);
      if (convertedTrips.length > 0 && !currentTrip) {
        setCurrentTrip(convertedTrips[0]);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  }, [user, currentTrip]);

  return {
    currentTrip,
    trips,
    loading,
    createTrip,
    addActivity,
    removeActivity,
    editActivity,
    updatePreferences,
    setCurrentTrip,
    loadTrips,
    deleteTrip
  };
};