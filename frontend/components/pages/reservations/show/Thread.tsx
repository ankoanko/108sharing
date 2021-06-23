import * as React from 'react'
import classNames from 'classnames'
import { IMessage } from './'

interface IProps {
  messages: IMessage[]
}

const Thread: React.FC<IProps> = ({ messages }) => (
  <div>
    <div>
      {[...messages].reverse().map(message => (
        <div
          className={classNames([
            'flex flex-wrap items-end mt-4 first:mt-0',
            'lg:flex-no-wrap',
            message.other && 'flex-row-reverse text-right',
          ])}
          key={message.id}
        >
          <div className={classNames(['flex', message.other && 'flex-row-reverse'])}>
            <img
              className="flex-none w-10 h-10 rounded-full object-cover"
              src={message.sender.avatar_url}
              alt=""
            />
            <div
              className={classNames(
                'max-w-xl py-4 px-6 rounded-t-lg flex',
                { 'flex-row-reverse mr-3 rounded-bl-lg bg-primary-light': message.other },
                { 'ml-3 rounded-br-lg bg-neutral-100': !message.other }
              )}
            >
              <div>
                {message.file_attached && (
                  <div className="max-w-sm mb-4">
                    <img className="w-full rounded-md" src={message.file_url} alt="" />
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.body}</div>
              </div>
            </div>
          </div>
          {/* TODO メッセージと縦をSPの時に合わせる（用構造変更） */}
          <div
            className={classNames([
              'w-full pt-1 text-xs text-neutral-500',
              'lg:w-auto lg:px-3 lg:py-4',
            ])}
          >
            {message.sent_at}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default Thread
