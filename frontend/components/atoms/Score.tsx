import * as React from 'react'
import { ReviewStars } from 'components/molecules'
import classNames from 'classnames'

type Size = 'small' | 'medium' | 'large'

interface IProps {
  score: number
  size: Size
  omit?: boolean
  totalCount?: number
  textSize?: Size
  className?: string
}

const getSize = (size: Size) => {
  switch (size) {
    case 'small':
      return { iconWidth: 13, iconHeight: 12, gapMarginClassName: 'mx-2px' }
    case 'medium':
      return { iconWidth: 17, iconHeight: 16, gapMarginClassName: 'mx-2px' }
    default:
      return {}
  }
}

const getTextSize = (size: Size) => {
  switch (size) {
    case 'small':
      return 'text-sm ml-1'
    case 'medium':
      return 'ml-1'
    default:
      return 'text-lg ml-2'
  }
}

const Score: React.FC<IProps> = props => {
  const sizeProps = getSize(props.size ?? 'small')
  return (
    <div className={props.className}>
      <div className="flex items-center">
        {props.omit || props.score === 0 ? (
          <ReviewStars score={1} range={[1]} {...sizeProps} />
        ) : (
          <ReviewStars score={props.score} {...sizeProps} />
        )}
        <span
          className={classNames([
            'leading-none',
            getTextSize(props.textSize ?? 'small'),
            props.textSize != null && props.size === 'large' ? 'ml-2' : 'ml-1',
          ])}
        >
          <span className="font-bold">{props.score === 0 ? '-' : props.score}</span>
          {!!props.totalCount && props.totalCount !== 0 && (
            <span className="pl-2px">({props.totalCount})</span>
          )}
        </span>
      </div>
    </div>
  )
}

export default Score
