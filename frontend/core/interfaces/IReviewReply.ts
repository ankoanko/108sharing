import { IReview, IUser } from '.'

export default interface IReviewReviewReply {
  id: number
  body: string
  created_time_ago: string
  user: IUser
  review: IReview
}
