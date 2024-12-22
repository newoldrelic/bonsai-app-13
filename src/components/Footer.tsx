import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TreeDeciduous, Stethoscope, MessageCircle, Leaf, Compass } from 'lucide-react';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TreeDeciduous, Stethoscope, MessageCircle, Leaf, Compass } from 'lucide-react';

export function Footer() {
  const navigate = useNavigate();

  const mainItems = [
    { id: 'garden', name: 'Garden', icon: TreeDeciduous, path: '/dashboard' },
    { id: 'diagnose', name: 'Health', icon: Stethoscope, path: '/health-analytics' },
    { id: 'coaching', name: 'Coach', icon: MessageCircle, path: '/expert-coaching' },
    { id: 'species', name: 'Identify', icon: Leaf, path: '/species-identifier' },
    { id: 'guide', name: 'Styles', icon: Compass, path: '/guide' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-bonsai-stone dark:bg-stone-900 border-t border-white/10 py-4 z-40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-5 gap-2 text-white/80">
          {mainItems.map(item => (
            <button 
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center p-2 hover:bg-stone-700/80 dark:hover:bg-stone-800 rounded-lg transition-colors group"
            >
              <item.icon className="w-6 h-6 text-bonsai-green group-hover:scale-110 transition-transform" />
              <span className="text-center text-sm mt-1 line-clamp-1 dark:text-white/90">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}