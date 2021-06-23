import React from 'react'

const ENTER_KEYCODE = 13

export const useHeaderSearch = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const area = urlParams.get('area') || ''
  const keywords = urlParams.get('keywords') || ''

  const onBlurHandler = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
    const currentUrlParams = new URLSearchParams(window.location.search)
    const target = event.target as HTMLInputElement

    if (target.value) {
      currentUrlParams.set(target.name, target.value)
    } else {
      currentUrlParams.delete(target.name)
    }

    location.href = `/posts/search?${currentUrlParams.toString()}`
  }, [])

  const onKeyDownHandler = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode && event.keyCode === ENTER_KEYCODE) {
        onBlurHandler(event)
      }
    },
    [onBlurHandler]
  )

  return {
    area,
    keywords,
    onBlurHandler,
    onKeyDownHandler,
  }
}
