/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartFilled } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen'
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock'
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons/faHeart'
import * as React from 'react'
import { PAYMENT_REQUIRED } from 'constants/paymentRequired'
import Score from 'components/atoms/Score'
import { lineCramp } from 'utils/emotion'
import { IPost } from 'core/interfaces'
import { MARKER_FAVORITE_CLASSNAME } from '../atoms/CustomMarker/Marker'
import { isTouchDevice } from 'utils/device'
import Tags from 'components/molecules/Tags'
import I18n from 'core/i18n'

interface IPostItemProps {
  post: IPost
  isSignedIn?: boolean
  staticSize?: boolean
  layout?: 'large' | 'medium' | 'small' | 'card'
  tag?: keyof JSX.IntrinsicElements
  isOwner?: boolean
  handleOnMouseEnter?(markerId): void
  handleOnMouseLeave?(): void
  toggleLike?(post: IPost): void
}

const PostItem: React.FC<IPostItemProps> = ({
  layout = 'medium',
  staticSize = false,
  isOwner = false,
  tag: Tag = 'div',
  toggleLike,
  post,
  ...props
}) => {
  const handleOnMouseEnter = (id: number) => {
    if (typeof props.handleOnMouseEnter === 'function') {
      props.handleOnMouseEnter(id)
    }
  }

  const handleOnMouseLeave = () => {
    if (typeof props.handleOnMouseLeave === 'function') {
      props.handleOnMouseLeave()
    }
  }

  const renderFav = post => {
    return (
      <div
        className={classNames(
          MARKER_FAVORITE_CLASSNAME,
          'absolute top-0 right-0 text-lg leading-none',
          { 'text-neutral-600': layout === 'large' },
          { 'mt-4 mr-4 text-white': ['medium', 'card'].includes(layout) }
        )}
        onClick={event => {
          event.stopPropagation()
          event.preventDefault()
          toggleLike(post)
        }}
      >
        {post.user_liked ? (
          <FontAwesomeIcon className="text-red" icon={faHeartFilled} />
        ) : (
          <FontAwesomeIcon icon={faHeartOutline} />
        )}
      </div>
    )
  }

  const renderOwnerActions = post => {
    return (
      <React.Fragment>
        {!post.published && (
          <div className="absolute left-0 bottom-0 ml-3 mb-3 rounded-full bg-blue shadow">
            <span className="block px-3 py-2 text-white text-sm font-bold">
              <FontAwesomeIcon icon={faLock} />
              <span className="inline-block ml-2">{I18n.t('enums.post.aasm_state.closed')}</span>
            </span>
          </div>
        )}
        <div
          className={classNames(
            'absolute right-0 bottom-0 mr-3 mb-3 rounded-full bg-white shadow',
            { 'hidden group-hover:block': !isTouchDevice() }
          )}
        >
          <div className="flex items-center divide-x divide-neutral-300">
            <a
              href={`/posts/${post.slug}/edit`}
              className="block text-xs px-3 py-2 text-neutral-500 hover:text-primary font-bold"
            >
              <FontAwesomeIcon icon={faPen} />
              <span className="inline-block ml-2">{I18n.t('generic.edit')}</span>
            </a>
            {/* TODO Add Delete */}
            {/* <a href="" className="block text-xs px-3 py-2 text-neutral-500 hover:text-primary font-bold">
              <FontAwesomeIcon icon={faTrashAlt}/>
              <span className="inline-block ml-2">削除</span>
            </a> */}
          </div>
        </div>
      </React.Fragment>
    )
  }

  return (
    <Tag
      className={classNames(
        'font-normal group',
        { 'px-2 py-4 md:w-1/3 lg:w-1/4 xl:w-1/5': staticSize },
        { 'py-4': layout === 'large' },
        { 'py-4': layout === 'medium' }
      )}
      onMouseEnter={() => handleOnMouseEnter(post.id)}
      onMouseLeave={handleOnMouseLeave}
    >
      <a href={`/posts/${post.slug}`} target="_blank">
        <div
          className={classNames(
            'relative',
            { flex: layout === 'large' },
            { 'font-normal': layout === 'card' }
          )}
        >
          <div
            className={classNames(
              'relative overflow-hidden',
              { 'w-56 h-40 rounded-lg': layout === 'large' },
              { 'h-48 rounded-lg': layout === 'medium' },
              { 'h-44': layout === 'card' }
            )}
          >
            {post.post_image && post.post_image.image_url ? (
              <img className="w-full h-full object-cover" src={post.post_image.image_url} alt="" />
            ) : (
              <p>No Image</p>
            )}
            {isOwner && renderOwnerActions(post)}
          </div>
          <div
            className={classNames(
              'flex flex-col justify-between flex-1',
              { 'relative pl-4': layout === 'large' },
              { 'pt-3': layout === 'medium' },
              { 'p-4': layout === 'card' }
            )}
          >
            <div>
              <div>
                <div
                  className={`${['medium', 'card'].includes(layout) &&
                    'flex justify-between items-center'}`}
                >
                  {['medium', 'card'].includes(layout) && (
                    <Score score={post.avarage_review_score} size="small" />
                  )}
                  {post.category && (
                    <div
                      className={classNames(
                        'text-neutral-500',
                        { 'text-xs': layout === 'medium' },
                        { 'text-sm': layout === 'large' }
                      )}
                    >
                      {post.category.name}
                    </div>
                  )}
                </div>
                {post.tags && ['medium', 'card'].includes(layout) && (
                  <Tags tags={post.tags} className="mt-2" />
                )}
                <h2 className="text-sm font-bold mt-2" css={lineCramp(2)}>
                  {post.name}
                </h2>
                {post.tags && layout === 'large' && <Tags tags={post.tags} className="mt-2" />}
              </div>
              {toggleLike && renderFav(post)}
            </div>
            <div className="flex justify-between mt-1 lg:mt-2">
              {layout === 'large' && <Score score={post.avarage_review_score} size="small" />}
              {PAYMENT_REQUIRED && <div className="text-sm font-bold">¥{post.price}</div>}
            </div>
          </div>
        </div>
      </a>
    </Tag>
  )
}

export default PostItem
