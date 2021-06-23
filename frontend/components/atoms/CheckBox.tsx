import * as React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'

interface IProps {
  name: string
  defaultChecked?: boolean
  checked?: boolean
  label?: string
  value?: number | string
  onChangeHandler?(event: any): void
}

const CheckBox: React.FC<IProps> = ({
  name,
  defaultChecked,
  checked,
  label,
  onChangeHandler,
  value = 'on',
}) => {
  const hasCheckedInProp = React.useMemo(() => checked != null, [checked])
  const [checkboxChecked, setCheckboxChecked] = React.useState(defaultChecked || false)
  const actualChecked = React.useMemo(() => (hasCheckedInProp ? checked : checkboxChecked), [
    hasCheckedInProp,
    checkboxChecked,
    checked,
  ])
  const checkBoxProp = React.useMemo(
    () => ({ [hasCheckedInProp ? 'checked' : 'defaultChecked']: actualChecked }),
    [hasCheckedInProp, actualChecked]
  )

  return (
    <div className="flex">
      <div className={classNames(['flex-grow w-full flex items-center'])}>
        <label
          className={classNames([
            'relative flex items-center cursor-pointer',
            'transition duration-75 hover:opacity-85',
          ])}
        >
          <input
            className="hidden"
            type="checkbox"
            value={value}
            name={name}
            onChange={event => {
              setCheckboxChecked(event.target.checked)
              if (onChangeHandler) {
                onChangeHandler(event)
              }
            }}
            {...checkBoxProp}
          />
          <div
            className={classNames([
              'w-5 h-5 flex items-center justify-center transition duration-150 rounded-sm border-2',
              actualChecked ? 'bg-primary border-primary' : 'bg-white border-neutral-300',
            ])}
          >
            <FontAwesomeIcon
              className={classNames([
                'text-sm text-white transition duration-150',
                actualChecked ? 'opacity-100' : 'opacity-0',
              ])}
              icon={faCheck}
            />
          </div>
          <span className="ml-3 text-sm leading-snug">{label}</span>
        </label>
      </div>
    </div>
  )
}

export default CheckBox
