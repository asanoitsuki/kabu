'use client'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

const isNative = () => typeof window !== 'undefined' && Capacitor.isNativePlatform()

/** 軽いタップ感（ボタン押下など） */
export async function hapticLight() {
  if (!isNative()) return
  await Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
}

/** 中程度（ターン終了・重要操作） */
export async function hapticMedium() {
  if (!isNative()) return
  await Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
}

/** 強め（ゲームオーバー・大イベント） */
export async function hapticHeavy() {
  if (!isNative()) return
  await Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {})
}

/** 成功通知バイブ */
export async function hapticSuccess() {
  if (!isNative()) return
  await Haptics.notification({ type: NotificationType.Success }).catch(() => {})
}

/** 警告バイブ */
export async function hapticWarning() {
  if (!isNative()) return
  await Haptics.notification({ type: NotificationType.Warning }).catch(() => {})
}

/** エラーバイブ */
export async function hapticError() {
  if (!isNative()) return
  await Haptics.notification({ type: NotificationType.Error }).catch(() => {})
}
