export interface IExceptionResponse {
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
}

export interface IExceptionResponseWithPath extends IExceptionResponse {
  path?: string;
}