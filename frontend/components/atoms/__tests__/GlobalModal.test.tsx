import * as React from 'react'
import GlobalModal from '../GlobalModal'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe('<GlobalModal />', () => {
  it('matches to the snapshot', () => {
    const wrapper = shallow(<GlobalModal />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
