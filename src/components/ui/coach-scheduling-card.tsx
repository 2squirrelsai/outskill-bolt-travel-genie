"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySchedule {
  date: string;
  dayName: string;
  dayNumber: number;
  slots: TimeSlot[];
  hasAvailability: boolean;
}

interface Coach {
  name: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

interface CoachSchedulingProps {
  coach?: Coach;
  locations?: string[];
  weekSchedule?: DaySchedule[];
  onLocationChange?: (location: string) => void;
  onTimeSlotSelect?: (day: string, time: string) => void;
  onWeekChange?: (direction: "prev" | "next") => void;
  enableAnimations?: boolean;
  className?: string;
}

const defaultCoach: Coach = {
  name: "Sarah Martinez",
  title: "Local Travel Guide",
  location: "Barcelona, Spain",
  rating: 4.9,
  reviewCount: 127,
  imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
};

const defaultLocations = [
  "Gothic Quarter Walking Tour",
  "Park Güell & Sagrada Familia", 
  "Barcelona Beach & Port Tour",
  "Tapas & Market Experience"
];

const defaultWeekSchedule: DaySchedule[] = [
  {
    date: "Dec 15",
    dayName: "Today",
    dayNumber: 15,
    hasAvailability: true,
    slots: [
      { time: "09:00 AM", available: true },
      { time: "10:30 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "02:00 PM", available: false },
      { time: "03:30 PM", available: true },
      { time: "05:00 PM", available: true }
    ]
  },
  {
    date: "Dec 16",
    dayName: "Sat",
    dayNumber: 16,
    hasAvailability: true,
    slots: [
      { time: "09:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "02:00 PM", available: true },
      { time: "04:00 PM", available: true }
    ]
  },
  {
    date: "Dec 17",
    dayName: "Sun",
    dayNumber: 17,
    hasAvailability: true,
    slots: [
      { time: "10:00 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "02:30 PM", available: false },
      { time: "04:00 PM", available: true }
    ]
  },
  {
    date: "Dec 18",
    dayName: "Mon",
    dayNumber: 18,
    hasAvailability: false,
    slots: []
  },
  {
    date: "Dec 19",
    dayName: "Tue",
    dayNumber: 19,
    hasAvailability: false,
    slots: []
  },
  {
    date: "Dec 20",
    dayName: "Wed",
    dayNumber: 20,
    hasAvailability: true,
    slots: [
      { time: "09:30 AM", available: true },
      { time: "01:00 PM", available: true },
      { time: "03:00 PM", available: true }
    ]
  }
];

export function CoachSchedulingCard({
  coach = defaultCoach,
  locations = defaultLocations,
  weekSchedule = defaultWeekSchedule,
  onLocationChange,
  onTimeSlotSelect,
  onWeekChange,
  enableAnimations = true,
  className
}: CoachSchedulingProps) {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [weekRange] = useState("Dec 15 - Dec 20");
  const [showConfirmationView, setShowConfirmationView] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{day: string, time: string, dayName: string} | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
    onLocationChange?.(location);
  };

  const handleTimeSlotClick = (day: string, time: string) => {
    const dayInfo = weekSchedule.find(d => d.date === day);
    setSelectedTimeSlot({
      day,
      time,
      dayName: dayInfo?.dayName || day
    });
    setShowConfirmationView(true);
    onTimeSlotSelect?.(day, time);
  };

  const handleBackToMain = () => {
    setShowConfirmationView(false);
    setSelectedTimeSlot(null);
  };

  const handleConfirmBooking = () => {
    // Handle booking confirmation logic here
    setShowConfirmationView(false);
    setSelectedTimeSlot(null);
  };

  const handleWeekNavigation = (direction: "prev" | "next") => {
    onWeekChange?.(direction);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -25,
      scale: 0.95,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
      },
    },
  };

  const timeSlotVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      }
    }
  };

  return (
    <motion.div
      variants={shouldAnimate ? containerVariants : {}}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden max-w-2xl relative",
        className
      )}
    >
      <div className="relative h-auto">
        {/* Main Content */}
        <motion.div
          initial={false}
          animate={{ 
            y: showConfirmationView ? "-20px" : "0px",
            opacity: showConfirmationView ? 0.3 : 1,
            scale: showConfirmationView ? 0.95 : 1
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
          className="w-full"
        >
      {/* Coach Profile Header */}
      <motion.div 
        variants={shouldAnimate ? itemVariants : {}}
        className="p-6 pb-6"
      >
        <div className="flex items-start justify-between gap-6">
          {/* Left Side - Profile Image */}
          <motion.div
            whileHover={shouldAnimate ? { 
              scale: 1.05,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            } : {}}
            className="flex-shrink-0"
          >
            <img
              src={coach.imageUrl}
              alt={coach.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          </motion.div>

          {/* Center - Coach Info */}
          <div className="flex-1 min-w-0 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {coach.name}
            </h2>
            
            {/* Rating and Details Row */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{coach.rating}</span>
                <motion.button
                  whileHover={shouldAnimate ? { 
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  } : {}}
                  className="underline hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ({coach.reviewCount} reviews)
                </motion.button>
              </div>
              <span>•</span>
              <span>{coach.title}</span>
              <span>•</span>
              <span>{coach.location}</span>
            </div>
          </div>

          {/* Right Side - Pricing */}
          <motion.div
            initial={shouldAnimate ? { 
              opacity: 0, 
              scale: 0.8,
              x: 20,
              filter: "blur(4px)"
            } : {}}
            animate={shouldAnimate ? {
              opacity: 1,
              scale: 1,
              x: 0,
              filter: "blur(0px)"
            } : {}}
            transition={shouldAnimate ? {
              type: "spring",
              stiffness: 400,
              damping: 25,
              delay: 0.3,
              mass: 0.6
            } : {}}
            className="text-right flex-shrink-0"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Per Tour</p>
            <motion.p 
              className="text-2xl font-bold text-sky-500"
              initial={shouldAnimate ? { scale: 0.5 } : {}}
              animate={shouldAnimate ? { scale: 1 } : {}}
              transition={shouldAnimate ? {
                type: "spring",
                stiffness: 500,
                damping: 20,
                delay: 0.5
              } : {}}
            >
              €45
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Location Selector */}
      <motion.div 
        variants={shouldAnimate ? itemVariants : {}}
        className="px-6 pb-4 relative z-50"
        style={{ overflow: 'visible' }}
      >
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
          Choose experience
        </label>
        <div className="relative z-50" ref={dropdownRef}>
          <motion.button
            whileHover={shouldAnimate ? {
              scale: 1.01,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            } : {}}
            whileTap={shouldAnimate ? { scale: 0.99 } : {}}
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            aria-expanded={isLocationDropdownOpen}
            aria-haspopup="listbox"
            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
          >
            <span className="text-gray-900 dark:text-white">{selectedLocation}</span>
            <ChevronDown className={cn(
              "w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform",
              isLocationDropdownOpen && "rotate-180"
            )} />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isLocationDropdownOpen && (
              <motion.div
                initial={shouldAnimate ? { opacity: 0, y: -10, scale: 0.95 } : {}}
                animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : {}}
                exit={shouldAnimate ? { opacity: 0, y: -10, scale: 0.95 } : {}}
                transition={shouldAnimate ? { type: "spring", stiffness: 400, damping: 25 } : {}}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[9999] overflow-hidden"
                role="listbox"
              >
                {locations.map((location, index) => (
                  <motion.button
                    key={location}
                    initial={shouldAnimate ? { opacity: 0, x: -10 } : {}}
                    animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
                    transition={shouldAnimate ? { delay: index * 0.05 } : {}}
                    whileHover={shouldAnimate ? {
                      backgroundColor: "rgb(249 250 251)",
                      transition: { duration: 0.15 }
                    } : {}}
                    onClick={() => handleLocationChange(location)}
                    role="option"
                    aria-selected={location === selectedLocation}
                    className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                  >
                    {location}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Separator */}
      <motion.div 
        variants={shouldAnimate ? itemVariants : {}}
        className="mx-6 border-t border-gray-200 dark:border-gray-700"
      />

      {/* Week Navigation */}
      <motion.div 
        variants={shouldAnimate ? itemVariants : {}}
        className="p-6 pb-4"
      >
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={shouldAnimate ? {
              scale: 1.05,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            } : {}}
            whileTap={shouldAnimate ? { scale: 0.95 } : {}}
            onClick={() => handleWeekNavigation("prev")}
            aria-label="Previous week"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </motion.button>

          <h3 className="font-semibold text-gray-900 dark:text-white">
            {weekRange}
          </h3>

          <motion.button
            whileHover={shouldAnimate ? {
              scale: 1.05,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            } : {}}
            whileTap={shouldAnimate ? { scale: 0.95 } : {}}
            onClick={() => handleWeekNavigation("next")}
            aria-label="Next week"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </motion.button>
        </div>
      </motion.div>

      {/* Daily Schedule */}
      <motion.div 
        variants={shouldAnimate ? itemVariants : {}}
        className="px-6 pb-6 space-y-4"
      >
        {weekSchedule.map((day) => (
          <motion.div
            key={day.date}
            variants={shouldAnimate ? itemVariants : {}}
            className="space-y-3"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {day.dayName}, {day.date}
                </h4>
              </div>
              {!day.hasAvailability && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No Availability
                </span>
              )}
            </div>

            {/* Time Slots */}
            {day.hasAvailability && (
              <motion.div 
                variants={shouldAnimate ? containerVariants : {}}
                className="flex flex-wrap gap-2"
              >
                {day.slots.map((slot) => (
                  <motion.button
                    key={`${day.date}-${slot.time}`}
                    variants={shouldAnimate ? timeSlotVariants : {}}
                    whileHover={shouldAnimate && slot.available ? {
                      scale: 1.05,
                      y: -2,
                      transition: { type: "spring", stiffness: 400, damping: 25 }
                    } : {}}
                    whileTap={shouldAnimate && slot.available ? { scale: 0.98 } : {}}
                    onClick={() => slot.available && handleTimeSlotClick(day.date, slot.time)}
                    disabled={!slot.available}
                    aria-label={`${slot.available ? 'Book' : 'Unavailable'} time slot at ${slot.time} on ${day.dayName}, ${day.date}`}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50",
                      slot.available
                        ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
                        : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                    )}
                  >
                    {slot.time}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Actions */}
      <motion.div 
        variants={shouldAnimate ? itemVariants : {}}
        className="border-t border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex gap-3">
          <motion.button
            whileHover={shouldAnimate ? {
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            } : {}}
            whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={shouldAnimate ? {
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            } : {}}
            whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            className="flex-1 bg-sky-500 text-white py-2.5 rounded-lg hover:bg-sky-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            Next
          </motion.button>
        </div>
      </motion.div>
        </motion.div>

        {/* Confirmation View */}
        <motion.div
          initial={false}
          animate={{ 
            y: showConfirmationView ? "0%" : "100%",
            opacity: showConfirmationView ? 1 : 0 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
          className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-800"
        >
          <div className="p-6 space-y-6">
            {/* Header with back button */}
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToMain}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </motion.button>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Booking</h3>
              <div></div> {/* Spacer for centering */}
            </div>

            {/* Coach info summary */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <img
                src={coach.imageUrl}
                alt={coach.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{coach.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{coach.title}</p>
              </div>
            </div>

            {/* Booking details */}
            {selectedTimeSlot && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Your Booking</p>
                  <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700 rounded-lg p-4">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedTimeSlot.dayName}, {selectedTimeSlot.day}
                    </p>
                    <p className="text-xl font-bold text-sky-500">
                      {selectedTimeSlot.time}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-300">Experience:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{selectedLocation}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                    <span className="text-gray-900 dark:text-white font-medium">3 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-300">Price:</span>
                    <span className="text-gray-900 dark:text-white font-medium">€45</span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm button */}
            <motion.button
              whileHover={shouldAnimate ? { scale: 1.02, y: -1 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              onClick={handleConfirmBooking}
              className="w-full relative overflow-hidden py-3 rounded-lg font-semibold transition-all duration-300 bg-sky-500 hover:bg-sky-600 text-white border cursor-pointer group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                CONFIRM BOOKING
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {/* Gradient shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}