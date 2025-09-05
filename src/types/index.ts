export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  spentAmount: number;
  days: Day[];
  preferences: TravelPreferences;
}

export interface Day {
  id: string;
  date: string;
  activities: Activity[];
  notes: string;
}

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  description: string;
  location: string;
  startTime: string;
  duration: number; // in minutes
  cost: number;
  notes: string;
  isRecommendation?: boolean;
}

export interface TravelPreferences {
  travelStyle: string[];
  interests: string[];
  budgetRange: 'budget' | 'mid-range' | 'luxury';
  groupSize: number;
  accessibility: string[];
}

export type ActivityType = 
  | 'attraction' 
  | 'restaurant' 
  | 'accommodation' 
  | 'transportation' 
  | 'entertainment' 
  | 'shopping' 
  | 'outdoor' 
  | 'cultural';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}