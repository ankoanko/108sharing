/** @jsx jsx */
import * as React from 'react'
import { css, jsx } from '@emotion/core'
import classNames from 'classnames'

interface IProps {
  overlayColor?: { r: number; g: number; b: number }
  type?: 'overlay' | 'normal'
}
const Collapse: React.FC<IProps> = ({
  children,
  overlayColor = { r: 247, g: 247, b: 247 },
  type = 'overlay',
}) => {
  const [showAll, setShowAll] = React.useState(false)
  const mainRef = React.useRef(null)
  const innerRef = React.useRef(null)
  const overLayColorText = `${overlayColor.r.toString()}, ${overlayColor.g.toString()}, ${overlayColor.b.toString()}`

  React.useLayoutEffect(() => {
    if (mainRef.current.clientHeight > innerRef.current.clientHeight) {
      setShowAll(true)
    }
  }, [])

  return (
    <div>
      <div
        ref={mainRef}
        className="overflow-hidden"
        css={css({
          height: showAll ? 'auto' : `${6 * 1.6}em`, // row * line-height
        })}
      >
        <div ref={innerRef}>{children}</div>
      </div>
      {!showAll && (
        <div className="py-1 relative">
          {type === 'overlay' && (
            <div
              className="absolute inset-x-0 bg-gray"
              css={css({
                height: '4em',
                top: '-4em',
                background: `linear-gradient(180deg, rgba(${overLayColorText}, 0) 0%, rgba(${overLayColorText}, 0.82) 52.08%, rgba(${overLayColorText}, 1) 100%)`,
              })}
            />
          )}
          <button
            className={classNames([
              'relative z-1 block text-primary text-sm focus:outline-none',
              type === 'overlay' ? 'w-full text-center' : 'text-left',
            ])}
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              setShowAll(true)
            }}
          >
            続きを読む
          </button>
        </div>
      )}
    </div>
  )
}

export default Collapse
