import * as React from 'react'
import I18n from 'core/i18n'
import classNames from 'classnames'
import { IUser } from 'core/interfaces'

interface IProps {
  user: IUser
  createdTimeAgo?: string
  isReply: boolean
}

const AvatarForReview: React.FC<IProps> = ({ user, createdTimeAgo, isReply }) => {
  return (
    <div className="flex items-center">
      <a
        className={classNames([
          'w-10 h-10 mr-3 overflow-hidden rounded-full',
          'md:w-16 md:h-16 md:mr-6',
        ])}
        href={`/user/${user.username}`}
        target="_blank"
      >
        <img className="object-cover" src={user.avatar_url} alt="" />
      </a>
      <div className="flex-auto">
        <h4 className="font-bold text-sm md:text-base">
          {isReply ? I18n.t('generic.response_from', { user: user.username }) + ':' : user.username}
        </h4>
        {createdTimeAgo && (
          <div className="text-sm">{I18n.t('generic.time_ago', { time: createdTimeAgo })}</div>
        )}
      </div>
    </div>
  )
}

export default AvatarForReview
