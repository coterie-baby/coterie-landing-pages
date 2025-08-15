import React from 'react';

export interface ComparisonColumn {
  name: string;
  subtitle?: string;
  highlighted?: boolean;
}

export interface ComparisonRow {
  label: string;
  description?: string;
  values: (string | boolean | { value: string })[];
  unit?: string;
  footnote?: string;
}

export interface ComparisonTableProps {
  title?: string;
  columns?: ComparisonColumn[];
  rows?: ComparisonRow[];
  footnotes?: (string | { footnote: string })[];
}

export default function ComparisonTable({
  title,
  columns,
  rows,
  footnotes,
}: ComparisonTableProps) {
  // Transform data format
  const processedRows =
    rows?.map((row) => ({
      ...row,
      values:
        row.values?.map((v) => {
          if (typeof v === 'object' && v !== null && 'value' in v) {
            // Handle object format: { value: "string" }
            const val = v.value;
            if (val === 'true') return true;
            if (val === 'false') return false;
            return val;
          }
          return v;
        }) || [],
    })) || [];

  const processedFootnotes =
    footnotes?.map((f) =>
      typeof f === 'object' && f !== null && 'footnote' in f ? f.footnote : f
    ) || [];
  const renderValue = (value: string | boolean, unit?: string, isHighlighted?: boolean) => {
    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
    
    return (
      <div className="text-center">
        <span className={`text-sm ${isHighlighted ? 'text-[#0000C9]' : ''}`}>{displayValue}</span>
        {unit && <span className={`text-xs ml-1 ${isHighlighted ? 'text-[#0000C9]' : 'text-gray-600'}`}>{unit}</span>}
      </div>
    );
  };

  const columnCount = columns?.length || 0;
  const columnWidth =
    columnCount <= 2 ? 'w-1/3' : columnCount <= 4 ? 'w-1/5' : 'w-1/6';
  const minWidth =
    columnCount <= 2
      ? 'min-w-[320px]'
      : columnCount <= 4
      ? 'min-w-[480px]'
      : 'min-w-[640px]';

  return (
    <div className="flex flex-col gap-10 px-4 py-15 w-full md:px-10 md:gap-15">
      <h3 className="md:text-[42px]! md:tracking-[-0.84px]!">{title}</h3>
      <div>
        <div className="bg-white border border-[#E0E0E0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full ${minWidth}`}>
              {/* Header */}
              <thead className="font-normal">
                <tr className="border-b border-[#E0E0E0]">
                  <th
                    className={`text-left p-4 ${columnWidth} border-r border-[#E0E0E0] md:h-[100px]`}
                  ></th>
                  {columns?.map((column, index) => (
                    <th
                      key={index}
                      className={`p-4 ${columnWidth} ${
                        index === 0 ? 'bg-[#D1E3FB]' : ''
                      } ${
                        index < columns.length - 1
                          ? 'border-r border-[#E0E0E0]'
                          : ''
                      } md:h-[100px]`}
                    >
                      <div className="text-center">
                        <div
                          className={`text-sm ${
                            index === 0 ? 'text-[#0000C9]' : ''
                          }`}
                        >
                          {column.name}
                        </div>
                        {column.subtitle && (
                          <div className="text-xs text-[#272727B2] mt-1">
                            {column.subtitle}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {processedRows?.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#E0E0E0] last:border-b-0"
                  >
                    <td
                      className={`p-4 text-left ${columnWidth} border-r border-[#E0E0E0] md:h-[100px]`}
                    >
                      <div className="text-sm">
                        {row.label}
                        {row.footnote && (
                          <span className="text-xs text-[#525252] align-super">
                            {row.footnote}
                          </span>
                        )}
                      </div>
                      {row.description && (
                        <div className="text-xs text-[#525252] mt-1">
                          {row.description}
                        </div>
                      )}
                    </td>
                    {columns?.map((_, colIndex) => (
                      <td
                        key={colIndex}
                        className={`p-4 ${columnWidth} ${
                          colIndex === 0 ? 'bg-[#D1E3FB]' : ''
                        } ${
                          colIndex < columns.length - 1
                            ? 'border-r border-[#E0E0E0]'
                            : ''
                        } md:h-[100px]`}
                      >
                        {renderValue(row.values?.[colIndex], row.unit, colIndex === 0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {processedFootnotes && processedFootnotes.length > 0 && (
          <div className="mt-4 px-4">
            {processedFootnotes.map((footnote, index) => (
              <p key={index} className="text-xs text-gray-500 leading-relaxed">
                {footnote}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
