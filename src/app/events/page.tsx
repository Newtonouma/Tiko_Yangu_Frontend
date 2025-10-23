'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { eventService, Event, generateEventSlug } from '../services/eventService';
import NavBar from '../components/navbar/NavBar';
import Footer from '../components/footer/Footer';
import styles from './EventsPage.module.css';
import {
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today'>('all');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const allEvents = await eventService.getAllEvents();
        // Filter only active events and sort by start date
        const activeEvents = allEvents
          .filter((event: Event) => event.status === 'active')
          .sort((a: Event, b: Event) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        setEvents(activeEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const getFilteredEvents = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (filter) {
      case 'today':
        return events.filter(event => {
          const eventDate = new Date(event.startDate);
          return eventDate >= today && eventDate < tomorrow;
        });
      case 'upcoming':
        return events.filter(event => {
          const eventDate = new Date(event.startDate);
          return eventDate >= today;
        });
      case 'all':
      default:
        return events;
    }
  };

  const filteredEvents = getFilteredEvents();

  // Format date helper function (match home page)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.container}>
            <div className={styles.headerContent}>
              <Link href="/" className={styles.backLink}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
              
              <h1 className={styles.pageTitle}>All Events</h1>
              <p className={styles.pageSubtitle}>
                Discover all the exciting events happening around you
              </p>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          {/* Filter Tabs */}
          <div className={styles.filterTabs}>
            <button
              onClick={() => setFilter('all')}
              className={`${styles.filterTab} ${filter === 'all' ? styles.filterTabActive : ''}`}
            >
              All Events ({events.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`${styles.filterTab} ${filter === 'upcoming' ? styles.filterTabActive : ''}`}
            >
              Upcoming ({events.filter(e => new Date(e.startDate) >= new Date()).length})
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`${styles.filterTab} ${filter === 'today' ? styles.filterTabActive : ''}`}
            >
              Today ({events.filter(e => {
                const today = new Date();
                const eventDate = new Date(e.startDate);
                return eventDate.toDateString() === today.toDateString();
              }).length})
            </button>
          </div>

          {error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className={styles.emptyContainer}>
              <div className={styles.emptyIcon}>
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className={styles.emptyTitle}>No events found</h3>
              <p className={styles.emptyText}>
                {filter === 'today' 
                  ? "No events are scheduled for today." 
                  : filter === 'upcoming' 
                  ? "No upcoming events at the moment." 
                  : "No events are currently available."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 mb-12">
              {filteredEvents.map((event) => (
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventsPage;
