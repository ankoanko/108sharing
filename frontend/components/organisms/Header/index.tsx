/** @jsx jsx */

import * as React from 'react'
import classNames from 'classnames'
import { css, Global, jsx } from '@emotion/core'
import { HEADER_HEIGHT } from '../../../constants/constants'
import { userService } from 'core/services'
import HeaderContentPC from 'components/organisms/Header/HeaderContentPC'
import HeaderContentSP from 'components/organisms/Header/HeaderContentSP'
import { useHeaderSearch } from 'hooks/useHeaderSearch'

interface IWindow {
  localePath: { [key: string]: string }
  location: any
}

declare let window: IWindow

interface IProps {
  isSignedIn: boolean
  user: any
  notifications: any[]
  lang?: Record<string, string>
  shrink?: boolean
}

const Header: React.FC<IProps> = props => {
  const { user } = userService.getUserFromJson(props.user)

  const { area, keywords, onKeyDownHandler, onBlurHandler } = useHeaderSearch()

  React.useEffect(() => {
    if (props.lang) {
      window.localePath = { ...props.lang }
    }
  }, [props.lang])

  return (
    <React.Fragment>
      <Global styles={css(globalStyle)} />

      <header
        className={classNames([
          'fixed top-0 inset-x-0',
          'flex items-center h-13 border-b border-neutral-300 bg-white z-50',
        ])}
      >
        <div className="hidden lg:block w-full">
          <HeaderContentPC
            isSignedIn={props.isSignedIn}
            user={user}
            shrink={props.shrink}
            area={area}
            keywords={keywords}
            onKeyDownSearchHandler={onKeyDownHandler}
            onBlurSearchHandler={onBlurHandler}
          />
        </div>
        <div className="lg:hidden w-full">
          <HeaderContentSP
            isSignedIn={props.isSignedIn}
            user={user}
            lang={props.lang}
            area={area}
            keywords={keywords}
          />
        </div>
      </header>
    </React.Fragment>
  )
}

const globalStyle = `
  main {
    padding-top: 0;
    margin-top: ${`${HEADER_HEIGHT}px`};
  }
`

export default Header
