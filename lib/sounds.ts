'use client'

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return ctx
}

function playTone(
  frequencies: number[],
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
  gap = 0.08,
) {
  const audioCtx = getCtx()
  if (!audioCtx) return
  frequencies.forEach((freq, i) => {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * gap)
    gain.gain.setValueAtTime(volume, audioCtx.currentTime + i * gap)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * gap + duration)
    osc.start(audioCtx.currentTime + i * gap)
    osc.stop(audioCtx.currentTime + i * gap + duration + 0.05)
  })
}

/** 株価上昇 🎵 */
export function soundUp() {
  playTone([523, 659, 784], 0.12, 0.08, 'sine')
}

/** 株価下落 📉 */
export function soundDown() {
  playTone([330, 262, 196], 0.18, 0.06, 'sawtooth')
}

/** ボタンタップ */
export function soundTap() {
  playTone([900], 0.04, 0.04, 'square')
}

/** ターン終了 */
export function soundTurnEnd() {
  playTone([440, 550, 660], 0.1, 0.07, 'sine', 0.06)
}

/** 実績解除・ゲームクリア 🎉 */
export function soundAchieve() {
  playTone([523, 659, 784, 1047], 0.18, 0.1, 'sine', 0.1)
}

/** ゲームオーバー */
export function soundGameOver() {
  playTone([330, 262, 196, 165], 0.25, 0.08, 'sawtooth', 0.15)
}

/** 倒産 💀 */
export function soundBankrupt() {
  playTone([200, 150, 100], 0.4, 0.1, 'sawtooth', 0.2)
}
