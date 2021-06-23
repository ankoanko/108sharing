export function getStripePublicKey(): string {
  const element = document.querySelector<HTMLMetaElement>('meta[name=stripe-public-key]')

  return element ? element.content : ''
}
