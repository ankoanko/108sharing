// tslint:disable-next-line
import '../../../../../test/matchMedia.mock'

import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import PostNew from '../'

jest.mock('../../../../../core/services/PostService')
jest.mock('../../../../../core/i18n')
jest.mock('../../../../../utils/injectGoogleMaps')

const data = {
  data: [],
  included: [],
}

describe('PostNew', () => {
  it('should matches to the snapshot', () => {
    const wrapper = shallow(
      <PostNew post={data} isNew={true} categories={data} tags={data} conditions={data} />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
