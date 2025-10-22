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
import { marketingService } from '../../services/marketingService';
import EventForm, { EventFormData } from '../../components/events/EventForm';
// import EventDetailView from '../../components/events/EventDetailView';
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

const MagnifyingGlassIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
  </svg>
);

const CurrencyDollarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.467-.22-2.121-.659-1.172-.879-1.172-2.303 0-3.182C10.536 7.22 11.268 7 12 7c.732 0 1.464.22 2.121.659l.879-.659m0 0L18 4.5m-6 0L6 4.5" />
  </svg>
);

const TicketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const UserGroupIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

// Events Sidebar Component
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
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full lg:w-80 bg-gray-800 flex flex-col lg:h-full shadow-lg max-h-96 lg:max-h-none">
      <div className="p-3 lg:p-4 border-b border-gray-700">
        {selectedEvent ? (
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-3 p-1 text-gray-400 hover:text-white lg:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-medium text-white">Events List</h2>
              <p className="text-sm text-gray-400 truncate">Viewing: {selectedEvent.title}</p>
            </div>
          </div>
        ) : (
          <h2 className="text-lg font-medium text-white">My Events</h2>
        )}
      </div>

      <div className="p-3 lg:p-4 border-b border-gray-700">
        <div className="relative mb-3 lg:mb-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 text-sm"
          />
          <div className="absolute left-3 top-3">
            <MagnifyingGlassIcon />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventSelect(event.id)}
            className={`p-3 lg:p-4 border-b border-gray-700 cursor-pointer transition-colors ${
              selectedEvent?.id === event.id 
                ? 'bg-blue-900 border-blue-600' 
                : 'hover:bg-gray-700'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-medium text-white truncate flex-1 mr-2">
                  {event.title}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusBadgeColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs lg:text-sm text-gray-400 flex items-center">
                  <MapPinIcon />
                  <span className="ml-1 truncate">{event.venue}</span>
                </p>
                <p className="text-xs lg:text-sm text-gray-400 flex items-center">
                  <CalendarIcon />
                  <span className="ml-1">{new Date(event.startDate).toLocaleDateString()}</span>
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-gray-400">
                  KES {(event.ticketPrice || 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  ID: {event.id}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Event Details Main Component
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

  const totalRevenue = tickets.reduce((sum, ticket) => sum + Number(ticket.price || 0), 0);
  const validTickets = tickets.filter(t => t.status === 'valid').length;
  const usedTickets = tickets.filter(t => t.status === 'used').length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-900 min-h-0">
      {/* Event Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-3 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-3 lg:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg lg:text-2xl font-bold text-white break-words">{event.title}</h1>
            <div className="mt-2 space-y-2 lg:space-y-0 lg:flex lg:items-center lg:space-x-6">
              <div className="flex items-center text-xs lg:text-sm text-gray-400">
                <MapPinIcon />
                <span className="ml-1 truncate">{event.venue}, {event.location}</span>
              </div>
              <div className="flex items-center text-xs lg:text-sm text-gray-400">
                <CalendarIcon />
                <span className="ml-1">{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-xs lg:text-sm text-gray-400">
                <CurrencyDollarIcon />
                <span className="ml-1">KES {(event.ticketPrice || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="text-left lg:text-right">
            <div className="text-xs lg:text-sm text-gray-400">Event ID</div>
            <div className="text-base lg:text-lg font-semibold text-white">#{event.id}</div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="bg-gray-800 p-3 lg:p-6 border-b border-gray-700">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6">
          <div className="bg-gray-700 rounded-lg shadow p-2 lg:p-4">
            <div className="flex items-center">
              <div className="p-1 lg:p-2 rounded-md bg-blue-500 flex-shrink-0">
                <TicketIcon />
              </div>
              <div className="ml-2 lg:ml-3 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-400">Total Tickets</p>
                <p className="text-sm lg:text-xl font-semibold text-white">{tickets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg shadow p-2 lg:p-4">
            <div className="flex items-center">
              <div className="p-1 lg:p-2 rounded-md bg-green-500 flex-shrink-0">
                <CheckCircleIcon />
              </div>
              <div className="ml-2 lg:ml-3 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-400">Valid Tickets</p>
                <p className="text-sm lg:text-xl font-semibold text-white">{validTickets}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg shadow p-2 lg:p-4">
            <div className="flex items-center">
              <div className="p-1 lg:p-2 rounded-md bg-purple-500 flex-shrink-0">
                <CurrencyDollarIcon />
              </div>
              <div className="ml-2 lg:ml-3 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-400">Revenue</p>
                <p className="text-xs lg:text-xl font-semibold text-white">KES {totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg shadow p-2 lg:p-4">
            <div className="flex items-center">
              <div className="p-1 lg:p-2 rounded-md bg-yellow-500 flex-shrink-0">
                <UserGroupIcon />
              </div>
              <div className="ml-2 lg:ml-3 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-400">Used Tickets</p>
                <p className="text-sm lg:text-xl font-semibold text-white">{usedTickets}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-3 lg:p-6 border-b border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tickets by buyer name, email, or type..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 text-sm lg:text-base"
              />
              <div className="absolute left-3 top-3">
                <MagnifyingGlassIcon />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white text-sm lg:text-base"
            >
              <option value="all">All Status</option>
              <option value="valid">Valid</option>
              <option value="used">Used</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="flex-1 overflow-auto bg-gray-800 min-h-0">
        <div className="p-3 lg:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block bg-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Buyer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Purchase Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-600">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{ticket.buyerName}</div>
                          <div className="text-sm text-gray-400">{ticket.buyerEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {ticket.ticketType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          KES {(ticket.price || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTickets.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No tickets found
                  </div>
                )}
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">{ticket.buyerName}</h3>
                        <p className="text-gray-400 text-xs">{ticket.buyerEmail}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Type:</span>
                        <span className="text-white text-xs">{ticket.ticketType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Price:</span>
                        <span className="text-white text-xs font-medium">
                          KES {(ticket.price || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Purchase Date:</span>
                        <span className="text-white text-xs">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTickets.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No tickets found
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function OrganizerDashboard() {
  const { user, logout, refreshProfile, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<OrganizerStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'tickets' | 'marketing'>('overview');
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventTickets, setEventTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketSearchTerm, setTicketSearchTerm] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('all');
  const [formLoading, setFormLoading] = useState(false);

  // Marketing module state
  const [marketingFilters, setMarketingFilters] = useState({
    eventId: '',
    search: ''
  });
  const [selectedMarketingEvent, setSelectedMarketingEvent] = useState<Event | null>(null);
  const [marketingCustomers, setMarketingCustomers] = useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [marketingMessage, setMarketingMessage] = useState({
    subject: '',
    message: '',
    type: 'email' as 'email' | 'sms'
  });
  const [sendingMarketing, setSendingMarketing] = useState(false);
  const [marketingTab, setMarketingTab] = useState<'event-specific' | 'broadcast'>('event-specific');

  // Broadcast marketing state
  const [broadcastCustomers, setBroadcastCustomers] = useState<any[]>([]);
  const [selectedBroadcastCustomers, setSelectedBroadcastCustomers] = useState<string[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState({
    subject: '',
    message: '',
    type: 'email' as 'email' | 'sms'
  });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastMode, setBroadcastMode] = useState<'all' | 'selected'>('all');

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
        .reduce((acc, ticket) => acc + Number(ticket.price || 0), 0);
      
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

  // Redirect to overview if user doesn't have marketing access and is on marketing tab
  useEffect(() => {
    if (activeTab === 'marketing' && !user?.marketingAccess) {
      setActiveTab('overview');
    }
  }, [activeTab, user?.marketingAccess]);

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
      console.log('🔄 Updating event:', selectedEvent.id, eventData);
      
      // Convert EventFormData to CreateEventData by ensuring images are File[] or undefined
      const updateEventData: CreateEventData = {
        ...eventData,
        images: Array.isArray(eventData.images) && eventData.images.every(img => img instanceof File) 
          ? eventData.images as File[] 
          : undefined
      };
      
      console.log('📤 Sending update data:', updateEventData);
      const result = await eventService.updateEvent(selectedEvent.id, updateEventData);
      console.log('✅ Update successful:', result);
      
      await loadEvents(); // Refresh events list
      setShowEditForm(false);
      setSelectedEvent(null);
      alert('Event updated successfully!');
    } catch (error) {
      console.error('❌ Failed to update event - Full error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        eventId: selectedEvent.id,
        eventData
      });
      alert(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewEvent = async (event: Event) => {
    setSelectedEvent(event);
    await loadEventTickets(event.id);
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
      // Clear selection if the deleted event was selected
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
        setEventTickets([]);
      }
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  // New handlers for event sidebar and details
  const handleSelectEvent = async (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      await loadEventTickets(eventId);
    }
  };

  const handleBackToEventsList = () => {
    setSelectedEvent(null);
    setEventTickets([]);
    setTicketSearchTerm('');
    setTicketStatusFilter('all');
  };

  const loadEventTickets = async (eventId: number) => {
    try {
      setTicketsLoading(true);
      const tickets = await ticketService.getTicketsForEvent(eventId);
      setEventTickets(tickets);
    } catch (error) {
      console.error('Failed to load event tickets:', error);
      setEventTickets([]);
    } finally {
      setTicketsLoading(false);
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

  // Marketing functions
  const loadMarketingCustomers = async (eventId: number) => {
    try {
      const eventTickets = await ticketService.getTicketsForEvent(eventId);
      
      // Extract unique customers from tickets
      const uniqueCustomers = eventTickets.reduce((acc: any[], ticket: any) => {
        const existingCustomer = acc.find(c => c.email === ticket.buyerEmail);
        if (!existingCustomer) {
          acc.push({
            id: ticket.id, // Use ticket ID for backend API
            name: ticket.buyerName,
            email: ticket.buyerEmail,
            phone: ticket.buyerPhone || 'N/A',
            ticketCount: 1,
            totalSpent: Number(ticket.price || 0),
            ticketIds: [ticket.id] // Keep track of all ticket IDs for this customer
          });
        } else {
          existingCustomer.ticketCount += 1;
          existingCustomer.totalSpent += Number(ticket.price || 0);
          existingCustomer.ticketIds.push(ticket.id);
        }
        return acc;
      }, []);
      
      setMarketingCustomers(uniqueCustomers);
    } catch (error) {
      console.error('Failed to load marketing customers:', error);
      setMarketingCustomers([]);
    }
  };

  const handleSelectMarketingEvent = async (event: Event) => {
    setSelectedMarketingEvent(event);
    setMarketingFilters({ ...marketingFilters, eventId: event.id.toString() });
    await loadMarketingCustomers(event.id);
    setSelectedCustomers([]); // Reset selection
  };

  const handleSelectAllCustomers = () => {
    if (selectedCustomers.length === filteredMarketingCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredMarketingCustomers.map(c => c.id));
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSendMarketing = async () => {
    if (selectedCustomers.length === 0) {
      alert('Please select at least one customer');
      return;
    }

    if (!marketingMessage.message.trim()) {
      alert('Please enter a message');
      return;
    }

    if (marketingMessage.type === 'email' && !marketingMessage.subject.trim()) {
      alert('Please enter an email subject');
      return;
    }

    try {
      setSendingMarketing(true);
      
      // Get all ticket IDs for selected customers
      const selectedCustomerIds = marketingCustomers
        .filter(c => selectedCustomers.includes(c.id))
        .flatMap(c => c.ticketIds || [c.id]); // Use ticketIds array or fallback to the main ID

      if (!selectedMarketingEvent) {
        alert('Please select an event first');
        return;
      }

      const payload = {
        eventId: selectedMarketingEvent.id,
        customerIds: selectedCustomerIds,
        messageType: marketingMessage.type as 'email' | 'sms',
        subject: marketingMessage.type === 'email' ? marketingMessage.subject : undefined,
        message: marketingMessage.message,
      };

      const result = await marketingService.sendMarketingMessage(payload);

      // Show detailed results
      const successMessage = `${marketingMessage.type.toUpperCase()} campaign completed!\n\nResults:\n- Total: ${result.summary.total}\n- Sent: ${result.summary.sent}\n- Failed: ${result.summary.failed}`;
      
      if (result.summary.failed > 0) {
        const failedDetails = result.results
          .filter(r => r.status === 'failed')
          .map(r => `${r.customer}: ${r.reason}`)
          .join('\n');
        alert(`${successMessage}\n\nFailed messages:\n${failedDetails}`);
      } else {
        alert(successMessage);
      }
      
      // Reset form
      setMarketingMessage({ subject: '', message: '', type: 'email' });
      setSelectedCustomers([]);
      
    } catch (error) {
      console.error('Failed to send marketing message:', error);
      alert(`Failed to send marketing message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSendingMarketing(false);
    }
  };

  // Broadcast marketing functions
  const loadBroadcastCustomers = async () => {
    try {
      const customers = await marketingService.getAllCustomers();
      setBroadcastCustomers(customers);
    } catch (error) {
      console.error('Failed to load broadcast customers:', error);
      setBroadcastCustomers([]);
    }
  };

  const handleSelectAllBroadcastCustomers = () => {
    if (selectedBroadcastCustomers.length === filteredBroadcastCustomers.length) {
      setSelectedBroadcastCustomers([]);
    } else {
      setSelectedBroadcastCustomers(filteredBroadcastCustomers.map(c => c.id));
    }
  };

  const sendBroadcastMessage = async () => {
    if (!broadcastMessage.message.trim()) {
      alert('Please enter a message');
      return;
    }

    if (broadcastMessage.type === 'email' && !broadcastMessage.subject.trim()) {
      alert('Please enter an email subject');
      return;
    }

    if (broadcastMode === 'selected' && selectedBroadcastCustomers.length === 0) {
      alert('Please select at least one customer');
      return;
    }

    try {
      setSendingBroadcast(true);
      
      // Get all ticket IDs for selected customers (or all customers if mode is 'all')
      let customerIds: number[] = [];
      
      if (broadcastMode === 'all') {
        customerIds = []; // Empty array means send to all
      } else {
        customerIds = broadcastCustomers
          .filter(c => selectedBroadcastCustomers.includes(c.id))
          .flatMap(c => c.ticketIds || [c.id]);
      }

      const payload = {
        messageType: broadcastMessage.type as 'email' | 'sms',
        subject: broadcastMessage.type === 'email' ? broadcastMessage.subject : undefined,
        message: broadcastMessage.message,
        customerIds: customerIds.length > 0 ? customerIds : undefined,
      };

      const result = await marketingService.sendBroadcastMessage(payload);

      // Show detailed results
      const successMessage = `${broadcastMessage.type.toUpperCase()} broadcast completed!\n\nResults:\n- Total: ${result.summary.total}\n- Sent: ${result.summary.sent}\n- Failed: ${result.summary.failed}`;
      
      if (result.summary.failed > 0) {
        const failedDetails = result.results
          .filter(r => r.status === 'failed')
          .map(r => `${r.customer}: ${r.reason}`)
          .join('\n');
        alert(`${successMessage}\n\nFailed messages:\n${failedDetails}`);
      } else {
        alert(successMessage);
      }
      
      // Reset form
      setBroadcastMessage({ subject: '', message: '', type: 'email' });
      setSelectedBroadcastCustomers([]);
      
    } catch (error) {
      console.error('Failed to send broadcast message:', error);
      alert(`Failed to send broadcast message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSendingBroadcast(false);
    }
  };

  const filteredBroadcastCustomers = broadcastCustomers.filter(customer => {
    return customer.name.toLowerCase().includes('') ||
      customer.email.toLowerCase().includes('');
  });

  const filteredMarketingCustomers = marketingCustomers.filter(customer => {
    return !marketingFilters.search || 
      customer.name.toLowerCase().includes(marketingFilters.search.toLowerCase()) ||
      customer.email.toLowerCase().includes(marketingFilters.search.toLowerCase());
  });

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
    { key: 'title' as keyof Event, header: 'Event Title', mobileLabel: 'Title' },
    { key: 'venue' as keyof Event, header: 'Venue', mobileLabel: 'Venue' },
    { key: 'startDate' as keyof Event, header: 'Date', mobileLabel: 'Date', render: (event: Event) => 
      new Date(event.startDate).toLocaleDateString() 
    },
    { key: 'ticketPrice' as keyof Event, header: 'Ticket Price', mobileLabel: 'Price', render: (event: Event) => 
      `KSH ${(event.ticketPrice || 0).toLocaleString()}` 
    },
    { key: 'status' as keyof Event, header: 'Status', mobileLabel: 'Status', render: (event: Event) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {event.status}
      </span>
    )},
    { key: 'actions' as keyof Event, header: 'Actions', mobileLabel: 'Actions', className: 'min-w-[280px]', render: (event: Event) => (
      <div className="flex flex-wrap gap-1">
        <ActionButton
          onClick={() => handleViewEvent(event)}
          variant="secondary"
          size="sm"
          icon={<ViewIcon />}
        >
          Analytics
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
    { key: 'event' as keyof Ticket, header: 'Event', mobileLabel: 'Event', render: (ticket: Ticket) => ticket.event?.title || 'Unknown Event' },
    { key: 'buyerName' as keyof Ticket, header: 'Buyer Name', mobileLabel: 'Buyer' },
    { key: 'buyerEmail' as keyof Ticket, header: 'Email', mobileLabel: 'Email' },
    { key: 'ticketType' as keyof Ticket, header: 'Type', mobileLabel: 'Type' },
    { key: 'price' as keyof Ticket, header: 'Price', mobileLabel: 'Price', render: (ticket: Ticket) => `KES ${(ticket.price || 0).toLocaleString()}` },
    { key: 'status' as keyof Ticket, header: 'Status', mobileLabel: 'Status', render: (ticket: Ticket) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        ticket.status === 'valid' ? 'bg-green-100 text-green-800' :
        ticket.status === 'used' ? 'bg-blue-100 text-blue-800' :
        'bg-red-100 text-red-800'
      }`}>
        {ticket.status}
      </span>
    )},
    { key: 'createdAt' as keyof Ticket, header: 'Purchase Date', mobileLabel: 'Date', render: (ticket: Ticket) => 
      new Date(ticket.createdAt).toLocaleDateString() 
    },
    { key: 'actions' as keyof Ticket, header: 'Actions', mobileLabel: 'Actions', render: (ticket: Ticket) => (
      <div className="flex flex-wrap gap-1">
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
        },
        // Only show marketing tab if user has marketing access permission
        ...(user.marketingAccess ? [{
          key: 'marketing',
          label: 'Marketing',
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>,
          active: activeTab === 'marketing',
          onClick: () => setActiveTab('marketing')
        }] : [])
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
        <div className="space-y-4 lg:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
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
              value={`KES ${(stats?.revenue || 0).toLocaleString()}`}
              icon={<RevenueIcon />}
              trend={stats?.trends.revenue}
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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

      {activeTab === 'events' && !selectedEvent && (
        <div className="space-y-4 lg:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-white">My Events</h2>
            <ActionButton
              onClick={() => setShowCreateForm(true)}
              variant="success"
              size="sm"
              icon={<PlusIcon />}
              className="w-full sm:w-auto"
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

      {activeTab === 'events' && selectedEvent && (
        <div className="flex flex-col lg:flex-row h-full">
          {/* Mobile header for selected event */}
          <div className="lg:hidden bg-gray-800 border-b border-gray-700 p-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{selectedEvent.title}</h2>
                <p className="text-sm text-gray-400">Event Details & Analytics</p>
              </div>
              <button
                onClick={handleBackToEventsList}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
              >
                Back to List
              </button>
            </div>
          </div>
          
          {/* Events Sidebar - Hidden on mobile when event is selected */}
          <div className="hidden lg:block">
            <EventsSidebar
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onEventSelect={handleSelectEvent}
              onBack={handleBackToEventsList}
              searchTerm={eventFilters.search}
              onSearchChange={(term) => setEventFilters({ ...eventFilters, search: term })}
              statusFilter={eventFilters.status || 'all'}
              onStatusFilterChange={(status) => setEventFilters({ ...eventFilters, status: status === 'all' ? '' : status })}
            />
          </div>

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
      )}

      {activeTab === 'tickets' && (
        <div className="space-y-4 lg:space-y-6">
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

      {activeTab === 'marketing' && (
        <div className="space-y-4 lg:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Marketing Center</h2>
              <p className="text-sm text-gray-400">Send targeted emails and SMS to your event customers</p>
            </div>
          </div>

          {/* Marketing Tab Navigation */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setMarketingTab('event-specific')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  marketingTab === 'event-specific'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Event Marketing</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setMarketingTab('broadcast');
                  loadBroadcastCustomers();
                }}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  marketingTab === 'broadcast'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <span>Broadcast</span>
                </div>
              </button>
            </div>
          </div>

          {/* Event-Specific Marketing */}
          {marketingTab === 'event-specific' && (
            <>
              {!selectedMarketingEvent ? (
                // Event Selection View
                <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Select an Event</h3>
                  <p className="text-sm text-gray-400 mb-6">Choose an event to view its customers and send marketing messages</p>
                  
                  <div className="grid gap-4">
                    {events.filter(e => e.status === 'active').map((event) => (
                      <div
                        key={event.id}
                        onClick={() => handleSelectMarketingEvent(event)}
                        className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors border border-gray-600"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{event.title}</h4>
                            <p className="text-sm text-gray-400 mt-1">{event.venue}, {event.location}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {event.status}
                            </span>
                            <p className="text-sm text-gray-400 mt-1">
                              KES {(event.ticketPrice || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {events.filter(e => e.status === 'active').length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <p>No active events found.</p>
                        <p className="text-sm mt-2">Create an active event to start marketing to customers.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Marketing Interface
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Customer Selection */}
                  <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Customers for {selectedMarketingEvent.title}</h3>
                        <p className="text-sm text-gray-400">{marketingCustomers.length} total customers</p>
                      </div>
                      <button
                        onClick={() => setSelectedMarketingEvent(null)}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
                      >
                        Change Event
                      </button>
                    </div>

                    {/* Customer Search */}
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Search customers..."
                        value={marketingFilters.search}
                        onChange={(e) => setMarketingFilters({ ...marketingFilters, search: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 text-sm"
                      />
                    </div>

                    {/* Select All */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-700 rounded-lg">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.length === filteredMarketingCustomers.length && filteredMarketingCustomers.length > 0}
                          onChange={handleSelectAllCustomers}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          aria-label="Select all customers"
                        />
                        <span className="text-white text-sm">Select All ({filteredMarketingCustomers.length})</span>
                      </label>
                      <span className="text-xs text-gray-400">{selectedCustomers.length} selected</span>
                    </div>

                    {/* Customer List */}
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {filteredMarketingCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <label className="flex items-center w-full">
                            <input
                              type="checkbox"
                              checked={selectedCustomers.includes(customer.id)}
                              onChange={() => handleSelectCustomer(customer.id)}
                              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              aria-label={`Select ${customer.name}`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">{customer.name}</p>
                              <p className="text-sm text-gray-400 truncate">{customer.email}</p>
                              <p className="text-xs text-gray-500">
                                {customer.ticketCount} tickets • KES {customer.totalSpent.toLocaleString()}
                              </p>
                            </div>
                          </label>
                        </div>
                      ))}

                      {filteredMarketingCustomers.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <p>No customers found for this event.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Composer */}
                  <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Compose Message</h3>

                    {/* Message Type */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Message Type</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="email"
                            checked={marketingMessage.type === 'email'}
                            onChange={(e) => setMarketingMessage({ ...marketingMessage, type: e.target.value as 'email' | 'sms' })}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-white">Email</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="sms"
                            checked={marketingMessage.type === 'sms'}
                            onChange={(e) => setMarketingMessage({ ...marketingMessage, type: e.target.value as 'email' | 'sms' })}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-white">SMS</span>
                        </label>
                      </div>
                    </div>

                    {/* Subject (Email only) */}
                    {marketingMessage.type === 'email' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                        <input
                          type="text"
                          value={marketingMessage.subject}
                          onChange={(e) => setMarketingMessage({ ...marketingMessage, subject: e.target.value })}
                          placeholder="Enter email subject..."
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                        />
                      </div>
                    )}

                    {/* Message */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Message {marketingMessage.type === 'sms' && '(160 characters max)'}
                      </label>
                      <textarea
                        value={marketingMessage.message}
                        onChange={(e) => setMarketingMessage({ ...marketingMessage, message: e.target.value })}
                        placeholder={`Enter your ${marketingMessage.type} message...`}
                        maxLength={marketingMessage.type === 'sms' ? 160 : undefined}
                        rows={marketingMessage.type === 'sms' ? 3 : 6}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 resize-none"
                      />
                      {marketingMessage.type === 'sms' && (
                        <p className="text-xs text-gray-500 mt-1">
                          {marketingMessage.message.length}/160 characters
                        </p>
                      )}
                    </div>

                    {/* Send Button */}
                    <div className="flex flex-col space-y-3">
                      <button
                        onClick={handleSendMarketing}
                        disabled={sendingMarketing || selectedCustomers.length === 0 || !marketingMessage.message.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                      >
                        {sendingMarketing ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </div>
                        ) : (
                          `Send ${marketingMessage.type.toUpperCase()} to ${selectedCustomers.length} customers`
                        )}
                      </button>
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-400">
                          {selectedCustomers.length} of {filteredMarketingCustomers.length} customers selected
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Broadcast Marketing */}
          {marketingTab === 'broadcast' && (
            <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Broadcast Center</h3>
                  <p className="text-sm text-gray-400">Send messages to all your customers across all events</p>
                </div>
              </div>

              {/* Broadcast Mode Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Broadcast Mode
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="broadcastMode"
                      value="all"
                      checked={broadcastMode === 'all'}
                      onChange={(e) => setBroadcastMode(e.target.value as 'all' | 'selected')}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-white">All customers</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="broadcastMode"
                      value="selected"
                      checked={broadcastMode === 'selected'}
                      onChange={(e) => setBroadcastMode(e.target.value as 'all' | 'selected')}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-white">Selected customers</span>
                  </label>
                </div>
              </div>

              {/* Customer List (only show if selected mode) */}
              {broadcastMode === 'selected' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-white">Your Customers</h4>
                    <button
                      onClick={handleSelectAllBroadcastCustomers}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
                    >
                      {selectedBroadcastCustomers.length === filteredBroadcastCustomers.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                    {filteredBroadcastCustomers.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No customers found</p>
                    ) : (
                      <div className="space-y-2">
                        {filteredBroadcastCustomers.map((customer) => (
                          <label key={customer.id} className="flex items-center p-2 hover:bg-gray-600 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedBroadcastCustomers.includes(customer.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBroadcastCustomers([...selectedBroadcastCustomers, customer.id]);
                                } else {
                                  setSelectedBroadcastCustomers(selectedBroadcastCustomers.filter(id => id !== customer.id));
                                }
                              }}
                              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                              aria-label={`Select customer ${customer.name}`}
                            />
                            <div className="flex-1">
                              <div className="font-medium text-white">{customer.name}</div>
                              <div className="text-sm text-gray-400">{customer.email}</div>
                              <div className="text-xs text-gray-500">
                                {customer.ticketCount} tickets • KES {customer.totalSpent.toLocaleString()}
                                {customer.events && customer.events.length > 0 && (
                                  <span> • Events: {customer.events.slice(0, 2).join(', ')}{customer.events.length > 2 ? '...' : ''}</span>
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Message Composition */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Message Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="broadcastType"
                        value="email"
                        checked={broadcastMessage.type === 'email'}
                        onChange={(e) => setBroadcastMessage({ ...broadcastMessage, type: e.target.value as 'email' | 'sms' })}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-white">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="broadcastType"
                        value="sms"
                        checked={broadcastMessage.type === 'sms'}
                        onChange={(e) => setBroadcastMessage({ ...broadcastMessage, type: e.target.value as 'email' | 'sms' })}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-white">SMS</span>
                    </label>
                  </div>
                </div>

                {broadcastMessage.type === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="broadcastSubject">
                      Email Subject
                    </label>
                    <input
                      id="broadcastSubject"
                      type="text"
                      value={broadcastMessage.subject}
                      onChange={(e) => setBroadcastMessage({ ...broadcastMessage, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email subject"
                      required
                      aria-describedby="broadcastSubjectHelp"
                    />
                    <p id="broadcastSubjectHelp" className="text-xs text-gray-500 mt-1">Required for email messages</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="broadcastMessage">
                    Message
                  </label>
                  <textarea
                    id="broadcastMessage"
                    value={broadcastMessage.message}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, message: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500 h-24"
                    placeholder={`Enter your ${broadcastMessage.type} message...`}
                    required
                    aria-describedby="broadcastMessageHelp"
                  />
                  <p id="broadcastMessageHelp" className="text-xs text-gray-500 mt-1">
                    This message will be sent to {broadcastMode === 'all' ? 'all your customers' : `${selectedBroadcastCustomers.length} selected customers`}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    {broadcastMode === 'all' ? (
                      `Will send to all ${broadcastCustomers.length} customers`
                    ) : (
                      `Will send to ${selectedBroadcastCustomers.length} selected customers`
                    )}
                  </div>
                  <button
                    onClick={sendBroadcastMessage}
                    disabled={sendingBroadcast || 
                      !broadcastMessage.message.trim() || 
                      (broadcastMessage.type === 'email' && !broadcastMessage.subject.trim()) ||
                      (broadcastMode === 'selected' && selectedBroadcastCustomers.length === 0)
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {sendingBroadcast ? 'Sending...' : `Send ${broadcastMessage.type.toUpperCase()} Broadcast`}
                  </button>
                </div>
              </div>
            </div>
          )}
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
            images: selectedEvent.images || [],
            // Add the missing price fields
            regularPrice: selectedEvent.regularPrice,
            earlybirdPrice: selectedEvent.earlybirdPrice,
            vipPrice: selectedEvent.vipPrice,
            vvipPrice: selectedEvent.vvipPrice,
            atTheGatePrice: selectedEvent.atTheGatePrice,
            ticketPrice: selectedEvent.ticketPrice || selectedEvent.regularPrice
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
  </>);
}

export default withOrganizerProtection(OrganizerDashboard);