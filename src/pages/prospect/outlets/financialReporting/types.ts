export interface IErrorsUnread {
  errorIssuedId: string;
  errorDescription: string;
}

export interface IErrorService {
  id: string;
  message: string | Error;
}
