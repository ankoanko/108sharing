/** @jsx jsx */
import * as React from 'react'
import { css, jsx } from '@emotion/core'
import { HEADER_HEIGHT } from 'constants/constants'

interface IProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const BurgerIcon: React.FC<IProps> = props => {
  return (
    <div
      onClick={() => props.setIsOpen(!props.isOpen)}
      css={getBurgerStyle(props.isOpen)}
      className="text-neutral-600"
    >
      <span />
      <span />
      <span />
    </div>
  )
}

const getBurgerStyle = (isOpen: boolean) => {
  return css`
        position: relative;
        width: ${HEADER_HEIGHT}px;
        height: ${HEADER_HEIGHT}px;
        
        :hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        > span {
          display: block;
          height: 3px;
          width: 20px;
          position: absolute;
          background-color: currentColor;
          transform-origin: center;
          transition-duration: 86ms;
          transition-property: background-color, opacity, transform;
          transition-timing-function: ease-out;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          
          :nth-of-type(1) {
            margin-top: -8px;
          }
      
          :nth-of-type(3) {
            margin-top: 8px;
          }
          
          ${isOpen &&
            `
            :nth-of-type(1) {
              margin-top: 0;
              transform: translate(-50%, -50%) rotate(45deg);
            }
      
            :nth-of-type(2) {
              opacity: 0;
            }
      
            :nth-of-type(3) {
              margin-top: 0;
              transform: translate(-50%, -50%) rotate(-45deg);
            }
          `}
        }
    }
  `
}

export default BurgerIcon
