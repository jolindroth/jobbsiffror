# Task 006: SCB API Integration for Salary and Enhanced Job Market Data

## Objective

Integrate Statistics Sweden (SCB) API to add salary statistics and potentially enhanced job market data to our existing JobTech-based job statistics platform.

## Technical Integration Plan

### 1. SCB API Service Layer

**Create new service: `src/services/scb-api.ts`**

- Implement rate limiting (30 calls/10 seconds)
- Handle data cell limits (10,000 per request)
- Support multiple data formats (JSON, CSV, XLSX)
- Error handling for API failures
- Caching strategy for expensive queries

### 2. Data Integration Strategy

#### Phase 1: Salary Data Integration

**Primary Data Sources:**

- **TAB5696**: Current salary data by region, sector, occupation, gender (2023-2024)
- **TAB4262**: Historical salary data (2014-2022)
- **TAB4266**: Gender pay gap data by occupation (2014-2024)

**Key Functions to Implement:**

- `getSalaryByOccupationAndRegion(occupation, region, year?)`
- `getSalaryTrendsByOccupation(occupation, dateRange)`
- `getRegionalSalaryComparison(occupation)`
- `getOccupationSalaryComparison(region)`

#### Phase 2: Enhanced Job Market Data Evaluation

**Data Sources:**

- "Lediga jobb, hela ekonomin" tables (quarterly vacancy data 2001-2025)
- Regional and industry breakdowns
- Seasonally adjusted data

**Evaluation Criteria:**

- Compare data quality vs current JobTech API
- Assess historical coverage (SCB: 2001-2025 vs JobTech: varies)
- Evaluate regional granularity
- Check occupation classification compatibility (SSYK 2012)

### 3. Data Mapping and Transformation

#### Occupation Classification Mapping

- Map current occupation groups to SSYK 2012 classification
- Create bidirectional mapping between our URL slugs and SCB codes
- Handle occupation hierarchy differences

#### Regional Mapping

- Align our Swedish regions with SCB's regional classification
- Ensure consistency between JobTech and SCB regional data
- Handle any regional boundary changes

#### Time Series Alignment

- Standardize date formats between APIs
- Handle different data frequencies (monthly vs quarterly)
- Account for methodological changes in SCB data (2014, 2018)

### 4. Enhanced Data Models

#### New Types to Create

```typescript
interface SalaryData {
  occupation: string;
  region: string;
  sector: string;
  gender: string;
  baseSalary: number;
  monthlySalary: number;
  employeeCount: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  year: number;
}

interface SalaryTrend {
  occupation: string;
  region?: string;
  timeSeries: {
    period: string;
    salary: number;
    change: number;
  }[];
}
```

#### Enhanced Existing Models

- Extend `VacancyRecord` to include salary data
- Add salary comparison to dashboard statistics
- Include regional salary rankings

### 5. Integration Architecture

#### Service Layer Integration

- Create `SCBApiService` class with methods for:
  - Authentication handling (none required)
  - Rate limiting and queuing
  - Data parsing and transformation
  - Error handling and retries

#### Data Combination Strategy

- **Primary**: Keep JobTech API for real-time job postings
- **Enhancement**: Add SCB salary data for career intelligence
- **Evaluation**: Test SCB job vacancy data as potential JobTech replacement

#### Caching Strategy

- Cache SCB salary data (updates annually)
- Cache job vacancy data (updates quarterly)
- Implement cache invalidation for data freshness

### 6. API Endpoints to Implement

#### Core Salary Endpoints

- `GET /api/salary/occupation/{occupation}/region/{region}`
- `GET /api/salary/trends/{occupation}`
- `GET /api/salary/comparison/regions/{occupation}`
- `GET /api/salary/comparison/occupations/{region}`

#### Combined Intelligence Endpoints

- `GET /api/career-intelligence/{occupation}/{region}` (combines salary + vacancy data)
- `GET /api/market-analysis/{region}` (salary + demand trends)

### 7. Error Handling and Fallbacks

#### Rate Limiting Strategy

- Implement exponential backoff for rate limit hits
- Queue requests during high-traffic periods
- Prioritize user-facing requests over background updates

#### Data Availability Fallbacks

- Handle missing salary data gracefully
- Provide estimated ranges when exact data unavailable
- Clear messaging when data is incomplete

### 8. Testing Strategy

#### Unit Tests

- Test API response parsing
- Validate data transformation accuracy
- Test rate limiting and error handling

#### Integration Tests

- Test combined JobTech + SCB data queries
- Validate data consistency across APIs
- Test caching behavior

#### Performance Tests

- Measure API response times
- Test under rate limiting conditions
- Validate large dataset handling

### 9. Documentation Requirements

#### API Documentation

- Document new salary-related endpoints
- Explain data sources and limitations
- Provide integration examples

#### Data Source Attribution

- Credit SCB as data source
- Explain data collection methodology
- Document any data processing applied

### 10. Implementation Phases

#### Phase 1 (Weeks 1-2): Foundation

- Set up SCB API service layer
- Implement basic salary data retrieval
- Create data transformation functions

#### Phase 2 (Weeks 3-4): Integration

- Combine salary data with existing vacancy data
- Implement caching and rate limiting
- Add error handling and fallbacks

#### Phase 3 (Weeks 5-6): Enhancement

- Evaluate SCB job vacancy data
- Implement trend analysis features
- Add regional comparison capabilities

#### Phase 4 (Weeks 7-8): Optimization

- Performance optimization
- Enhanced caching strategies
- Comprehensive testing

## Key API Tables Identified

### Salary Data Tables

- **TAB5696**: Salary by region, sector, occupation (SSYK 2012), gender (2023-2024)
  - 8 Swedish regions
  - 432 occupation categories
  - Metrics: Base salary, monthly salary, employee count, confidence intervals
- **TAB4262**: Historical salary data (2014-2022) with similar breakdowns
- **TAB4266**: Gender pay gap data by occupation (2014-2024)

### Job Market Data Tables

- **"Lediga jobb, hela ekonomin"** series: Quarterly vacancy data (2001-2025)
  - Regional and industry breakdowns
  - Seasonally adjusted data
  - Comprehensive Swedish labor market coverage

## API Technical Specifications

- **Rate Limits**: 30 calls per 10-second window
- **Data Limits**: 10,000 data cells per request
- **Formats**: JSON, CSV, XLSX, Parquet
- **Authentication**: None required (open data)
- **License**: CC0 (no attribution required)
- **Base URL**: https://api.scb.se/ov0104/v2beta/

## Expected Outcomes

This integration will transform our job statistics platform into a comprehensive career intelligence tool by combining real-time job market data with authoritative salary statistics from Sweden's official statistics agency.

## Status

- [x] Research and analysis completed
- [ ] Implementation pending
