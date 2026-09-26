import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function amountToWords(amount: number): string {
  const digits = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  ];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const underHundred = (n: number): string => {
    if (n < 10) return digits[n];
    if (n < 20) return teens[n - 10];
    const unit = n % 10;
    const ten = Math.floor(n / 10);
    return `${tens[ten]}${unit ? ` ${digits[unit]}` : ''}`;
  };

  const underThousand = (n: number): string => {
    if (n < 100) return underHundred(n);
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    return `${digits[hundreds]} hundred${remainder ? ` ${underHundred(remainder)}` : ''}`;
  };

  const underMillion = (n: number): string => {
    if (n < 1000) return underThousand(n);
    const thousands = Math.floor(n / 1000);
    const remainder = n % 1000;
    return `${underThousand(thousands)} thousand${remainder ? ` ${underThousand(remainder)}` : ''}`;
  };

  const safeAmount = Math.trunc(Number(amount) || 0);
  const words = underMillion(safeAmount);
  const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
  return `${capitalized} Naira Only`;
}
