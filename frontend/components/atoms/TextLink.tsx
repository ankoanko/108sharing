import * as React from 'react'
import classNames from 'classnames'

interface IProps {
  href: string
  className?: string
}

const TextLink: React.FC<IProps> = props => {
  return (
    <a
      href={props.href}
      className={classNames([
        'text-sm text-blue underline transition duration-150 hover:opacity-85',
        props.className,
      ])}
    >
      {props.children}
    </a>
  )
}

export default TextLink
