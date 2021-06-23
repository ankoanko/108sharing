import * as React from 'react'
import I18n from 'core/i18n'
import * as interfaces from 'core/interfaces'
import { IJsonResponse } from 'core/JsonApiSerializer'
import { postService } from 'core/services'
import { usePosts } from 'hooks/usePosts'
import PostList from 'components/organisms/PostList'
import SearchHeader from './SearchHeader'

declare let window: interfaces.IWindow

interface IProps {
  isSignedIn: boolean
  favorite: boolean
  posts: any
  meta: interfaces.IPager
  tags: IJsonResponse
  categories: IJsonResponse
}

const urlParams = new URLSearchParams(window.location.search)

const PostSearchIndex: React.FC<IProps> = props => {
  const { posts: initialPosts, pagination: initialPagination } = React.useMemo(
    () => postService.getPostsFromJson(props.posts.posts),
    [props.posts.posts]
  )
  const defaultKeyword = React.useMemo(() => urlParams.get('keywords'), [])
  const { loading, posts, toggleLike, getPostsByPage, pagination, handleOnFilterSubmit } = usePosts(
    {
      initialPosts,
      initialPagination,
    }
  )

  return (
    <div className="">
      {!props.favorite && (
        <SearchHeader
          handleOnFilterSubmit={handleOnFilterSubmit}
          categories={props.categories}
          tags={props.tags}
        />
      )}
      <div className={`relative lg:flex`}>
        <PostList
          showMap={false}
          loading={loading}
          title={count =>
            props.favorite
              ? I18n.t('post.result_count_favorite', { count })
              : I18n.t('post.result_count_search', { count })
          }
          getPostsByPage={getPostsByPage}
          isSignedIn={props.isSignedIn}
          favorite={props.favorite}
          posts={posts}
          toggleLike={toggleLike}
          meta={pagination}
          keyword={defaultKeyword}
          layout={'medium'}
        />
      </div>
    </div>
  )
}

export default PostSearchIndex
