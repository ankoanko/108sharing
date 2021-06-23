import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import posts from '../../../test/fixtures/posts'
import '../../../test/matchMedia.mock'
import PostList from '../PostList'

jest.mock('../../../core/i18n')

describe('pages/post/search', () => {
  it('should matches to the snapshot', () => {
    const wrapper = shallow(
      <PostList
        loading={false}
        isSignedIn={true}
        favorite={false}
        posts={[]}
        meta={null}
        title={count => `${count} Posts`}
        toggleLike={() => {
          return
        }}
      />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should matches to the snapshot with posts', () => {
    const wrapper = shallow(
      <PostList
        loading={false}
        isSignedIn={true}
        favorite={false}
        posts={posts}
        meta={null}
        title={count => `${count} Posts`}
        toggleLike={() => {
          return
        }}
      />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
