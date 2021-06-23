import { IPost, IUser } from '.'
import IReviewReviewReply from 'core/interfaces/IReviewReply'

export default interface IReview {
  avatar_url: string
  body: string
  created_at: string
  id: number
  post_id: number
  rating: number
  reviewer_id: number
  reviewer: IUser
  updated_at: string
  username: string
  review_replies: IReviewReviewReply[]
  review_reply: IReviewReviewReply
  reviewable: IPost | IUser
  created_time_ago: string
}
