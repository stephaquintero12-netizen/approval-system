export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  full_name: string;
  role: string; 
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApprovalRequest {
  id: number;
  request_id: string;
  title: string;
  description: string;
  request_type: string; 
  status: string; 
  priority: string; 
  requester_id: number;
  approver_id: number;
  created_at: string;
  updated_at?: string;
  requester_username?: string;
  requester_name?: string;
  approver_username?: string;
  approver_name?: string;
}

export type RequestType = 'despliegue' | 'acceso' | 'cambio' | 'herramienta';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type RequestPriority = 'low' | 'medium' | 'high';
export type UserRole = 'user' | 'admin';

export interface NewRequestData {
  title: string;
  description: string;
  request_type: RequestType;
  priority: RequestPriority;
  requester_id: number;
  approver_id: number;
}

export interface RequestHistory {
  id: number;
  request_id: number;
  user_id: number;
  action: string;
  comment: string;
  created_at: string;
  username?: string;
  full_name?: string;
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  createdAt: string;
}

export interface ApprovalActionData {
  user_id: number;
  comment?: string;
}