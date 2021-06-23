import * as React from 'react'
import { render } from 'react-dom'
import Price from './Price'
import Detail from './Detail'
import { IPost } from 'core/interfaces'

export const PRICE_MARKER_CLASSNAME = 'PriceMarker'
export const DETAIL_MARKER_CLASSNAME = 'DetailMarker'
export const MARKER_FAVORITE_CLASSNAME = 'MarkerFavorite'

type Args = { post: IPost; toggleLike: (post: IPost) => void; setActiveMarker: (id) => void }
type Map = google.maps.Map<HTMLDivElement>
type LatLng = google.maps.LatLng

function getCreateMarker(googleMaps) {
  class Marker extends googleMaps.OverlayView {
    public PADDING_TOP = 66
    public PADDING_LEFT = 16
    public PADDING_RIGHT = 66
    public PADDING_BOTTOM = 16
    public latlng: LatLng
    public map: Map
    public args: Args
    public markerId: number
    public div: HTMLElement | undefined | null
    public opened: boolean

    constructor(latlng: LatLng, map: Map, args: Args) {
      super()

      this.latlng = latlng
      this.map = map
      this.args = args
      this.markerId = args.post.id
      this.setMap(map)
    }

    public getMarkerId() {
      return this.markerId
    }

    public updateDetail(post) {
      this.args.post = post
      render(
        <Detail
          post={this.args.post}
          toggleLike={this.args.toggleLike}
          closeDetail={this.closeDetail}
        />,
        this.div
      )
      this.opened = true
    }

    public showDetail() {
      render(
        <Detail
          post={this.args.post}
          toggleLike={this.args.toggleLike}
          closeDetail={this.closeDetail}
        />,
        this.div
      )
      this.opened = true
      this.div.style.zIndex = '12'

      this.adjustMapPan()
    }

    public closeDetail = () => {
      render(<Price post={this.args.post} />, this.div)
      this.opened = false
      this.div.style.zIndex = null
    }

    public handleOnMouseEnter() {
      const marker = this.div?.querySelector(`.${PRICE_MARKER_CLASSNAME}`)
      if (!marker) return

      marker.classList.remove('bg-white', 'border-neutral-300')
      marker.classList.add('bg-primary', 'text-white', 'border-primary')
      this.div.style.zIndex = '1'
    }

    public handleOnMouseLeave() {
      const marker = this.div?.querySelector(`.${PRICE_MARKER_CLASSNAME}`)
      if (!marker) return
      marker.classList.remove('bg-primary', 'text-white', 'border-primary')
      marker.classList.add('bg-white', 'border-neutral-300')
      this.div.style.zIndex = null
    }

    private onAdd() {
      if (this.div) return

      const div = (this.div = document.createElement('div'))
      div.id = `marker_${this.args.post.id}`
      div.classList.add('Marker')
      div.style.zIndex = 'auto'
      div.style.position = 'absolute'
      div.style.display = 'inline-block'
      div.style.transform = 'translate(-50%, -100%)'
      div.style.cursor = 'pointer'

      render(<Price post={this.args.post} />, div)

      // Enable click toggle like
      googleMaps.event.addDomListener(div, 'click', async event => {
        event.stopPropagation()
        const favoriteElement = event.target.closest(`.${MARKER_FAVORITE_CLASSNAME}`)

        if (favoriteElement) {
          event.preventDefault()
          this.args.toggleLike(this.args.post)
          return
        }

        this.showDetail()
        this.args.setActiveMarker(this.markerId)
      })

      const panes = this.getPanes()
      panes.floatPane.appendChild(div)
    }

    private draw() {
      if (!this.div) return

      const point = this.getProjection().fromLatLngToDivPixel(this.latlng)

      this.div.style.left = `${point.x}px`
      this.div.style.top = `${point.y}px`
    }

    private adjustMapPan() {
      const marker = this.div?.querySelector<HTMLDivElement>(`.${DETAIL_MARKER_CLASSNAME}`)
      const containerPoint = this.getProjection().fromLatLngToContainerPixel(this.latlng)
      const mapWidth = this.map.getDiv().offsetWidth
      const mapHeight = this.map.getDiv().offsetHeight
      const markerPositions = {
        left: containerPoint.x - marker?.offsetWidth / 2,
        right: containerPoint.x + marker?.offsetWidth / 2,
        top: containerPoint.y - marker?.offsetHeight,
        bottom: containerPoint.y,
      }

      let panX = 0
      let panY = 0

      if (markerPositions.top < this.PADDING_TOP) {
        panY = markerPositions.top - this.PADDING_TOP
      }

      if (markerPositions.bottom > mapHeight - this.PADDING_BOTTOM) {
        panY = markerPositions.bottom - mapHeight + this.PADDING_BOTTOM
      }

      if (markerPositions.left < this.PADDING_LEFT) {
        panX = markerPositions.left - this.PADDING_LEFT
      }

      if (markerPositions.right > mapWidth - this.PADDING_RIGHT) {
        panX = markerPositions.right - mapWidth + this.PADDING_RIGHT
      }

      if (panX !== 0 || panY !== 0) {
        this.map.panBy(panX, panY)
      }
    }

    private onRemove() {
      if (!this.div) return

      this.div.parentNode.removeChild(this.div)
      this.div = null
    }
  }

  return (latlng, map, args) => new Marker(latlng, map, args)
}

export default getCreateMarker
