import * as React from 'react'
import once from 'lodash-es/once'

const urlParams = new URLSearchParams(window.location.search)

const MAP_PADDING = 32
const MAP_DEFAULT_ZOOM = 10

const mapOptions: google.maps.MapOptions = {
  zoom: MAP_DEFAULT_ZOOM,
  mapTypeId: 'roadmap',
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  scrollwheel: false,
}
type Map = google.maps.Map<HTMLDivElement>

export const useMap = ({ favorite, posts, resetPosts, updatePostsByMapBounds }) => {
  const [map, setMap] = React.useState<null | Map>(null)
  const initializeMap = React.useCallback(() => {
    const areaParam = urlParams.get('area')
    const latParam = urlParams.get('lat')
    const lngParam = urlParams.get('lng')

    if (latParam && lngParam) {
      mapOptions.center = {
        lat: parseFloat(latParam),
        lng: parseFloat(lngParam),
      }
    }

    const initializedMap = new google.maps.Map<HTMLDivElement>(
      document.getElementById('map') as HTMLDivElement,
      mapOptions
    )

    if (latParam && lngParam) {
      // Mapの初期化後, クエリパラメータで取得したlat, lngのboundsの範囲にあるpostsを返却する
      initializedMap.addListener(
        'bounds_changed',
        once(() => updatePostsByMapBounds(initializedMap))
      )
    } else if (areaParam !== null) {
      const geocoder = new google.maps.Geocoder()

      geocoder.geocode({ address: areaParam }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const location = results[0].geometry.location
          initializedMap.panTo({ lat: location.lat(), lng: location.lng() })
          updatePostsByMapBounds(initializedMap)
        } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
          resetPosts()
        }
      })
    } else {
      if (posts.length === 0) {
        // 東京駅
        initializedMap.panTo({ lat: 35.68155, lng: 139.767178 })
      } else {
        // 取得したPostsが収まる範囲にfitBounds, お気に入り、キーワード検索で使用
        const latitudes = posts.map(post => post.latitude)
        const longitudes = posts.map(post => post.longitude)
        const minPosition = [Math.min.apply(null, latitudes), Math.min.apply(null, longitudes)]
        const maxPosition = [Math.max.apply(null, latitudes), Math.max.apply(null, longitudes)]

        if (posts.length === 1) {
          initializedMap.panTo({ lat: minPosition[0], lng: minPosition[1] })
        } else {
          const latLngBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(minPosition[0], minPosition[1]),
            new google.maps.LatLng(maxPosition[0], maxPosition[1])
          )
          initializedMap.fitBounds(latLngBounds, MAP_PADDING)
        }
      }
    }

    if (!favorite) {
      initializedMap.addListener('dragend', () => updatePostsByMapBounds(initializedMap))
      initializedMap.addListener('zoom_changed', () => updatePostsByMapBounds(initializedMap))
    }

    setMap(initializedMap)
  }, [favorite, posts, resetPosts, updatePostsByMapBounds])

  React.useEffect(() => {
    if (google) {
      initializeMap()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [google])

  return { map }
}
