/** @jsx jsx */
import * as React from 'react'
import { IUser } from 'core/interfaces'
import { IconClose, LogoBlack } from 'icon'
import BurgerIcon from 'components/atoms/BurgerIcon'
import { jsx } from '@emotion/core'
import Notifications from 'components/organisms/Header/Notifications'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import classNames from 'classnames'
import { Button } from 'components/atoms'
import HeaderSearch from 'components/organisms/Header/HeaderSearch'
import MenuList from 'components/organisms/Header/MenuList'
import I18n from 'core/i18n'

interface IProps {
  isSignedIn: boolean
  user: IUser
  lang?: Record<string, string>
  area: string
  keywords: string
}

const HeaderContentSP: React.FC<IProps> = props => {
  const [isBurgerOpen, setIsBurgerOpen] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  return (
    <div className="flex items-center">
      <div>
        <BurgerIcon isOpen={isBurgerOpen} setIsOpen={setIsBurgerOpen} />
        <div
          className={classNames([
            'absolute z-1 inset-x-0 top-0 ',
            'transition-all ease-out duration-300',
            isBurgerOpen ? 'visible' : 'invisible',
          ])}
        >
          <div
            className={classNames([
              'absolute inset-x-0 bg-black h-screen',
              'transition-all ease-out duration-300',
              isBurgerOpen ? 'opacity-20 bg-blur' : 'opacity-0',
            ])}
            onClick={() => setIsBurgerOpen(false)}
          />
          <div
            className={classNames([
              'absolute w-60 sm:w-80 bg-white transform h-screen overflow-y-auto',
              'transition ease-out duration-300',
              isBurgerOpen ? 'translate-x-0' : '-translate-x-full',
            ])}
          >
            <div
              className={classNames([
                'transform transition duration-500',
                isBurgerOpen ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0',
              ])}
            >
              {props.user ? (
                <React.Fragment>
                  <div className="flex items-center px-4 mt-8 mb-6">
                    <img
                      className="w-16 h-16 rounded-full object-cover"
                      src={props.user.avatar_url}
                      alt={props.user.username}
                    />
                    <div className="ml-4 font-bold">{props.user.username}</div>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="flex items-center mt-8 px-6">
                    <div className="w-1/2">
                      <a href="/users/sign_in" className="text-primary font-bold">
                        {I18n.t('top_nav.login')}
                      </a>
                    </div>
                    <div className="w-1/2">
                      <Button fit size="small" link="/users/sign_up">
                        {I18n.t('top_nav.signup')}
                      </Button>
                    </div>
                  </div>
                  <div className="h-1px bg-neutral-300 my-4 mx-4" />
                </React.Fragment>
              )}
              <div className="pb-20">
                <MenuList isSignedIn={props.isSignedIn} user={props.user} lang={props.lang} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <a href="/">
          <LogoBlack />
        </a>
      </div>
      <div className="ml-auto mr-4">
        <div className="cursor-pointer" onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <FontAwesomeIcon className="text-2xl text-neutral-600" icon={faSearch} />
        </div>
        <form action="/posts/search" method="get">
          <div
            className={classNames([
              'absolute inset-0 bg-white z-1',
              'flex items-center px-4',
              'transition-all duration-150',
              isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
            ])}
          >
            <div className="flex items-center text-neutral-600">
              <IconClose onClick={() => setIsSearchOpen(false)} />
            </div>
            <div className="ml-2 flex-grow w-0">
              <HeaderSearch area={props.area} keywords={props.keywords} />
            </div>
            <div className="ml-2">
              <Button fit size="small" type="submit">
                {I18n.t('button.search')}
              </Button>
            </div>
          </div>
        </form>
      </div>
      {props.user && (
        <div className="mr-4">
          <Notifications user={props.user} />
        </div>
      )}
    </div>
  )
}

export default HeaderContentSP
