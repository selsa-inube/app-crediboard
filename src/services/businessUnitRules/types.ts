interface ICondition {
  condition: string;
  value: string | number;
}

export interface IBusinessUnitRules {
  ruleName: string;
  conditions: ICondition[];
}

interface IBusinessConditions {
  name: string;
  dataType: string;
  value: string;
  valueUse: string;
}

export interface IBusinessUnitRulesResponse {
  name: string;
  dataType: string;
  value: string;
  valueUse: string;
  startDate: string;
  totalConditionsEvaluated: number;
  dataEvaluated: string[];
  typeDecision: string;
  conditions: IBusinessConditions[];
}
