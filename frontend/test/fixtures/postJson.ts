import { IJsonResponse } from '../../core/interfaces'

const postJson: IJsonResponse = {
  data: {
    id: '101',
    type: 'post',
    attributes: {
      id: 101,
      slug: '849141268169c711',
      name: '駅･スカイツリーから徒歩6分！立地最高の無料Wi-FI付、最大3名収容物件！',
      description:
        'ようこそ東京へ！\n  利便性の高い立地で､押上駅から徒歩6分｡スカイツリーからも徒歩6分です｡成田空港､羽田空港から直通です。コンビニやスーパーなど周辺施設も充実しています。\n  ビジネス旅行にも､ご友人での旅行にも大変おすすめです!',
      aasm_state_i18n: '公開',
      published: true,
      latitude: 35.658581,
      longitude: 139.745433,
      viewed_count: 3,
      avarage_review_score: 4,
      public_address: '墨田区 東京',
      full_address: '墨田区 東京  ',
      note:
        'Please contact us if there are mistakes in the number of people. If you stay over the number of people you want, you will be charged a fee and a penalty.\n宿泊人数に間違いがある場合はご連絡ください｡意図して予約した人数より多く宿泊した場合は追加料金と違約金を請求します｡\n\n･午後10時以降は騒音禁止\nNoise prohibition after 10 pm.\n\n･他に住人がいるため廊下･階段での会話禁止\nThere are people living in other rooms. Prohibition of talk in hallways and stairs.',
      size: null,
      capacity: null,
      functionality: null,
      zipcode: null,
      state: '墨田区',
      city: '東京',
      street1: null,
      street2: null,
      price: '10,000',
      created_at: '2020年10月05日 20時04分37秒',
      price_numeric: 10000,
      updated_at: '2020年10月05日 20時04分37秒',
      published_at: '2020年10月05日 20時04分37秒',
      user_liked: true,
    },
    relationships: {
      user: {
        data: {
          id: '2',
          type: 'user',
        },
      },
      category: {
        data: {
          id: '1',
          type: 'category',
        },
      },
      post_images: {
        data: [
          {
            id: '101',
            type: 'post_image',
          },
        ],
      },
      tags: {
        data: [
          {
            id: '1',
            type: 'tag',
          },
          {
            id: '4',
            type: 'tag',
          },
        ],
      },
      reviews: {
        data: [
          {
            id: '1',
            type: 'review',
          },
        ],
      },
    },
  },
  included: [
    {
      id: '1',
      type: 'category',
      attributes: {
        id: 1,
        name: 'Apartment',
        position: 10,
      },
      relationships: {},
    },
    {
      id: '101',
      type: 'post_image',
      attributes: {
        id: 101,
        position: 1,
        description: null,
        image_url:
          '/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBhdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e5fb451af544c14e35831fa9752bbb92a610ae9a/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9LYzNSeWFYQlUiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--c1eb796b040bd3f4e700914a69aa117fbcdae195/apartment-2094666.jpg',
        image_attached: true,
        created_at: '2020年10月05日 20時04分37秒',
        updated_at: '2020年10月05日 20時04分37秒',
      },
      relationships: {
        post: {
          data: null,
        },
      },
    },
    {
      id: '1',
      type: 'review',
      attributes: {
        id: 1,
        rating: 4,
        body: 'とてもきれいな部屋で快適でした',
        created_time_ago: '10日',
        created_at: '2020/10/05',
      },
      relationships: {
        reservation: {
          data: {
            id: '1',
            type: 'reservations',
          },
        },
        reviewer: {
          data: {
            id: '3',
            type: 'user',
          },
        },
        reviewable: {
          data: {
            id: '101',
            type: 'post',
          },
        },
        review_reply: {
          data: null,
        },
      },
    },
    {
      id: '3',
      type: 'user',
      attributes: {
        id: 3,
        username: 'hanako',
        bio: 'はじめまして。花子と申します。埼玉に住んでおります。リプは一時間以内を目指しています',
        posts_count: 0,
        avatar_url: '/images/no-avatar.svg',
        unread_notifications_count: 0,
        email_notification: true,
        identification_workflow_state: 'approved',
        reviews_count: 0,
        fullname: 'sasada',
        birthday: null,
        gender: 'female',
        gender_i18n: 'Female',
        phone: null,
        published: true,
        email_exists: true,
        suspended: false,
        email: 'guest@example.com',
        created_at: '2020年10月',
      },
      relationships: {
        card: {
          data: {
            id: '1',
            type: 'card',
          },
        },
        roles: {
          data: [
            {
              id: '2',
              type: 'role',
            },
            {
              id: '3',
              type: 'role',
            },
          ],
        },
      },
    },
    {
      id: '1',
      type: 'tag',
      attributes: {
        id: 1,
        name: 'Entire place',
        position: 10,
      },
      relationships: {},
    },
    {
      id: '4',
      type: 'tag',
      attributes: {
        id: 4,
        name: 'Self Check-in',
        position: 40,
      },
      relationships: {},
    },
    {
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
        unread_notifications_count: 1,
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
        card: {
          data: null,
        },
        roles: {
          data: [
            {
              id: '2',
              type: 'role',
            },
            {
              id: '3',
              type: 'role',
            },
          ],
        },
      },
    },
  ],
}

export default postJson
