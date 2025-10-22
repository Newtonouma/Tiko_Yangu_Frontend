'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { usersAPI } from '../lib/api';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  marketingAccess: boolean;
  createdAt: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminCount: number;
  organizerCount: number;
  attendeeCount: number;
  recentRegistrations: any[];
}

function UserStatsCards({ stats }: { stats: UserStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-blue-500">
            <UsersIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-green-500">
            <CheckCircleIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-purple-500">
            <UserCircleIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Admins</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.adminCount || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-indigo-500">
            <UsersIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Organizers</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.organizerCount || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserTable({ users, onUserAction }: { 
  users: User[]; 
  onUserAction: (action: string, userId: number) => void;
}) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'event_organizer':
        return 'bg-blue-100 text-blue-800';
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
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marketing Access
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.role === 'event_organizer' ? (
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.marketingAccess ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.marketingAccess ? 'Granted' : 'Denied'}
                      </span>
                      <button
                        onClick={() => onUserAction(user.marketingAccess ? 'revoke-marketing' : 'grant-marketing', user.id)}
                        className={`text-xs px-2 py-1 rounded-md transition-colors ${
                          user.marketingAccess 
                            ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                        title={user.marketingAccess ? 'Revoke marketing access' : 'Grant marketing access'}
                      >
                        {user.marketingAccess ? 'Revoke' : 'Grant'}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onUserAction('edit', user.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onUserAction(user.isActive ? 'deactivate' : 'activate', user.id)}
                      className={user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                    >
                      {user.isActive ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => onUserAction('delete', user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [usersData, statsData] = await Promise.all([
          usersAPI.getAll(),
          usersAPI.getStatistics(),
        ]);
        setUsers(usersData);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleUserAction = async (action: string, userId: number) => {
    try {
      switch (action) {
        case 'activate':
          await usersAPI.activate(userId);
          break;
        case 'deactivate':
          await usersAPI.deactivate(userId);
          break;
        case 'grant-marketing':
          await usersAPI.grantMarketingAccess(userId);
          break;
        case 'revoke-marketing':
          await usersAPI.revokeMarketingAccess(userId);
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this user?')) {
            await usersAPI.delete(userId);
          } else {
            return;
          }
          break;
        case 'edit':
          // TODO: Open edit modal
          return;
      }

      // Reload data
      const updatedUsers = await usersAPI.getAll();
      setUsers(updatedUsers);
    } catch (err) {
      alert('Action failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="User Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="User Management">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Users</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        {/* Stats */}
        {stats && <UserStatsCards stats={stats} />}

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>

        {/* Users Table */}
        <UserTable users={filteredUsers} onUserAction={handleUserAction} />
      </div>
    </AdminLayout>
  );
}