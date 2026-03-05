import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Github, Linkedin, Twitter, Youtube, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { databases, DB_ID, CONTACTS_COLLECTION_ID, isConfigured, ID } from '../lib/appwrite';

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com/in/vikasdhavande', label: 'LinkedIn', username: 'vikasdhavande' },
  { icon: Github, href: 'https://github.com/vikasdhavande', label: 'GitHub', username: 'vikasdhavande' },
  { icon: Twitter, href: 'https://twitter.com/vikasdhavande', label: 'Twitter', username: '@vikasdhavande' },
  { icon: Youtube, href: 'https://youtube.com/@vikasdhavande', label: 'YouTube', username: 'Vikas Dhavande' },
];

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (isConfigured(DB_ID, CONTACTS_COLLECTION_ID)) {
        // ── Real Appwrite submission ──────────────────────────────────────────
        await databases.createDocument(DB_ID, CONTACTS_COLLECTION_ID, ID.unique(), {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        });
      } else {
        // ── Appwrite not configured: simulate for local dev ───────────────────
        console.warn('[Contact] Appwrite not configured – simulating submission.');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: unknown) {
      console.error('[Contact] Submission failed:', err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again or email me directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Get in <span className="text-black dark:text-white">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            I'm currently open to new opportunities in Embedded Systems, Industrial Automation, and Semiconductor Engineering. Let's build something great together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
                <span className="text-black dark:text-white font-mono text-xl">01.</span> Contact Details
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-black dark:border-white/30 transition-colors group">
                  <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">Email</h3>
                    <a href="mailto:vikasndhavande@gmail.com" className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-black dark:text-white transition-colors">
                      vikasndhavande@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-black dark:border-white/30 transition-colors group">
                  <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">Location</h3>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Bengaluru, India
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Available for remote &amp; relocation</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
                <span className="text-black dark:text-white font-mono text-xl">02.</span> Social Profiles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-black dark:border-white/50 hover:bg-gray-200 dark:bg-gray-800 transition-all group"
                  >
                    <div className="p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:text-black dark:text-white transition-colors">
                      <social.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{social.label}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">{social.username}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-slate-900 border border-black dark:border-white/20">
              <h3 className="text-lg font-bold text-black dark:text-white mb-2">Availability Status</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-black dark:bg-white"></span>
                </span>
                <span className="text-black dark:text-white font-medium">Actively looking for roles</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Interested in roles related to Embedded Systems, Firmware Engineering, and Industrial IoT.
              </p>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-black dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-300 text-white dark:text-black font-semibold transition-colors w-full sm:w-auto"
              >
                Download Resume
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
              <span className="text-black dark:text-white font-mono text-xl">03.</span> Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8 rounded-2xl bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 relative overflow-hidden">
              {/* Success Overlay */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-10 bg-gray-100 dark:bg-gray-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-black dark:bg-white/20 flex items-center justify-center text-black dark:text-white mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                </motion.div>
              )}

              {/* Error Banner */}
              {submitError && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <p className="text-sm">{submitError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-gray-800 dark:text-gray-200 placeholder:text-slate-600 focus:outline-none focus:border-black dark:border-white focus:ring-1 focus:ring-cyan-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-gray-800 dark:text-gray-200 placeholder:text-slate-600 focus:outline-none focus:border-black dark:border-white focus:ring-1 focus:ring-cyan-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-gray-800 dark:text-gray-200 placeholder:text-slate-600 focus:outline-none focus:border-black dark:border-white focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Job Opportunity / Collaboration"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-gray-800 dark:text-gray-200 placeholder:text-slate-600 focus:outline-none focus:border-black dark:border-white focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                  placeholder="Hello Vikas, I'd like to discuss..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-black dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-300 text-white dark:text-black font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
