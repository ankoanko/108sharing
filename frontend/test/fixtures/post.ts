import { IPost } from '../../core/interfaces'
import { ROLES } from 'constants/roles'

const post: IPost = {
  aasm_state_i18n: 'Published',
  aasm_state: 'published',
  avarage_review_score: 0,
  category_id: 1,
  category: {
    id: 1,
    name: 'Category 1',
    position: 10,
  },
  city: '横浜',
  created_at: '2019年10月02日 16時15分55秒',
  description:
    '2ようこそ東京へ！↵↵  利便性の高い立地で､押上駅から徒歩6分｡スカイツリーからも徒歩6分です｡成田空港､羽田空港から直通です。コンビニやスーパーなど周辺施設も充実しています。↵  ビジネス旅行にも､ご友人での旅行にも大変おすすめです!',
  full_address: '桜木町 横浜  ',
  id: 2,
  latitude: 35.454954,
  longitude: 139.631386,
  name: '一軒家の12畳和室  代々木､代々木公園駅より徒歩8分',
  note:
    'Please contact us if there are mistakes in the number of people. If you stay over the number of people you want, you will be charged a fee and a penalty.↵宿泊人数に間違いがある場合はご連絡ください｡意図して予約した人数より多く宿泊した場合は追加料金と違約金を請求します｡↵↵･午後10時以降は騒音禁止↵Noise prohibition after 10 pm.↵↵･他に住人がいるため廊下･階段での会話禁止↵There are people living in other rooms. Prohibition of talk in hallways and stairs.',
  post_images: [
    {
      created_at: '2019年10月02日 16時15分55秒',
      description: null,
      id: 2,
      image_attached: true,
      image_url:
        '/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBDdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--c450acd2c0186bce6691627f6004fa023e10eb30/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9LYzNSeWFYQlUiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--5847c13c036c253fd69dd274f96f1e9b8bde9b4d/apartment-2094666.jpg',
      position: 1,
      updated_at: '2019年10月02日 16時15分55秒',
    },
  ],
  price: '2,000',
  price_numeric: 2000,
  public_address: '桜木町 横浜',
  published: false,
  published_at: null,
  reviews: [],
  slug: 'd154d2082190345f',
  state: '桜木町',
  street1: null,
  street2: null,
  tags: [],
  user: {
    avatar_attached: true,
    avatar_url: '',
    bio: 'bio',
    created_at: '2019年10月21日 18時14分58秒',
    email_notification: false,
    email: 'test@example.com',
    fullname: 'User',
    id: 1,
    identification_workflow_state: null,
    posts_count: 0,
    reviews_count: 0,
    social_profiles: [],
    stripe_customer_id: null,
    unread_notifications_count: 0,
    updated_at: '',
    username: 'User',
    roles: Object.values(ROLES),
  },
  updated_at: '2019年10月02日 16時15分55秒',
  user_liked: true,
  viewed_count: 5,
  zipcode: null,
}

export default post
