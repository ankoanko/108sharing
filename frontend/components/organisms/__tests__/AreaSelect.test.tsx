import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import AreaSelect from '../AreaSelect'

jest.mock('../../../core/i18n')

describe('organisms/AreaSelect', () => {
  it('should matches to the snapshot', () => {
    const wrapper = shallow(<AreaSelect title="title" />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
