// types/feature-request.ts

export type FeatureRequestStatus = 'pending' | 'planned' | 'in-progress' | 'completed' | 'declined';

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  votes: number;
  userId: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewFeatureRequest = Omit<FeatureRequest, 'id' | 'votes' | 'status' | 'createdAt' | 'updatedAt'>;