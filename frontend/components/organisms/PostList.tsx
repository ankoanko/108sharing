import * as React from 'react'
import I18n from 'core/i18n'
import { IPost } from 'core/interfaces'
import Pagination from 'components/atoms/Pagination'
import { Spinner, PostItem } from 'components/atoms'
import classNames from 'classnames'

interface IPostListProps {
  showMap?: boolean
  loading?: boolean
  isSignedIn: boolean
  favorite: boolean
  posts: any
  meta: any
  noPostsTitle?: string
  keyword?: null | string
  layout?: 'large' | 'medium' | 'small'

  handleOnMouseEnter?(markerId): void

  handleOnMouseLeave?(): void

  getPostsByPage?(page: number): void

  title(count: number): string

  toggleLike(post: IPost): void
}

const PostList: React.FC<IPostListProps> = ({
  layout = 'medium',
  showMap = true,
  isSignedIn = false,
  favorite = false,
  keyword = '',
  noPostsTitle,
  meta,
  posts,
  loading,
  title,
  getPostsByPage,
  toggleLike,
  handleOnMouseEnter,
  handleOnMouseLeave,
}) => {
  const renderHeader = () => {
    return (
      <React.Fragment>
        {favorite && <h1>{I18n.t('post.favorite_post_heading')}</h1>}
        <div>
          {keyword && <p>{I18n.t('post.result_keyword', { keyword })}</p>}
          <p>
            {!meta || !meta.total_count ? (
              <span>
                {noPostsTitle
                  ? noPostsTitle
                  : favorite
                  ? I18n.t('favorite.no_favorites')
                  : I18n.t('post.no_search_result')}
              </span>
            ) : (
              <span>{title(meta.total_count)}</span>
            )}
          </p>
        </div>
      </React.Fragment>
    )
  }

  const renderPostList = () => {
    return (
      <ul
        className={`
        ${showMap && 'divide-y divide-neutral-300'}
        ${!showMap && 'flex flex-wrap -mx-2'}
      `}
      >
        {posts.map((post, index) => (
          <PostItem
            key={post.id}
            post={post}
            layout={layout}
            isSignedIn={isSignedIn}
            staticSize={!showMap}
            toggleLike={toggleLike}
            handleOnMouseEnter={handleOnMouseEnter}
            handleOnMouseLeave={handleOnMouseLeave}
          />
        ))}
      </ul>
    )
  }

  return (
    <div
      className={classNames([
        showMap ? 'h-0 overflow-hidden w-full lg:h-auto lg:block lg:max-w-screen-md' : '',
      ])}
    >
      <div className={classNames(['w-full p-4', 'sm:p-6 lg:py-10 lg:px-8'])}>
        {loading ? (
          <Spinner />
        ) : (
          <div className="mb-20 lg:mb-0">
            {renderHeader()}
            {renderPostList()}
            {!meta || meta.total_pages <= 1 ? null : (
              <Pagination
                onChangePageHandler={getPostsByPage}
                currentPage={Number(meta.current_page)}
                prevPage={meta.prev_page}
                nextPage={meta.next_page}
                totalPages={meta.total_pages}
                totalCount={meta.total_count}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostList
