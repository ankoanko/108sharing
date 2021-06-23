import * as React from 'react'
import range from 'lodash-es/range'
import IconStar from 'icon/IconStar'
import classNames from 'classnames'

interface IProps {
  range?: number[]
  score: number
  setScore?: (score: number) => void
  iconWidth?: number
  iconHeight?: number
  gapMarginClassName?: string
}

const DEFAULT_RANGE = range(1, 6)

const ReviewStars: React.FC<IProps> = ({
  range,
  score,
  setScore,
  iconWidth,
  iconHeight,
  gapMarginClassName,
}) => {
  const [hoveredScore, setHoveredScore] = React.useState<null | number>(null)
  const onClick = React.useCallback(
    (num: number) => {
      if (setScore) setScore(num)
    },
    [setScore]
  )
  const onMouseEnter = React.useCallback(
    (num: number) => {
      if (setScore) setHoveredScore(num)
    },
    [setScore]
  )
  const onMouseLeave = React.useCallback(() => {
    if (setScore) setHoveredScore(null)
  }, [setScore])

  return (
    <div
      className={classNames([
        'flex items-center',
        gapMarginClassName ? `-${gapMarginClassName}` : '-mx-1',
      ])}
    >
      {(range || DEFAULT_RANGE).map(num => (
        <div
          key={num}
          className={classNames(['cursor-pointer', gapMarginClassName || 'px-1'])}
          onMouseEnter={() => onMouseEnter(num)}
          onMouseLeave={onMouseLeave}
          onClick={() => onClick(num)}
        >
          <IconStar
            width={iconWidth}
            height={iconHeight}
            className={classNames([
              'transition duration-100',
              num <= (hoveredScore || score) ? 'text-yellow' : 'text-neutral-600',
            ])}
          />
        </div>
      ))}
    </div>
  )
}

export default ReviewStars
