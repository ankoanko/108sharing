import * as React from 'react'
import I18n from '../../../core/i18n'
import classNames from 'classnames'

export type ActiveTypes =
  | 'post'
  | 'category'
  | 'tag'
  | 'user'
  | 'reservation'
  | 'contact'
  | 'identification'
  | 'setting'

interface IProps {
  active: ActiveTypes
}

const AdminNav: React.FC<IProps> = ({ active }) => {
  const i18nPrefix = { scope: 'activerecord.models' }
  const navs = [
    {
      icon: null,
      href: '/admin/posts',
      content: I18n.t('post', i18nPrefix),
      show: true,
      active: active === 'post',
    },
    {
      icon: null,
      href: '/admin/categories',
      content: I18n.t('category', i18nPrefix),
      show: true,
      active: active === 'category',
    },
    {
      icon: null,
      href: '/admin/tags',
      content: I18n.t('tag', i18nPrefix),
      show: true,
      active: active === 'tag',
    },
    {
      icon: null,
      href: '/admin/users',
      content: I18n.t('user', i18nPrefix),
      show: true,
      active: active === 'user',
    },
    {
      icon: null,
      href: '/admin/reservations',
      content: I18n.t('reservation', i18nPrefix),
      show: true,
      active: active === 'reservation',
    },
    {
      icon: null,
      href: '/admin/contacts',
      content: I18n.t('contact', i18nPrefix),
      show: true,
      active: active === 'contact',
    },
    {
      icon: null,
      href: '/admin/identifications',
      content: I18n.t('identification', i18nPrefix),
      show: true,
      active: active === 'identification',
    },
    {
      icon: null,
      href: '/admin/settings',
      content: I18n.t('setting', i18nPrefix),
      show: true,
      active: active === 'setting',
    },
  ]

  return (
    <nav>
      <ul className="text-sm">
        {navs.map((nav, i) => (
          <li key={i}>
            <a
              href={nav.href}
              className={classNames([
                'group relative block py-2 my-1 px-5',
                'transition duration-150 hover:opacity-85',
                nav.active && 'font-bold',
              ])}
            >
              <span>{nav.content}</span>
              {nav.active && (
                <span
                  className={`
                  absolute block w-1 top-0 bottom-0 left-0 bg-primary rounded-r-sm
                  transition duration-150 group-hover:text-primary
                `}
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default AdminNav
