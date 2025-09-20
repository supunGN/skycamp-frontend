import React from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data available",
  onRowClick = null,
  sortable = true,
  currentSort = { column: null, direction: "asc" },
  onSort = null,
  className = "",
}) {
  const handleSort = (column) => {
    if (!sortable || !onSort) return;

    const newDirection =
      currentSort.column === column && currentSort.direction === "asc"
        ? "desc"
        : "asc";

    onSort(column, newDirection);
  };

  const getSortIcon = (column) => {
    if (!sortable || !onSort) return null;

    if (currentSort.column === column) {
      return currentSort.direction === "asc" ? (
        <ChevronUpIcon className="w-4 h-4" />
      ) : (
        <ChevronDownIcon className="w-4 h-4" />
      );
    }

    return <ChevronUpIcon className="w-4 h-4 opacity-30" />;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
          <span className="ml-4 text-gray-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key || index}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider ${
                    column.sortable !== false && sortable
                      ? "cursor-pointer hover:bg-gray-100 transition-colors"
                      : ""
                  }`}
                  onClick={() =>
                    column.sortable !== false && handleSort(column.key)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable !== false &&
                      sortable &&
                      getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`hover:bg-gray-50 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick && onRowClick(row, rowIndex)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key || colIndex}
                    className="px-6 py-5 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
