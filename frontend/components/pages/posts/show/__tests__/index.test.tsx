// tslint:disable-next-line
import '../../../../../test/matchMedia.mock'

import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import { PostShow } from '../'
import { postJson, user } from '../../../../../test/fixtures'

jest.mock('../../../../../core/i18n')
jest.mock('../../../../../utils/injectGoogleMaps')

const props = {
  editable: false,
  google: undefined,
  isOwner: false,
  isSignedIn: false,
  post_owner: user,
  post: postJson,
  related_posts: [],
  reviews: [],
  user,
  identification_required: false,
  profile_required: false,
}

describe('PostShow', () => {
  it('should matches to the snapshot', () => {
    const wrapper = shallow(<PostShow {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
