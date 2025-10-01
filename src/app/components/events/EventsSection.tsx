'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { eventService, Event, generateEventSlug } from '../../services/eventService';
import styles from './EventsSection.module.css';

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

  if (isLoading) {
    return (
      <section className={styles.eventsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.eventsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className={styles.eventsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>
          <div className={styles.emptyContainer}>
            <p className={styles.emptyText}>No upcoming events at the moment.</p>
            <p className={styles.emptySubtext}>Check back soon for exciting events!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.eventsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>
        </div>
        
        <div className={styles.eventsGrid}>
          {events.map((event) => (
            <Link 
              key={event.id} 
              href={`/events/${generateEventSlug(event.title, event.id)}`}
              className={styles.eventCard}
            >
              <div className={styles.posterContainer}>
                {event.images && event.images.length > 0 ? (
                  <img 
                    src={event.images[0]} 
                    alt={event.title}
                    className={styles.posterImage}
                  />
                ) : (
                  <div className={styles.placeholderPoster}>
                    <div className={styles.placeholderIcon}>
                      <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className={styles.placeholderText}>No Image</p>
                  </div>
                )}
                
                <div className={styles.eventOverlay}>
                  <div className={styles.eventInfo}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventVenue}>{event.venue}</p>
                    {(() => {
                      // Use regularPrice or fallback to ticketPrice for backward compatibility
                      const price = Math.floor(event.regularPrice || event.ticketPrice || 0);
                      const priceString = price.toLocaleString();
                      const isLongPrice = priceString.length > 4;
                      const priceClass = priceString.length > 6 ? styles.eventPriceSmall : priceString.length > 4 ? styles.eventPriceMedium : '';
                      
                      return (
                        <div className={`${styles.eventMeta} ${isLongPrice ? styles.eventMetaStacked : ''}`}>
                          <div className={styles.eventDate}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(event.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className={`${styles.eventPrice} ${priceClass}`}>
                            <span>KSH {priceString}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className={styles.hoverActions}>
                    <button 
                      className={styles.buyTicketButton}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = `/events/${generateEventSlug(event.title, event.id)}`;
                      }}
                    >
                      Buy Tickets
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {events.length > 8 && (
          <div className={styles.viewMoreContainer}>
            <Link href="/events" className={styles.viewMoreButton}>
              View All Events
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;