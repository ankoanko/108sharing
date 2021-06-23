import * as React from 'react'
import classNames from 'classnames'

interface IPanelProps {
  title?: string | React.ReactElement
  className?: string
  wrapperFull?: boolean
  contentFull?: boolean
}

const Panel: React.FC<IPanelProps> = ({
  title,
  children,
  className = '',
  contentFull,
  wrapperFull,
}) => {
  return (
    <div
      className={classNames([
        'm-auto px-6 py-10 rounded-xlg shadow-colored-lg bg-white',
        wrapperFull ? '' : 'max-w-4xl',
        className,
      ])}
    >
      <div className={classNames(['m-auto', contentFull ? '' : 'max-w-2xl'])}>
        {title && <h1 className="mb-8 text-xl font-bold">{title}</h1>}
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Panel
