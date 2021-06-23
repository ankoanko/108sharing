import * as React from 'react'
import { LogoBlack } from 'icon'
import HeaderSearch from 'components/organisms/Header/HeaderSearch'
import LocaleSelector from 'components/atoms/LocaleSelector'
import Notifications from 'components/organisms/Header/Notifications'
import MenuList from 'components/organisms/Header/MenuList'
import I18n from 'core/i18n'
import Button from 'components/atoms/Button'
import classNames from 'classnames'
import { IUser } from 'core/interfaces'

interface IProps {
  shrink: boolean
  isSignedIn: boolean
  user: IUser
  area: string
  keywords: string
  onKeyDownSearchHandler: React.KeyboardEventHandler<HTMLInputElement>
  onBlurSearchHandler: React.FormEventHandler<HTMLInputElement>
}

const HeaderContentPC: React.FC<IProps> = props => {
  const [showMenu, setShowMenu] = React.useState(false)

  return (
    <div
      className={classNames([
        'flex items-center',
        props.shrink ? 'container' : 'w-full px-4 lg:px-6',
      ])}
    >
      <div className="flex items-center">
        <div>
          <a href="/">
            <LogoBlack />
          </a>
        </div>
        <div className="ml-8">
          <HeaderSearch
            area={props.area}
            keywords={props.keywords}
            onBlurHandler={props.onBlurSearchHandler}
            onKeyDownHandler={props.onKeyDownSearchHandler}
          />
        </div>
      </div>
      <div className="ml-auto flex items-center">
        <div className={'ml-5 first:ml-0'}>
          <LocaleSelector />
        </div>
        {props.isSignedIn ? (
          <>
            <div className={'ml-5 first:ml-0'}>
              <Notifications user={props.user} />
            </div>
            <div
              className={'ml-5 first:ml-0 cursor-pointer'}
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <div className="relative flex items-center">
                <div className="font-bold mr-4">{props.user.username}</div>
                <div>
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={props.user.avatar_url}
                    alt={props.user.username}
                  />
                </div>
                <div
                  className={classNames([
                    'absolute top-100 right-0 py-6 -mt-2px -mr-2',
                    'bg-white shadow-md w-57 rounded-lg',
                    'transition-all duration-100',
                    showMenu ? 'opacity-100 visible' : 'opacity-0 invisible',
                  ])}
                >
                  <MenuList user={props.user} isSignedIn={props.isSignedIn} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={'ml-8 first:ml-0'}>
              <a href="/users/sign_in" className="text-primary font-bold">
                {I18n.t('top_nav.login')}
              </a>
            </div>
            <div className={'ml-5 first:ml-0'}>
              <Button fit size="small" link="/users/sign_up">
                {I18n.t('top_nav.signup')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default HeaderContentPC
