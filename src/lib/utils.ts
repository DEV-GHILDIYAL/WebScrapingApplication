import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FAILURE_RATE } from './constants';

/**
 * Utility for merging Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility for simulating network delay
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Utility for random failure simulation
 */
export const shouldFail = (probability: number = FAILURE_RATE) => Math.random() < probability;

/**
 * Format relative time (e.g. "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

/**
 * Generate a random numeric string/ID
 */
export const generateId = (prefix: string = '') => `${prefix}${Math.random().toString(36).substring(2, 9)}`;

/**
 * Download a file in the browser
 */
export function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert an array of objects to CSV string
 */
export function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => 
    headers.map(header => JSON.stringify(obj[header] || '')).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Generate realistic mock data based on fields
 */
export function generateRealisticData(fields: any[], count: number = 10): any[] {
  const mockValues: Record<string, string[]> = {
    title: ['Premium Wireless Headphones', 'Self-Cleaning Water Bottle', 'Smart Garden Kit', 'Organic Cotton T-Shirt', 'Minimalist Desk Lamp'],
    price: ['$59.99', '$35.00', '$120.00', '$24.50', '$45.00'],
    rating: ['4.8', '4.2', '4.9', '3.8', '4.5'],
    stock: ['In Stock', 'Limited', 'Out of Stock'],
    category: ['Electronics', 'Lifestyle', 'Home Decor', 'Apparel'],
    sku: ['SF-101', 'SF-202', 'SF-303', 'SF-404', 'SF-505'],
  };

  return Array.from({ length: count }, (_, i) => {
    const item: Record<string, any> = { id: i + 1 };
    fields.forEach(field => {
      const fieldName = field.name.toLowerCase();
      const possibleValues = mockValues[fieldName] || [`Value for ${field.name} ${i + 1}`, `Data point ${i + 1}`];
      item[field.name] = possibleValues[Math.floor(Math.random() * possibleValues.length)];
    });
    return item;
  });
}
