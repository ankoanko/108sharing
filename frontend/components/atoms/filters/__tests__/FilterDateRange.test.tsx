import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import '../../../../test/matchMedia.mock'
import FilterDateRange from '../FilterDateRange'

jest.mock('../../../../core/i18n')

describe('atoms/filters/FilterDateRange.tsx', () => {
  const handleOnSubmit = jest.fn()
  const props = {
    name: 'Date Range',
    field: 'date',
    handleOnSubmit,
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<FilterDateRange {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
