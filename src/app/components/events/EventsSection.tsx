'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  CalendarIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { eventService, Event, generateEventSlug } from '../../services/eventService';

const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const activeEvents = await eventService.getAllEvents();
        // Filter only active events and sort by start date
        const sortedEvents = activeEvents
          .filter(event => event.status === 'active')
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        setEvents(sortedEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Format date helper function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
            <p className="text-lg text-gray-600">Discover amazing events happening near you</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600 font-medium">Loading events...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
            <p className="text-lg text-gray-600">Discover amazing events happening near you</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-800 font-medium">{error}</p>
            <p className="text-red-600 text-sm mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
            <p className="text-lg text-gray-600">Discover amazing events happening near you</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Available</h3>
            <p className="text-gray-600 mb-4">No upcoming events at the moment.</p>
            <p className="text-sm text-gray-500">Check back soon for exciting events!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing events happening near you. From concerts to festivals, find your next adventure.
          </p>
        </div>
        
        {/* Events Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 mb-12">
          {events.slice(0, 10).map((event) => (
            <Link 
              key={event.id} 
              href={`/events/${generateEventSlug(event.title, event.id)}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Event Image */}
              <div className="aspect-[4/3] relative overflow-hidden">
                {event.images && event.images.length > 0 ? (
                  <img 
                    src={event.images[0]} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <PhotoIcon className="h-12 w-12 text-white/70" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    {event.status}
                  </span>
                </div>
              </div>
              
              {/* Event Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                  {event.title}
                </h3>
                
                {/* Event Meta Information */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="font-medium">{formatDate(event.startDate)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2 text-indigo-500" />
                    <span>{event.venue}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="font-semibold text-indigo-600">
                      From KSH {Math.floor(event.regularPrice || event.ticketPrice || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Location */}
                {event.location && (
                  <p className="text-sm text-gray-500 mb-3">{event.location}</p>
                )}
                
                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Available Now
                  </span>
                  <div className="flex items-center text-indigo-600 group-hover:text-indigo-700 transition-colors duration-200">
                    <span className="text-xs font-medium mr-1">Details</span>
                    <ArrowRightIcon className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Events Button */}
        <div className="text-center">
          <Link 
            href="/events" 
            className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <UserGroupIcon className="h-5 w-5 mr-2" />
            View All Events
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;