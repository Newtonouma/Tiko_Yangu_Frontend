import React from 'react';

interface FilterBarProps {
  filters: {
    key: string;
    label: string;
    type: 'select' | 'text' | 'date';
    options?: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }[];
  onReset?: () => void;
  className?: string;
}

export default function FilterBar({ filters, onReset, className = '' }: FilterBarProps) {
  return (
    <div className={`bg-gray-800 backdrop-blur-lg bg-opacity-70 border border-gray-700 rounded-xl p-3 lg:p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 lg:gap-4">
        {filters.map((filter) => (
          <div key={filter.key} className="flex flex-col w-full sm:w-auto sm:min-w-[140px] lg:min-w-[160px]">
            <label className="text-xs font-medium text-gray-400 mb-1">
              {filter.label}
            </label>
            {filter.type === 'select' ? (
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                aria-label={filter.label}
                className="bg-gray-700 border border-gray-600 text-white text-xs lg:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 lg:p-2.5"
              >
                <option value="">All</option>
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={filter.type}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                placeholder={filter.placeholder}
                className="bg-gray-700 border border-gray-600 text-white text-xs lg:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 lg:p-2.5"
              />
            )}
          </div>
        ))}
        
        {onReset && (
          <div className="flex flex-col justify-end w-full sm:w-auto sm:min-w-[80px]">
            <button
              onClick={onReset}
              className="bg-gray-600 hover:bg-gray-700 text-white text-xs lg:text-sm font-medium py-2 lg:py-2.5 px-3 lg:px-4 rounded-lg transition-colors duration-200 mt-auto"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}