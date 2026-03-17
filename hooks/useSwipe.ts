import { useRef, useCallback } from 'react'

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
}

/**
 * Returns touch event handlers that fire onSwipeLeft / onSwipeRight
 * when the user drags more than `threshold` pixels horizontally.
 */
export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold = 50,
): SwipeHandlers {
  const startX = useRef<number | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (startX.current === null) return
      const diff = startX.current - e.changedTouches[0].clientX
      if (Math.abs(diff) >= threshold) {
        diff > 0 ? onSwipeLeft() : onSwipeRight()
      }
      startX.current = null
    },
    [onSwipeLeft, onSwipeRight, threshold],
  )

  return { onTouchStart, onTouchEnd }
}
