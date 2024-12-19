import React, { useState, useEffect } from 'react';
import { HelpCircle, Mail, MessageCircle, ExternalLink, FileQuestion, Send, Loader2, AlertCircle, Clock } from 'lucide-react';
import { useSupportRequestStore } from '../store/supportRequestStore';
import { useAuthStore } from '../store/authStore';
import { SUPPORT_FAQS } from '../config/support-config';
import type { SupportRequestStatus } from '../types/support-request';

export function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const { user } = useAuthStore();
  const { 
    requests, 
    loading, 
    error, 
    submitRequest, 
    loadUserRequests, 
    clearError 
  } = useSupportRequestStore();

  useEffect(() => {
    if (user?.email) {
      loadUserRequests();
    }
  }, [user, loadUserRequests]);

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email
      }));
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRequest(formData);
    setFormData(prev => ({ ...prev, subject: '', message: '' }));
  };

  const getStatusColor = (status: SupportRequestStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      case 'closed':
        return 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HelpCircle className="w-8 h-8 text-bonsai-green" />
            <h1 className="text-3xl font-bold text-bonsai-bark dark:text-white">Support</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
          Having trouble with your bonsai or our app? Our support team is ready to help you.
                We typically respond within 24 hours on business days.
          </p>
        </div>

        <div className="grid gap-6">
          

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-bonsai-green" />
              <span>Contact Support</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
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

          {user && requests.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-bonsai-green" />
                <span>Request History</span>
              </h2>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-bonsai-bark dark:text-white">{request.subject}</h3>
                        <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">{request.message}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <span className="text-xs text-stone-500 dark:text-stone-400">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4 flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-bonsai-green" />
              <span>Common Questions</span>
            </h2>
            <div className="space-y-4">
              {SUPPORT_FAQS.map((faq, index) => (
                <details key={index} className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                    <span className="font-medium">{faq.question}</span>
                    <span className="transform group-open:rotate-180 transition-transform">
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </summary>
                  <div className="mt-2 p-3 text-stone-600 dark:text-stone-300">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">Emergency Care</h2>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-red-700 dark:text-red-300">
                If your bonsai shows signs of severe distress (sudden leaf drop, branch die-off, or pest infestation), 
                premium users can access immediate expert consultation through our chat feature.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
                <a 
                  href="mailto:support@bonsaiforbeginners.app"
                  className="inline-flex items-center space-x-2 text-bonsai-green hover:text-bonsai-moss transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>support@bonsaiforbeginners.app</span>
                </a>
              </div>
    </div>
  );
}