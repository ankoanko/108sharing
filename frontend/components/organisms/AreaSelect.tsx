import * as React from 'react'
import I18n from 'core/i18n'
import { css } from '@emotion/core'

interface IProps {
  title: string
}

const AreaSelect: React.FC<IProps> = props => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{props.title}</h1>

      <ul className="flex flex-wrap lg:flex-row -my-1 -mx-2">
        {['tokyo', 'osaka', 'kyoto', 'sapporo'].map(key => (
          <li className="w-1/2 lg:w-1/4 py-1 px-2" key={key}>
            <div className="relative w-full h-50 lg:h-90 flex items-center justify-center rounded-md">
              <a className="block" href={`/posts/search?area=${I18n.t(`search_pan.${key}`)}`}>
                <div className="absolute bottom-0 inset-x-0 flex items-end justify-center text-white z-1 text-2xl font-bold mb-6">
                  <span>{I18n.t(`search_pan.${key}`)}</span>
                </div>
                <img
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  src={`/images/top/img_${key}.jpg`}
                  alt=""
                />
                <div
                  css={css`
                    position: absolute;
                    background-image: linear-gradient(
                      0deg,
                      #000000 0%,
                      rgba(0, 0, 0, 0.82) 52.08%,
                      rgba(0, 0, 0, 0) 100%
                    );
                    opacity: 0.52;
                    height: 25%;
                    left: 0;
                    right: 0;
                    bottom: 0;
                  `}
                />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AreaSelect
