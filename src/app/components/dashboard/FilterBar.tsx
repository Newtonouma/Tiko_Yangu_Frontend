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
    <div className={`bg-gray-800 backdrop-blur-lg bg-opacity-70 border border-gray-700 rounded-xl p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-4">
        {filters.map((filter) => (
          <div key={filter.key} className="flex flex-col">
            <label className="text-xs font-medium text-gray-400 mb-1">
              {filter.label}
            </label>
            {filter.type === 'select' ? (
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                aria-label={filter.label}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            )}
          </div>
        ))}
        
        {onReset && (
          <div className="flex flex-col justify-end">
            <button
              onClick={onReset}
              className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}