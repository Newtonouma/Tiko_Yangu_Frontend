import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  className = '' 
}: StatsCardProps) {
  return (
    <div className={`bg-gray-800 backdrop-blur-lg bg-opacity-70 border border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-gray-400 text-xs sm:text-sm font-medium truncate">{title}</p>
          <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mt-1 sm:mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-1 sm:mt-2">
              <span
                className={`text-xs sm:text-sm font-medium ${
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-gray-400 text-xs sm:text-sm ml-1 sm:ml-2 hidden sm:inline">from last month</span>
            </div>
          )}
        </div>
        <div className="text-blue-400 text-xl sm:text-2xl lg:text-3xl opacity-80 ml-2 flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}