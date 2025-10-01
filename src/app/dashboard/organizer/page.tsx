'use client';

import React, { useEffect, useState } from 'react';
import { withOrganizerProtection } from '../../components/auth/withRoleProtection';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import DataTable from '../../components/dashboard/DataTable';
import ActionButton from '../../components/dashboard/ActionButton';
import FilterBar from '../../components/dashboard/FilterBar';
import { useAuth } from '../../contexts/AuthContext';
import { eventService, Event as EventType, CreateEventData } from '../../services/eventService';
import { ticketService, Ticket } from '../../services/ticketService';
import EventForm, { EventFormData } from '../../components/events/EventForm';
import EventDetailView from '../../components/events/EventDetailView';
import styles from './OrganizerDashboard.module.css';

// Icons
const EventsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);
const ActiveEventsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const TicketsSoldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);
const RevenueIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const ArchiveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4 4 4-4m6-4V6a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2h10a2 2 0 012 2zM5 10v8a2 2 0 002 2h10a2 2 0 002-2v-8" />
  </svg>
);
const UnarchiveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l4-4 4 4m6-4V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2z" />
  </svg>
);
const ViewIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// Use EventType from service, extend with additional display fields
interface Event extends EventType {
  ticketsSold?: number;
  revenue?: number;
}

// Ticket interface imported from ticketService

interface OrganizerStats {
  totalEvents: number;
  activeEvents: number;
  ticketsSold: number;
  revenue: number;
  trends: {
    events: { value: number; isPositive: boolean };
    activeEvents: { value: number; isPositive: boolean };
    tickets: { value: number; isPositive: boolean };
    revenue: { value: number; isPositive: boolean };
  };
}

function OrganizerDashboard() {
  const { user, logout, refreshProfile, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<OrganizerStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'tickets'>('overview');
  const [eventFilters, setEventFilters] = useState({
    status: '',
    search: ''
  });
  const [ticketFilters, setTicketFilters] = useState({
    status: '',
    eventId: '',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Utility function to check if an event is upcoming
  const isEventUpcoming = (event: Event): boolean => {
    const now = new Date();
    const eventStartDate = new Date(`${event.startDate}T${event.startTime}`);
    return eventStartDate > now;
  };

  const apiCall = async (endpoint: string, options?: RequestInit) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  };

  const loadEvents = async () => {
    try {
      // Try to load events with error handling
      let activeEvents: EventType[] = [];
      let archivedEvents: EventType[] = [];
      
      try {
        activeEvents = await eventService.getMyEvents();
      } catch (error) {
        console.warn('Failed to load active events:', error);
      }
      
      try {
        archivedEvents = await eventService.getMyArchivedEvents();
      } catch (error) {
        console.warn('Failed to load archived events:', error);
      }
      
      const allEvents = [...activeEvents, ...archivedEvents];
      setEvents(allEvents);
      
      // Fetch real tickets from backend (this handles its own errors now)
      const realTickets = await ticketService.getMyTickets();
      setTickets(realTickets);
      
      // Calculate stats from real data
      const activeCount = activeEvents.length;
      const totalCount = allEvents.length;
      const totalTicketsSold = realTickets.filter(t => t.status !== 'canceled').length;
      const totalRevenue = realTickets
        .filter(t => t.status !== 'canceled')
        .reduce((acc, ticket) => acc + ticket.price, 0);
      
      setStats({
        totalEvents: totalCount,
        activeEvents: activeCount,
        ticketsSold: totalTicketsSold,
        revenue: totalRevenue,
        trends: {
          events: { value: 5, isPositive: true },
          activeEvents: { value: 10, isPositive: true },
          tickets: { value: 15, isPositive: true },
          revenue: { value: 8, isPositive: true }
        }
      });
    } catch (error) {
      console.error('Critical error in loadEvents:', error);
      // Set empty data on critical error
      setEvents([]);
      setTickets([]);
      setStats({
        totalEvents: 0,
        activeEvents: 0,
        ticketsSold: 0,
        revenue: 0,
        trends: {
          events: { value: 0, isPositive: false },
          activeEvents: { value: 0, isPositive: false },
          tickets: { value: 0, isPositive: false },
          revenue: { value: 0, isPositive: false }
        }
      });
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        await loadEvents();
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleRefreshProfile = async () => {
    try {
      await refreshProfile();
      alert('Profile refreshed successfully! Check the console for details.');
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      alert('Failed to refresh profile. Please try again.');
    }
  };

  const handleShowCurrentUserInfo = () => {
    const currentUser = user;
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const userInfo = {
      'Current User Object': currentUser,
      'Token exists': !!token,
      'User ID': currentUser?.id,
      'User Name': currentUser?.name,
      'User Email': currentUser?.email,
      'User Role': currentUser?.role
    };
    console.log('📋 Current User Information:', userInfo);
    alert(`Current User Info (check console for full details):\nName: ${currentUser?.name}\nEmail: ${currentUser?.email}\nRole: ${currentUser?.role}`);
  };

  // Event CRUD Operations
  const handleCreateEvent = async (eventData: EventFormData) => {
    try {
      setFormLoading(true);
      // Convert EventFormData to CreateEventData by ensuring images are File[] or undefined
      const createEventData: CreateEventData = {
        ...eventData,
        images: Array.isArray(eventData.images) && eventData.images.every(img => img instanceof File) 
          ? eventData.images as File[] 
          : undefined
      };
      await eventService.createEvent(createEventData);
      await loadEvents(); // Refresh events list
      setShowCreateForm(false);
      alert('Event created successfully!');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditEvent = async (eventData: EventFormData) => {
    if (!selectedEvent) return;
    
    try {
      setFormLoading(true);
      // Convert EventFormData to CreateEventData by ensuring images are File[] or undefined
      const updateEventData: CreateEventData = {
        ...eventData,
        images: Array.isArray(eventData.images) && eventData.images.every(img => img instanceof File) 
          ? eventData.images as File[] 
          : undefined
      };
      await eventService.updateEvent(selectedEvent.id, updateEventData);
      await loadEvents(); // Refresh events list
      setShowEditForm(false);
      setSelectedEvent(null);
      alert('Event updated successfully!');
    } catch (error) {
      console.error('Failed to update event:', error);
      alert('Failed to update event. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const handleEditEventModal = (event: Event) => {
    // Prevent editing past events
    if (!isEventUpcoming(event)) {
      alert('Cannot edit past events. Only upcoming events can be modified.');
      return;
    }
    
    setSelectedEvent(event);
    setShowEditForm(true);
  };

  const handleArchiveEvent = async (eventId: number) => {
    if (!confirm('Are you sure you want to archive this event?')) return;

    try {
      await eventService.archiveEvent(eventId);
      await loadEvents(); // Refresh events list
      alert('Event archived successfully!');
    } catch (error) {
      console.error('Failed to archive event:', error);
      alert('Failed to archive event. Please try again.');
    }
  };

  const handleUnarchiveEvent = async (eventId: number) => {
    if (!confirm('Are you sure you want to unarchive this event? It will become active again.')) return;

    try {
      await eventService.unarchiveEvent(eventId);
      await loadEvents(); // Refresh events list
      alert('Event unarchived successfully!');
    } catch (error) {
      console.error('Failed to unarchive event:', error);
      alert('Failed to unarchive event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('Are you sure you want to permanently delete this event? This action cannot be undone.')) return;

    try {
      await eventService.deleteEvent(eventId);
      await loadEvents(); // Refresh events list
      setShowEventDetail(false);
      setSelectedEvent(null);
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  // Ticket management functions
  const handleCancelTicket = async (ticketId: number) => {
    if (!confirm('Are you sure you want to cancel this ticket? This action cannot be undone.')) return;

    try {
      await ticketService.cancelTicket(ticketId);
      await loadEvents(); // Refresh data
      alert('Ticket cancelled successfully!');
    } catch (error) {
      console.error('Failed to cancel ticket:', error);
      alert('Failed to cancel ticket. Please try again.');
    }
  };

  const handleUseTicket = async (ticketId: number) => {
    if (!confirm('Mark this ticket as used?')) return;

    try {
      await ticketService.useTicket(ticketId);
      await loadEvents(); // Refresh data
      alert('Ticket marked as used!');
    } catch (error) {
      console.error('Failed to mark ticket as used:', error);
      alert('Failed to update ticket status. Please try again.');
    }
  };

  const filteredEvents = events.filter(event => {
    return (
      (!eventFilters.status || event.status === eventFilters.status) &&
      (!eventFilters.search || 
        event.title.toLowerCase().includes(eventFilters.search.toLowerCase()) ||
        event.venue.toLowerCase().includes(eventFilters.search.toLowerCase())
      )
    );
  });

  const filteredTickets = tickets.filter(ticket => {
    return (
      (!ticketFilters.status || ticket.status === ticketFilters.status) &&
      (!ticketFilters.eventId || ticket.event.id.toString() === ticketFilters.eventId) &&
      (!ticketFilters.search || 
        ticket.buyerName.toLowerCase().includes(ticketFilters.search.toLowerCase()) ||
        ticket.buyerEmail.toLowerCase().includes(ticketFilters.search.toLowerCase())
      )
    );
  });

  const eventColumns = [
    { key: 'title' as keyof Event, header: 'Event Title' },
    { key: 'venue' as keyof Event, header: 'Venue' },
    { key: 'startDate' as keyof Event, header: 'Date', render: (event: Event) => 
      new Date(event.startDate).toLocaleDateString() 
    },
    { key: 'ticketPrice' as keyof Event, header: 'Ticket Price', render: (event: Event) => 
      `KSH ${event.ticketPrice?.toLocaleString() || '0'}` 
    },
    { key: 'status' as keyof Event, header: 'Status', render: (event: Event) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {event.status}
      </span>
    )},
    { key: 'actions' as keyof Event, header: 'Actions', className: 'min-w-[280px]', render: (event: Event) => (
      <div className="flex space-x-1">
        <ActionButton
          onClick={() => handleViewEvent(event)}
          variant="secondary"
          size="sm"
          icon={<ViewIcon />}
        >
          View
        </ActionButton>
        {isEventUpcoming(event) ? (
          <ActionButton
            onClick={() => handleEditEventModal(event)}
            variant="secondary"
            size="sm"
            icon={<EditIcon />}
          >
            Edit
          </ActionButton>
        ) : (
          <ActionButton
            onClick={() => {}}
            variant="secondary"
            size="sm"
            icon={<EditIcon />}
            disabled
            title="Cannot edit past events"
          >
            Edit
          </ActionButton>
        )}
        {event.status === 'active' && (
          <ActionButton
            onClick={() => handleArchiveEvent(event.id)}
            variant="secondary"
            size="sm"
            icon={<ArchiveIcon />}
          >
            Archive
          </ActionButton>
        )}
        {event.status === 'archived' && (
          <ActionButton
            onClick={() => handleUnarchiveEvent(event.id)}
            variant="secondary"
            size="sm"
            icon={<UnarchiveIcon />}
            title="Restore event to active status"
          >
            Unarchive
          </ActionButton>
        )}
      </div>
    )}
  ];

  const ticketColumns = [
    { key: 'event' as keyof Ticket, header: 'Event', render: (ticket: Ticket) => ticket.event.title },
    { key: 'buyerName' as keyof Ticket, header: 'Buyer Name' },
    { key: 'buyerEmail' as keyof Ticket, header: 'Email' },
    { key: 'ticketType' as keyof Ticket, header: 'Type' },
    { key: 'price' as keyof Ticket, header: 'Price', render: (ticket: Ticket) => `KES ${ticket.price?.toLocaleString()}` },
    { key: 'status' as keyof Ticket, header: 'Status', render: (ticket: Ticket) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        ticket.status === 'valid' ? 'bg-green-100 text-green-800' :
        ticket.status === 'used' ? 'bg-blue-100 text-blue-800' :
        'bg-red-100 text-red-800'
      }`}>
        {ticket.status}
      </span>
    )},
    { key: 'createdAt' as keyof Ticket, header: 'Purchase Date', render: (ticket: Ticket) => 
      new Date(ticket.createdAt).toLocaleDateString() 
    },
    { key: 'actions' as keyof Ticket, header: 'Actions', render: (ticket: Ticket) => (
      <div className="flex space-x-2">
        {ticket.status === 'valid' && (
          <>
            <ActionButton
              onClick={() => handleUseTicket(ticket.id)}
              variant="primary"
              size="sm"
              title="Mark ticket as used"
            >
              Use
            </ActionButton>
            <ActionButton
              onClick={() => handleCancelTicket(ticket.id)}
              variant="danger"
              size="sm"
              title="Cancel this ticket"
            >
              Cancel
            </ActionButton>
          </>
        )}
        {ticket.status === 'used' && (
          <span className="text-sm text-gray-500">Used</span>
        )}
        {ticket.status === 'canceled' && (
          <span className="text-sm text-red-500">Canceled</span>
        )}
      </div>
    )}
  ];



  // Show loading if auth is still loading or user data is not available
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <DashboardLayout
      title="Organizer Dashboard"
      subtitle={`Welcome back, ${user.name}`}
      navigationItems={[
        {
          key: 'overview',
          label: 'Overview',
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>,
          active: activeTab === 'overview',
          onClick: () => setActiveTab('overview')
        },
        {
          key: 'events',
          label: 'My Events',
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>,
          active: activeTab === 'events',
          onClick: () => setActiveTab('events')
        },
        {
          key: 'tickets',
          label: 'Tickets',
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>,
          active: activeTab === 'tickets',
          onClick: () => setActiveTab('tickets')
        }
      ]}
      actions={
        <ActionButton
          onClick={handleLogout}
          variant="danger"
          size="sm"
          icon={<LogoutIcon />}
        >
          Logout
        </ActionButton>
      }
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Events"
              value={stats?.totalEvents || 0}
              icon={<EventsIcon />}
              trend={stats?.trends.events}
            />
            <StatsCard
              title="Active Events"
              value={stats?.activeEvents || 0}
              icon={<ActiveEventsIcon />}
              trend={stats?.trends.activeEvents}
            />
            <StatsCard
              title="Tickets Sold"
              value={stats?.ticketsSold || 0}
              icon={<TicketsSoldIcon />}
              trend={stats?.trends.tickets}
            />
            <StatsCard
              title="Revenue"
              value={`KES ${stats?.revenue?.toLocaleString() || 0}`}
              icon={<RevenueIcon />}
              trend={stats?.trends.revenue}
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
              <DataTable
                data={events.slice(0, 5)}
                columns={eventColumns.slice(0, 4)}
                isLoading={isLoading}
                emptyMessage="No events found"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Ticket Sales</h3>
              <DataTable
                data={tickets.slice(0, 5)}
                columns={ticketColumns.slice(0, 4)}
                isLoading={isLoading}
                emptyMessage="No tickets sold yet"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">My Events</h2>
            <ActionButton
              onClick={() => setShowCreateForm(true)}
              variant="success"
              size="sm"
              icon={<PlusIcon />}
            >
              New Event
            </ActionButton>
          </div>
          <FilterBar
            filters={[
              {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { value: 'active', label: 'Active' },
                  { value: 'archived', label: 'Archived' }
                ],
                value: eventFilters.status,
                onChange: (value) => setEventFilters({ ...eventFilters, status: value })
              },
              {
                key: 'search',
                label: 'Search',
                type: 'text',
                placeholder: 'Search by title or venue...',
                value: eventFilters.search,
                onChange: (value) => setEventFilters({ ...eventFilters, search: value })
              }
            ]}
            onReset={() => setEventFilters({ status: '', search: '' })}
          />
          
          <DataTable
            data={filteredEvents}
            columns={eventColumns}
            isLoading={isLoading}
            emptyMessage="No events found"
          />
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <FilterBar
            filters={[
              {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { value: 'valid', label: 'Valid' },
                  { value: 'used', label: 'Used' },
                  { value: 'canceled', label: 'Canceled' }
                ],
                value: ticketFilters.status,
                onChange: (value) => setTicketFilters({ ...ticketFilters, status: value })
              },
              {
                key: 'eventId',
                label: 'Event',
                type: 'select',
                options: events.map(event => ({ value: event.id.toString(), label: event.title })),
                value: ticketFilters.eventId,
                onChange: (value) => setTicketFilters({ ...ticketFilters, eventId: value })
              },
              {
                key: 'search',
                label: 'Search',
                type: 'text',
                placeholder: 'Search by buyer name or email...',
                value: ticketFilters.search,
                onChange: (value) => setTicketFilters({ ...ticketFilters, search: value })
              }
            ]}
            onReset={() => setTicketFilters({ status: '', eventId: '', search: '' })}
          />
          
          <DataTable
            data={filteredTickets}
            columns={ticketColumns}
            isLoading={isLoading}
            emptyMessage="No tickets found"
          />
        </div>
      )}
    </DashboardLayout>

    {/* Create Event Modal */}
    {showCreateForm && (
      <div className={styles.modalOverlay}>
        <EventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setShowCreateForm(false)}
          isLoading={formLoading}
        />
      </div>
    )}

    {/* Edit Event Modal */}
    {showEditForm && selectedEvent && (
      <div className={styles.modalOverlay}>
        <EventForm
          initialData={{
            title: selectedEvent.title,
            description: selectedEvent.description,
            venue: selectedEvent.venue,
            location: selectedEvent.location,
            startDate: selectedEvent.startDate,
            endDate: selectedEvent.endDate,
            startTime: selectedEvent.startTime,
            endTime: selectedEvent.endTime,
            url: selectedEvent.url,
            images: selectedEvent.images || []
          }}
          onSubmit={handleEditEvent}
          onCancel={() => {
            setShowEditForm(false);
            setSelectedEvent(null);
          }}
          isLoading={formLoading}
          isEdit={true}
        />
      </div>
    )}

    {/* Event Detail Modal */}
    {showEventDetail && selectedEvent && (
      <EventDetailView
        event={selectedEvent}
        onEdit={() => {
          if (isEventUpcoming(selectedEvent)) {
            setShowEventDetail(false);
            setShowEditForm(true);
          } else {
            alert('Cannot edit past events. Only upcoming events can be modified.');
          }
        }}
        onArchive={() => {
          if (selectedEvent.status === 'active') {
            handleArchiveEvent(selectedEvent.id);
          } else if (selectedEvent.status === 'archived') {
            handleUnarchiveEvent(selectedEvent.id);
          }
          setShowEventDetail(false);
          setSelectedEvent(null);
        }}

        onClose={() => {
          setShowEventDetail(false);
          setSelectedEvent(null);
        }}
        canEdit={isEventUpcoming(selectedEvent)}
      />
    )}
  </>);
}

export default withOrganizerProtection(OrganizerDashboard);