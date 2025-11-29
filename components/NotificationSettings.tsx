'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  isSubscribedToPush,
  showLocalNotification,
} from '@/lib/pushNotifications';

export default function NotificationSettings() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSupported(isPushSupported());
    setPermission(getNotificationPermission());

    // Check subscription status
    isSubscribedToPush().then(setSubscribed);
  }, []);

  const handleToggleNotifications = async () => {
    setLoading(true);

    try {
      if (subscribed) {
        // Unsubscribe
        const success = await unsubscribeFromPush();
        if (success) {
          setSubscribed(false);
        }
      } else {
        // Request permission if not granted
        if (permission !== 'granted') {
          const newPermission = await requestNotificationPermission();
          setPermission(newPermission);

          if (newPermission !== 'granted') {
            setLoading(false);
            return;
          }
        }

        // Subscribe
        const subscription = await subscribeToPush();
        if (subscription) {
          setSubscribed(true);

          // Show test notification
          await showLocalNotification('Notifications Enabled!', {
            body: "You'll now receive updates about your orders and new products.",
          });
        }
      }
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
    }

    setLoading(false);
  };

  if (!supported) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
            <BellOff className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-500">Not supported in this browser</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              subscribed ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            {subscribed ? (
              <Bell className="w-5 h-5 text-green-600" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-500">
              {subscribed
                ? 'Receiving order updates & offers'
                : permission === 'denied'
                ? 'Blocked in browser settings'
                : 'Get notified about orders & deals'}
            </p>
          </div>
        </div>

        {permission === 'denied' ? (
          <div className="flex items-center gap-1 text-red-500 text-sm">
            <XCircle className="w-4 h-4" />
            <span>Blocked</span>
          </div>
        ) : (
          <button
            onClick={handleToggleNotifications}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              subscribed
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-[#ff6f61] text-white hover:bg-[#e55a4d]'
            } disabled:opacity-50`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : subscribed ? (
              'Disable'
            ) : (
              'Enable'
            )}
          </button>
        )}
      </div>

      {/* Notification Types */}
      {subscribed && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">
            You'll receive notifications for:
          </p>
          <div className="space-y-2">
            {[
              'Order confirmations & updates',
              'Download ready alerts',
              'Special offers & discounts',
              'New products in your interests',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

