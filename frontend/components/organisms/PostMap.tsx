/** @jsx jsx */
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkedAlt'
import { faListUl } from '@fortawesome/free-solid-svg-icons/faListUl'
import * as React from 'react'
import { BREAKPOINT_TABLET_LARGE, HEADER_HEIGHT } from 'constants/constants'
import { css, jsx } from '@emotion/core'
import I18n from 'core/i18n'

interface IPostListProps {
  showMap?: boolean
  toggleShowMap?(show: boolean): void
}

const PostList: React.FC<IPostListProps> = ({ showMap = true, toggleShowMap }) => {
  const onChangeMql = React.useCallback(
    mql => {
      toggleShowMap(!mql.matches)
    },
    [toggleShowMap]
  )
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINT_TABLET_LARGE}px)`)
    mql.addListener(onChangeMql)
    return () => mql.removeListener(onChangeMql)
  }, [onChangeMql])

  return (
    <React.Fragment>
      <div
        className={classNames([
          'relative lg:inset-0 lg:static lg:flex-auto',
          !showMap && 'h-0 overflow-hidden lg:h-auto',
        ])}
      >
        <div
          className={classNames('sticky')}
          css={css`
            height: calc(var(--inner-height) - ${HEADER_HEIGHT + 52}px);
            top: ${HEADER_HEIGHT + 52}px;
          `}
        >
          <div id="map" className="h-full" />
        </div>
      </div>
      <div className="absolute inset-y-0 lg:hidden lg:flex-auto">
        <div
          className={classNames('sticky')}
          css={css`
            height: calc(var(--inner-height) - ${HEADER_HEIGHT + 52}px);
            top: ${HEADER_HEIGHT + 52}px;
          `}
        >
          <div className="absolute w-screen flex justify-center z-10 bottom-0 mb-8 m-auto">
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 py-2 px-5 bg-white shadow-colored-lg rounded-full border border-neutral-300 cursor-pointer"
              onClick={() => toggleShowMap(!showMap)}
            >
              <FontAwesomeIcon
                className="text-primary"
                icon={showMap ? faListUl : faMapMarkedAlt}
              />
              <span className="ml-2 font-bold text-sm">
                {showMap ? I18n.t('generic.to_index') : I18n.t('generic.map')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default PostList
