import React, { useState } from 'react';
import { X, Send, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CustomProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomProjectModal: React.FC<CustomProjectModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    user_name: '',
    user_email: '',
    user_phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('custom_project_submissions')
        .insert([
          {
            title: formData.title,
            message: formData.message,
            user_name: formData.user_name || null,
            user_email: formData.user_email || null,
            user_phone: formData.user_phone || null
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        title: '',
        message: '',
        user_name: '',
        user_email: '',
        user_phone: ''
      });

      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error submitting project:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl border border-gray-600 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-black border border-gray-600 p-2 rounded-lg">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Share Your Project Idea</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-gray-300 text-sm mb-6">
            Have a custom project in mind? Share your idea with us and we'll get back to you!
          </p>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Project Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-white placeholder-gray-400"
              placeholder="Enter your project title"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Project Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-white placeholder-gray-400 min-h-[120px] resize-y"
              placeholder="Tell us about your project idea, goals, and any specific requirements..."
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="border-t border-gray-700 pt-4 mt-4">
            <p className="text-sm text-gray-400 mb-4">Contact Information (Optional)</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.user_name}
                  onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                  className="w-full px-4 py-3 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-white placeholder-gray-400"
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.user_phone}
                  onChange={(e) => setFormData({ ...formData, user_phone: e.target.value })}
                  className="w-full px-4 py-3 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-white placeholder-gray-400"
                  placeholder="+1 (555) 000-0000"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.user_email}
                onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                className="w-full px-4 py-3 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-white placeholder-gray-400"
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {submitStatus === 'success' && (
            <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
              <p className="text-green-200 text-sm font-medium">
                Thank you! Your project idea has been submitted successfully. We'll get back to you soon!
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
              <p className="text-red-200 text-sm font-medium">
                Something went wrong. Please try again later.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 glass border border-gray-600 text-white rounded-xl font-medium hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-black border border-gray-600 text-white rounded-xl font-medium hover:bg-gray-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 transform hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
