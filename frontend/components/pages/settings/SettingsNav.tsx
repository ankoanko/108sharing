import React from 'react'
import { IUser } from 'core/interfaces'
import { getSettingNavs } from 'constants/navs'

export type ActiveTypes =
  | 'account'
  | 'profile'
  | 'card'
  | 'notification'
  | 'identification'
  | 'payment_history'
  | 'business_registration'

interface IProps {
  user: IUser
}

const SettingsNav: React.FC<IProps> = ({ user }) => {
  const navs = getSettingNavs({ user: user, isSetting: true }).filter(nav => nav.show)
  const pathname = window.location.pathname

  return (
    <nav>
      <ul className={`text-sm`}>
        {navs.map((nav, i) => {
          const activeNav = pathname.startsWith(nav.href)
          return (
            <li key={i}>
              <a
                href={nav.href}
                className={`
                group relative flex items-center py-2 my-1 px-4 font-bold
                ${activeNav && `text-primary`}
                transition duration-150 hover:opacity-85
              `}
              >
                <span
                  className={`
              w-6 h-6 flex items-center justify-center mr-3  text-xl
              ${activeNav ? 'text-primary' : 'text-neutral-600'}
              `}
                >
                  {nav.icon}
                </span>
                <span>{nav.content}</span>
                {activeNav && (
                  <span
                    className={`
                  absolute block w-1 top-0 bottom-0 right-0 bg-primary rounded-l
                  transition duration-150 group-hover:text-primary
                `}
                  />
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default SettingsNav
