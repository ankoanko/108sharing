export default interface IContact {
  id: number
  name: string
  email: string
  subject: string
  body: string
  status: string | number
  note: string
  user_id: number
  created_at: string
  updated_at: string
}
