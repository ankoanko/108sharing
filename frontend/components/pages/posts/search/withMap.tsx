import { useMediaQuery } from 'react-responsive'
import * as React from 'react'
import I18n from 'core/i18n'
import * as interfaces from 'core/interfaces'
import { IJsonResponse } from 'core/JsonApiSerializer'
import { postService } from 'core/services'
import { BREAKPOINT_TABLET_LARGE } from 'constants/constants'
import injectGoogleMaps from 'utils/injectGoogleMaps'
import AreaSelect from 'components/organisms/AreaSelect'
import PostList from 'components/organisms/PostList'
import PostMap from 'components/organisms/PostMap'
import { useMapMarkers } from 'hooks/useMapMarkers'
import { usePostsOnMap } from 'hooks/usePostsOnMap'
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

export const PostSearchWithMap: React.FC<IProps> = props => {
  // show area select panels
  if (!urlParams.get('area') && !urlParams.get('keywords') && !props.favorite) {
    return (
      <div className="container py-8">
        <AreaSelect title={I18n.t('search_pan.select_area')} />
      </div>
    )
  } else {
    const PostSearchIndexWithGoogleMap = injectGoogleMaps(PostSearchIndex)
    return <PostSearchIndexWithGoogleMap {...props} />
  }
}

const PostSearchIndex: React.FC<IProps> = props => {
  const isDesktop = useMediaQuery({ query: `(min-width: ${BREAKPOINT_TABLET_LARGE}px)` })
  const { posts: initialPosts, pagination: initialPagination } = React.useMemo(
    () => postService.getPostsFromJson(props.posts.posts),
    [props.posts.posts]
  )
  const defaultKeyword = React.useMemo(() => urlParams.get('keywords'), [])

  const {
    showMap,
    toggleShowMap,
    loading,
    map,
    posts,
    toggleLike,
    getPostsByPage,
    pagination,
    handleOnFilterSubmit,
  } = usePostsOnMap({
    favorite: props.favorite,
    initialPosts: props.favorite || urlParams.get('keywords') ? initialPosts : [],
    initialPagination: props.favorite ? initialPagination : null,
  })

  const { handleOnMouseEnter, handleOnMouseLeave } = useMapMarkers({
    toggleLike,
    posts,
    map,
  })

  return (
    <div>
      {!props.favorite && (
        <SearchHeader
          handleOnFilterSubmit={handleOnFilterSubmit}
          categories={props.categories}
          tags={props.tags}
          showMap={showMap}
          setShowMap={toggleShowMap}
        />
      )}
      <div className={`relative lg:flex`}>
        <PostList
          loading={loading}
          title={count =>
            props.favorite
              ? I18n.t('post.result_count_favorite', { count })
              : I18n.t('post.result_count_search', { count })
          }
          handleOnMouseEnter={handleOnMouseEnter}
          handleOnMouseLeave={handleOnMouseLeave}
          getPostsByPage={getPostsByPage}
          isSignedIn={props.isSignedIn}
          favorite={props.favorite}
          posts={posts}
          toggleLike={toggleLike}
          meta={pagination}
          showMap={showMap}
          keyword={defaultKeyword}
          layout={isDesktop && showMap ? 'large' : 'medium'}
        />
        <PostMap showMap={showMap} toggleShowMap={toggleShowMap} />
      </div>
    </div>
  )
}

export default PostSearchWithMap
