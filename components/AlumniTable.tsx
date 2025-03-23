/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AlumniTable.tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Icon } from "@iconify/react";
import React from 'react';
import * as XLSX from 'xlsx';

interface AlumniTableProps {
  alumni: Record<string, any>[];
  title?: string;
}

export const AlumniTable: React.FC<AlumniTableProps> = ({ alumni, title }) => {
  if (!alumni || alumni.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center my-4">
        <p className="text-gray-600">Aucun alumni trouvé</p>
      </div>
    );
  }

  // Get the keys (column names) from the first alumni object
  const allKeys = Object.keys(alumni[0]);

  // Filter out id if present (usually not needed for display)
  const keys = allKeys.filter(key => key !== 'id' && key !== 'ID');

  // Format cell value based on the key type
  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined) return '-';

    // Format LinkedIn URL
    if (key === 'LinkedIn URL' && typeof value === 'string') {
      // Extraire le nom d'utilisateur pour un affichage plus propre
      const username = value.replace(/https?:\/\/(?:www\.)?linkedin\.com\/in\//, '');
      return (
        <a
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-1"
          >
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
          </svg>
          {username}
        </a>
      );
    }

    // Format graduation year
    if (key === 'Année de promotion' && typeof value === 'string') {
      return value;
    }

    return String(value);
  };

  // Export to Excel
  const exportToExcel = () => {
    // Prepare data for export
    const exportData = alumni.map(person => {
      const row: Record<string, any> = {};
      keys.forEach(key => {
        const value = person[key];
        // Format the value for Excel
        if (key === 'LinkedIn URL' && typeof value === 'string') {
          row[key] = value; // Keep the full URL
        } else {
          row[key] = value !== null && value !== undefined ? value : '';
        }
      });
      return row;
    });

    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumni');

    // Generate Excel file
    XLSX.writeFile(workbook, 'alumni_export.xlsx');
  };

  // Determine column display order for better UX
  const priorityColumns = [
    'Prénom', 'Nom', 'Année de promotion', 'Programme',
    'Entreprise actuelle', 'Poste actuel', 'Secteur d\'activité',
    'Ville', 'Pays'
  ];

  // Reorder keys to have priority columns first
  const orderedKeys = [
    ...priorityColumns.filter(col => keys.includes(col)),
    ...keys.filter(key => !priorityColumns.includes(key))
  ];

  return (
    <div className="my-4 ml-0 sm:ml-12 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-700">{title || "Résultats"}</h2>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={exportToExcel}
                  className="flex items-center justify-center w-10 h-10 bg-zinc-100 rounded-full text-gray-600 hover:bg-zinc-300"
                >
                  <Icon icon="vscode-icons:file-type-excel" width="20" height="20" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white">
                <p>Exporter en Excel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50">
              {orderedKeys.map((key) => (
                <th
                  key={key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {alumni.map((person, personIdx) => (
              <tr key={personIdx} className="hover:bg-gray-50 transition-colors">
                {orderedKeys.map((key) => (
                  <td key={key} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {formatValue(key, person[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="py-2 px-4 bg-gray-50 text-sm text-gray-500 border-t flex justify-between items-center">
        <div>{alumni.length} alumnis trouvés</div>
        <img src="/logo.png" alt="Logo" className="h-6" />
      </div>
    </div>
  );
};

// Loading state component
export const AlumniTableSkeleton: React.FC = () => {
  return (
    <div className="my-4 animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between">
        <div className="h-6 w-1/3 rounded bg-gray-300"></div>
        <div className="h-6 w-24 rounded bg-gray-300"></div>
      </div>
      <div className="overflow-x-auto">
        <div className="p-4">
          <div className="h-8 w-full rounded bg-gray-200 mb-4"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 rounded bg-gray-200"></div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 rounded bg-gray-200"></div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 rounded bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="py-2 px-4 bg-gray-50 h-8 flex justify-between">
        <div className="h-5 w-32 rounded bg-gray-300"></div>
        <div className="h-5 w-16 rounded bg-gray-300"></div>
      </div>
    </div>
  );
};