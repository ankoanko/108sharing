import * as React from 'react'
import { ITag } from 'core/interfaces'
import classNames from 'classnames'

interface IProps {
  tags: ITag[]
  className?: string
}

const Tags: React.FC<IProps> = props => {
  return (
    <div className={props.className}>
      <ul className="flex flex-wrap -m-1">
        {props.tags.map(tag => (
          <li
            key={tag.name}
            className={classNames([
              'm-1 py-1 px-2 bg-primary-light rounded text-primary leading-none font-medium',
              'text-xs lg:text-sm',
            ])}
          >
            {tag.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Tags
