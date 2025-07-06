import { startOfMonth, endOfMonth, format } from 'date-fns';

export function monthToDateRange(month: string): { from: string; to: string } {
  // Convert "2024-01" to { from: "2024-01-01T00:00:00", to: "2024-01-31T23:59:59" }
  const [year, monthStr] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthStr) - 1, 1);

  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);

  return {
    from: format(startDate, "yyyy-MM-dd'T'00:00:00"),
    to: format(endDate, "yyyy-MM-dd'T'23:59:59")
  };
}
