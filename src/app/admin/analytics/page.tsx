'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { analyticsAPI } from '../lib/api';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  EyeIcon,
  TicketIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalUsers: number;
    totalEvents: number;
    totalTicketsSold: number;
    revenueGrowth: number;
    userGrowth: number;
    eventGrowth: number;
    ticketGrowth: number;
  };
  revenueData: Array<{
    month: string;
    revenue: number;
    tickets: number;
  }>;
  userRegistrationData: Array<{
    month: string;
    users: number;
  }>;
  eventData: Array<{
    month: string;
    events: number;
  }>;
  topEvents: Array<{
    id: number;
    title: string;
    revenue: number;
    ticketsSold: number;
    attendanceRate: number;
  }>;
  topOrganizers: Array<{
    id: number;
    name: string;
    eventsCreated: number;
    totalRevenue: number;
    averageRating: number;
  }>;
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
    amount?: number;
  }>;
}

function OverviewCards({ overview }: { overview: AnalyticsData['overview'] }) {
  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
        ) : (
          <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
        )}
        <span className="text-sm font-medium">
          {isPositive ? '+' : ''}{growth.toFixed(1)}% from last month
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              KSh {overview.totalRevenue.toLocaleString()}
            </p>
            {formatGrowth(overview.revenueGrowth)}
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">
              {overview.totalUsers.toLocaleString()}
            </p>
            {formatGrowth(overview.userGrowth)}
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <UsersIcon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Events</p>
            <p className="text-2xl font-bold text-gray-900">
              {overview.totalEvents.toLocaleString()}
            </p>
            {formatGrowth(overview.eventGrowth)}
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <CalendarIcon className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Tickets Sold</p>
            <p className="text-2xl font-bold text-gray-900">
              {overview.totalTicketsSold.toLocaleString()}
            </p>
            {formatGrowth(overview.ticketGrowth)}
          </div>
          <div className="p-3 bg-indigo-100 rounded-full">
            <TicketIcon className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleChart({ data, title, dataKey, color = 'bg-blue-500' }: {
  data: any[];
  title: string;
  dataKey: string;
  color?: string;
}) {
  const maxValue = Math.max(...data.map(item => item[dataKey]));
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.slice(-6).map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 w-16">{item.month}</span>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${color}`}
                  style={{
                    width: `${(item[dataKey] / maxValue) * 100}%`
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-20 text-right">
              {typeof item[dataKey] === 'number' && item[dataKey] > 1000 
                ? `${(item[dataKey] / 1000).toFixed(1)}K`
                : item[dataKey].toLocaleString()
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopEventsTable({ events }: { events: AnalyticsData['topEvents'] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Events</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Event</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Tickets</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Attendance</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 truncate max-w-xs">
                    {event.title}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">
                    KSh {event.revenue.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-600">{event.ticketsSold}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${event.attendanceRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{event.attendanceRate}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopOrganizersTable({ organizers }: { organizers: AnalyticsData['topOrganizers'] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Event Organizers</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Organizer</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Events</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {organizers.map((organizer) => (
              <tr key={organizer.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{organizer.name}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-600">{organizer.eventsCreated}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">
                    KSh {organizer.totalRevenue.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(organizer.averageRating) ? 'fill-current' : 'text-gray-300'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {organizer.averageRating.toFixed(1)}
                    </span>
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

function RecentActivityFeed({ activities }: { activities: AnalyticsData['recentActivity'] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ticket_purchase':
        return <TicketIcon className="h-5 w-5 text-green-600" />;
      case 'event_created':
        return <CalendarIcon className="h-5 w-5 text-blue-600" />;
      case 'user_registered':
        return <UsersIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <ChartBarIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.slice(0, 10).map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
                {activity.amount && (
                  <p className="text-sm font-medium text-green-600">
                    +KSh {activity.amount.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const backendData = await analyticsAPI.getDashboard();
        const platformMetrics = await analyticsAPI.getPlatformMetrics();
        
        // Transform backend data to match frontend interface
        const analyticsData: AnalyticsData = {
          overview: {
            totalRevenue: backendData.totalRevenue || 0,
            totalUsers: backendData.totalUsers || 0,
            totalEvents: backendData.totalEvents || 0,
            totalTicketsSold: backendData.totalTickets || 0,
            revenueGrowth: backendData.monthlyGrowth?.revenue || 0,
            userGrowth: backendData.monthlyGrowth?.users || 0,
            eventGrowth: backendData.monthlyGrowth?.events || 0,
            ticketGrowth: backendData.monthlyGrowth?.tickets || 0,
          },
          revenueData: platformMetrics.trends?.revenue?.map((item: any) => ({
            month: new Date(item.month + '-01').toLocaleDateString('en', { month: 'short' }),
            revenue: item.revenue || 0,
            tickets: item.tickets || 0,
          })) || [],
          userRegistrationData: platformMetrics.trends?.userRegistration?.map((item: any) => ({
            month: new Date(item.month + '-01').toLocaleDateString('en', { month: 'short' }),
            users: item.count || 0,
          })) || [],
          eventData: (() => {
            // Calculate event creation trends from recent activity
            const eventActivities = backendData.recentActivity?.filter((activity: any) => 
              activity.type === 'event_created'
            ) || [];
            const eventsByMonth = eventActivities.reduce((acc: any, activity: any) => {
              const month = new Date(activity.timestamp).toLocaleDateString('en', { month: 'short' });
              acc[month] = (acc[month] || 0) + 1;
              return acc;
            }, {});
            return Object.entries(eventsByMonth).map(([month, events]) => ({
              month,
              events: events as number,
            }));
          })(),
          topEvents: platformMetrics.topPerformers?.events?.map((event: any, index: number) => ({
            id: event.eventId || index + 1,
            title: event.eventTitle || 'Unknown Event',
            revenue: event.revenue || 0,
            ticketsSold: event.ticketsSold || 0,
            attendanceRate: Math.round(((event.ticketsSold || 0) / Math.max(event.capacity || 100, 1)) * 100),
          })) || [],
          topOrganizers: platformMetrics.topPerformers?.organizers?.slice(0, 5).map((organizer: any, index: number) => ({
            id: organizer.userId || index + 1,
            name: organizer.name || 'Unknown Organizer',
            eventsCreated: organizer.eventsCreated || 0,
            totalRevenue: organizer.totalRevenue || 0,
            averageRating: 4.5, // Default rating since not provided by backend
          })) || [],
          recentActivity: backendData.recentActivity?.map((activity: any) => ({
            id: Math.random(),
            type: activity.type || 'activity',
            description: activity.description || 'Recent activity',
            timestamp: activity.timestamp || new Date().toISOString(),
            amount: activity.amount || undefined,
          })) || [],
        };
        
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Analytics & Reports">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Analytics & Reports">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Analytics</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!data) return null;

  return (
    <AdminLayout title="Analytics & Reports">
      <div className="space-y-8">
        {/* Overview Cards */}
        <OverviewCards overview={data.overview} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SimpleChart
            data={data.revenueData}
            title="Revenue Trend"
            dataKey="revenue"
            color="bg-green-500"
          />
          <SimpleChart
            data={data.userRegistrationData}
            title="User Growth"
            dataKey="users"
            color="bg-blue-500"
          />
          <SimpleChart
            data={data.eventData}
            title="Events Created"
            dataKey="events"
            color="bg-purple-500"
          />
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopEventsTable events={data.topEvents} />
          <TopOrganizersTable organizers={data.topOrganizers} />
        </div>

        {/* Recent Activity */}
        <RecentActivityFeed activities={data.recentActivity} />
      </div>
    </AdminLayout>
  );
}