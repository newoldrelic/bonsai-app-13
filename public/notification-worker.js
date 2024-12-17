console.log('Service Worker: Loading');

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  console.log('Service Worker: Received message', event.data);
});

self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', {
    notification: event.notification,
    action: event.action,
    data: event.notification.data
  });

  event.notification.close();

  if (event.action === 'snooze') {
    console.log('Service Worker: Handling snooze action');
    // Snooze for 1 hour
    const snoozeTime = new Date().getTime() + (60 * 60 * 1000);
    self.registration.showNotification(event.notification.title, {
      ...event.notification.options,
      timestamp: snoozeTime,
      data: event.notification.data
    });
  } else if (event.action === 'done') {
    console.log('Service Worker: Handling done action');
    // Send message to client to mark task as done
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'MAINTENANCE_DONE',
          data: event.notification.data,
          notificationTag: event.notification.tag
        });
      });
    });
  } else {
    console.log('Service Worker: Opening app');
    // Open the app when clicking the notification
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return self.clients.openWindow('/');
      })
    );
  }
});

self.addEventListener('notificationclose', (event) => {
  console.log('Service Worker: Notification closed', {
    tag: event.notification.tag,
    data: event.notification.data
  });
});

self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received', event);
  if (!event.data) {
    console.log('Service Worker: Push event but no data');
    return;
  }

  try {
    const data = event.data.json();
    console.log('Service Worker: Push data parsed', data);
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.message,
        icon: '/bonsai-icon.png',
        tag: data.tag,
        data: data.data,
        requireInteraction: true,
        actions: [
          { action: 'done', title: 'Mark as Done' },
          { action: 'snooze', title: 'Snooze 1hr' }
        ]
      })
    );
  } catch (error) {
    console.error('Service Worker: Error showing push notification:', error);
  }
});

// Add a specific event listener for handling notification requests
self.addEventListener('notificationrequest', (event) => {
  console.log('Service Worker: Notification request received', {
    title: event.title,
    options: event.options
  });
});

console.log('Service Worker: Setup complete');