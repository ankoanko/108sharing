import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import React, { useCallback, useEffect } from 'react'

const options = {
  reserveScrollBarGap: true,
}

export const useBodyScrollLock = () => {
  const targetRef = React.createRef<HTMLDivElement>()
  const lockBodyScroll = useCallback(() => {
    disableBodyScroll(targetRef.current, options)
  }, [targetRef])
  const unlockBodyScroll = useCallback(() => {
    enableBodyScroll(targetRef.current, options)
  }, [targetRef])

  useEffect(() => () => clearAllBodyScrollLocks())

  return {
    targetRef,
    lockBodyScroll,
    unlockBodyScroll,
  }
}
