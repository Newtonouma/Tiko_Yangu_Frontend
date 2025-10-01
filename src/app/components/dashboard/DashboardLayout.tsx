import React, { useState } from 'react';

interface NavigationItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  navigationItems?: NavigationItem[];
}

export default function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  actions,
  navigationItems = []
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar Navigation */}
      <div className={`
        w-64 bg-gray-800 border-r border-gray-700 flex flex-col transition-transform duration-300 ease-in-out z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        fixed inset-y-0 left-0
      `}>
        {/* Brand/Logo Section */}
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Tikoyangu</h2>
          <p className="text-gray-400 text-sm">Event Management</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                item.onClick();
                setSidebarOpen(false); // Close sidebar on mobile after clicking
              }}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                item.active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.icon && (
                <span className="mr-3 flex-shrink-0 flex items-center justify-center w-5 h-5">
                  {item.icon}
                </span>
              )}
              <span className="font-medium leading-none">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        {actions && (
          <div className="px-4 py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2">
              {actions}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Mobile Menu Button */}
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden mr-4 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Toggle navigation menu"
                  title="Toggle navigation menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-white">{title}</h1>
                  {subtitle && (
                    <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 lg:px-6 py-6 lg:py-8 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}