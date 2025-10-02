'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { analyticsAPI } from './lib/api';
import {
  UsersIcon,
  CalendarIcon,
  TicketIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface DashboardData {
  totalUsers: number;
  totalEvents: number;
  totalTickets: number;
  totalRevenue: number;
  activeEvents: number;
  pendingEvents: number;
  monthlyGrowth: {
    users: number;
    events: number;
    tickets: number;
    revenue: number;
  };
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

interface StatCardProps {
  title: string;
  value: number | string;
  growth?: number;
  icon: React.ComponentType<any>;
  color: string;
}

function StatCard({ title, value, growth, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-md ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-center">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {typeof growth === 'number' && (
              <div className={`ml-2 flex items-center text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growth >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
                <span>{Math.abs(growth)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentActivity({ activities }: { activities: DashboardData['recentActivity'] }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.slice(0, 10).map((activity, index) => (
          <div key={index} className="px-6 py-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${
                activity.type === 'user_registration' ? 'bg-blue-100' :
                activity.type === 'event_created' ? 'bg-green-100' :
                'bg-purple-100'
              }`}>
                <div className={`h-2 w-2 rounded-full ${
                  activity.type === 'user_registration' ? 'bg-blue-600' :
                  activity.type === 'event_created' ? 'bg-green-600' :
                  'bg-purple-600'
                }`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const data = await analyticsAPI.getDashboard();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!dashboardData) {
    return (
      <AdminLayout title="Dashboard">
        <div className="text-center text-gray-500">No data available</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={dashboardData.totalUsers.toLocaleString()}
            growth={dashboardData.monthlyGrowth.users}
            icon={UsersIcon}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Events"
            value={dashboardData.totalEvents.toLocaleString()}
            growth={dashboardData.monthlyGrowth.events}
            icon={CalendarIcon}
            color="bg-green-500"
          />
          <StatCard
            title="Total Tickets"
            value={dashboardData.totalTickets.toLocaleString()}
            growth={dashboardData.monthlyGrowth.tickets}
            icon={TicketIcon}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Revenue"
            value={`KSh ${dashboardData.totalRevenue.toLocaleString()}`}
            growth={dashboardData.monthlyGrowth.revenue}
            icon={CurrencyDollarIcon}
            color="bg-indigo-500"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Active Events"
            value={dashboardData.activeEvents.toLocaleString()}
            icon={ChartBarIcon}
            color="bg-green-600"
          />
          <StatCard
            title="Pending Events"
            value={dashboardData.pendingEvents.toLocaleString()}
            icon={CalendarIcon}
            color="bg-yellow-500"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={dashboardData.recentActivity} />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200">
                <div className="font-medium text-indigo-900">Review Pending Events</div>
                <div className="text-sm text-indigo-600">{dashboardData.pendingEvents} events waiting for approval</div>
              </button>
              
              <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                <div className="font-medium text-green-900">View Revenue Report</div>
                <div className="text-sm text-green-600">Generate detailed financial report</div>
              </button>
              
              <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                <div className="font-medium text-purple-900">System Settings</div>
                <div className="text-sm text-purple-600">Configure platform settings</div>
              </button>
              
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <div className="font-medium text-gray-900">Export Data</div>
                <div className="text-sm text-gray-600">Download platform analytics</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}