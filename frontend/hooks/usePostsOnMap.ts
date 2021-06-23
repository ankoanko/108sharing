import * as React from 'react'
import { postService } from 'core/services'
import { useMap } from 'hooks/useMap'
import { getMergedFilterParams, getMergedFilterQueryString } from 'utils/queryString'

const FILTER_FIELDS = [
  'area',
  'start_date',
  'end_date',
  'min_price',
  'max_price',
  'category_ids',
  'tag_ids',
]

function getMapBounds(googleMap) {
  const { north, south, east, west } = googleMap.getBounds().toJSON()
  const bounds = {
    northEast: { lat: north, lng: east },
    southWest: { lat: south, lng: west },
  }
  return bounds
}

const searchPost = async baseParams => {
  const keywords = urlParams.get('keywords')
  const params = { ...baseParams }

  if (keywords) {
    params.keywords = keywords
  }

  return postService.search(params)
}

const urlParams = new URLSearchParams(window.location.search)

export const usePostsOnMap = ({ favorite, initialPosts = [], initialPagination = null }) => {
  const keyword = urlParams.get('keywords')
  const [loading, setLoading] = React.useState(favorite || keyword ? false : true)
  const [posts, setPosts] = React.useState(initialPosts)
  const [pagination, setPagination] = React.useState(initialPagination)
  // Map非表示に、表示されてたときのboundsを保持しておく
  const [currentMapBounds, setCurrentMapBounds] = React.useState(null)
  const [showMap, setShowMap] = React.useState(true)

  const resetPosts = React.useCallback(() => {
    setPosts([])
    setPagination(null)
    setLoading(false)
  }, [])

  const updatePostsByMapBounds = React.useCallback(async googleMap => {
    if (!googleMap.getBounds()) {
      return
    }
    setLoading(true)
    const filterParams = getMergedFilterParams(FILTER_FIELDS)
    const bounds = getMapBounds(googleMap)
    const params = { bounds, ...filterParams }
    const result = await searchPost(params)

    setPosts(result.posts)
    setPagination(result.pagination)
    setLoading(false)
  }, [])

  const { map } = useMap({
    favorite,
    posts,
    resetPosts,
    updatePostsByMapBounds,
  })

  const toggleShowMap = React.useCallback(
    (show: boolean) => {
      if (!show && map) {
        const bounds = getMapBounds(map)
        setCurrentMapBounds(bounds)
      } else {
        setCurrentMapBounds(null)
      }
      if (show) {
        window.scroll(0, 0)
      }
      setShowMap(show)
    },
    [map]
  )

  const getPostsByPage = React.useCallback(
    async page => {
      setLoading(true)
      const bounds = currentMapBounds ? currentMapBounds : getMapBounds(map)
      const result = favorite
        ? await postService.getFavorites({ page })
        : await searchPost({ bounds, page })

      setPosts(result.posts)
      setPagination(result.pagination)
      setLoading(false)
    },
    [currentMapBounds, map, favorite]
  )

  const handleOnFilterSubmit = React.useCallback(
    async filterValue => {
      setLoading(true)

      if (!map) {
        return
      }

      const bounds = getMapBounds(map)
      const filterParams = getMergedFilterParams(FILTER_FIELDS, filterValue)
      const filterQueryString = getMergedFilterQueryString(FILTER_FIELDS, filterParams)
      const result = await searchPost({ bounds, ...filterParams })

      setPosts(result.posts)
      setPagination(result.pagination)
      setLoading(false)
      history.replaceState(null, null, `?${filterQueryString}`)
    },
    [map]
  )

  const toggleLike = async post => {
    const res = await postService.toggleLike(post)

    if (res) {
      setPosts(currentPosts =>
        currentPosts.map(postItem => ({
          ...postItem,
          user_liked: postItem.id === post.id ? res.like.user_liked : postItem.user_liked,
        }))
      )
    }
  }

  return {
    showMap,
    toggleShowMap,
    loading,
    setLoading,
    map,
    posts,
    toggleLike,
    getPostsByPage,
    pagination,
    handleOnFilterSubmit,
  }
}
