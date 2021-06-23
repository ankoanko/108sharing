import React from 'react'
import { IUser } from 'core/interfaces'
import { getSettingNavs, getSignedInNav } from 'constants/navs'
import classNames from 'classnames'
import { BREAKPOINT_TABLET_LARGE } from 'constants/constants'
import { useMediaQuery } from 'react-responsive'
import LocaleSelector from 'components/atoms/LocaleSelector'

interface IProps {
  isSignedIn: boolean
  lang?: any
  user?: IUser
}

const MenuList: React.FC<IProps> = props => {
  const isDesktop = useMediaQuery({ query: `(min-width: ${BREAKPOINT_TABLET_LARGE}px)` })
  const pathname = window.location.pathname

  const navsItems = [
    getSettingNavs({ user: props.user, isSetting: false }),
    getSignedInNav({ user: props.user, isMobile: !isDesktop }),
    isDesktop
      ? []
      : ([
          {
            icon: null,
            href: null,
            content: <LocaleSelector />,
            show: true,
          },
        ] as any[]),
  ]
    .map(navs => navs.filter(nav => nav?.show))
    .filter(navs => navs.length)

  return (
    <ul className={classNames(['text-sm font-bold'])}>
      {navsItems.map((navs, i) => (
        <li key={i}>
          {i !== 0 && <div className="h-1px bg-neutral-300 my-2 mx-4" />}
          {navs.map(nav => {
            const activeNav = nav.match ? nav.match(pathname) : pathname.startsWith(nav.href)
            return (
              <div key={nav.href}>
                <a
                  href={nav.href}
                  className={classNames([
                    'group flex items-center py-2 px-4',
                    activeNav && 'text-primary',
                    'transition duration-150 hover:opacity-85',
                  ])}
                  {...nav.attrs}
                >
                  {nav.icon && (
                    <span
                      className={classNames([
                        'w-6 h-6 flex items-center justify-center mr-3  text-xl',
                        activeNav ? 'text-primary' : 'text-neutral-600',
                      ])}
                    >
                      {nav.icon}
                    </span>
                  )}
                  <span>{nav.content}</span>
                </a>
              </div>
            )
          })}
        </li>
      ))}
    </ul>
  )
}

export default MenuList
