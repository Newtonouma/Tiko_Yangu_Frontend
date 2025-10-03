'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { settingsAPI } from '../lib/api';
import {
  CogIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface SystemSetting {
  id: number;
  category: string;
  key: string;
  value: string;
  description: string;
  dataType: string;
  isActive: boolean;
}

interface SettingsCategory {
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  settings: SystemSetting[];
}

function SettingItem({ setting, onUpdate }: { 
  setting: SystemSetting; 
  onUpdate: (key: string, value: string) => void;
}) {
  const [value, setValue] = useState(setting.value);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (value !== setting.value) {
      setIsSaving(true);
      try {
        await onUpdate(setting.key, value);
        setIsEditing(false);
      } catch (error) {
        setValue(setting.value); // Revert on error
        alert('Failed to update setting');
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setValue(setting.value);
    setIsEditing(false);
  };

  const renderInput = () => {
    switch (setting.dataType) {
      case 'boolean':
        return (
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={!isEditing}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={!isEditing}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={!isEditing}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={!isEditing}
          />
        );
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">{setting.key}</h4>
          <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {!setting.isActive && (
            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" title="Inactive" />
          )}
        </div>
      </div>
      
      <div className="mt-3">
        {renderInput()}
      </div>

      <div className="flex justify-end space-x-2 mt-3">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

function SettingsSection({ category, onUpdate }: { 
  category: SettingsCategory;
  onUpdate: (key: string, value: string) => void;
}) {
  const IconComponent = category.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg mr-3">
          <IconComponent className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
          <p className="text-sm text-gray-500">{category.description}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {category.settings.map((setting) => (
          <SettingItem
            key={setting.id}
            setting={setting}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const settingsData = await settingsAPI.getAll();
        setSettings(settingsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSettingUpdate = async (key: string, value: string) => {
    try {
      await settingsAPI.update(key, value);
      // Update local state
      setSettings(prevSettings =>
        prevSettings.map(setting =>
          setting.key === key ? { ...setting, value } : setting
        )
      );
      setSuccessMessage(`Setting "${key}" updated successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      throw err; // Re-throw to be handled by SettingItem
    }
  };

  // Group settings by category
  const settingsCategories: SettingsCategory[] = [
    {
      name: 'General Settings',
      icon: CogIcon,
      description: 'Basic platform configuration and general settings',
      settings: settings.filter(s => s.category === 'general'),
    },
    {
      name: 'Email Configuration',
      icon: EnvelopeIcon,
      description: 'Email templates, SMTP settings, and notification preferences',
      settings: settings.filter(s => s.category === 'email'),
    },
    {
      name: 'Payment Settings',
      icon: CurrencyDollarIcon,
      description: 'Payment gateway configuration and transaction fees',
      settings: settings.filter(s => s.category === 'payment'),
    },
    {
      name: 'Security Settings',
      icon: ShieldCheckIcon,
      description: 'Authentication, password policies, and security configurations',
      settings: settings.filter(s => s.category === 'security'),
    },
    {
      name: 'Notification Settings',
      icon: BellIcon,
      description: 'Push notifications, email alerts, and communication preferences',
      settings: settings.filter(s => s.category === 'notification'),
    },
    {
      name: 'Platform Settings',
      icon: GlobeAltIcon,
      description: 'Regional settings, timezone, currency, and localization',
      settings: settings.filter(s => s.category === 'platform'),
    },
  ].filter(category => category.settings.length > 0);

  if (loading) {
    return (
      <AdminLayout title="System Settings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="System Settings">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Settings</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="System Settings">
      <div className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckIcon className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Sections */}
        {settingsCategories.map((category) => (
          <SettingsSection
            key={category.name}
            category={category}
            onUpdate={handleSettingUpdate}
          />
        ))}

        {/* Backup and Maintenance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Maintenance</h3>
              <p className="text-sm text-gray-500">Backup, restore, and maintenance operations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <h4 className="font-medium text-gray-900">Backup Database</h4>
              <p className="text-sm text-gray-500 mt-1">Create a full system backup</p>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <h4 className="font-medium text-gray-900">Clear Cache</h4>
              <p className="text-sm text-gray-500 mt-1">Clear all system caches</p>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <h4 className="font-medium text-gray-900">System Health</h4>
              <p className="text-sm text-gray-500 mt-1">Check system health status</p>
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Platform Details</h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Version:</dt>
                  <dd className="text-gray-900">1.0.0</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Environment:</dt>
                  <dd className="text-gray-900">Production</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Uptime:</dt>
                  <dd className="text-gray-900">24 days, 6 hours</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Resource Usage</h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Database Size:</dt>
                  <dd className="text-gray-900">2.3 GB</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Storage Used:</dt>
                  <dd className="text-gray-900">15.7 GB</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Active Users:</dt>
                  <dd className="text-gray-900">1,247</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}