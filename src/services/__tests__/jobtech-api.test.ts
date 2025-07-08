import { GetHistoricalVacanciesByRange, JobTechAPIError } from '../jobtech-api';
import { JobTechSearchResponse } from '@/types/jobtech-api';

// Mock the external fetch
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Mock date-fns functions
jest.mock('@/lib/date-utils', () => ({
  monthToDateRange: jest.fn((month: string) => ({
    from: `${month}-01T00:00:00`,
    to: `${month}-31T23:59:59`
  }))
}));

describe('GetHistoricalVacanciesByRange', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Mock console.warn to avoid noise in test output
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockApiResponse: JobTechSearchResponse = {
    total: { value: 12345 },
    positions: 20000,
    query_time_in_millis: 50,
    result_time_in_millis: 60,
    hits: []
  };

  it('should return an array with a single vacancy record for a given month', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    } as Response);

    const result = await GetHistoricalVacanciesByRange('2024-01', '2024-01');

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('month', '2024-01');
    expect(result[0]).toHaveProperty('region', 'all');
    expect(result[0]).toHaveProperty('occupation', 'all');
    expect(result[0]).toHaveProperty('count', 12345);
    expect(typeof result[0].count).toBe('number');
  });

  it('should handle region filter', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockApiResponse, total: { value: 5678 } })
    } as Response);

    const result = await GetHistoricalVacanciesByRange(
      '2024-01',
      '2024-01',
      'stockholms-län'
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('region', 'stockholms-län');
    expect(result[0]).toHaveProperty('month', '2024-01');
    expect(result[0].count).toBe(5678);
  });

  it('should handle occupation filter', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockApiResponse, total: { value: 3456 } })
    } as Response);

    const result = await GetHistoricalVacanciesByRange(
      '2024-01',
      '2024-01',
      undefined,
      'mjukvaru-systemutvecklare'
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('occupation', 'mjukvaru-systemutvecklare');
    expect(result[0]).toHaveProperty('region', 'all');
    expect(result[0].count).toBe(3456);
  });

  it('should handle both filters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockApiResponse, total: { value: 789 } })
    } as Response);

    const result = await GetHistoricalVacanciesByRange(
      '2024-01',
      '2024-01',
      'stockholms-län',
      'mjukvaru-systemutvecklare'
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('region', 'stockholms-län');
    expect(result[0]).toHaveProperty('occupation', 'mjukvaru-systemutvecklare');
    expect(result[0].count).toBe(789);
  });

  it('should build correct API URL with filters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    } as Response);

    await GetHistoricalVacanciesByRange(
      '2024-01',
      '2024-01',
      'stockholms-län',
      'mjukvaru-systemutvecklare'
    );

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://historical.api.jobtechdev.se/search'),
      expect.objectContaining({
        next: { revalidate: 3600 * 24 * 30 }
      })
    );

    const callUrl = mockFetch.mock.calls[0][0] as string;
    expect(callUrl).toContain('historical-from=2024-01-01T00%3A00%3A00');
    expect(callUrl).toContain('historical-to=2024-01-31T23%3A59%3A59');
    expect(callUrl).toContain('region=01');
    expect(callUrl).toContain('occupation-group=2512');
  });

  it('should add country filter when no region specified', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    } as Response);

    await GetHistoricalVacanciesByRange('2024-01', '2024-01');

    const callUrl = mockFetch.mock.calls[0][0] as string;
    expect(callUrl).toContain('country=199'); // Sweden
  });

  it('should handle API failure gracefully with placeholder data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    } as Response);

    const result = await GetHistoricalVacanciesByRange('2024-01', '2024-01');

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('month', '2024-01');
    expect(result[0]).toHaveProperty('count', 0); // Placeholder count for failed request
    expect(console.warn).toHaveBeenCalledWith(
      'Some monthly data failed to fetch:',
      expect.arrayContaining([
        expect.stringContaining('Failed to fetch data for 2024-01')
      ])
    );
  });

  it('should handle network failure gracefully with placeholder data', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await GetHistoricalVacanciesByRange('2024-01', '2024-01');

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('month', '2024-01');
    expect(result[0]).toHaveProperty('count', 0); // Placeholder count for failed request
    expect(console.warn).toHaveBeenCalledWith(
      'Some monthly data failed to fetch:',
      expect.arrayContaining([
        expect.stringContaining('Failed to fetch data for 2024-01')
      ])
    );
  });

  it('should handle multiple months in date range', async () => {
    // Mock responses for multiple months
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockApiResponse, total: { value: 1000 } })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockApiResponse, total: { value: 2000 } })
      } as Response);

    const result = await GetHistoricalVacanciesByRange('2024-01', '2024-02');

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('month', '2024-01');
    expect(result[0].count).toBe(1000);
    expect(result[1]).toHaveProperty('month', '2024-02');
    expect(result[1].count).toBe(2000);
  });

  it('should return empty array for invalid date range', async () => {
    const result = await GetHistoricalVacanciesByRange(
      'invalid-date',
      '2024-01'
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });
});
