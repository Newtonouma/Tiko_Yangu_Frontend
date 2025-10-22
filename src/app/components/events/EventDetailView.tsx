'use client';

import React from 'react';
import { Event } from '../../services/eventService';
import styles from './EventDetailView.module.css';

interface EventDetailViewProps {
  event: Event;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onClose: () => void;
  canEdit?: boolean;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  onEdit,
  onArchive,
  onDelete,
  onClose,
  canEdit = false
}) => {
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status: string) => {
    const statusClass = status === 'active' ? styles.statusActive : styles.statusArchived;
    return (
      <span className={`${styles.statusBadge} ${statusClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>{event.title}</h1>
            <button 
              onClick={onClose} 
              className={styles.closeButton}
              aria-label="Close event details"
              title="Close event details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className={styles.statusRow}>
            {getStatusBadge(event.status)}
            <span className={styles.organizer}>
              Organized by {event.organizer.name}
            </span>
          </div>
        </div>

        <div className={styles.content}>
          {/* Event Images */}
          {event.images && event.images.length > 0 && (
            <div className={styles.imageGallery}>
              {event.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${event.title} - Image ${index + 1}`}
                  className={styles.eventImage}
                />
              ))}
            </div>
          )}

          {/* Event Details Grid */}
          <div className={styles.detailsGrid}>
            <div className={styles.detailCard}>
              <div className={styles.detailIcon}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className={styles.detailContent}>
                <h3 className={styles.detailTitle}>Date & Time</h3>
                <p className={styles.detailText}>
                  <strong>Start:</strong> {formatDate(event.startDate)} at {formatTime(event.startTime)}
                </p>
                <p className={styles.detailText}>
                  <strong>End:</strong> {formatDate(event.endDate)} at {formatTime(event.endTime)}
                </p>
              </div>
            </div>

            <div className={styles.detailCard}>
              <div className={styles.detailIcon}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className={styles.detailContent}>
                <h3 className={styles.detailTitle}>Location</h3>
                <p className={styles.detailText}>
                  <strong>Venue:</strong> {event.venue}
                </p>
                <p className={styles.detailText}>
                  <strong>City:</strong> {event.location}
                </p>
              </div>
            </div>

            <div className={styles.detailCard}>
              <div className={styles.detailIcon}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className={styles.detailContent}>
                <h3 className={styles.detailTitle}>Description</h3>
                <p className={styles.detailDescription}>{event.description}</p>
              </div>
            </div>

            {event.url && (
              <div className={styles.detailCard}>
                <div className={styles.detailIcon}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className={styles.detailContent}>
                  <h3 className={styles.detailTitle}>Event Website</h3>
                  <a 
                    href={event.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.eventLink}
                  >
                    Visit Event Website
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Ticket Pricing Section */}
          <div className={styles.pricingSection}>
            <h2 className={styles.sectionTitle}>Ticket Pricing</h2>
            
            {/* Individual Tickets */}
            <div className={styles.ticketTypeSection}>
              <h3 className={styles.ticketTypeTitle}>Individual Tickets</h3>
              <div className={styles.ticketGrid}>
                {event.earlybirdPrice && (
                  <div className={styles.ticketCard}>
                    <div className={styles.ticketType}>Earlybird</div>
                    <div className={styles.ticketPrice}>KSH {Math.floor(event.earlybirdPrice).toLocaleString()}</div>
                  </div>
                )}
                <div className={styles.ticketCard}>
                  <div className={styles.ticketType}>Regular</div>
                  <div className={styles.ticketPrice}>KSH {Math.floor(event.regularPrice).toLocaleString()}</div>
                </div>
                {event.vipPrice && (
                  <div className={styles.ticketCard}>
                    <div className={styles.ticketType}>VIP</div>
                    <div className={styles.ticketPrice}>KSH {Math.floor(event.vipPrice).toLocaleString()}</div>
                  </div>
                )}
                {event.vvipPrice && (
                  <div className={styles.ticketCard}>
                    <div className={styles.ticketType}>VVIP</div>
                    <div className={styles.ticketPrice}>KSH {Math.floor(event.vvipPrice).toLocaleString()}</div>
                  </div>
                )}
                {event.atTheGatePrice && (
                  <div className={styles.ticketCard}>
                    <div className={styles.ticketType}>At the Gate</div>
                    <div className={styles.ticketPrice}>KSH {Math.floor(event.atTheGatePrice).toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Group Tickets */}
            {event.groupTickets && event.groupTickets.length > 0 && (
              <div className={styles.ticketTypeSection}>
                <h3 className={styles.ticketTypeTitle}>Group Tickets</h3>
                <div className={styles.groupTicketGrid}>
                  {event.groupTickets.map((groupTicket) => (
                    <div key={groupTicket.id} className={styles.groupTicketCard}>
                      <div className={styles.groupTicketHeader}>
                        <div className={styles.groupTicketName}>{groupTicket.name}</div>
                        <div className={styles.groupTicketPrice}>KSH {Math.floor(groupTicket.price).toLocaleString()}</div>
                      </div>
                      <div className={styles.groupTicketDetails}>
                        <span className={styles.memberCount}>{groupTicket.memberCount} members</span>
                        <span className={styles.pricePerPerson}>
                          KSH {Math.floor(groupTicket.price / groupTicket.memberCount).toLocaleString()} per person
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {canEdit && (
          <div className={styles.actions}>
            {onEdit && (
              <button onClick={onEdit} className={styles.editButton}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Event
              </button>
            )}
            {onArchive && (
              <>
                {event.status === 'active' && (
                  <button onClick={onArchive} className={styles.archiveButton}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4 4 4-4m6-4V6a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2h10a2 2 0 012 2zM5 10v8a2 2 0 002 2h10a2 2 0 002-2v-8" />
                    </svg>
                    Archive Event
                  </button>
                )}
                {event.status === 'archived' && (
                  <button 
                    onClick={onArchive} 
                    className={styles.unarchiveButton}
                    title="Restore event to active status"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l4-4 4 4m6-4V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2z" />
                    </svg>
                    Unarchive Event
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailView;