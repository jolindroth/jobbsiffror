export interface JobTechSearchResponse {
  total: {
    value: number;
  };
  positions: number;
  query_time_in_millis: number;
  result_time_in_millis: number;
  hits: JobTechHit[];
}

export interface JobTechHit {
  _source: {
    workplace_address?: {
      region_code?: string;
    };
    occupation_group?: {
      concept_id?: string;
    };
  };
}
