export const isTouchDevice = (): boolean => {
  const regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return window.navigator.userAgent.search(regexp) !== -1
}
