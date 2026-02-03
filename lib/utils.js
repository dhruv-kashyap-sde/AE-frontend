import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDurationFromMonths(totalMonths) {
  if (totalMonths === null || totalMonths === undefined) return ""
  const months = Number(totalMonths)
  if (Number.isNaN(months) || months <= 0) return "0 months"

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  const parts = []
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "year" : "years"}`)
  }
  if (remainingMonths > 0) {
    parts.push(`${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`)
  }

  return parts.join(" ")
}
