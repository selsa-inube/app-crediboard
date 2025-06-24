export interface ICondition {
  condition: string;
  value: string | number;
}

export interface Irule {
  ruleName: string;
  conditions: ICondition[];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContextData = Record<string, any>;

export type Rule = Irule;

export type RuleBuilder = (contextData: ContextData) => Rule;
