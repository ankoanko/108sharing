import * as React from 'react'
import classNames from 'classnames'

interface ITab {
  label: string
  onClick: () => void
  active: boolean
}
interface IProps {
  tabs: ITab[]
}

const Review: React.FC<IProps> = props => {
  return (
    <div className="flex border-b border-neutral-300">
      {props.tabs.map((tab, i) => (
        <div className="w-full" key={i}>
          {/* routerになるとaタグかなと思いaタグで実装 */}
          <a
            href="#"
            className="flex justify-center w-full transition duration-150 hover:opacity-85"
            onClick={e => {
              e.preventDefault()
              tab.onClick()
            }}
          >
            <span
              className={classNames([
                'relative pb-2 lg:pb-3 text-base lg:text-lg font-bold focus:outline-none',
                tab.active && 'text-primary',
              ])}
            >
              {tab.label}
              {tab.active && (
                <span className="absolute bottom-0 inset-x-0 block h-3px -mx-2 bg-primary rounded-sm -mb-1px" />
              )}
            </span>
          </a>
        </div>
      ))}
    </div>
  )
}

export default Review
