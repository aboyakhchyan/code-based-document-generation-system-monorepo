import React from "react";
import { cn } from "./utils";

interface ITableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table: React.FC<ITableProps> = ({
  children,
  className,
  ...props
}) => (
  <table
    {...props}
    className={cn(
      "min-w-full border-separate border-spacing-0 rounded-lg shadow-lg overflow-hidden",
      className
    )}
  >
    {children}
  </table>
);

interface ITableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHeader: React.FC<ITableHeaderProps> = ({
  children,
  className,
  ...props
}) => (
  <thead {...props} className={cn("bg-gray-50", className)}>
    {children}
  </thead>
);

interface ITableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody: React.FC<ITableBodyProps> = ({
  children,
  className,
  ...props
}) => (
  <tbody {...props} className={cn("", className)}>
    {children}
  </tbody>
);

interface ITrProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  even?: boolean;
}

export const Tr: React.FC<ITrProps> = ({
  children,
  even,
  className,
  ...props
}) => (
  <tr
    {...props}
    className={cn(
      "transition-colors hover:bg-gray-200",
      even && "bg-gray-100",
      className
    )}
  >
    {children}
  </tr>
);

interface IThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const Th: React.FC<IThProps> = ({ children, className, ...props }) => (
  <th
    {...props}
    className={cn(
      "px-6 py-3 text-left text-primary-800 font-semibold",
      className
    )}
  >
    {children}
  </th>
);

interface ITdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const Td: React.FC<ITdProps> = ({ children, className, ...props }) => (
  <td {...props} className={cn("px-6 py-4 text-gray-700 truncate", className)}>
    {children}
  </td>
);
