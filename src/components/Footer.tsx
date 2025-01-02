import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TreeDeciduous, Stethoscope, MessageCircle, Leaf, Compass } from 'lucide-react';

export function Footer() {
  const navigate = useNavigate();

  const mainItems = [
    { id: 'garden', name: 'Garden', icon: TreeDeciduous, path: '/dashboard' },
    { id: 'guide', name: 'Styles', icon: Compass, path: '/guide' },
    { id: 'species', name: 'Identify', icon: Leaf, path: '/species-identifier' },
    { id: 'diagnose', name: 'Health', icon: Stethoscope, path: '/health-analytics' },
    { id: 'coaching', name: 'Coach', icon: MessageCircle, path: '/expert-coaching' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-bonsai-stone dark:bg-stone-900 border-t border-white/10 z-40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-5 gap-2">
          {mainItems.map(item => (
            <button 
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center py-3 px-2 hover:bg-stone-700/80 dark:hover:bg-stone-800 rounded-lg transition-colors group"
            >
              <item.icon className="w-6 h-6 text-bonsai-green group-hover:scale-110 transition-transform" />
              <span className="text-center text-xs mt-1 text-white/90 dark:text-white/90 line-clamp-1">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}