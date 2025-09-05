import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, ChevronDown, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface UserMenuProps {
  onShowSettings?: () => void;
  onDeleteTrip?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onShowSettings, onDeleteTrip }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleSettings = () => {
    setIsOpen(false);
    if (onShowSettings) {
      onShowSettings();
    }
  };

  const handleDeleteTrip = () => {
    setIsOpen(false);
    if (onDeleteTrip) {
      onDeleteTrip();
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = () => {
    const metadata = user?.user_metadata;
    return metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {getInitials(user.user_metadata?.full_name)}
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
          {getDisplayName()}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{getDisplayName()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
          
          <button
            onClick={handleSettings}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          
          {onDeleteTrip && (
            <button
              onClick={handleDeleteTrip}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 border-t border-gray-100 dark:border-gray-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Trip</span>
            </button>
          )}
          
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 border-t border-gray-100 dark:border-gray-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};