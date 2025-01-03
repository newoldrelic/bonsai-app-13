import React, { useEffect, useRef, useState } from 'react';
import { PhoneCall, MessageCircle, Crown, ArrowRight, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { ChatInterface } from '../components/ChatInterface';
import { AI_PROMPTS } from '../config/ai-prompts';
import ExpertInfoPopover from '../components/ExpertInfoPopover';

export function ExpertCoachingPage() {
  const navigate = useNavigate();
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan !== 'hobby';
  const chatRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark component as loaded
    setIsLoaded(true);

    // First, ensure we're at the top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Then set up the scroll to chat
    const timer = setTimeout(() => {
      if (chatRef.current) {
        const startPosition = window.scrollY;
        const chatTop = chatRef.current.getBoundingClientRect().top + window.scrollY;
        const headerOffset = 80;
        const targetPosition = chatTop - headerOffset;
        const duration = 1500; // Duration in milliseconds - increase this for slower scroll
        const startTime = performance.now();

        function scrollStep(currentTime: number) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smoother animation
          const easeInOutCubic = (t: number) => 
            t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

          window.scrollTo(0, startPosition + (targetPosition - startPosition) * easeInOutCubic(progress));

          if (progress < 1) {
            requestAnimationFrame(scrollStep);
          }
        }

        requestAnimationFrame(scrollStep);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (message: string) => {
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        systemPrompt: AI_PROMPTS.expertCoaching.prompt
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const data = await response.json();
    return data.response;
  };

  if (!isSubscribed) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card p-6">
            <div className="p-4 bg-bonsai-terra/10 rounded-lg flex items-start space-x-3">
              <Crown className="w-5 h-5 text-bonsai-terra flex-shrink-0 mt-1" />
              <div>
                <p className="text-bonsai-terra font-medium">Premium Feature</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Upgrade to Premium to access AI-powered expert coaching through chat.
                </p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="mt-3 text-bonsai-terra hover:text-bonsai-clay transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <span>View Pricing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className={`text-center mb-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <PhoneCall className="w-8 h-8 text-bonsai-green" />
              <h1 className="text-3xl font-bold text-bonsai-bark dark:text-white">AI Expert Coaching</h1>
              <ExpertInfoPopover />
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Get expert guidance through chat or voice interaction based on knowledge from Ken Nakamura, your bonsai expert.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="mb-4">
            <div className="flex space-x-4 justify-center">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-bonsai-green text-white">
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => navigate('/voice-chat')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
              >
                <Phone className="w-5 h-5" />
                <span>Voice</span>
              </button>
            </div>
          </div>

          {/* Chat Interface Container */}
          <div 
            ref={chatRef}
            className="h-[calc(100vh-12rem)]"
          >
            <div className="h-full flex flex-col bg-white dark:bg-stone-800 rounded-lg shadow-sm">
              <ChatInterface 
                onSendMessage={handleSendMessage}
                className="flex-1 overflow-y-auto" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}