// pages/FeatureRequestPage.tsx

import React, { useState, useEffect } from 'react';
import { Lightbulb, ThumbsUp, Send, Crown, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useFeatureRequestStore } from '../store/featureRequestStore';
import type { FeatureRequestStatus } from '../types/feature-request';

export function FeatureRequestPage() {
  const [newRequest, setNewRequest] = useState({ title: '', description: '' });
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const { 
    requests, 
    loading, 
    error, 
    userVotes,
    submitRequest, 
    loadRequests, 
    voteForRequest,
    clearError 
  } = useFeatureRequestStore();

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/pricing');
      return;
    }

    await submitRequest({
      title: newRequest.title,
      description: newRequest.description,
      userId: user.uid,
      userEmail: user.email || ''
    });

    setNewRequest({ title: '', description: '' });
  };

  const getStatusColor = (status: FeatureRequestStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300';
      case 'planned':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
      case 'in-progress':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      case 'declined':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Lightbulb className="w-8 h-8 text-bonsai-green" />
            <h1 className="text-3xl font-bold text-bonsai-bark dark:text-white">Feature Requests</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Help shape the future of Bonsai for Beginners by suggesting new features
          </p>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">Submit a Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Feature Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green"
                  placeholder="Enter a concise title for your feature request"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green"
                  placeholder="Describe the feature and how it would help bonsai enthusiasts"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-bonsai-green text-white px-6 py-2 rounded-lg hover:bg-bonsai-moss transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>

              {error && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">Popular Requests</h2>
            {loading && requests.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-bonsai-green" />
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-bonsai-bark dark:text-white">{request.title}</h3>
                        <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">{request.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <span className="text-xs text-stone-500 dark:text-stone-400">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button 
                        className={`flex flex-col items-center space-y-1 ${
                          userVotes[request.id] 
                            ? 'text-bonsai-moss cursor-default' 
                            : 'text-bonsai-green hover:text-bonsai-moss'
                        }`}
                        onClick={() => voteForRequest(request.id)}
                        disabled={userVotes[request.id] || loading}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span className="text-sm font-medium">{request.votes}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {requests.length === 0 && !loading && (
                  <div className="text-center py-8 text-stone-500 dark:text-stone-400">
                    No feature requests yet. Be the first to suggest one!
                  </div>
                )}
              </div>
            )}
          </div>

          {!user && (
            <div className="card p-6 bg-gradient-to-br from-bonsai-terra/10 to-bonsai-clay/10">
              <div className="flex items-start space-x-3">
                <Crown className="w-5 h-5 text-bonsai-terra flex-shrink-