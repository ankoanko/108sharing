/** @jsx jsx */
import * as React from 'react'
import { css, jsx } from '@emotion/core'

interface IProps {
  name: string
  value: string
  label?: string
  className?: string
  defaultChecked?: boolean
  onChangeHandler?: React.FormEventHandler<HTMLInputElement>
}

const Radio: React.FC<IProps> = ({
  name,
  value,
  label,
  className = '',
  defaultChecked = false,
  onChangeHandler,
}) => {
  return (
    <label
      className={className}
      css={css`
      display: block;
      position: relative;
      cursor: pointer;

      &:hover {
        opacity: .75;
      }

      input:checked + span {
        &::before {
          width: 18px;
          height: 18px;
          border: solid 1px #08C4B3;
          border-radius: 50%;
        }

        &::after {
          left: 4px;
          width: 10px;
          height: 10px;
          background-color: #08C4B3;
          border-radius: 50%;
        }
      }
    }
    `}
    >
      <input
        css={css`
          opacity: 0;
          height: 0;
          width: 0;
        `}
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        onChange={onChangeHandler}
      />
      <span
        css={css`
          font-size: 14px;
          padding-left: 28px;

          &::before,
          &::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            margin: auto;
          }

          &::before {
            width: 18px;
            height: 18px;
            border: solid 1px #eaedef;
            border-radius: 50%;
          }
        `}
      >
        {label}
      </span>
    </label>
  )
}

export default Radio
