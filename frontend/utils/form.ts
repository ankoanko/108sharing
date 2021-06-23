// https://github.com/facebook/react/issues/11488#issuecomment-347775628
// Update formElement value then trigger blur event programmatically
export function setNativeValue(formElement, nextValue, triggerBlur) {
  const lastValue = formElement.value
  const event: any = new Event('blur', { bubbles: true })

  formElement.value = nextValue
  const tracker = formElement._valueTracker
  if (tracker) {
    tracker.setValue(lastValue)
  }

  if (triggerBlur) {
    formElement.dispatchEvent(event)
  }
}
