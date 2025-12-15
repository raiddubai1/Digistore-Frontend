"use client";

import { useState, useEffect } from "react";
import { Mail, Users, Download, Trash2, Send, Loader2, Search, CheckSquare, Square, X } from "lucide-react";
import { newsletterAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface Subscriber {
  email: string;
  name?: string;
  subscribedAt?: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await newsletterAPI.getSubscribers();
      setSubscribers(response.data.data?.subscribers || []);
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSelection = (email: string) => {
    setSelectedEmails((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(email)) {
        newSet.delete(email);
      } else {
        newSet.add(email);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const allEmails = filteredSubscribers.map((s) => s.email);
    const allSelected = allEmails.every((e) => selectedEmails.has(e));
    if (allSelected) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(allEmails));
    }
  };

  const handleUnsubscribe = async (emails: string[]) => {
    if (emails.length === 0) return;
    const confirmed = confirm(`Unsubscribe ${emails.length} email(s)?`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      for (const email of emails) {
        await newsletterAPI.unsubscribe(email);
      }
      toast.success(`Unsubscribed ${emails.length} email(s)`);
      setSelectedEmails(new Set());
      fetchSubscribers();
    } catch (error) {
      toast.error("Failed to unsubscribe");
    } finally {
      setDeleting(false);
    }
  };

  const exportCSV = () => {
    const csv = ["Email,Name,Subscribed At"];
    subscribers.forEach((s) => {
      csv.push(`${s.email},${s.name || ""},${s.subscribedAt || ""}`);
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported subscribers to CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
          <p className="text-gray-600">Manage your email subscribers</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowComposeModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
            Send Email
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Subscribers</div>
              <div className="text-2xl font-bold">{subscribers.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">This Month</div>
              <div className="text-2xl font-bold">
                {subscribers.filter((s) => {
                  if (!s.subscribedAt) return false;
                  const subDate = new Date(s.subscribedAt);
                  const now = new Date();
                  return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          {selectedEmails.size > 0 && (
            <button
              onClick={() => handleUnsubscribe(Array.from(selectedEmails))}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Unsubscribe {selectedEmails.size}
            </button>
          )}
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium">No subscribers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button onClick={selectAll} className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                      {filteredSubscribers.every((s) => selectedEmails.has(s.email)) ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                      Select
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subscribed</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.email} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelection(subscriber.email)}>
                        {selectedEmails.has(subscriber.email) ? (
                          <CheckSquare className="w-5 h-5 text-primary" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold">
                          {subscriber.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{subscriber.name || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {subscriber.subscribedAt
                        ? new Date(subscriber.subscribedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleUnsubscribe([subscriber.email])}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                        title="Unsubscribe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <ComposeModal onClose={() => setShowComposeModal(false)} subscriberCount={subscribers.length} />
      )}
    </div>
  );
}

function ComposeModal({ onClose, subscriberCount }: { onClose: () => void; subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject || !title || !body) {
      toast.error("Subject, title, and body are required");
      return;
    }

    setSending(true);
    try {
      await newsletterAPI.sendPromotion({ subject, title, body, ctaText, ctaUrl });
      toast.success(`Email sent to ${subscriberCount} subscribers!`);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Send Newsletter</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm">
            This will send to <strong>{subscriberCount}</strong> subscribers
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Special Offer This Week!"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 50% Off All Products"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="Write your email content here..."
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text (optional)</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g., Shop Now"
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button URL (optional)</label>
              <input
                type="text"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="e.g., https://digistore1.com/products"
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t">
          <button onClick={onClose} className="px-4 py-2.5 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !subject || !title || !body}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send to {subscriberCount} Subscribers
          </button>
        </div>
      </div>
    </div>
  );
}
