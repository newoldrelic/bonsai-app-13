// types/support-request.ts

export type SupportRequestStatus = 'pending' | 'in-progress' | 'resolved' | 'closed';

export interface SupportRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: SupportRequestStatus;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export type NewSupportRequest = Omit<SupportRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'resolvedAt'>;