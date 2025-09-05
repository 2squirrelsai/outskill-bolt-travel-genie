import React, { useState, useRef, useEffect } from 'react';
import { Trip, Message } from '../types';
import { Send, Bot, User, Sparkles, MapPin, Clock, DollarSign, X } from 'lucide-react';
import { generateTravelResponse } from '../lib/openai';

interface TravelAssistantProps {
  trip: Trip;
  selectedDay: string | null;
  onAddActivity: (dayId: string, activity: any) => void;
  onClose: () => void;
}

export const TravelAssistant: React.FC<TravelAssistantProps> = ({
  trip,
  selectedDay,
  onAddActivity,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm TravelThread, your personal travel assistant! 👋 I'm excited to help you plan an amazing trip to ${trip.destination}. What would you like to explore or add to your itinerary?`,
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Get existing activities for context
      const existingActivities = trip.days.flatMap(day => 
        day.activities.map(activity => `${activity.name} (${activity.startTime})`)
      );

      const response = await generateTravelResponse(inputText, {
        destination: trip.destination,
        budget: trip.budget,
        spentAmount: trip.spentAmount,
        startDate: trip.startDate,
        endDate: trip.endDate,
        selectedDay,
        existingActivities
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment! 🤖",
        sender: 'assistant',
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const quickActions = [
    'Recommend restaurants',
    'Suggest activities for today',
    'Help with budget planning',
    'Transportation tips',
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-orange-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">TravelThread</h3>
            <p className="text-sm text-gray-600">Your AI Travel Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-brand-navy text-white' 
                  : 'bg-brand-orange text-white'
              }`}>
                {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`rounded-xl p-3 ${
                message.sender === 'user'
                  ? 'bg-brand-navy text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 rounded-xl p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputText(action)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me anything about your trip..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};