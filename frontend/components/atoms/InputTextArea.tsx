import * as React from 'react'
import FormItem from 'components/layouts/FormItem'

interface IProps {
  name: string
  defaultValue: string
  label?: null | string
  placeholder?: null | string
  error?: null | string
  required?: boolean
}

const InputTextArea = React.forwardRef<HTMLTextAreaElement, IProps>((props, ref) => {
  const { name, defaultValue, label, placeholder, error, required } = props

  return (
    <FormItem label={label} required={required} error={error}>
      <textarea
        className="
          block w-full h-40 px-3 py-2 bg-neutral-100 rounded outline-none
          border-2 border-transparent
          focus:border-2 focus:border-primary focus:bg-white
        "
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        ref={ref}
      />
    </FormItem>
  )
})

export default InputTextArea
