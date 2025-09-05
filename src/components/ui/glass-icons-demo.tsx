import { GlassIcons } from "@/components/ui/glass-icons";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Camera, 
  Compass, 
  Plane,
  Hotel,
  Utensils,
  Car,
  Mountain,
  Waves,
  Sun
} from 'lucide-react';

const GlassIconsDemo = () => {
  // TravelGenie-themed items
  const travelItems = [
    { icon: <MapPin />, color: 'sky', label: 'Destinations' },
    { icon: <Calendar />, color: 'blue', label: 'Itinerary' },
    { icon: <DollarSign />, color: 'green', label: 'Budget' },
    { icon: <Camera />, color: 'purple', label: 'Memories' },
    { icon: <Compass />, color: 'orange', label: 'Explore' },
    { icon: <Plane />, color: 'indigo', label: 'Flights' },
    { icon: <Hotel />, color: 'emerald', label: 'Hotels' },
    { icon: <Utensils />, color: 'red', label: 'Dining' },
    { icon: <Car />, color: 'amber', label: 'Transport' },
  ];

  const activityItems = [
    { icon: <Mountain />, color: 'green', label: 'Adventure' },
    { icon: <Waves />, color: 'blue', label: 'Beach' },
    { icon: <Sun />, color: 'orange', label: 'Relaxation' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            TravelGenie Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover all the amazing features that make planning your perfect trip effortless and enjoyable
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center">
            Core Features
          </h2>
          <GlassIcons items={travelItems} className="max-w-4xl" />
        </div>

        {/* Activity Types */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center">
            Activity Types
          </h2>
          <GlassIcons items={activityItems} className="max-w-2xl" />
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6 pt-8">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Ready to Start Planning?
          </h3>
          <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl">
            Create Your First Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export { GlassIconsDemo as DemoOne };
export default GlassIconsDemo;