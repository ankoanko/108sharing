/** @jsx jsx */
import React from 'react'
import 'react-dates/initialize'
import I18n from 'core/i18n'
import { IPost } from 'core/interfaces'
import { Button } from 'components/atoms'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartFilled } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons/faHeart'
import { jsx } from '@emotion/core'
import PostDetailSidebarContent from 'components/pages/posts/show/PostDetailSidebarContent'
import classNames from 'classnames'
import { HEADER_HEIGHT } from 'constants/constants'
import { PostReservationPeriod, PostShowPageType } from 'components/pages/posts/show/index'

interface IProps {
  post: IPost
  changePage: (page: PostShowPageType, period?: PostReservationPeriod) => void
  isSignedIn: boolean
  isOwner: boolean
  toggleLike(post: IPost): void
  userLiked: boolean
}

const PostDetailSideBar: React.FC<IProps> = ({
  post,
  changePage,
  isSignedIn,
  isOwner,
  toggleLike,
  userLiked,
}) => {
  return (
    <div className={classNames(['hidden lg:block max-w-2xl w-80 mb-8'])}>
      <div className="sticky z-1" css={{ top: `${HEADER_HEIGHT + 24}px` }}>
        <div className="p-6 rounded-lg shadow-colored-lg">
          <PostDetailSidebarContent post={post} isSignedIn={isSignedIn} changePage={changePage} />
        </div>
        {!isOwner && (
          <div className="px-4 mt-4">
            <Button
              buttonType="secondary"
              handleClick={() => toggleLike(post)}
              full
              iconLeft={
                userLiked ? (
                  <FontAwesomeIcon className="text-lg text-red" icon={faHeartFilled} />
                ) : (
                  <FontAwesomeIcon className="text-lg" icon={faHeartOutline} />
                )
              }
            >
              {I18n.t(userLiked ? 'favorite.is_liked' : 'favorite.add_like')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostDetailSideBar
