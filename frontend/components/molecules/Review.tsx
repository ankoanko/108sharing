import * as React from 'react'
import { IPost, IReview, IUser } from 'core/interfaces'
import I18n from 'core/i18n'
import { AvatarForReview } from 'components/atoms'
import ReviewReply from 'components/pages/posts/show/ReviewReply'

interface IProps {
  review: IReview
  showPostLink?: boolean
  updateReviews?: (review: IReview) => void
}

const Review: React.FC<IProps> = props => {
  const review = props.review

  return (
    <div>
      <div>
        <AvatarForReview
          user={review.reviewer}
          createdTimeAgo={review.created_time_ago}
          isReply={false}
        />
        {props.showPostLink && (review.reviewable as IPost).name && (
          <div className="flex items-center mt-4 text-sm text-neutral-650">
            <div>{I18n.t('activerecord.models.post')}:</div>
            <div className="flex-grow w-0 ml-1">
              <a className="mt-4 text-primary" href={`/posts/${(review.reviewable as IPost).slug}`}>
                {(review.reviewable as IPost).name || 'none'}
              </a>
            </div>
          </div>
        )}
        <p className="mt-3 text-sm md:text-base whitespace-pre-wrap">{review.body}</p>
      </div>
      {review.review_reply && (
        <div className="pl-8 mt-5">
          <AvatarForReview
            user={review.review_reply.user}
            createdTimeAgo={review.review_reply.created_time_ago}
            isReply={true}
          />
          <p className="mt-5 text-sm md:text-base whitespace-pre-wrap">
            {review.review_reply.body}
          </p>
        </div>
      )}
      {props.updateReviews && !review.review_reply && (
        <ReviewReply
          post={review.reviewable as IPost}
          review={review}
          updateReviews={props.updateReviews}
        />
      )}
    </div>
  )
}

export default Review
