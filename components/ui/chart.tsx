"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type ChartConfig = {
  [key: string]: {
    label: string
    color?: string
  }
}

export function ChartContainer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface ChartTooltipProps {
  cursor?: boolean
  content?: React.ReactNode
}

export function ChartTooltip({
  cursor = true,
  content,
  ...props
}: ChartTooltipProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-50 rounded-md border bg-background px-3 py-2 text-sm shadow-md transition-opacity",
        cursor ? "cursor-pointer" : "cursor-none"
      )}
      {...props}
    >
      {content}
    </div>
  )
}

interface ChartTooltipContentProps {
  hideLabel?: boolean
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      flag: string
      count: number
    }
  }>
}

export function ChartTooltipContent({
  hideLabel = false,
  active,
  payload,
  ...props
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  return (
    <div className="flex flex-col gap-1" {...props}>
      {!hideLabel && (
        <div className="text-xs font-medium text-muted-foreground">
          {data.flag}
        </div>
      )}
      <div className="text-sm font-medium">
        {data.count}
      </div>
    </div>
  )
}
