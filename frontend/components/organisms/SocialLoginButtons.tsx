import React from 'react'
import I18n from '../../core/i18n'
import { LogoFacebook, LogoGoogle, LogoTwitter } from '../../icon/index'
import { ROLES } from 'constants/roles'
import classNames from 'classnames'

interface IProps {
  className?: string
}

interface ISocialButton {
  href: string
  logo: React.ReactElement
  label: string
}

const SocialLoginButtons: React.FC<IProps> = props => {
  const roleParams = '?' + [ROLES.Host.id, ROLES.Guest.id].map(id => `role_ids[]=${id}`).join('&')
  const buttons: ISocialButton[] = [
    {
      href: `/users/auth/facebook${roleParams}`,
      logo: <LogoFacebook />,
      label: `Facebook${I18n.t('session.login_with')}`,
    },
    {
      href: `/users/auth/google_oauth2${roleParams}`,
      logo: <LogoGoogle />,
      label: `Google${I18n.t('session.login_with')}`,
    },
    {
      href: `/users/auth/twitter${roleParams}`,
      logo: <LogoTwitter />,
      label: `Twitter${I18n.t('session.login_with')}`,
    },
  ]
  return (
    <div className={props.className}>
      {buttons.map((button, i) => (
        <a
          key={i}
          href={button.href}
          className={classNames([
            'flex items-center max-w-64 mx-auto py-2 px-4 mt-3 first:mt-0',
            'border border-neutral-300 rounded-full',
            'transition duration-150 hover:opacity-85',
          ])}
        >
          <span>{button.logo}</span>
          <span className="ml-6 flex-grow">{button.label}</span>
        </a>
      ))}
    </div>
  )
}

export default SocialLoginButtons
