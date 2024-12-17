import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative h-[80vh] overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=1800"
        alt="Beautiful bonsai tree"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent dark:from-black/70 dark:via-black/50 dark:to-transparent light:from-white/70 light:via-white/50 light:to-transparent">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4">
              Bonsai For Beginners
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-xl mb-8">
              Your personal guide to the art of bonsai cultivation. Track, learn, and grow with expert guidance.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-primary group relative overflow-hidden px-6 py-3 rounded-full"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>View Your Collection</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}