import * as React from 'react'
import { postService } from 'core/services'
import { getMergedFilterParams, getMergedFilterQueryString } from 'utils/queryString'
import { IPost } from 'core/interfaces'

const FILTER_FIELDS = [
  'area',
  'start_date',
  'end_date',
  'min_price',
  'max_price',
  'category_ids',
  'tag_ids',
]

const urlParams = new URLSearchParams(window.location.search)

const searchPost = async baseParams => {
  const keywords = urlParams.get('keywords')
  const params = { ...baseParams }

  if (keywords) {
    params.keywords = keywords
  }

  return postService.search(params)
}

export const usePosts = ({
  initialPosts = [],
  initialPagination = null,
}: {
  initialPosts?: IPost[]
  initialPagination?: any
}) => {
  const [loading, setLoading] = React.useState(false)
  const [posts, setPosts] = React.useState(initialPosts)
  const [pagination, setPagination] = React.useState(initialPagination)

  const getPostsByPage = React.useCallback(async page => {
    setLoading(true)
    const result = await searchPost({ page })

    setPosts(result.posts)
    setPagination(result.pagination)
    setLoading(false)
  }, [])

  const handleOnFilterSubmit = React.useCallback(async filterValue => {
    setLoading(true)

    const filterParams = getMergedFilterParams(FILTER_FIELDS, filterValue)
    const filterQueryString = getMergedFilterQueryString(FILTER_FIELDS, filterParams)
    const result = await searchPost({ ...filterParams })

    setPosts(result.posts)
    setPagination(result.pagination)
    setLoading(false)
    history.replaceState(null, null, `?${filterQueryString}`)
  }, [])

  const toggleLike = React.useCallback(async post => {
    const res = await postService.toggleLike(post)

    if (res) {
      setPosts(currentPosts =>
        currentPosts.map(postItem => ({
          ...postItem,
          user_liked: postItem.id === post.id ? res.like.user_liked : postItem.user_liked,
        }))
      )
    }
  }, [])

  return {
    loading,
    setLoading,
    posts,
    toggleLike,
    getPostsByPage,
    pagination,
    handleOnFilterSubmit,
  }
}
