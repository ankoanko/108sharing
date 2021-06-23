/** @jsx jsx */
import * as React from 'react'
import { IJsonResponse } from 'core/JsonApiSerializer'
import { postService, utilService } from 'core/services'
import { HEADER_HEIGHT } from 'constants/constants'
import { usePosts } from 'hooks/usePosts'
import { css, jsx } from '@emotion/core'
import { Pagination, PostItem } from 'components/atoms'
import { Review } from 'components/molecules/'
import * as camelcaseKeysDeep from 'camelcase-keys-deep'
import { useReviews } from 'hooks/useReviews'
import UserShowProfile from './UserShowProfile'
import UserShowTabNav from 'components/pages/users/show/UserShowTabNav'
import I18n from 'core/i18n'

interface IProps {
  user: IJsonResponse
  posts: {
    posts: IJsonResponse
  }
  reviews?: {
    reviews: IJsonResponse
  }
}

const Show: React.FC<IProps> = props => {
  // TODO use API for pagination
  const { data: user } = utilService.getDataFromJson(props.user)
  const { posts: initialPosts, pagination: initialPostsPagination } = postService.getPostsFromJson(
    props.posts.posts
  )
  const { data: initialReviews, pagination: initialReviewPagination } = utilService.getDataFromJson(
    props.reviews.reviews
  )

  const [currentTab, setCurrentTab] = React.useState<'post' | 'review'>('post')
  const { reviews } = useReviews({ initialReviews })
  const { posts, toggleLike } = usePosts({
    initialPosts: initialPosts,
    initialPagination: initialPostsPagination,
  })

  const tabs = [
    {
      label: I18n.t('activerecord.models.post'),
      onClick: () => setCurrentTab('post'),
      active: currentTab === 'post',
    },
    {
      label: I18n.t('activerecord.models.review'),
      onClick: () => setCurrentTab('review'),
      active: currentTab === 'review',
    },
  ]

  return (
    <div className="lg:flex bg-neutral-200">
      <div className={`lg:w-80 py-6 lg:py-10 px-4 lg:px-6 border-r border-neutral-300`}>
        <div
          className="lg:sticky"
          css={css`
            top: ${HEADER_HEIGHT + 40}px;
          `}
        >
          <UserShowProfile user={user} />
        </div>
      </div>
      <div
        className="px-4 py-6 bg-white lg:flex-grow lg:w-0 lg:px-6 lg:py-10"
        css={css`
          min-height: calc(var(--inner-height) - ${HEADER_HEIGHT}px);
        `}
      >
        <UserShowTabNav tabs={tabs} />
        {currentTab === 'post' && (
          <React.Fragment>
            <div className="flex flex-wrap -m-2 mt-8">
              {posts.map((post, index) => (
                <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2" key={index}>
                  <PostItem
                    key={post.id}
                    post={post}
                    layout="card"
                    isSignedIn={true}
                    staticSize={false}
                    toggleLike={toggleLike}
                  />
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Pagination
                onChangePageHandler={page => {
                  const url = new URL(window.location.href)
                  url.searchParams.set('page_post', String(page))
                  location.href = url.toString()
                }}
                {...camelcaseKeysDeep(initialPostsPagination)}
              />
            </div>
          </React.Fragment>
        )}
        {currentTab === 'review' && (
          <React.Fragment>
            <div className="mt-10">
              {reviews.map((review, i) => (
                <div key={i} className="py-6 border-t border-neutral-300 first:border-0">
                  <Review review={review} showPostLink={true} />
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Pagination
                onChangePageHandler={page => {
                  const url = new URL(window.location.href)
                  url.searchParams.set('page_review', String(page))
                  location.href = url.toString()
                }}
                {...camelcaseKeysDeep(initialReviewPagination)}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default Show
