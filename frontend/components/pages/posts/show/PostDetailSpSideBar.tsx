/** @jsx jsx */
import * as React from 'react'
import { IPost } from 'core/interfaces'
import I18n from 'core/i18n'
import { Button, Score } from 'components/atoms'
import classNames from 'classnames'
import { css, jsx } from '@emotion/core'
import { HEADER_HEIGHT } from 'constants/constants'
import PostDetailSidebarContent from 'components/pages/posts/show/PostDetailSidebarContent'
import { PAYMENT_REQUIRED } from 'constants/paymentRequired'
import { IconClose } from 'icon'
import { PostReservationPeriod, PostShowPageType } from 'components/pages/posts/show/index'

interface IProps {
  post: IPost
  showReservationPanel: boolean
  setShowReservationPanel(showReesrvationPanel: boolean): void
  changePage: (page: PostShowPageType, period?: PostReservationPeriod) => void
  isSignedIn: boolean
}

const PostDetailSpSideBar: React.FC<IProps> = props => {
  return (
    <React.Fragment>
      {/* bottom nav */}
      <div
        className={classNames([
          props.showReservationPanel ? 'hidden' : 'fixed xl:hidden',
          'inset-x-0 bottom-0 flex items-center h-16 bg-white py-2 px-4 z-10',
        ])}
      >
        <div className="flex-grow">
          {PAYMENT_REQUIRED && (
            <div className="font-bold mb-1">
              ¥ {props.post.price} <span>{I18n.t('generic.per_day')}</span>
            </div>
          )}
          <Score score={props.post.avarage_review_score} size="small" />
        </div>

        <div className="w-50">
          <Button handleClick={() => props.setShowReservationPanel(true)}>
            {I18n.t('generic.reservation')}
          </Button>
        </div>
      </div>

      {/* screen of selecting date */}
      <div
        className={classNames([
          props.showReservationPanel ? 'fixed' : 'hidden',
          'inset-0 bg-white z-10 py-6 px-4',
          ' xl:hidden',
        ])}
        css={css`
          top: ${HEADER_HEIGHT}px;
        `}
      >
        <div className="mb-4 text-neutral-600">
          <IconClose onClick={() => props.setShowReservationPanel(false)} />
        </div>
        <PostDetailSidebarContent
          isSignedIn={props.isSignedIn}
          post={props.post}
          changePage={props.changePage}
          setShowReservationPanel={props.setShowReservationPanel}
        />
      </div>
    </React.Fragment>
  )
}

export default PostDetailSpSideBar
