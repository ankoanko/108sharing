import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import '../../../../test/matchMedia.mock'
import FilterType from '../FilterType'

jest.mock('../../../../core/i18n')

describe('atoms/filters/FilterType.tsx', () => {
  const handleOnSubmit = jest.fn()
  const types = [
    {
      id: 1,
      name: 'Type 1',
    },
    {
      id: 2,
      name: 'Type 2',
    },
    {
      id: 3,
      name: 'Type 3',
    },
  ]
  const props = {
    name: 'Type',
    field: 'type',
    handleOnSubmit,
    types,
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<FilterType {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
