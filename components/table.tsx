import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "../lib/utils";

interface TableProps<T> {
  data: T[];
  columns: any[];
  className?: string;
}

export default function Table<T>({ data, columns, className }: TableProps<T>) {
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className={cn("w-full table-fixed text-sm", className)}>
      <thead className="border-b text-xs">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="p-3 text-left align-middle">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, index) => (
          <tr
            key={row.id}
            className={cn(
              "h-16 border-b align-middle",
              index === data.length - 1 && "border-b-0",
            )}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="p-3 align-middle">
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
