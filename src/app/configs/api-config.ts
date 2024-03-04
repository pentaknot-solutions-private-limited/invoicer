export interface IResponseSchema {
  message?: string;
  error?: string;
  data?: any;
  statusCode?: number;
  status: string;
}
