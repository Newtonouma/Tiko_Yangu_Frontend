import React from 'react';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  mobileLabel?: string; // Label to show in mobile card view
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T extends { id: number | string }>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  emptyMessage = "No data available",
  className = ""
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className={`bg-gray-800 backdrop-blur-lg bg-opacity-70 border border-gray-700 rounded-xl p-4 lg:p-8 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`bg-gray-800 backdrop-blur-lg bg-opacity-70 border border-gray-700 rounded-xl p-4 lg:p-8 text-center ${className}`}>
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 backdrop-blur-lg bg-opacity-70 border border-gray-700 rounded-xl ${className}`}>
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 bg-opacity-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${column.className || ''}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    onRowClick
                      ? 'hover:bg-gray-700 hover:bg-opacity-50 cursor-pointer'
                      : ''
                  } transition-colors duration-150`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key] || '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="p-4 space-y-4">
          {data.map((item, index) => (
            <div
              key={item.id}
              className={`bg-gray-700 border border-gray-600 rounded-lg p-4 ${
                onRowClick ? 'cursor-pointer hover:bg-gray-600 transition-colors' : ''
              }`}
              onClick={() => onRowClick?.(item)}
            >
              <div className="space-y-3">
                {columns.map((column, colIndex) => {
                  const value = column.render
                    ? column.render(item)
                    : String(item[column.key] || '');
                  
                  // Skip empty values in mobile view
                  if (!value || value === 'undefined' || value === 'null') return null;
                  
                  return (
                    <div key={String(column.key)} className="flex justify-between items-start">
                      <span className="text-xs font-medium text-gray-400 flex-shrink-0 mr-3">
                        {column.mobileLabel || column.header}:
                      </span>
                      <span className="text-sm text-gray-200 text-right flex-1">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}