'use client'
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

const isNative = () => typeof window !== 'undefined' && Capacitor.isNativePlatform()

/** 通知権限をリクエストして毎日リマインダーをスケジュール */
export async function setupDailyNotification() {
  if (!isNative()) return

  const { display } = await LocalNotifications.requestPermissions()
  if (display !== 'granted') return

  // 既存の通知をキャンセル
  const pending = await LocalNotifications.getPending()
  if (pending.notifications.length > 0) {
    await LocalNotifications.cancel({ notifications: pending.notifications })
  }

  // 毎日19時にリマインダー
  const now = new Date()
  const scheduleAt = new Date(now)
  scheduleAt.setHours(19, 0, 0, 0)
  if (scheduleAt <= now) scheduleAt.setDate(scheduleAt.getDate() + 1)

  await LocalNotifications.schedule({
    notifications: [
      {
        id: 1001,
        title: '📈 今日も経営しよう！',
        body: 'あなたの会社は株価更新を待っています。ターンを進めよう。',
        schedule: {
          at: scheduleAt,
          repeats: true,
          every: 'day',
        },
        sound: undefined,
        smallIcon: 'ic_stat_icon_config_sample',
        iconColor: '#6366f1',
      },
    ],
  })
}

/** 実績解除通知 */
export async function notifyAchievement(title: string) {
  if (!isNative()) return
  await LocalNotifications.schedule({
    notifications: [
      {
        id: Math.floor(Math.random() * 9000) + 1000,
        title: '🏅 実績解除！',
        body: title,
        schedule: { at: new Date(Date.now() + 500) },
      },
    ],
  })
}
