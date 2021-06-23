import * as React from 'react'
import classNames from 'classnames'

interface IProps {
  name: string
  checked: boolean
  onChangeHandler(event: any): void
}

const Toggle: React.FC<IProps> = props => {
  return (
    <label
      className={classNames([
        'block w-15  rounded-full px-1 py-1 cursor-pointer transition duration-300',
        props.checked ? 'bg-primary' : 'bg-neutral-400',
      ])}
    >
      <div className="relative">
        <div
          className={classNames([
            'w-6 h-6 bg-white rounded-full transition-all duration-300 transform',
            props.checked ? 'ml-full -translate-x-full' : 'ml-0 translate-x-0',
          ])}
        />
      </div>

      <input
        className="hidden"
        name={props.name}
        type="checkbox"
        checked={props.checked}
        onChange={props.onChangeHandler}
      />
    </label>
  )
}

export default Toggle
