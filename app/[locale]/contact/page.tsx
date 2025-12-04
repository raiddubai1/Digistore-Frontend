"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Reset success state after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gray-50 dark:bg-slate-900 pb-24">
        <div className="bg-white dark:bg-slate-800 p-6 border-b border-gray-100 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">We'd love to hear from you</p>
        </div>

        <div className="p-4 space-y-4">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl">
              <Mail className="w-6 h-6 text-[#FF6B35] mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">support@digistore1.com</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl">
              <Clock className="w-6 h-6 text-[#FF6B35] mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Response Time</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">24-48 hours</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl p-4 space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none text-gray-900 dark:text-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none text-gray-900 dark:text-white"
            />
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none text-gray-900 dark:text-white"
            >
              <option value="">Select Subject</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="billing">Billing Question</option>
              <option value="partnership">Partnership</option>
            </select>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none text-gray-900 dark:text-white resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#FF6B35] text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                "Sending..."
              ) : isSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5" /> Sent!
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-gray-50 dark:bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Get In Touch</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have a question or feedback? We're here to help. Send us a message and we'll respond within 24-48 hours.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl">
                <Mail className="w-8 h-8 text-[#FF6B35] mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Email Us</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">support@digistore1.com</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl">
                <MessageSquare className="w-8 h-8 text-[#FF6B35] mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Live Chat</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Available 9am-6pm EST</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl">
                <Clock className="w-8 h-8 text-[#FF6B35] mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Response Time</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">24-48 hours</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-span-2 bg-white dark:bg-slate-800 p-8 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none text-gray-900 dark:text-white"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none text-gray-900 dark:text-white"
                >
                  <option value="">Select Subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership</option>
                </select>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] outline-none text-gray-900 dark:text-white resize-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" /> Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

