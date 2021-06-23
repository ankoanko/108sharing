// TODO これはconstants? でもnavをまとめておきたい
import React from 'react'
import I18n from 'core/i18n'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons/faCreditCard'
import { faListUl } from '@fortawesome/free-solid-svg-icons/faListUl'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'
import { faIdCard } from '@fortawesome/free-solid-svg-icons/faIdCard'
import { IUser } from 'core/interfaces'
import { getRoleFlagsFromUser } from 'utils/role'
import LocaleSelector from 'components/atoms/LocaleSelector'
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons/faCalendarCheck'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser'
import { faCashRegister, faLandmark, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'

interface INav {
  icon?: React.ReactElement
  href: string
  content: string | React.ReactElement
  show: boolean
  attrs?: any
  match?: (pathname: string) => boolean
  // active は location.pathname.startsWith か === で必要な時に使う側で好きに取る
}

export const getSettingNavs = ({
  user,
  isSetting,
}: {
  user: IUser
  isSetting?: boolean
}): INav[] => {
  if (!user) return []
  const { isAdmin, isGuest, isHost } = getRoleFlagsFromUser(user)
  const profileIcon = isSetting ? (
    <img className="block w-full h-full rounded-full" src={user.avatar_url} />
  ) : (
    <FontAwesomeIcon icon={faUser} />
  )
  return [
    {
      icon: profileIcon,
      href: '/settings/profile',
      content: I18n.t('generic.profile'),
      show: true,
    },
    {
      icon: <FontAwesomeIcon icon={faBell} />,
      href: '/settings/notification',
      content: I18n.t('generic.notification'),
      show: true,
    },
    {
      icon: <FontAwesomeIcon icon={faLandmark} />,
      href: '/settings/bank_account',
      content: I18n.t('top_nav.bank_account'),
      show: isHost,
    },
    {
      icon: <FontAwesomeIcon icon={faCreditCard} />,
      href: '/settings/card',
      content: I18n.t('generic.card'),
      show: isGuest,
    },
    {
      icon: <FontAwesomeIcon icon={faIdCard} />,
      href: '/settings/identification',
      content: I18n.t('generic.identification'),
      show: true,
    },
    // {
    //   href: '/settings/payment_history',
    //   content: I18n.t('payment_history.history'),
    //   show: isGuest,
    //   active: pathname.startsWith('payment_history'),
    // },
    // {
    // href: '/settings/business_registration',
    // content: I18n.t('business_registration.title'),
    // show: isHost,
    // active: pathname.startsWith('business_registration'),
    // },
    {
      icon: <FontAwesomeIcon icon={faCog} />,
      href: '/admin/posts',
      content: I18n.t('top_nav.admin'),
      show: !isSetting && isAdmin,
    },
  ]
}

export const getSignedInNav = ({ user, isMobile }: { user: IUser; isMobile?: boolean }): INav[] => {
  if (!user) return []
  const { isAdmin, isGuest, isHost } = getRoleFlagsFromUser(user)
  return [
    {
      icon: <FontAwesomeIcon className="text-primary" icon={faPlusCircle} />,
      href: '/posts/new',
      content: I18n.t('top_nav.create_post'),
      show: isHost,
    },
    {
      icon: <FontAwesomeIcon icon={faListUl} />,
      href: '/posts',
      content: I18n.t('top_nav.posts'),
      show: isHost,
      match: pathname => pathname.match(/^\/posts$/) !== null,
    },
    {
      icon: <FontAwesomeIcon icon={faHeart} />,
      href: '/favorites',
      content: I18n.t('top_nav.favorites'),
      show: isGuest,
    },
    {
      icon: <FontAwesomeIcon icon={faCalendarCheck} />,
      href: '/reservations',
      content: I18n.t('top_nav.reservations', { name: I18n.t('generic.guest') }),
      show: isGuest,
      match: pathname => pathname.match(/\/reservations$/) !== null,
    },
    {
      icon: <FontAwesomeIcon icon={faCalendarCheck} />,
      href: '/host_reservations',
      content: I18n.t('top_nav.reservations', { name: I18n.t('generic.host') }),
      show: isHost,
    },
    {
      icon: <FontAwesomeIcon icon={faEnvelope} />,
      href: '/contacts/new',
      content: I18n.t('top_nav.contacts'),
      show: !isAdmin,
    },
    {
      icon: <FontAwesomeIcon icon={faSignOutAlt} />,
      href: '/users/sign_out',
      content: I18n.t('top_nav.logout'),
      show: true,
      attrs: {
        rel: 'nofollow',
        'data-method': 'delete',
      },
    },
  ]
}
