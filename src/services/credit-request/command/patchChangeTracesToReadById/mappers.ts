import { ICreditRequests } from "@services/types";

const mapChangeTracesToReadByIdEntity = (data: string): ICreditRequests => {
  const creditRequest: ICreditRequests = {
    creditRequestId: String(data),
  };
  return creditRequest;
};

export { mapChangeTracesToReadByIdEntity };
