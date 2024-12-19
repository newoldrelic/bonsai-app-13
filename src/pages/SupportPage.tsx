import React from 'react';
import { HelpCircle, Mail, MessageCircle, ExternalLink, FileQuestion } from 'lucide-react';

export function SupportPage() {
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
                  href="mailto:support@bonsaiforbeginners.com"
                  className="inline-flex items-center space-x-2 text-bonsai-green hover:text-bonsai-moss transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>support@bonsaiforbeginners.com</span>
                </a>
              </div>
            </div>
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