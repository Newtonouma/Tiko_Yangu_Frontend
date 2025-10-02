'use client';

import React from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { useAdminAuth } from '../lib/auth';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

export default function AdminHeader({ toggleSidebar, title }: HeaderProps) {
  const { user, logout } = useAdminAuth();
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="ml-2 text-2xl font-semibold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="flex items-center text-sm text-green-600">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
            System Online
          </div>

          {/* Admin Profile */}
          <div className="relative group">
            <div className="flex items-center cursor-pointer">
              <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-gray-500">{user?.email}</div>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}