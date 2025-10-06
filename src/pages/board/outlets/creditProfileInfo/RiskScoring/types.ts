export interface IRiskScoringRangeRequered {
  seniority_score: number;
  risk_center_score: number;
  job_stability_index_score: number;
  marital_status_score: number;
  economic_activity_score: number;
}

export interface IKeyRiskScoring {
  total_score: number;
  minimum_score: number;
  seniority: number;
  seniority_score: number;
  risk_center: number;
  risk_center_score: number;
  job_stability_index: number;
  job_stability_index_score: number;
  marital_status: string;
  marital_status_score: number;
  economic_activity: string;
  economic_activity_score: number;
}

export interface IRiskScoring {
  credit_request_id: string;
  risk_scoring: IKeyRiskScoring;
}
