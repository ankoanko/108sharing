const identifications = [
  {
    description: null,
    id: 1,
    identification_images: [
      {
        id: 1,
        image_url: '/url/1',
      },
    ],
    user: {
      bio:
        'はじめまして。太郎と申します。都内に住んでおりますので、何かございましたらいつでもご連絡ください。すぐに対応いたします。',
      email: 'user@example.com',
      email_notification: true,
      id: 2,
      posts_count: 3,
      unread_notifications_count: 2,
      username: 'Taro',
    },
    workflow_state: 'requested',
  },
  {
    description: null,
    id: 2,
    identification_images: [
      {
        id: 2,
        image_url: '/url/2',
      },
      {
        id: 3,
        image_url: '/url/3',
      },
    ],
    user: {
      bio: 'はじめまして。花子です。',
      email: 'user@example.com',
      email_notification: true,
      id: 3,
      posts_count: 4,
      unread_notifications_count: 2,
      username: 'Hanako',
    },
    workflow_state: 'requested',
  },
]

export const identificationsJsonWithRequestedUser = {
  data: [
    {
      id: '1',
      type: 'identification',
      attributes: { id: 1, workflow_state: 'requested', description: null },
      relationships: {
        user: { data: { id: '3', type: 'user' } },
        identification_images: { data: [{ id: '1', type: 'identification_image' }] },
      },
    },
  ],
  included: [
    {
      id: '1',
      type: 'identification_image',
      attributes: {
        id: 1,
        image_url:
          '/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBiZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--3c965a65d76a9a7a2cf30ea5d36be7c947b9f3c0/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9LYzNSeWFYQlUiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--c1eb796b040bd3f4e700914a69aa117fbcdae195/license.jpg',
      },
    },
  ],
  meta: { current_page: 1, total_pages: 1, next_page: null, prev_page: null, total_count: 4 },
}

export default identifications
