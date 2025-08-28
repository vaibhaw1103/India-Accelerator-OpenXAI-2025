import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function highlightKeywords(text: string, keywords: string[]): string {
  let highlightedText = text
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    highlightedText = highlightedText.replace(regex, `<span class="keyword-highlight">${keyword}</span>`)
  })
  return highlightedText
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
