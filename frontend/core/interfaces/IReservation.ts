import { IConversation, IPost, IReceipt, IUser } from '.'

export default interface IReservation {
  id: number
  name: string
  workflow_state_name: string
  workflow_state: string
  user: IUser
  post: IPost
  created_at: string
  start_date: string
  price: number
  reviewable: boolean
  slug: string
  total_price: number
  number: number
  selectedDate: any
  next_work_flow_state: any
  receipt_accessible: boolean
  conversation: IConversation
  receipt: IReceipt
  paid_at: string
  canceled_at: string
  updated_at: string
  refund_amount: number
  authorized_at: string
  post_name: string
  end_date: string
}
