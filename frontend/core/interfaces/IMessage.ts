import { IUser } from '.'

export default interface IMessage {
  body: string
  conversationId: number
  created_at: string
  file_attached: boolean
  file_url: null | string
  formatted_sent_time: string
  id: number
  sender: IUser
  sender_id: number
  sender_username: string
  sender_avatar_url: string
  sent_at: string
  updated_at: string
}
