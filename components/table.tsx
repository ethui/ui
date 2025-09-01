import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "../lib/utils.js";

interface TableProps<T> {
  data: T[];
  columns: any[];
  className?: string;
  rowClassName?: string;
  variant?: "primary" | "secondary";
  showHeader?: boolean;
}

export function Table<T>({
  data,
  columns,
  className,
  rowClassName,
  variant = "primary",
  showHeader = true,
}: TableProps<T>) {
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className={cn("w-full table-fixed text-sm", className)}>
      {showHeader && (
        <thead className="border-b text-xs">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    "p-3 text-left align-middle",
                    variant === "secondary" && "border",
                  )}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
      )}
      <tbody>
        {table.getRowModel().rows.map((row, index) => (
          <tr
            key={row.id}
            className={cn(
              "h-10 border-b align-middle",
              index === data.length - 1 && "border-b-0",
              rowClassName,
            )}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={cn(
                  "px-3 align-middle",
                  variant === "secondary" && "border",
                )}
              >
                <div className="truncate">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
