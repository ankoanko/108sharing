import { IRole } from 'core/interfaces/IRole'

export default interface IUser {
  avatar_attached: boolean
  avatar_url: string
  bio: string
  created_at: string
  email_notification: boolean
  email: string
  fullname: string
  id: number
  identification_workflow_state?: null | string
  posts_count: number
  reviews_count?: number
  social_profiles?: { provider: string }[]
  stripe_customer_id: null | string
  unread_notifications_count: number
  updated_at: string
  username: string
  roles: IRole[]
}
