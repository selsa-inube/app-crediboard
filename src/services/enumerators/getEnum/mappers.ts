import { IEnumerator } from "../types";

const mapEnumeratorsEntity = (
  data: Record<string, string | number | object>
): IEnumerator => {
  const creditRequest: IEnumerator = {
    code: String(data.code || ""),
    description: String(data.description || ""),
  };
  return creditRequest;
};

const mapEnumeratorsEntities = (
  creditRequest: Record<string, string | number | object>[]
): IEnumerator[] => {
  return creditRequest.map(mapEnumeratorsEntity);
};

export { mapEnumeratorsEntity, mapEnumeratorsEntities };
