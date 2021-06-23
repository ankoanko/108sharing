const paymentRequiredEl = document.getElementById('payment-required')
export const PAYMENT_REQUIRED = paymentRequiredEl
  ? paymentRequiredEl.getAttribute('data').toLowerCase() === 'true'
  : false
