import * as React from 'react'
import FormItem from 'components/layouts/FormItem'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'

interface IOption {
  value: string
  label: string
}
interface IProps {
  name: string
  options: readonly IOption[]
  defaultValue: string
  label?: null | string
  error?: null | string
  required?: boolean
  selectRef?: any
  onChangeHandler?: (event) => void
  onBlurHandler?: (event) => void
}

const Select: React.FC<IProps> = ({
  name,
  options,
  defaultValue,
  label,
  error,
  required,
  selectRef,
  onChangeHandler,
  onBlurHandler,
}) => {
  return (
    <FormItem label={label} required={required} error={error}>
      <label className="relative block">
        <select
          className={classNames([
            'appearance-none m-0 bg-transparent outline-none text-current',
            'relative z-1 w-full py-1 px-3 leading-8 rounded-md border-2 border-transparent',
            'focus:shadow-none focus:border-2 focus:border-primary',
          ])}
          id={name}
          name={name}
          required={required}
          defaultValue={defaultValue}
          ref={selectRef || null}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* for focus style of select*/}
        <div className="absolute inset-0 rounded-md border border-neutral-300" />
        <div className="absolute right-0 inset-y-0 flex items-center mr-4">
          <FontAwesomeIcon className="text-sm" icon={faChevronDown} />
        </div>
      </label>
    </FormItem>
  )
}

export default Select
