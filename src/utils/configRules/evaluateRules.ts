import {
  IBusinessUnitRules,
  IBusinessUnitRulesResponse,
} from "@services/businessUnitRules/types";
import { Rule } from "./types";

export function removeDuplicates<
  T extends { [K in KKey]: string },
  KKey extends keyof T,
>(arr: T[], key: KKey): T[] {
  const seen = new Set<string>();
  return arr.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export async function evaluateRule(
  rule: Rule,
  endpoint: (
    business: string,
    data: Rule
  ) => Promise<IBusinessUnitRules | undefined>,
  uniqueKey: string,
  business: string
): Promise<IBusinessUnitRulesResponse[]> {
  const response = await endpoint(business, rule);

  if (!response || !Array.isArray(response) || response.length === 0) {
    return [];
  }

  const unique = removeDuplicates(response, uniqueKey);
  return unique.map((item) => item[uniqueKey]);
}
