import * as React from 'react'
import { IPost } from 'core/interfaces'
import { PostItem } from '../'
import { DETAIL_MARKER_CLASSNAME } from './Marker'
import ClickOutside from 'react-click-outside'

interface IDetailMarkerProps {
  post: IPost
  toggleLike: (post: IPost) => void

  closeDetail(): void
}

const Detail: React.FC<IDetailMarkerProps> = ({ post, toggleLike, closeDetail }) => {
  return (
    <ClickOutside onClickOutside={closeDetail}>
      <div
        id={`marker-detail-${post.id}`}
        className={`${DETAIL_MARKER_CLASSNAME} block w-64 bg-white shadow-lg rounded-lg overflow-hidden whitespace-normal`}
      >
        <PostItem post={post} layout="card" toggleLike={toggleLike} />
      </div>
    </ClickOutside>
  )
}

export default Detail
