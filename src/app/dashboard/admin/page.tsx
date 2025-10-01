'use client';

import React, { useEffect, useState } from 'react';
import { withAdminProtection } from '../../components/auth/withRoleProtection';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import DataTable from '../../components/dashboard/DataTable';
import ActionButton from '../../components/dashboard/ActionButton';
import FilterBar from '../../components/dashboard/FilterBar';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';

// Icons
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);
const EventsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);
const TicketsIcon = () => (
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
const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: number;
  title: string;
  organizer: { name: string };
  venue: string;
  startDate: string;
  status: string;
}

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalTickets: number;
  totalRevenue: number;
  trends: {
    users: { value: number; isPositive: boolean };
    events: { value: number; isPositive: boolean };
    tickets: { value: number; isPositive: boolean };
    revenue: { value: number; isPositive: boolean };
  };
}

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events'>('overview');
  const [userFilters, setUserFilters] = useState({
    role: '',
    search: ''
  });
  const [eventFilters, setEventFilters] = useState({
    status: '',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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

  // Get all tickets for admin (fetch tickets for all events)
  const getAllTickets = async () => {
    try {
      const eventsData = await apiCall('/events');
      const ticketPromises = eventsData.map((event: any) => 
        ticketService.getTicketsForEvent(event.id).catch(() => []) // Return empty array if fails
      );
      const ticketArrays = await Promise.all(ticketPromises);
      return ticketArrays.flat();
    } catch (error) {
      console.error('Error fetching all tickets:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Load data with individual error handling
        let usersData = [];
        let eventsData = [];
        let allTickets = [];
        
        try {
          usersData = await apiCall('/users');
          setUsers(usersData);
        } catch (error) {
          console.warn('Failed to load users:', error);
          setUsers([]);
        }

        try {
          eventsData = await apiCall('/events');
          setEvents(eventsData);
        } catch (error) {
          console.warn('Failed to load events:', error);
          setEvents([]);
        }

        try {
          allTickets = await getAllTickets();
        } catch (error) {
          console.warn('Failed to load tickets:', error);
          allTickets = [];
        }
        
        // Calculate real stats from available data
        const totalTickets = allTickets.length;
        const validTickets = allTickets.filter(t => t.status !== 'canceled');
        const totalRevenue = validTickets.reduce((acc, ticket) => acc + ticket.price, 0);

        const realStats: DashboardStats = {
          totalUsers: usersData.length,
          totalEvents: eventsData.length,
          totalTickets: totalTickets,
          totalRevenue: totalRevenue,
          trends: {
            users: { value: 12, isPositive: true },
            events: { value: 8, isPositive: true },
            tickets: { value: 15, isPositive: true },
            revenue: { value: 22, isPositive: true }
          }
        };
        setStats(realStats);
      } catch (error) {
        console.error('Critical error in loadDashboardData:', error);
        // Set empty data on critical error
        setUsers([]);
        setEvents([]);
        setStats({
          totalUsers: 0,
          totalEvents: 0,
          totalTickets: 0,
          totalRevenue: 0,
          trends: {
            users: { value: 0, isPositive: false },
            events: { value: 0, isPositive: false },
            tickets: { value: 0, isPositive: false },
            revenue: { value: 0, isPositive: false }
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await apiCall(`/users/${userId}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const filteredUsers = users.filter(user => {
    return (
      (!userFilters.role || user.role === userFilters.role) &&
      (!userFilters.search || 
        user.name.toLowerCase().includes(userFilters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(userFilters.search.toLowerCase())
      )
    );
  });

  const filteredEvents = events.filter(event => {
    return (
      (!eventFilters.status || event.status === eventFilters.status) &&
      (!eventFilters.search || 
        event.title.toLowerCase().includes(eventFilters.search.toLowerCase()) ||
        event.organizer.name.toLowerCase().includes(eventFilters.search.toLowerCase())
      )
    );
  });

  const userColumns = [
    { key: 'name' as keyof User, header: 'Name' },
    { key: 'email' as keyof User, header: 'Email' },
    { key: 'role' as keyof User, header: 'Role', render: (user: User) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {user.role === 'admin' ? 'Admin' : 'Organizer'}
      </span>
    )},
    { key: 'createdAt' as keyof User, header: 'Joined', render: (user: User) => 
      new Date(user.createdAt).toLocaleDateString() 
    },
    { key: 'id' as keyof User, header: 'Actions', render: (user: User) => (
      <div className="flex space-x-2">
        <ActionButton
          onClick={() => console.log('Edit user:', user.id)}
          variant="secondary"
          size="sm"
          icon={<EditIcon />}
        >
          Edit
        </ActionButton>
        <ActionButton
          onClick={() => handleDeleteUser(user.id)}
          variant="danger"
          size="sm"
          icon={<DeleteIcon />}
        >
          Delete
        </ActionButton>
      </div>
    )}
  ];

  const eventColumns = [
    { key: 'title' as keyof Event, header: 'Event Title' },
    { key: 'organizer' as keyof Event, header: 'Organizer', render: (event: Event) => event.organizer.name },
    { key: 'venue' as keyof Event, header: 'Venue' },
    { key: 'startDate' as keyof Event, header: 'Date', render: (event: Event) => 
      new Date(event.startDate).toLocaleDateString() 
    },
    { key: 'status' as keyof Event, header: 'Status', render: (event: Event) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {event.status}
      </span>
    )}
  ];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle={`Welcome back, ${user?.name || 'Loading...'}`}
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
          key: 'users',
          label: 'Users',
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>,
          active: activeTab === 'users',
          onClick: () => setActiveTab('users')
        },
        {
          key: 'events',
          label: 'Events',
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>,
          active: activeTab === 'events',
          onClick: () => setActiveTab('events')
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
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={<UsersIcon />}
              trend={stats?.trends.users}
            />
            <StatsCard
              title="Total Events"
              value={stats?.totalEvents || 0}
              icon={<EventsIcon />}
              trend={stats?.trends.events}
            />
            <StatsCard
              title="Tickets Sold"
              value={stats?.totalTickets || 0}
              icon={<TicketsIcon />}
              trend={stats?.trends.tickets}
            />
            <StatsCard
              title="Revenue"
              value={`KES ${stats?.totalRevenue?.toLocaleString() || 0}`}
              icon={<RevenueIcon />}
              trend={stats?.trends.revenue}
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Users</h3>
              <DataTable
                data={users.slice(0, 5)}
                columns={userColumns.slice(0, 3)}
                isLoading={isLoading}
                emptyMessage="No users found"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
              <DataTable
                data={events.slice(0, 5)}
                columns={eventColumns.slice(0, 3)}
                isLoading={isLoading}
                emptyMessage="No events found"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <FilterBar
            filters={[
              {
                key: 'role',
                label: 'Role',
                type: 'select',
                options: [
                  { value: 'admin', label: 'Admin' },
                  { value: 'event_organizer', label: 'Event Organizer' }
                ],
                value: userFilters.role,
                onChange: (value) => setUserFilters({ ...userFilters, role: value })
              },
              {
                key: 'search',
                label: 'Search',
                type: 'text',
                placeholder: 'Search by name or email...',
                value: userFilters.search,
                onChange: (value) => setUserFilters({ ...userFilters, search: value })
              }
            ]}
            onReset={() => setUserFilters({ role: '', search: '' })}
          />
          
          <DataTable
            data={filteredUsers}
            columns={userColumns}
            isLoading={isLoading}
            emptyMessage="No users found"
          />
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-6">
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
                placeholder: 'Search by title or organizer...',
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
    </DashboardLayout>
  );
}

export default withAdminProtection(AdminDashboard);