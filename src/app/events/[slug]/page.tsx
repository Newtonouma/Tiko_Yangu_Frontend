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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

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
        <div className={styles.container}>
          {/* Main Two-Column Layout */}
          <div className={styles.mainContent}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {/* Image Section */}
              <div 
                className={styles.imageSection}
                style={{
                  backgroundImage: event.images && event.images.length > 0 
                    ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url(${JSON.stringify(event.images[selectedImageIndex])})` 
                    : 'none'
                }}
              >
                {event.images && event.images.length > 0 ? (
                  <div className={styles.carouselContainer}>
                    {/* Main Image Display Area (Background) */}
                    <div className={styles.mainImageContainer}>
                      {/* This div will show the background image */}
                    </div>
                    
                    {/* Thumbnail Navigation with Arrows */}
                    {event.images.length > 1 && (
                      <div className={styles.thumbnailCarousel}>
                        <button 
                          className={`${styles.navArrow} ${styles.navArrowLeft}`}
                          onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : event.images.length - 1)}
                          aria-label="Previous image"
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        {event.images.map((image: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`${styles.thumbnailImage} ${
                              index === selectedImageIndex ? styles.thumbnailImageActive : ''
                            }`}
                          >
                            <img src={image} alt={`${event.title} - Image ${index + 1}`} />
                          </button>
                        ))}
                        
                        <button 
                          className={`${styles.navArrow} ${styles.navArrowRight}`}
                          onClick={() => setSelectedImageIndex(selectedImageIndex < event.images.length - 1 ? selectedImageIndex + 1 : 0)}
                          aria-label="Next image"
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.placeholderImage}>
                    <div className={styles.placeholderIcon}>
                      <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className={styles.placeholderText}>No Image Available</p>
                  </div>
                )}
              </div>

              {/* About Section */}
              <div className={styles.aboutSection}>
                {/* Event Title */}
                <h1 className={styles.eventTitle}>{event.title}</h1>
                
                {/* Event Info */}
                <div className={styles.eventInfo}>
                  <div className={styles.infoItem}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className={styles.infoText}>
                      <span className={styles.infoLabel}>Date & Time</span>
                      <span className={styles.infoValue}>{startDateTime.date} at {startDateTime.time}</span>
                      {isMultiDay && <span className={styles.endDate}>to {endDateTime.date} at {endDateTime.time}</span>}
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className={styles.infoText}>
                      <span className={styles.infoLabel}>Location</span>
                      <span className={styles.infoValue}>{event.venue}, {event.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* Event Description */}
                <div className={styles.aboutContent}>
                  <div className={styles.descriptionHeader}>
                    <h3 className={styles.descriptionTitle}>Description</h3>
                    <button 
                      className={styles.expandButton}
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      aria-expanded={isDescriptionExpanded}
                    >
                      {isDescriptionExpanded ? '−' : '+'}
                    </button>
                  </div>
                  <div className={`${styles.descriptionContent} ${isDescriptionExpanded ? styles.expanded : styles.collapsed}`}>
                    <p>{event.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {/* Tickets Section */}
              <div className={styles.ticketsSection}>
                <h3 className={styles.sectionTitle}>Ticket Types</h3>
                <div className={styles.ticketsList}>
                  {/* Earlybird */}
                  <div className={styles.ticketItem}>
                    <div className={styles.ticketInfo}>
                      <span className={styles.ticketName}>Earlybird</span>
                      {event.earlybirdPrice ? (
                        <span className={styles.ticketPrice}>KSH {Math.floor(event.earlybirdPrice).toLocaleString()}</span>
                      ) : (
                        <span className={styles.ticketUnavailable}>Not available</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Regular */}
                  <div className={styles.ticketItem}>
                    <div className={styles.ticketInfo}>
                      <span className={styles.ticketName}>Regular</span>
                      {event.regularPrice || event.ticketPrice ? (
                        <span className={styles.ticketPrice}>KSH {Math.floor(event.regularPrice || event.ticketPrice || 0).toLocaleString()}</span>
                      ) : (
                        <span className={styles.ticketUnavailable}>Not available</span>
                      )}
                    </div>
                  </div>
                  
                  {/* VIP */}
                  <div className={styles.ticketItem}>
                    <div className={styles.ticketInfo}>
                      <span className={styles.ticketName}>VIP</span>
                      {event.vipPrice ? (
                        <span className={styles.ticketPrice}>KSH {Math.floor(event.vipPrice).toLocaleString()}</span>
                      ) : (
                        <span className={styles.ticketUnavailable}>Not available</span>
                      )}
                    </div>
                  </div>
                  
                  {/* VVIP */}
                  <div className={styles.ticketItem}>
                    <div className={styles.ticketInfo}>
                      <span className={styles.ticketName}>VVIP</span>
                      {event.vvipPrice ? (
                        <span className={styles.ticketPrice}>KSH {Math.floor(event.vvipPrice).toLocaleString()}</span>
                      ) : (
                        <span className={styles.ticketUnavailable}>Not available</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Premium */}
                  <div className={styles.ticketItem}>
                    <div className={styles.ticketInfo}>
                      <span className={styles.ticketName}>Premium</span>
                      {event.premiumPrice ? (
                        <span className={styles.ticketPrice}>KSH {Math.floor(event.premiumPrice).toLocaleString()}</span>
                      ) : (
                        <span className={styles.ticketUnavailable}>Not available</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Group/Table */}
                  <div className={styles.ticketItem}>
                    <div className={styles.ticketInfo}>
                      <span className={styles.ticketName}>Group/Table</span>
                      {event.groupPrice || event.tablePrice ? (
                        <span className={styles.ticketPrice}>KSH {Math.floor(event.groupPrice || event.tablePrice || 0).toLocaleString()}</span>
                      ) : (
                        <span className={styles.ticketUnavailable}>Not available</span>
                      )}
                    </div>
                  </div>
                  
                  {/* At the Gate */}
                  <div className={styles.ticketItem}>
                    <div className={styles.ticketInfo}>
                      <span className={styles.ticketName}>At the Gate</span>
                      {event.atTheGatePrice ? (
                        <span className={styles.ticketPrice}>KSH {Math.floor(event.atTheGatePrice).toLocaleString()}</span>
                      ) : (
                        <span className={styles.ticketUnavailable}>Not available</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Section */}
              <div className={styles.paymentSection}>
                <h3 className={styles.sectionTitle}>Payment Methods</h3>
                <div className={styles.paymentMethods}>
                  <button className={styles.paymentButton} onClick={() => setShowPurchaseForm(true)}>
                    <span className={styles.paymentIcon}>📱</span>
                    <span>M-Pesa</span>
                  </button>
                  <button className={styles.paymentButton} onClick={() => setShowPurchaseForm(true)}>
                    <span className={styles.paymentIcon}>📱</span>
                    <span>Airtel Money</span>
                  </button>
                  <button className={styles.paymentButton} onClick={() => setShowPurchaseForm(true)}>
                    <span className={styles.paymentIcon}>🏦</span>
                    <span>KCB</span>
                  </button>
                  <button className={styles.paymentButton} onClick={() => setShowPurchaseForm(true)}>
                    <span className={styles.paymentIcon}>🏦</span>
                    <span>Equity</span>
                  </button>
                  <button className={styles.paymentButton} onClick={() => setShowPurchaseForm(true)}>
                    <span className={styles.paymentIcon}>🏦</span>
                    <span>NCBA</span>
                  </button>
                  <button className={styles.paymentButton} onClick={() => setShowPurchaseForm(true)}>
                    <span className={styles.paymentIcon}>🏦</span>
                    <span>I&M Bank</span>
                  </button>
                </div>
                
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

          {/* Related Tickets Section */}
          <div className={styles.relatedSection}>
            <h2 className={styles.sectionTitle}>Related Tickets</h2>
            <div className={styles.relatedEvents}>
              <p className={styles.comingSoon}>Related tickets coming soon...</p>
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