/** @jsx jsx */
import classNames from 'classnames'
import * as React from 'react'
import { css, jsx } from '@emotion/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'

const REMAIN_TIME = 2000

export type FlashMessageType = null | 'error' | 'success'

interface IProps {
  uuid: string
  type?: FlashMessageType
  deleteMessage: (uuid: string) => void
  className?: string
}

const animationStyles = css`
  &.fade-enter {
    opacity: 0;
    transform: translateY(100%);
  }

  &.fade-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.2s ease-out;
  }

  &.fade-exit {
    opacity: 1;
    transform: translateY(0);
  }

  &.fade-exit-active {
    opacity: 0;
    transform: translateY(100%);
    transition: all 0.2s ease-in;
  }
`

const FlashMessageItem: React.FC<IProps> = props => {
  React.useEffect(() => {
    setTimeout(() => {
      props.deleteMessage(props.uuid)
    }, REMAIN_TIME)
  }, [props])

  return (
    <div
      className={classNames(['flex items-center justify-center', props.className])}
      css={animationStyles}
    >
      <div
        className={classNames([
          'w-auto flex items-center py-2 px-4 mx-4 text-center text-white font-bold rounded-md shadow-button',
          props.type === 'error' ? 'bg-red' : 'bg-green',
        ])}
      >
        <FontAwesomeIcon
          className="text-lg"
          icon={props.type === 'error' ? faExclamationTriangle : faCheckCircle}
        />
        <div className="ml-2 text-sm">{props.children}</div>
      </div>
    </div>
  )
}

export default FlashMessageItem
