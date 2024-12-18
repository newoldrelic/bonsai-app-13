import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TreeDeciduous, Stethoscope, MessageCircle, Leaf, MoreHorizontal, Compass, Home, CreditCard } from 'lucide-react';

export function Footer() {
  const navigate = useNavigate();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainItems = [
    { id: 'garden', name: 'My Bonsai Garden', icon: TreeDeciduous, path: '/dashboard' },
    { id: 'diagnose', name: 'Diagnose', icon: Stethoscope, path: '/health-analytics' },
    { id: 'coaching', name: 'Coaching', icon: MessageCircle, path: '/expert-coaching' },
    { id: 'species', name: 'Species Identifier', icon: Leaf, path: '/species-identifier' },
  ];

  const moreItems = [
    { id: 'guide', name: 'Style Guide', icon: Compass, path: '/guide' },
    { id: 'pricing', name: 'Pricing', icon: CreditCard, path: '/pricing' },
    { id: 'home', name: 'Home', icon: Home, path: '/' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-bonsai-stone dark:bg-stone-900 border-t border-white/10 py-4 z-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-5 gap-4 text-white/80">
          {mainItems.map(item => (
            <button 
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center p-2 hover:bg-stone-700/80 dark:hover:bg-stone-800 rounded-lg transition-colors group"
            >
              <item.icon className="w-7 h-7 text-bonsai-green group-hover:scale-110 transition-transform" />
              <span className="text-center text-sm mt-1 line-clamp-1 dark:text-white/90">
                {item.name}
              </span>
            </button>
          ))}

          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="w-full flex flex-col items-center p-2 hover:bg-stone-700/80 dark:hover:bg-stone-800 rounded-lg transition-colors group"
            >
              <MoreHorizontal className="w-7 h-7 text-bonsai-green group-hover:scale-110 transition-transform" />
              <span className="text-center text-sm mt-1 line-clamp-1 dark:text-white/90">
                More
              </span>
            </button>

            {showMoreMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-stone-800 rounded-lg shadow-lg overflow-hidden z-50">
                  {moreItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setShowMoreMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-stone-600 dark:text-stone-300"
                    >
                      <item.icon className="w-5 h-5 text-bonsai-green" />
                      <span className="text-sm">{item.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}