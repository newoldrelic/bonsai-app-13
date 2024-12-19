import React, { useState } from 'react';
import { HelpCircle, Mail, MessageCircle, ExternalLink, FileQuestion, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Create mailto URL with form data
    const mailtoUrl = `mailto:support@bonsaiforbeginners.app?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;

    // Open default mail client
    window.location.href = mailtoUrl;
    
    // Show success state briefly
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
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
            Get help with your bonsai care journey. We're here to assist you.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-bonsai-green" />
              <span>Quick Support</span>
            </h2>
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <p>
                Having trouble with your bonsai or our app? Our support team is ready to help you.
                We typically respond within 24 hours on business days.
              </p>
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
          </div>

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
                disabled={status === 'submitting'}
                className="w-full bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Sent Successfully</span>
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

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4 flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-bonsai-green" />
              <span>Common Questions</span>
            </h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                  <span className="font-medium">How do I enable notifications?</span>
                  <span className="transform group-open:rotate-180 transition-transform">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </summary>
                <div className="mt-2 p-3 text-stone-600 dark:text-stone-300">
                  Go to your tree's details page and look for the maintenance section. Toggle the notification switches for the types of reminders you want to receive.
                </div>
              </details>

              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                  <span className="font-medium">How do I cancel my subscription?</span>
                  <span className="transform group-open:rotate-180 transition-transform">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </summary>
                <div className="mt-2 p-3 text-stone-600 dark:text-stone-300">
                  You can cancel your subscription at any time from your account settings. Your premium features will remain active until the end of your billing period.
                </div>
              </details>

              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                  <span className="font-medium">Can I export my bonsai data?</span>
                  <span className="transform group-open:rotate-180 transition-transform">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </summary>
                <div className="mt-2 p-3 text-stone-600 dark:text-stone-300">
                  Yes! You can export your maintenance schedules to your calendar and download care guides as PDF files.
                </div>
              </details>
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
    </div>
  );
}