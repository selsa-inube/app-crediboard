export interface ICondition {
  condition: string;
  value: string | number;
}

export interface Irule {
  ruleName: string;
  conditions: ICondition[];
}

export type ContextData = {
  [key: string]: string | number;
};

export type Rule = Irule;

export type RuleBuilder = (contextData: ContextData) => Rule;
