import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SpreadsheetEditor({ data, headers, onUpdate, onSelectionChange }) {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleCellChange = (rowIndex, header, value) => {
    const globalIndex = startIndex + rowIndex;
    const newData = [...data];
    newData[globalIndex] = { ...newData[globalIndex], [header]: value };
    onUpdate(newData, headers);
  };

  const handleHeaderChange = (oldHeader, newHeader) => {
    if (oldHeader === newHeader) return;
    const newHeaders = headers.map(h => h === oldHeader ? newHeader : h);
    const newData = data.map(row => {
      const newRow = { ...row };
      newRow[newHeader] = newRow[oldHeader];
      delete newRow[oldHeader];
      return newRow;
    });
    onUpdate(newData, newHeaders);
  };

  const addColumn = () => {
    const newHeader = `Column ${headers.length + 1}`;
    const newHeaders = [...headers, newHeader];
    const newData = data.map(row => ({ ...row, [newHeader]: '' }));
    onUpdate(newData, newHeaders);
  };

  const addRow = () => {
    const newRow = {};
    headers.forEach(h => newRow[h] = '');
    const newData = [...data, newRow];
    onUpdate(newData, headers);
    // Go to last page to see new row
    setTimeout(() => setCurrentPage(Math.ceil((data.length + 1) / rowsPerPage)), 0);
  };

  const deleteRow = (rowIndex) => {
    const globalIndex = startIndex + rowIndex;
    const newData = data.filter((_, i) => i !== globalIndex);
    onUpdate(newData, headers);
  };

  const deleteColumn = (header) => {
    const newHeaders = headers.filter(h => h !== header);
    const newData = data.map(row => {
        const newRow = { ...row };
        delete newRow[header];
        return newRow;
    });
    onUpdate(newData, newHeaders);
  };

  const handleCellClick = (rowIndex, header, e) => {
    const globalIndex = startIndex + rowIndex;
    if (e.shiftKey) {
        // Multi-selection logic could go here
    } else {
        setSelectedCells(new Set([`${globalIndex}:${header}`]));
        onSelectionChange && onSelectionChange(new Set([`${globalIndex}:${header}`]));
    }
  };

  return (
    <div className="flex flex-col h-full border border-border rounded-lg bg-card overflow-hidden">
      <div className="flex-grow overflow-auto">
        <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs uppercase bg-muted/50 sticky top-0 z-10">
            <tr>
                <th className="p-2 border-b border-r border-border w-10 text-center text-muted-foreground">#</th>
                {headers.map((header, index) => (
                <th key={index} className="p-0 border-b border-r border-border min-w-[150px] relative group">
                    <div className="flex items-center">
                        <input
                        type="text"
                        value={header}
                        onChange={(e) => handleHeaderChange(header, e.target.value)}
                        className="w-full h-full p-2 bg-transparent border-none focus:outline-none focus:bg-background font-bold"
                        />
                        <button onClick={() => deleteColumn(header)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 absolute right-0 top-1/2 -translate-y-1/2 bg-muted/50">
                            <Trash2 size={12} />
                        </button>
                    </div>
                </th>
                ))}
                <th className="p-2 border-b border-border w-10 text-center">
                    <button onClick={addColumn} className="p-1 hover:bg-primary/10 text-primary rounded" title="Add Column">
                        <Plus size={14} />
                    </button>
                </th>
            </tr>
            </thead>
            <tbody>
            {currentData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-muted/20 group">
                <td className="p-2 border-b border-r border-border text-center text-muted-foreground text-xs select-none relative">
                    <div className="group-hover:hidden">{startIndex + rowIndex + 1}</div>
                    <button onClick={() => deleteRow(rowIndex)} className="hidden group-hover:block mx-auto text-red-500 hover:bg-red-500/10 p-1 rounded">
                        <Trash2 size={12} />
                    </button>
                </td>
                {headers.map((header, colIndex) => {
                    const globalIndex = startIndex + rowIndex;
                    const cellId = `${globalIndex}:${header}`;
                    const isSelected = selectedCells.has(cellId);
                    return (
                    <td
                        key={colIndex}
                        className={`p-0 border-b border-r border-border min-w-[150px] relative ${isSelected ? 'bg-primary/10 ring-1 ring-inset ring-primary' : ''}`}
                        onClick={(e) => handleCellClick(rowIndex, header, e)}
                    >
                        <input
                        type="text"
                        value={row[header] || ''}
                        onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                        className="w-full h-full p-2 bg-transparent border-none focus:outline-none focus:bg-background"
                        />
                    </td>
                    );
                })}
                <td className="border-b border-border"></td>
                </tr>
            ))}
            <tr>
                <td className="p-2 border-r border-border text-center">
                    <button onClick={addRow} className="p-1 hover:bg-primary/10 text-primary rounded" title="Add Row">
                        <Plus size={14} />
                    </button>
                </td>
                <td colSpan={headers.length + 1} className="p-2 text-muted-foreground text-xs italic">
                    Click + to add row
                </td>
            </tr>
            </tbody>
        </table>
        {data.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
            No data. Upload a CSV to get started.
            </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-2 border-t border-border bg-muted/30 text-sm">
            <div className="text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} rows
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 hover:bg-muted rounded disabled:opacity-50"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="font-medium">
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 hover:bg-muted rounded disabled:opacity-50"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
