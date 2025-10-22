'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { EnvelopeIcon, DevicePhoneMobileIcon, ExclamationTriangleIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { adminBroadcast, getAdminBroadcastTargets } from '../lib/api';

interface BroadcastTargets {
  total_users: number;
  organizers: number;
  customers: number;
  events: Array<{
    id: string;
    title: string;
    customer_count: number;
  }>;
  organizers_with_customers: Array<{
    id: string;
    name: string;
    email: string;
    customer_count: number;
  }>;
}

interface BroadcastFormData {
  targetType: string;
  eventId?: string;
  organizerId?: string;
  subject: string;
  message: string;
  sendEmail: boolean;
  sendSms: boolean;
}

// Stats Cards Component
function CommunicationStatsCards({ targets }: { targets: BroadcastTargets | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-blue-500">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-gray-900">{targets?.total_users || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-green-500">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Organizers</p>
            <p className="text-2xl font-semibold text-gray-900">{targets?.organizers || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-purple-500">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Customers</p>
            <p className="text-2xl font-semibold text-gray-900">{targets?.customers || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-md bg-indigo-500">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Events</p>
            <p className="text-2xl font-semibold text-gray-900">{targets?.events.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommunicationsPage() {
  const [formData, setFormData] = useState<BroadcastFormData>({
    targetType: 'all_users',
    subject: '',
    message: '',
    sendEmail: true,
    sendSms: false,
  });
  const [targets, setTargets] = useState<BroadcastTargets | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = async () => {
    try {
      const response = await getAdminBroadcastTargets();
      setTargets(response.data);
    } catch (err) {
      setError('Failed to load broadcast targets');
    }
  };

  const getTargetCount = () => {
    if (!targets) return 0;
    
    switch (formData.targetType) {
      case 'all_users':
        return targets.total_users;
      case 'organizers':
        return targets.organizers;
      case 'customers':
        return targets.customers;
      case 'customers_by_event':
        if (formData.eventId) {
          const event = targets.events.find(e => e.id === formData.eventId);
          return event?.customer_count || 0;
        }
        return 0;
      case 'customers_by_organizer':
        if (formData.organizerId) {
          const organizer = targets.organizers_with_customers.find(o => o.id === formData.organizerId);
          return organizer?.customer_count || 0;
        }
        return 0;
      default:
        return 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.sendEmail && !formData.sendSms) {
        throw new Error('Please select at least one communication method (Email or SMS)');
      }

      if (!formData.subject.trim()) {
        throw new Error('Subject is required');
      }

      if (!formData.message.trim()) {
        throw new Error('Message is required');
      }

      const broadcastData = {
        targetType: formData.targetType,
        ...(formData.eventId && { eventId: formData.eventId }),
        ...(formData.organizerId && { organizerId: formData.organizerId }),
        subject: formData.subject,
        message: formData.message,
        sendEmail: formData.sendEmail,
        sendSms: formData.sendSms,
      };

      const response = await adminBroadcast(broadcastData);
      setSuccess(`Broadcast sent successfully! ${response.data.totalSent} messages delivered.`);
      
      // Reset form
      setFormData({
        targetType: 'all_users',
        subject: '',
        message: '',
        sendEmail: true,
        sendSms: false,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BroadcastFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset dependent fields when target type changes
      ...(field === 'targetType' && { eventId: undefined, organizerId: undefined })
    }));
  };

  return (
    <AdminLayout title="Communications">
      <div className="space-y-6">
        {/* Stats */}
        <CommunicationStatsCards targets={targets} />

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Broadcast Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Send Broadcast Message</h3>
            <p className="mt-1 text-sm text-gray-500">
              Send targeted messages to users via email and SMS
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Target Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Target Audience
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="all_users"
                      name="targetType"
                      type="radio"
                      value="all_users"
                      checked={formData.targetType === 'all_users'}
                      onChange={(e) => handleInputChange('targetType', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="all_users" className="ml-3 block text-sm text-gray-900">
                      All Users ({targets?.total_users || 0})
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="organizers"
                      name="targetType"
                      type="radio"
                      value="organizers"
                      checked={formData.targetType === 'organizers'}
                      onChange={(e) => handleInputChange('targetType', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="organizers" className="ml-3 block text-sm text-gray-900">
                      All Organizers ({targets?.organizers || 0})
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="customers"
                      name="targetType"
                      type="radio"
                      value="customers"
                      checked={formData.targetType === 'customers'}
                      onChange={(e) => handleInputChange('targetType', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="customers" className="ml-3 block text-sm text-gray-900">
                      All Customers ({targets?.customers || 0})
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="customers_by_event"
                      name="targetType"
                      type="radio"
                      value="customers_by_event"
                      checked={formData.targetType === 'customers_by_event'}
                      onChange={(e) => handleInputChange('targetType', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="customers_by_event" className="ml-3 block text-sm text-gray-900">
                      Customers by Event
                    </label>
                  </div>

                  {formData.targetType === 'customers_by_event' && (
                    <div className="ml-7">
                      <select
                        value={formData.eventId || ''}
                        onChange={(e) => handleInputChange('eventId', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        aria-label="Select event for customer targeting"
                        required
                      >
                        <option value="">Select an event</option>
                        {targets?.events.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.title} ({event.customer_count} customers)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      id="customers_by_organizer"
                      name="targetType"
                      type="radio"
                      value="customers_by_organizer"
                      checked={formData.targetType === 'customers_by_organizer'}
                      onChange={(e) => handleInputChange('targetType', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="customers_by_organizer" className="ml-3 block text-sm text-gray-900">
                      Customers by Organizer
                    </label>
                  </div>

                  {formData.targetType === 'customers_by_organizer' && (
                    <div className="ml-7">
                      <select
                        value={formData.organizerId || ''}
                        onChange={(e) => handleInputChange('organizerId', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        aria-label="Select organizer for customer targeting"
                        required
                      >
                        <option value="">Select an organizer</option>
                        {targets?.organizers_with_customers.map((organizer) => (
                          <option key={organizer.id} value={organizer.id}>
                            {organizer.name} ({organizer.customer_count} customers)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Target Count Display */}
                <div className="mt-3 p-3 bg-indigo-50 rounded-md">
                  <p className="text-sm text-indigo-800">
                    <strong>Recipients:</strong> {getTargetCount()} users will receive this message
                  </p>
                </div>
              </div>

              {/* Communication Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Communication Method
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="sendEmail"
                      type="checkbox"
                      checked={formData.sendEmail}
                      onChange={(e) => handleInputChange('sendEmail', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sendEmail" className="ml-3 flex items-center text-sm text-gray-900">
                      <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                      Email
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="sendSms"
                      type="checkbox"
                      checked={formData.sendSms}
                      onChange={(e) => handleInputChange('sendSms', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sendSms" className="ml-3 flex items-center text-sm text-gray-900">
                      <DevicePhoneMobileIcon className="h-4 w-4 mr-1 text-gray-500" />
                      SMS
                    </label>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter message subject"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your message content"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.message.length} characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading || getTargetCount() === 0}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Broadcast'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}