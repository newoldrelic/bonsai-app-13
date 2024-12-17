import React from 'react';
import { Bot, MessageCircle, Crown, ArrowRight, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { ChatInterface } from '../components/ChatInterface';
import { AI_PROMPTS } from '../config/ai-prompts';

export function ExpertCoachingPage() {
  const navigate = useNavigate();
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan !== 'hobby';

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="w-8 h-8 text-bonsai-green" />
            <h1 className="text-3xl font-bold text-bonsai-bark dark:text-white">AI Expert Coaching</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Get expert guidance through chat or voice interaction based on knowledge from Ken Nakamura, your bonsai expert.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 justify-center">
            <button
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-bonsai-green text-white"
            >
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

        <ChatInterface onSendMessage={handleSendMessage} />

        <div className="mt-8 card p-6">
          <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">About Your Expert</h2>
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <p className="text-sm">
              Ken Nakamur-ai is an AI bonsai expert trained on decades of bonsai knowledge. He provides guidance on:
            </p>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              <ul className="space-y-1">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-bonsai-green rounded-full"></span>
                  <span>Watering techniques</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-bonsai-green rounded-full"></span>
                  <span>Pruning methods</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-bonsai-green rounded-full"></span>
                  <span>Wiring guidance</span>
                </li>
              </ul>
              <ul className="space-y-1">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-bonsai-green rounded-full"></span>
                  <span>Seasonal care</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-bonsai-green rounded-full"></span>
                  <span>Disease control</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-bonsai-green rounded-full"></span>
                  <span>Tool selection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}