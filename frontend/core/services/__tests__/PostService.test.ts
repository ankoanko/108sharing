import { postService } from '../'

jest.mock('../../i18n')
jest.mock('../PostService')

describe('PostService', () => {
  it('should return posts', async () => {
    const { posts } = await postService.search({})
    // console.log('posts', posts)
    expect(posts[0].id).toEqual(1)
  })
})
