'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { ticketsAPI } from '../lib/api';
import {
  TicketIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface Ticket {
  id: number;
  eventId: number;
  userId: number;
  ticketType: string;
  price: number;
  quantity: number;
  totalAmount: number;
  purchaseDate: string;
  status: 'active' | 'used' | 'refunded' | 'cancelled';
  refundRequested: boolean;
  refundReason?: string;
  refundAmount?: number;
  event?: {
    title: string;
    startDate: string;
  };
  user?: {
    name: string;
    email: string;
  };
}

interface TicketStats {
  totalTickets: number;
  totalRevenue: number;
  ticketsByStatus: Record<string, number>;
  ticketsByMonth: Record<string, number>;
  averageTicketPrice: number;
  topEvents: Array<{
    eventId: number;
    eventTitle: string;
    ticketsSold: number;
    revenue: number;
  }>;
}

interface RevenueReport {
  totalRevenue: number;
  paidRevenue: number;
  refundedAmount: number;
  ticketsSold: number;
  period: {
    start: string;
    end: string;
  };
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    tickets: number;
  }>;
}

function TicketStatsCards({ stats, revenueReport }: { stats: TicketStats; revenueReport: RevenueReport | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-blue-500">
            <TicketIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Tickets</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalTickets}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-green-500">
            <CheckCircleIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.ticketsByStatus.valid || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-red-500">
            <ExclamationTriangleIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Refund Requests</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.ticketsByStatus.refund_requested || 0}</p>
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

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-orange-500">
            <XMarkIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Refunded</p>
            <p className="text-2xl font-semibold text-gray-900">KSh {(revenueReport?.refundedAmount || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TicketTable({ tickets, onTicketAction }: { 
  tickets: Ticket[]; 
  onTicketAction: (action: string, ticketId: number) => void;
}) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-blue-100 text-blue-800';
      case 'refunded':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
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
                Ticket ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{ticket.id}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(ticket.purchaseDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                    {ticket.event?.title || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {ticket.event?.startDate ? new Date(ticket.event.startDate).toLocaleDateString() : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{ticket.buyerName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{ticket.buyerEmail || ''}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {ticket.ticketType}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    KSh {ticket.price?.toLocaleString() || '0'}
                  </div>
                  {ticket.refundReason && (
                    <div className="text-xs text-red-600 flex items-center mt-1">
                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                      Refund Requested
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onTicketAction('view', ticket.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    {ticket.refundReason && ticket.status === 'valid' && (
                      <>
                        <button
                          onClick={() => onTicketAction('approve-refund', ticket.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve Refund"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onTicketAction('reject-refund', ticket.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Reject Refund"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onTicketAction('download', ticket.id)}
                      className="text-purple-600 hover:text-purple-900"
                      title="Download Ticket"
                    >
                      <DocumentTextIcon className="h-4 w-4" />
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

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [revenueReport, setRevenueReport] = useState<RevenueReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refundFilter, setRefundFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [ticketsData, statsData, revenueData] = await Promise.all([
          ticketsAPI.getAllForAdmin(),
          ticketsAPI.getStatistics(),
          ticketsAPI.getRevenue(),
        ]);
        setTickets(ticketsData.tickets || []);
        setStats(statsData);
        setRevenueReport(revenueData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tickets data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleTicketAction = async (action: string, ticketId: number) => {
    try {
      switch (action) {
        case 'approve-refund':
          await ticketsAPI.approveRefund(ticketId);
          break;
        case 'reject-refund':
          await ticketsAPI.rejectRefund(ticketId);
          break;
        case 'download':
          // TODO: Implement ticket download
          return;
        case 'view':
          // TODO: Open ticket details modal
          return;
      }

      // Reload data
      const updatedTickets = await ticketsAPI.getAllForAdmin();
      setTickets(updatedTickets.tickets || []);
    } catch (err) {
      alert('Action failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.id.toString().includes(searchTerm) ||
      (ticket.event?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.buyerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.buyerEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    const matchesRefund = refundFilter === 'all' || 
      (refundFilter === 'requested' && ticket.refundReason) ||
      (refundFilter === 'none' && !ticket.refundReason);
    
    return matchesSearch && matchesStatus && matchesRefund;
  });

  if (loading) {
    return (
      <AdminLayout title="Ticket Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Ticket Management">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Tickets</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Ticket Management">
      <div className="space-y-6">
        {/* Stats */}
        {stats && <TicketStatsCards stats={stats} revenueReport={revenueReport} />}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
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
              <option value="active">Active</option>
              <option value="used">Used</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={refundFilter}
              onChange={(e) => setRefundFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Refunds</option>
              <option value="requested">Refund Requested</option>
              <option value="none">No Refund</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <TicketTable tickets={filteredTickets} onTicketAction={handleTicketAction} />

        {/* Revenue by Event */}
        {stats && stats.topEvents.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Event</h3>
            <div className="space-y-4">
              {stats.topEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{event.eventTitle}</p>
                    <p className="text-sm text-gray-500">{event.ticketsSold} tickets sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">KSh {event.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Revenue</p>
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