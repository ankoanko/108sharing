import { ICategory, IPostImage, IReview, ITag, IUser } from '.'

export default interface IPost {
  aasm_state_i18n: string
  aasm_state: string
  avarage_review_score: number
  category_id: null | number
  category: ICategory
  city: string
  created_at: string
  description: string
  full_address: string
  id: number
  latitude: number
  longitude: number
  name: string
  note: string
  post_image?: IPostImage
  post_images: IPostImage[]
  price_numeric: number
  price: string
  public_address: string
  published_at: null | string
  published: boolean
  reviews: IReview[]
  slug: string
  state: string
  street1: null | string
  street2: null | string
  tags: ITag[]
  updated_at: string
  user_liked: boolean
  user: IUser
  viewed_count: number
  zipcode: null | string
}
