import { Book, Leaf, Stethoscope, TreeDeciduous, Home, CreditCard, Compass, PhoneCall, HelpCircle, Lightbulb } from 'lucide-react';
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
    id: 'style-guide',
    name: 'Style Guide',
    description: 'Learn about traditional bonsai styles and techniques',
    path: '/guide',
    icon: Compass,
    isPremium: false
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Get help with your bonsai care journey',
    path: '/support',
    icon: HelpCircle,
    isPremium: false
  },
  {
    id: 'feature-requests',
    name: 'Feature Requests',
    description: 'Suggest and vote on new features',
    path: '/feature-requests',
    icon: Lightbulb,
    isPremium: false
  }
];