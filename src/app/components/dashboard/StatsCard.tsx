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
    <div className={`bg-gray-800 backdrop-blur-lg bg-opacity-70 border border-gray-700 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-gray-400 text-sm ml-2">from last month</span>
            </div>
          )}
        </div>
        <div className="text-blue-400 text-3xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
}