import {
  ICreditRequest,
  ICreditRequestPinned,
} from "@services/creditRequest/query/types";

interface IBoardData {
  boardRequests: ICreditRequest[];
  requestsPinned: ICreditRequestPinned[];
}

interface IEnumerator {
  code: string;
  description: string;
}

export type { IBoardData, IEnumerator };
