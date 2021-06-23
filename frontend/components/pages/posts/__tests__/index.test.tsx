// tslint:disable-next-line
import '../../../../test/matchMedia.mock'

import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import PostIndex from '../'

jest.mock('../../../../core/services/PostService')
jest.mock('../../../../core/i18n')
jest.mock('../../../../utils/injectGoogleMaps')

describe('PostIndex', () => {
  const props = {
    posts: {
      posts: {
        data: [],
        included: [],
      },
    },
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<PostIndex {...props} />)

    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
