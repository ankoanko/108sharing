import * as React from 'react'
import FormItem from 'components/layouts/FormItem'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactNode } from 'react'
interface IProps {
  name: string
  defaultValue: string
  readonly?: boolean
  label?: null | string
  placeholder?: null | string
  error?: null | string
  required?: boolean
  type?: string
  inputRef?: any
  onChangeHandler?(event: any): void | Promise<void>
  onBlurHandler?(event: any): void | Promise<void>
  icon?: ReactNode
}

const InputText: React.FC<IProps> = ({
  name,
  defaultValue,
  readonly,
  label,
  placeholder,
  error,
  required,
  type,
  inputRef,
  onChangeHandler,
  onBlurHandler,
  icon,
}) => {
  return (
    <FormItem label={label} required={required} error={error}>
      <div className="relative w-ful">
        {icon && (
          <div className="absolute left-0 inset-y-0 flex items-center ml-3 text-neutral-600 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={classNames([
            'block w-full px-3 py-2 bg-neutral-100 rounded outline-none appearance-none',
            'border-2 border-transparent',
            !readonly && 'focus:border-2 focus:border-primary focus:bg-white',
            readonly && 'text-neutral-500 cursor-default',
            icon && 'pl-8',
          ])}
          id={name}
          type={type ?? 'text'}
          name={name}
          placeholder={placeholder}
          required={required ? true : false}
          defaultValue={defaultValue}
          onChange={event => {
            if (typeof onChangeHandler === 'function') {
              onChangeHandler(event)
            }
          }}
          onBlur={event => {
            if (typeof onBlurHandler === 'function') {
              onBlurHandler(event)
            }
          }}
          ref={inputRef || null}
          readOnly={readonly || false}
        />
      </div>
    </FormItem>
  )
}

export default InputText
