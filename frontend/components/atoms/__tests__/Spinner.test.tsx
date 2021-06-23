import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import Spinner from '../Spinner'

describe('atoms/Spinner.tsx', () => {
  it('should matches to the snapshot', () => {
    const wrapper = shallow(<Spinner />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
