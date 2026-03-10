import { api } from './api';
 
export interface HealthResponse {
  status: string;
}
 
export const healthCheck = () =>
  api<HealthResponse>('/health');
 
 