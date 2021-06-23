import * as React from 'react'
import isEqual from 'lodash-es/isEqual'
import getCreateMarker from 'components/atoms/CustomMarker/Marker'

export const useMapMarkers = ({ map, posts, toggleLike }) => {
  const [markers, setMarkers] = React.useState([])
  const openedMarker = React.useMemo(() => markers.find(marker => marker.opened) || null, [markers])

  const getMarkerPositions = updatedPosts => {
    const markerPositions = []

    for (const post of updatedPosts) {
      const latLng = new google.maps.LatLng(post.latitude, post.longitude)
      markerPositions.push(latLng)
    }

    return markerPositions
  }

  const setActiveMarker = (activeMarker, currentMarkers) => {
    // console.log('activeMarker', markers, activeMarker)
    if (activeMarker === -1) {
      // マップをクリック時に既に開いているマーカー詳細を閉じる
      currentMarkers.forEach(marker => {
        if (marker.div) {
          marker.closeDetail()
        }
      })
    } else {
      // マーカーをクリック時に既に開いているマーカー詳細を閉じる
      currentMarkers.forEach(marker => {
        if (marker.getMarkerId() !== activeMarker) {
          marker.closeDetail()
        }
      })
    }
  }

  const setCustomMarkers = React.useCallback(
    (googleMap, updatedPosts) => {
      if (!googleMap) {
        return
      }

      const haveSamePosts = isEqual(
        markers.map(marker => marker.markerId),
        updatedPosts.map(post => post.id)
      )
      if (haveSamePosts) {
        return
      }

      // Remove markers
      markers.forEach(marker => marker.setMap(null))

      const markerPositions = getMarkerPositions(updatedPosts)
      const createMarker = getCreateMarker(google.maps)
      const updatedMarkers = updatedPosts.map((post, index) =>
        createMarker(markerPositions[index], googleMap, {
          post,
          toggleLike,
          setActiveMarker: markerId => setActiveMarker(markerId, updatedMarkers),
        })
      )
      setMarkers(updatedMarkers)
      return updatedMarkers
    },
    [markers, toggleLike]
  )

  const handleOnMouseEnter = React.useCallback(
    markerId => {
      markers.forEach(marker => {
        if (markerId === marker.markerId) {
          marker.handleOnMouseEnter()
        }
      })
    },
    [markers]
  )

  const handleOnMouseLeave = () => {
    markers.forEach(marker => marker.handleOnMouseLeave())
  }

  React.useEffect(() => {
    setCustomMarkers(map, posts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, posts])

  // Update opened marker like when post list item like is clicked
  React.useEffect(() => {
    if (!openedMarker) {
      return
    }

    const updated = posts.find(post => post.id === openedMarker.markerId)

    if (updated?.user_liked !== openedMarker.args.post?.user_liked) {
      openedMarker.updateDetail(updated)
    }
  }, [openedMarker, posts])

  return { markers, handleOnMouseEnter, handleOnMouseLeave }
}
