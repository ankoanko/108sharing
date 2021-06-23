import * as React from 'react'
import { ReactNode } from 'react'
import classNames from 'classnames'

interface IProps {
  id?: string
  handleClick?: () => void
  type?: 'submit' | 'button' | 'reset'
  size?: 'small' | 'midium'
  buttonType?: 'primary' | 'primary-filled' | 'secondary' | 'tertiary' | 'muted'
  fit?: boolean
  full?: boolean
  link?: string
  disabled?: boolean
  className?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const classes = {
  size: {
    small: 'w-48 max-w-full h-10 text-sm',
    medium: 'w-64 max-w-full h-12 text-base',
  },
  buttonType: {
    primary: 'bg-gradient-primary text-white',
    'primary-filled': 'bg-primary text-white',
    secondary: 'bg-white border border-primary text-primary',
    tertiary: 'bg-white border border-blue text-blue',
    muted: 'bg-neutral-400',
  },
} as const

const Button: React.FC<IProps> = ({
  handleClick = () => {},
  disabled = false,
  full = false,
  fit = false,
  size = 'medium',
  buttonType = 'primary',
  // type = 'button',
  type = 'submit',
  className = '',
  link = null,
  iconLeft,
  iconRight,
  ...props
}) => {
  const Tag = link ? 'a' : 'button'
  return (
    <Tag
      className={classNames([
        'flex items-center justify-center rounded-full font-bold shadow-button focus:outline-none',
        classes.size[size],
        !disabled && classes.buttonType[buttonType],
        disabled && 'bg-none bg-neutral-300 text-neutral-500 cursor-auto',
        (iconLeft || iconRight) && 'relative',
        full && 'w-full max-w-none',
        fit ? 'px-4 w-auto max-w-none' : '',
        className,
      ])}
      type={link ? undefined : type}
      disabled={link ? undefined : disabled}
      onClick={handleClick}
      href={link || undefined}
      {...props}
    >
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      <span>{props.children}</span>
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </Tag>
  )
}

export default Button
