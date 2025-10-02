'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { eventsAPI, ticketsAPI } from '../lib/api';
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ChartBarIcon,
  TicketIcon,
  PhoneIcon,
  EnvelopeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  organizerId: number;
  organizer?: {
    name: string;
    email: string;
  };
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'cancelled';
  createdAt: string;
  ticketsSold?: number;
  revenue?: number;
}

interface Ticket {
  id: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  ticketType: string;
  price: number;
  status: 'valid' | 'used' | 'canceled' | 'refunded';
  qrCode: string;
  createdAt: string;
  refundReason?: string;
}

interface EventStats {
  totalEvents: number;
  activeEvents: number;
  pendingEvents: number;
  archivedEvents: number;
  featuredEvents: number;
  totalRevenue: number;
  recentEvents: any[];
}

function EventStatsCards({ stats }: { stats: EventStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-blue-500">
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Events</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalEvents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-yellow-500">
            <ClockIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Pending Approval</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.pendingEvents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-green-500">
            <CheckCircleIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Published</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.activeEvents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-purple-500">
            <CurrencyDollarIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">KSh {stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsSidebar({ 
  events, 
  selectedEvent, 
  onEventSelect, 
  onBack,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange 
}: {
  events: Event[];
  selectedEvent: Event | null;
  onEventSelect: (eventId: number) => void;
  onBack: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-none">
      <div className="p-4 border-b border-gray-200">
        {selectedEvent ? (
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-3 p-1 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Events List</h2>
              <p className="text-sm text-gray-500">Viewing: {selectedEvent.title}</p>
            </div>
          </div>
        ) : (
          <h2 className="text-lg font-medium text-gray-900">All Events</h2>
        )}
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventSelect(event.id)}
            className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
              selectedEvent?.id === event.id 
                ? 'bg-indigo-50 border-indigo-200' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {event.location}
                </p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {new Date(event.startDate).toLocaleDateString()}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(event.status)}`}>
                    {event.status}
                  </span>
                  <div className="text-xs text-gray-500">
                    {event.ticketsSold || 0}/{event.capacity}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventDetailsMain({ 
  event, 
  tickets, 
  loading,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange 
}: {
  event: Event;
  tickets: Ticket[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = tickets.reduce((sum, ticket) => sum + Number(ticket.price), 0);
  const validTickets = tickets.filter(t => t.status === 'valid').length;
  const usedTickets = tickets.filter(t => t.status === 'used').length;
  const refundedTickets = tickets.filter(t => t.status === 'refunded').length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Event Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <div className="mt-2 flex items-center text-sm text-gray-500 space-x-6">
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {event.location}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                KSh {event.price}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Event ID</div>
            <div className="text-lg font-semibold text-gray-900">#{event.id}</div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="bg-gray-50 p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-blue-500">
                <TicketIcon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                <p className="text-xl font-semibold text-gray-900">{tickets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-green-500">
                <CheckCircleIcon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Valid Tickets</p>
                <p className="text-xl font-semibold text-gray-900">{validTickets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-purple-500">
                <CurrencyDollarIcon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="text-xl font-semibold text-gray-900">KSh {totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-yellow-500">
                <UserGroupIcon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Capacity</p>
                <p className="text-xl font-semibold text-gray-900">{tickets.length}/{event.capacity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets by buyer name, email, or type..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="valid">Valid</option>
              <option value="used">Used</option>
              <option value="canceled">Canceled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {tickets.length === 0 ? 'No tickets sold' : 'No tickets match your filters'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {tickets.length === 0 
                  ? 'No tickets have been purchased for this event yet.'
                  : 'Try adjusting your search criteria.'
                }
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <TicketIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {ticket.buyerName}
                            </h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <EnvelopeIcon className="h-4 w-4 mr-1" />
                              {ticket.buyerEmail}
                            </div>
                            <div className="flex items-center">
                              <PhoneIcon className="h-4 w-4 mr-1" />
                              {ticket.buyerPhone}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          KSh {Number(ticket.price).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ticket.ticketType}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {ticket.refundReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md">
                        <p className="text-sm text-red-800">
                          <strong>Refund Reason:</strong> {ticket.refundReason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventTable({ events, onEventAction }: { 
  events: Event[]; 
  onEventAction: (action: string, eventId: number) => void;
}) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organizer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      KSh {event.price}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{event.organizer?.name || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{event.organizer?.email || ''}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(event.status)}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(event.startDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(event.startDate).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {event.ticketsSold || 0}/{event.capacity}
                  </div>
                  <div className="text-sm text-gray-500">
                    KSh {(event.revenue || 0).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEventAction('view', event.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="View Event Tickets"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    {event.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onEventAction('approve', event.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEventAction('reject', event.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onEventAction('analytics', event.id)}
                      className="text-purple-600 hover:text-purple-900"
                      title="View Analytics"
                    >
                      <ChartBarIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Event details state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventTickets, setEventTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketSearchTerm, setTicketSearchTerm] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('all');
  
  // Admin sidebar state (moved to top level to avoid hooks order issues)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [eventsData, statsData] = await Promise.all([
          eventsAPI.getAllForAdmin(),
          eventsAPI.getStatistics(),
        ]);
        setEvents(eventsData);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleEventAction = async (action: string, eventId: number) => {
    try {
      switch (action) {
        case 'approve':
          await eventsAPI.approve(eventId);
          break;
        case 'reject':
          await eventsAPI.reject(eventId);
          break;
        case 'view':
          await handleSelectEvent(eventId);
          return;
        case 'analytics':
          // TODO: Navigate to event analytics page
          return;
      }

      // Reload data
      const updatedEvents = await eventsAPI.getAllForAdmin();
      setEvents(updatedEvents);
    } catch (err) {
      alert('Action failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleSelectEvent = async (eventId: number) => {
    try {
      setTicketsLoading(true);
      const event = events.find(e => e.id === eventId);
      if (!event) return;
      
      setSelectedEvent(event);
      
      const tickets = await ticketsAPI.getByEventId(eventId);
      setEventTickets(tickets);
    } catch (err) {
      alert('Failed to load tickets: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleBackToEventsList = () => {
    setSelectedEvent(null);
    setEventTickets([]);
    setTicketSearchTerm('');
    setTicketStatusFilter('all');
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.organizer?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout title="Event Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Event Management">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Events</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show sidebar layout only when an event is selected
  if (selectedEvent) {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Actual Admin Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Actual Admin Header */}
          <AdminHeader toggleSidebar={toggleSidebar} title="Event Management" />
          
          {/* Events Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Events Sidebar */}
            <EventsSidebar
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onEventSelect={handleSelectEvent}
              onBack={handleBackToEventsList}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />

            {/* Main Content - Event Details */}
            <EventDetailsMain
              event={selectedEvent}
              tickets={eventTickets}
              loading={ticketsLoading}
              searchTerm={ticketSearchTerm}
              onSearchChange={setTicketSearchTerm}
              statusFilter={ticketStatusFilter}
              onStatusFilterChange={setTicketStatusFilter}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default layout - original events management view
  return (
    <AdminLayout title="Event Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Events Management
            </h2>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && <EventStatsCards stats={stats} />}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Events Table */}
        <EventTable events={filteredEvents} onEventAction={handleEventAction} />

        {/* Recent Events */}
        {stats && stats.recentEvents && stats.recentEvents.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Events</h3>
            <div className="space-y-4">
              {stats.recentEvents.slice(0, 5).map((event: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">Status: {event.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{new Date(event.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Created</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}