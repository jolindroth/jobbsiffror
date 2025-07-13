import {
  startOfMonth,
  endOfMonth,
  format,
  subMonths,
  parseISO
} from 'date-fns';

export function monthToDateRange(month: string): { from: string; to: string } {
  // Convert "2024-01" to { from: "2024-01-01T00:00:00", to: "2024-01-31T23:59:59" }
  // Parse the month string as an ISO date (add day to make it valid)
  const monthDate = parseISO(`${month}-01`);

  const startDate = startOfMonth(monthDate);
  const endDate = endOfMonth(monthDate);

  return {
    from: format(startDate, "yyyy-MM-dd'T'00:00:00"),
    to: format(endDate, "yyyy-MM-dd'T'23:59:59")
  };
}

export function getDefaultFromDate(): string {
  // Default to 12 months ago using date-fns
  const today = new Date();
  const date = subMonths(today, 12);
  return format(date, "yyyy-MM-dd'T'00:00:00");
}

export function getDefaultToDate(): string {
  // Default to today using date-fns
  const today = new Date();
  return format(today, "yyyy-MM-dd'T'23:59:59");
}

export function formatDateForDisplay(dateStr: string): string {
  // Convert "2024-01-01T00:00:00" to readable format using parseISO
  return format(parseISO(dateStr), 'MMM yyyy');
}

export function formatMonthForDisplay(monthStr: string): string {
  // Convert "2024-01" to "Jan 2024"
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return format(date, 'MMM yyyy');
}

export function getDefaultFromMonth(): string {
  // Default to 12 months ago in YYYY-MM format
  const today = new Date();
  const date = subMonths(today, 12);
  return format(date, 'yyyy-MM');
}

export function getDefaultToMonth(): string {
  // Default to current month in YYYY-MM format
  const today = new Date();
  return format(today, 'yyyy-MM');
}

export function validateMonthFormat(monthStr: string): boolean {
  // Validate YYYY-MM format
  const regex = /^\d{4}-\d{2}$/;
  if (!regex.test(monthStr)) return false;

  const [year, month] = monthStr.split('-');
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);

  return (
    yearNum >= 2006 &&
    yearNum <= new Date().getFullYear() + 1 &&
    monthNum >= 1 &&
    monthNum <= 12
  );
}
