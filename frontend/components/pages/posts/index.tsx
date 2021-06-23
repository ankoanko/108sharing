/** @jsx jsx */
import * as React from 'react'
import { IJsonResponse } from 'core/JsonApiSerializer'
import { postService } from 'core/services'
import { Pagination, PostItem } from 'components/atoms'
import { usePosts } from 'hooks/usePosts'
import * as camelcaseKeysDeep from 'camelcase-keys-deep'
import I18n from 'core/i18n'
import { css, jsx } from '@emotion/core'
import { HEADER_HEIGHT } from 'constants/constants'

interface IProps {
  posts: {
    posts: IJsonResponse
  }
}

const PostIndex: React.FC<IProps> = props => {
  const { posts: initialPosts, pagination: initialPostsPagination } = postService.getPostsFromJson(
    props.posts.posts
  )
  const { posts, toggleLike } = usePosts({
    initialPosts: initialPosts,
    initialPagination: initialPostsPagination,
  })

  return (
    <div
      className="p-4 md:p-8"
      css={css`
        min-height: calc(var(--inner-height) - ${HEADER_HEIGHT}px);
      `}
    >
      <h2 className="text-2xl font-bold"> {I18n.t('meta.post.index')}</h2>
      {posts.length ? (
        <div className="flex flex-wrap -m-2 mt-8">
          {posts.map((post, index) => (
            <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 p-2" key={index}>
              <PostItem
                key={post.id}
                post={post}
                layout="medium"
                isSignedIn={true}
                isOwner={true}
                staticSize={false}
                toggleLike={toggleLike}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-center">{I18n.t('post.no_registered_post')}</div>
      )}

      <div className="mt-5">
        <Pagination
          onChangePageHandler={page => {
            const url = new URL(window.location.href)
            url.searchParams.set('page', String(page))
            location.href = url.toString()
          }}
          {...camelcaseKeysDeep(initialPostsPagination)}
        />
      </div>
    </div>
  )
}

export default PostIndex
