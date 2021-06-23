import React from 'react'
import ClickOutside from 'react-click-outside'
import I18n from '../../../core/i18n'
import { IUser } from '../../../core/interfaces'
import { userService } from '../../../core/services'
import classNames from 'classnames'
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Spinner } from 'components/atoms'

interface INotification {
  id: number
  title: string
  created_at: string
  read_at: string
  url: string
}

interface IProps {
  user: IUser
}

const Notifications: React.FC<IProps> = ({ user }) => {
  const [notifications, setNotifications] = React.useState<INotification[]>(null)
  const [showNotifications, setShowNotifications] = React.useState(false)

  const getNotifications = async () => {
    if (showNotifications) {
      setShowNotifications(false)
      return
    }

    const result = await userService.getNotifications()
    setNotifications(result.notifications)
  }

  const togglePopover = () => {
    if (showNotifications) {
      return setShowNotifications(false)
    }

    setNotifications(null)
    setShowNotifications(true)
    getNotifications()
  }

  return (
    <div className="relative">
      <ClickOutside onClickOutside={() => setShowNotifications(false)}>
        <div className="cursor-pointer text-neutral-600" onClick={togglePopover}>
          <FontAwesomeIcon className="text-2xl lg:text-xl" icon={faBell} />
          {user.unread_notifications_count > 0 && (
            <span className="absolute top-0 right-0 -mt-2 -mr-2 flex items-center justify-center w-4 h-4 text-xs text-center bg-red text-white rounded-full leading-none">
              {user.unread_notifications_count}
            </span>
          )}
        </div>
        <ul
          className={classNames([
            'w-76 lg:w-90 absolute z-1 top-100 right-0 -mr-2 mt-2',
            'bg-white shadow-colored-lg rounded-md max-h-60 overflow-y-auto',
            'transition-all duration-150',
            showNotifications ? 'opacity-100 visible' : 'opacity-0 invisible',
          ])}
        >
          {notifications === null ? (
            <div className="py-4">
              <Spinner />
            </div>
          ) : (
            <>
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <li key={notification.id}>
                    <a
                      href={notification.url}
                      className="block text-sm py-1 px-4 transition duration-100 hover:bg-neutral-100"
                    >
                      {notification.title}
                      <br />
                      <span className="text-xs text-neutral-650">
                        {I18n.t('generic.time_ago', { time: notification.created_at })}
                      </span>
                    </a>
                  </li>
                ))
              ) : (
                <li>
                  <div className="block text-sm py-1 px-4">
                    <span>{I18n.t('notifications.no_notifications')}</span>
                  </div>
                </li>
              )}
            </>
          )}
        </ul>
      </ClickOutside>
    </div>
  )
}

export default Notifications
