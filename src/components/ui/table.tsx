import { cn } from "../../lib/utils"
import { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react"

export function Table({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn(
        "w-full rounded-lg shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={className} {...props} />
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "",
        className
      )}
      {...props}
    />
  )
}

type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement> & {
  width?: string
}

export function TableHead({
  className,
  width,
  style,
  ...props
}: TableHeadProps) {
  return (
    <th
      className={cn("text-left p-2 font-medium", className)}
      style={{ width, ...style }}
      {...props}
    />
  )
}

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  width?: string
}

export function TableCell({
  className,
  width,
  style,
  ...props
}: TableCellProps) {
  return (
    <td
      className={cn("p-2 align-middle", className)}
      style={{ width, ...style }}
      {...props}
    />
  )
}
