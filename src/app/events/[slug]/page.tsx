'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { eventService, Event, getIdFromSlug } from '../../services/eventService';
import { ticketService } from '../../services/ticketService';
import NavBar from '../../components/navbar/NavBar';
import TicketPurchaseForm from '../../components/tickets/TicketPurchaseForm';
import styles from './EventDetail.module.css';

const EventDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const eventSlug = params?.slug as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!eventSlug) return;

    const loadEvent = async () => {
      try {
        setIsLoading(true);
        // For public events, we might need a separate endpoint or method
        const eventData = await eventService.getAllEvents();
        
        // Extract ID from slug and find event
        const eventId = getIdFromSlug(eventSlug);
        const foundEvent = eventData.find((e: Event) => e.id === eventId);
        
        if (!foundEvent) {
          setError('Event not found');
          return;
        }
        
        setEvent(foundEvent);
      } catch (error) {
        console.error('Failed to load event:', error);
        setError('Failed to load event details');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventSlug]);

  const handlePurchaseSuccess = () => {
    setShowPurchaseForm(false);
    alert('Ticket purchased successfully! Check your email for details.');
  };

  const formatDateTime = (date: string, time: string) => {
    const eventDate = new Date(date);
    const [hours, minutes] = time.split(':');
    eventDate.setHours(parseInt(hours), parseInt(minutes));
    
    return {
      date: eventDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: eventDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className={styles.errorContainer}>
          <h1 className={styles.errorTitle}>Event Not Found</h1>
          <p className={styles.errorText}>{error || 'The requested event could not be found.'}</p>
          <Link href="/" className={styles.backButton}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const startDateTime = formatDateTime(event.startDate, event.startTime);
  const endDateTime = formatDateTime(event.endDate, event.endTime);
  const isMultiDay = event.startDate !== event.endDate;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className={styles.main}>
        {/* Back Navigation */}
        <div className={styles.navigation}>
          <Link href="/" className={styles.backLink}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
        </div>

        <div className={styles.container}>
          <div className={styles.eventHeader}>
            {/* Event Poster */}
            <div className={styles.posterSection}>
              <div className={styles.mainPoster}>
                {event.images && event.images.length > 0 ? (
                  <img 
                    src={event.images[selectedImageIndex]} 
                    alt={event.title}
                    className={styles.posterImage}
                  />
                ) : (
                  <div className={styles.placeholderPoster}>
                    <div className={styles.placeholderIcon}>
                      <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className={styles.placeholderText}>No Image Available</p>
                  </div>
                )}
              </div>
              
              {/* Image Gallery */}
              {event.images && event.images.length > 1 && (
                <div className={styles.imageGallery}>
                  {event.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`${styles.galleryImage} ${
                        index === selectedImageIndex ? styles.galleryImageActive : ''
                      }`}
                    >
                      <img src={image} alt={`${event.title} - Image ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Event Details */}
            <div className={styles.eventDetails}>
              <div className={styles.eventBadge}>
                <span className={styles.statusBadge}>
                  {event.status === 'active' ? 'Active Event' : 'Event'}
                </span>
              </div>
              
              <h1 className={styles.eventTitle}>{event.title}</h1>
              
              <div className={styles.organizer}>
                <span className={styles.organizerLabel}>Organized by</span>
                <span className={styles.organizerName}>{event.organizer.name}</span>
              </div>

              <div className={styles.eventMeta}>
                <div className={styles.metaItem}>
                  <div className={styles.metaIcon}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className={styles.metaContent}>
                    <span className={styles.metaLabel}>Date & Time</span>
                    <span className={styles.metaValue}>
                      {startDateTime.date} at {startDateTime.time}
                      {isMultiDay && (
                        <span className={styles.endDate}>
                          <br />to {endDateTime.date} at {endDateTime.time}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className={styles.metaItem}>
                  <div className={styles.metaIcon}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className={styles.metaContent}>
                    <span className={styles.metaLabel}>Venue</span>
                    <span className={styles.metaValue}>{event.venue}</span>
                    <span className={styles.metaSubtext}>{event.location}</span>
                  </div>
                </div>

                {/* Ticket Types Section */}
                <div className={styles.ticketTypesSection}>
                  <div className={styles.metaIcon}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className={styles.ticketTypesContent}>
                    <span className={styles.metaLabel}>Available Tickets</span>
                    <div className={styles.ticketTypesList}>
                      {/* Earlybird */}
                      {event.earlybirdPrice && (
                        <div className={styles.ticketTypeItem}>
                          <span className={styles.ticketTypeName}>Earlybird</span>
                          <span className={styles.ticketTypePrice}>KSH {Math.floor(event.earlybirdPrice).toLocaleString()}</span>
                        </div>
                      )}
                      
                      {/* Regular - Always show as it's required */}
                      <div className={styles.ticketTypeItem}>
                        <span className={styles.ticketTypeName}>Regular</span>
                        <span className={styles.ticketTypePrice}>KSH {Math.floor(event.regularPrice || event.ticketPrice || 0).toLocaleString()}</span>
                      </div>
                      
                      {/* VIP */}
                      {event.vipPrice && (
                        <div className={styles.ticketTypeItem}>
                          <span className={styles.ticketTypeName}>VIP</span>
                          <span className={styles.ticketTypePrice}>KSH {Math.floor(event.vipPrice).toLocaleString()}</span>
                        </div>
                      )}
                      
                      {/* VVIP */}
                      {event.vvipPrice && (
                        <div className={styles.ticketTypeItem}>
                          <span className={styles.ticketTypeName}>VVIP</span>
                          <span className={styles.ticketTypePrice}>KSH {Math.floor(event.vvipPrice).toLocaleString()}</span>
                        </div>
                      )}
                      
                      {/* At the Gate */}
                      {event.atTheGatePrice && (
                        <div className={styles.ticketTypeItem}>
                          <span className={styles.ticketTypeName}>At the Gate</span>
                          <span className={styles.ticketTypePrice}>KSH {Math.floor(event.atTheGatePrice).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              <div className={styles.purchaseSection}>
                <button 
                  onClick={() => setShowPurchaseForm(true)}
                  className={styles.purchaseButton}
                >
                  Buy Tickets - From KSH {Math.floor(event.regularPrice || event.ticketPrice || 0).toLocaleString()}
                </button>
                
                {event.url && (
                  <a 
                    href={event.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.eventWebsite}
                  >
                    Visit Event Website
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className={styles.descriptionSection}>
            <h2 className={styles.sectionTitle}>About This Event</h2>
            <div className={styles.description}>
              <p>{event.description}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Ticket Purchase Modal */}
      {showPurchaseForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Purchase Ticket</h3>
              <button 
                onClick={() => setShowPurchaseForm(false)}
                className={styles.modalClose}
                aria-label="Close modal"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <TicketPurchaseForm
              eventId={event.id}
              eventTitle={event.title}
              event={event}
              onClose={() => setShowPurchaseForm(false)}
              onSuccess={handlePurchaseSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;