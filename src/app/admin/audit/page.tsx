'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { auditAPI } from '../lib/api';
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  userId: number;
  userEmail?: string;
  userName?: string;
  changes: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AuditStats {
  totalLogs: number;
  actionBreakdown: Record<string, number>;
  entityBreakdown: Record<string, number>;
  userBreakdown: Array<{
    userId: number;
    userEmail: string;
    actionCount: number;
  }>;
  recentActivity: any[];
  topActions: Array<{
    action: string;
    count: number;
  }>;
  dailyActivity: Array<{
    date: string;
    count: number;
  }>;
}

function AuditStatsCards({ stats }: { stats: AuditStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-blue-500">
            <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Logs</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalLogs.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-green-500">
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Today's Logs</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.dailyActivity.slice(-1)[0]?.count || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-yellow-500">
            <ExclamationTriangleIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">High Priority</p>
            <p className="text-2xl font-semibold text-gray-900">
              {Math.floor(stats.totalLogs * 0.1)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-purple-500">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active Admins</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.userBreakdown.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditLogTable({ logs, onViewDetails }: { 
  logs: AuditLog[]; 
  onViewDetails: (log: AuditLog) => void;
}) {
  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'update':
        return <EyeIcon className="h-4 w-4 text-blue-600" />;
      case 'delete':
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default:
        return <ClipboardDocumentListIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getActionIcon(log.action)}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{log.action}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{log.entityType}</div>
                  <div className="text-sm text-gray-500">{log.entityId ? `ID: ${log.entityId}` : ''}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {log.userName || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">{log.userEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityBadgeColor(log.severity)}`}>
                    {log.severity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(log)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="View Details"
                  >
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

function AuditLogDetailsModal({ log, isOpen, onClose }: {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Audit Log Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Action</label>
                <p className="mt-1 text-sm text-gray-900">{log.action}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Entity Type</label>
                <p className="mt-1 text-sm text-gray-900">{log.entityType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Entity ID</label>
                <p className="mt-1 text-sm text-gray-900">{log.entityId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Severity</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{log.severity}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">User</label>
                <p className="mt-1 text-sm text-gray-900">{log.userName || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{log.userEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IP Address</label>
                <p className="mt-1 text-sm text-gray-900">{log.ipAddress}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">User Agent</label>
                <p className="mt-1 text-sm text-gray-900 truncate" title={log.userAgent}>
                  {log.userAgent}
                </p>
              </div>
            </div>

            {log.changes && Object.keys(log.changes).length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Changes</label>
                <div className="bg-gray-50 rounded-md p-4">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                    {JSON.stringify(log.changes, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to determine severity based on action and entity type
function determineSeverity(action: string, entityType: string): 'low' | 'medium' | 'high' | 'critical' {
  // Critical actions
  if (action === 'delete' || action === 'refund') return 'critical';
  
  // High priority actions
  if (action === 'approve' || action === 'reject' || action === 'deactivate') return 'high';
  
  // Medium priority actions
  if (action === 'update' || action === 'create') {
    if (entityType === 'user' || entityType === 'setting') return 'high';
    return 'medium';
  }
  
  // Low priority actions
  if (action === 'login' || action === 'logout' || action === 'export') return 'low';
  
  return 'medium'; // Default
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [logsData, statsData] = await Promise.all([
          auditAPI.getLogs(),
          auditAPI.getStatistics(),
        ]);
        
        // Transform backend data to match frontend interface
        const transformedLogs = (logsData.logs || []).map((log: any) => ({
          id: log.id,
          action: log.action,
          entityType: log.entityName || `${log.entityType} #${log.entityId}`, // Use entityName from backend
          entityId: log.entityId || 0,
          userId: log.userId || 0,
          userEmail: log.user?.email || log.userEmail || 'Unknown',
          userName: log.user?.name || 'Unknown User', // Map from user.name
          changes: {
            ...log.metadata,
            previousData: log.previousData,
            newData: log.newData,
            description: log.description,
          },
          ipAddress: log.ipAddress || 'Unknown',
          userAgent: log.userAgent || 'Unknown',
          timestamp: log.createdAt, // Keep as ISO string for proper parsing
          severity: determineSeverity(log.action, log.entityType),
        }));
        
        setLogs(transformedLogs);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load audit data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesAction = actionFilter === 'all' || log.action.toLowerCase() === actionFilter.toLowerCase();
    
    return matchesSearch && matchesSeverity && matchesAction;
  });

  if (loading) {
    return (
      <AdminLayout title="Audit Logs">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Audit Logs">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Audit Logs</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Audit Logs">
      <div className="space-y-6">
        {/* Stats */}
        {stats && <AuditStatsCards stats={stats} />}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
          </div>
        </div>

        {/* Audit Logs Table */}
        <AuditLogTable logs={filteredLogs} onViewDetails={handleViewDetails} />

        {/* Top Active Users */}
        {stats && stats.userBreakdown.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Most Active Administrators</h3>
            <div className="space-y-4">
              {stats.userBreakdown.map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user.userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">{user.userEmail}</p>
                      <p className="text-sm text-gray-500">Administrator</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{user.actionCount}</p>
                    <p className="text-sm text-gray-500">Actions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details Modal */}
        <AuditLogDetailsModal
          log={selectedLog}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </AdminLayout>
  );
}