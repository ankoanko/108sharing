/** @jsx jsx */
import * as React from 'react'
import { COLORS } from 'constants/colors'
import { css, jsx } from '@emotion/core'
import classNames from 'classnames'

interface IProps {
  className?: string
}

const spinnerStyle = css`
  .hollow-dots-spinner,
  .hollow-dots-spinner * {
    box-sizing: border-box;
  }

  .hollow-dots-spinner {
    height: 15px;
    width: calc(30px * 3);
  }

  .hollow-dots-spinner .dot {
    width: 15px;
    height: 15px;
    margin: 0 calc(15px / 2);
    background-color: ${COLORS.Primary};
    border-radius: 50%;
    float: left;
    transform: scale(0);
    animation: hollow-dots-spinner-animation 900ms ease infinite 0ms;
  }

  .hollow-dots-spinner .dot:nth-of-type(1) {
    animation-delay: calc(180ms * 1);
  }

  .hollow-dots-spinner .dot:nth-of-type(2) {
    animation-delay: calc(180ms * 2);
  }

  .hollow-dots-spinner .dot:nth-of-type(3) {
    animation-delay: calc(180ms * 3);
  }

  @keyframes hollow-dots-spinner-animation {
    50% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`

// https://github.com/epicmaxco/epic-spinners/blob/master/src/components/lib/HollowDotsSpinner.vue
const Spinner: React.FC<IProps> = props => {
  return (
    <div
      className={classNames(['flex items-center justify-center', props.className])}
      css={spinnerStyle}
    >
      <div className="hollow-dots-spinner">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </div>
  )
}

export default Spinner
