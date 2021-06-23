import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import '../../../../test/matchMedia.mock'
import FilterPrice from '../FilterPrice'

jest.mock('../../../../core/i18n')

describe('atoms/filters/FilterPrice.tsx', () => {
  const handleOnSubmit = jest.fn()
  const props = {
    name: 'Price',
    field: 'price',
    handleOnSubmit,
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<FilterPrice {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
