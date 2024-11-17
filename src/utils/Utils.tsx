export interface AxiosError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}