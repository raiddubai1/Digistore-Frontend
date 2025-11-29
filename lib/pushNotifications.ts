// Push Notification utilities for Digistore1

// VAPID public key - replace with your own from web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

/**
 * Check if push notifications are supported
 */
export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Subscribe user to push notifications
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  try {
    if (!isPushSupported()) {
      console.warn('Push notifications not supported');
      return null;
    }

    // Wait for service worker
    const registration = await navigator.serviceWorker.ready;

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log('Already subscribed to push');
      return subscription;
    }

    // Subscribe to push
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log('Push subscription:', subscription);

    // Send subscription to backend
    await sendSubscriptionToServer(subscription);

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      return true;
    }

    // Unsubscribe
    const success = await subscription.unsubscribe();

    if (success) {
      // Notify backend
      await removeSubscriptionFromServer(subscription);
    }

    return success;
  } catch (error) {
    console.error('Failed to unsubscribe from push:', error);
    return false;
  }
}

/**
 * Check if user is subscribed to push
 */
export async function isSubscribedToPush(): Promise<boolean> {
  try {
    if (!isPushSupported()) return false;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return subscription !== null;
  } catch {
    return false;
  }
}

/**
 * Send subscription to backend
 */
async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return;

  try {
    await fetch(`${apiUrl}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(subscription),
    });
  } catch (error) {
    console.error('Failed to send subscription to server:', error);
  }
}

/**
 * Remove subscription from backend
 */
async function removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return;

  try {
    await fetch(`${apiUrl}/notifications/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
  } catch (error) {
    console.error('Failed to remove subscription from server:', error);
  }
}

/**
 * Convert VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray.buffer as ArrayBuffer;
}

/**
 * Show a local notification (for testing)
 */
export async function showLocalNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/icons/icon-192x192.svg',
      badge: '/icons/icon-72x72.svg',
      ...options,
    });
  }
}

