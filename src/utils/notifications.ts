import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (Capacitor.isNativePlatform()) {
      const status = await LocalNotifications.requestPermissions();
      return status.display === 'granted';
    } else if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  } catch (err) {
    console.warn('Erro ao solicitar permissão de notificações:', err);
  }
  return false;
}

export async function checkNotificationPermission(): Promise<boolean> {
  try {
    if (Capacitor.isNativePlatform()) {
      const status = await LocalNotifications.checkPermissions();
      return status.display === 'granted';
    } else if ('Notification' in window) {
      return Notification.permission === 'granted';
    }
  } catch {
    // fallback
  }
  return false;
}

export async function sendLocalNotification(
  title: string,
  body: string,
  id: number = Math.floor(Math.random() * 10000)
): Promise<boolean> {
  try {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id,
            schedule: { at: new Date(Date.now() + 100) },
            sound: undefined,
            smallIcon: 'ic_launcher',
          },
        ],
      });
      return true;
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
      });
      return true;
    }
  } catch (err) {
    console.warn('Erro ao disparar notificação local:', err);
  }
  return false;
}
