import * as React from 'react'
import { IPost } from 'core/interfaces'
import Gallery from 'components/pages/posts/show/Gallery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartFilled } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons/faHeart'

interface IProps {
  post: IPost
  toggleLike(post: IPost): void
}

const PostImages: React.FC<IProps> = props => {
  if (!props.post.post_images.length) {
    return (
      <div className="mb-6">
        <div className="flex justify-center items-center w-full h-full bg-gray-200">No Image</div>
      </div>
    )
  }

  return (
    <div className="relative">
      {props.post.post_images.length === 1 ? (
        <div className="mb-6">
          <img className="object-cover" src={props.post.post_images[0].image_url} alt="" />
        </div>
      ) : (
        <Gallery postImages={props.post.post_images} />
      )}
      <div className="lg:hidden absolute right-0 top-0 mt-4 mr-4">
        {props.post.user_liked ? (
          <FontAwesomeIcon
            className="text-xl text-red drop-shadow-icon"
            icon={faHeartFilled}
            onClick={() => props.toggleLike(props.post)}
          />
        ) : (
          <FontAwesomeIcon
            className="text-xl text-white drop-shadow-icon"
            icon={faHeartOutline}
            onClick={() => props.toggleLike(props.post)}
          />
        )}
      </div>
    </div>
  )
}

export default PostImages
