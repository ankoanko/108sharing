import { IJsonResponse, IUser } from '../../core/interfaces'
import { ROLES } from 'constants/roles'

const user: IUser = {
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
}

export const userJson = {
  data: {
    id: '2',
    type: 'user',
    attributes: {
      id: 2,
      username: 'taro',
      bio:
        'はじめまして。太郎と申します。都内に住んでおりますので、何かございましたらいつでもご連絡ください。すぐに対応いたします。',
      posts_count: 103,
      avatar_url:
        '/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--3914a20eb6b998df7ae7f3cac41e0b88fad787fc/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9LYzNSeWFYQlUiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--c1eb796b040bd3f4e700914a69aa117fbcdae195/face-1391628_1920.jpg',
      unread_notifications_count: 0,
      email_notification: true,
      identification_workflow_state: 'approved',
      reviews_count: 2,
      fullname: 'yamanaka taro',
      birthday: null,
      gender: 'female',
      gender_i18n: 'Female',
      phone: null,
      published: true,
      email_exists: true,
      suspended: false,
      email: null,
      created_at: '2020年10月',
    },
    relationships: {
      card: { data: null },
      roles: {
        data: [
          { id: '2', type: 'role' },
          { id: '3', type: 'role' },
        ],
      },
    },
  },
  included: [
    { id: '2', type: 'role', attributes: { id: 2, name: 'host' } },
    {
      id: '3',
      type: 'role',
      attributes: { id: 3, name: 'guest' },
    },
  ],
}

export default user
