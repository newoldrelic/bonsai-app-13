import { Book, Leaf, Stethoscope, TreeDeciduous, Home, CreditCard, Compass, PhoneCall } from 'lucide-react';
import type { IconType } from 'lucide-react';

export interface Feature {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: IconType;
  isPremium: boolean;
}

export const FEATURES: Feature[] = [
  {
    id: 'collection',
    name: 'Tree Collection',
    description: 'Manage and track your bonsai collection',
    path: '/dashboard',
    icon: TreeDeciduous,
    isPremium: false
  },
  {
    id: 'species-identifier',
    name: 'Species Identifier',
    description: 'Instantly identify your bonsai species using AI technology (3 free uses)',
    path: '/species-identifier',
    icon: Leaf,
    isPremium: false
  },
  {
    id: 'style-guide',
    name: 'Style Guide',
    description: 'Learn about traditional bonsai styles and techniques',
    path: '/guide',
    icon: Compass,
    isPremium: false
  },
  {
    id: 'health-analytics',
    name: 'Dynamic Health Analytics',
    description: 'Get instant expert analysis and personalized treatment recommendations',
    path: '/health-analytics',
    icon: Stethoscope,
    isPremium: true
  },
  {
    id: 'care-guide',
    name: 'Tailored Care Guide',
    description: 'Expert care instructions customized to your tree and location',
    path: '/care-guide',
    icon: Book,
    isPremium: true
  },
  {
    id: 'expert-coaching',
    name: 'Expert Coaching',
    description: 'One-on-one video calls and chat support with bonsai masters',
    path: '/expert-coaching',
    icon: PhoneCall,
    isPremium: true
  }
];