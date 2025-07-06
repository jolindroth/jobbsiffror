import { GetVacancies, JobTechAPIError } from '../jobtech-api';
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

describe('GetVacancies', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  const mockApiResponse: JobTechSearchResponse = {
    total: { value: 12345 },
    positions: 20000,
    query_time_in_millis: 50,
    result_time_in_millis: 60,
    hits: []
  };

  it('should return a single vacancy record for a given month', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    } as Response);

    const result = await GetVacancies('2024-01');

    expect(result).toHaveProperty('month', '2024-01');
    expect(result).toHaveProperty('region', 'all');
    expect(result).toHaveProperty('occupation', 'all');
    expect(result).toHaveProperty('count', 12345);
    expect(typeof result.count).toBe('number');
  });

  it('should handle region filter', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockApiResponse, total: { value: 5678 } })
    } as Response);

    const result = await GetVacancies('2024-01', 'stockholms-län');

    expect(result).toHaveProperty('region', 'stockholms-län');
    expect(result).toHaveProperty('month', '2024-01');
    expect(result).toHaveProperty('count', 5678);
  });

  it('should handle occupation filter', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockApiResponse, total: { value: 3456 } })
    } as Response);

    const result = await GetVacancies(
      '2024-01',
      undefined,
      'mjukvaru-systemutvecklare'
    );

    expect(result).toHaveProperty('occupation', 'mjukvaru-systemutvecklare');
    expect(result).toHaveProperty('region', 'all');
    expect(result).toHaveProperty('count', 3456);
  });

  it('should handle both filters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockApiResponse, total: { value: 789 } })
    } as Response);

    const result = await GetVacancies(
      '2024-01',
      'stockholms-län',
      'mjukvaru-systemutvecklare'
    );

    expect(result).toHaveProperty('region', 'stockholms-län');
    expect(result).toHaveProperty('occupation', 'mjukvaru-systemutvecklare');
    expect(result).toHaveProperty('count', 789);
  });

  it('should build correct API URL with filters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    } as Response);

    await GetVacancies(
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

    await GetVacancies('2024-01');

    const callUrl = mockFetch.mock.calls[0][0] as string;
    expect(callUrl).toContain('country=199'); // Sweden
  });

  it('should throw JobTechAPIError on API failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    } as Response);

    await expect(GetVacancies('2024-01')).rejects.toThrow(
      'API request failed: 500'
    );
  });

  it('should throw JobTechAPIError on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(GetVacancies('2024-01')).rejects.toThrow(
      'Failed to fetch vacancy data: Network error'
    );
  });
});
