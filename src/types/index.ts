export interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  requester: string;
  approver: string;
  requestType: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'requester' | 'approver';
}