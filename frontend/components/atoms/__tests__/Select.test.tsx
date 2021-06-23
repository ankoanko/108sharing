import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import Select from '../Select'

jest.mock('../../../core/i18n')

describe('atoms/Select.tsx', () => {
  const onChangeHandler = jest.fn()
  const onBlurHandler = jest.fn()
  const options = [
    { value: 'value1', label: 'option1' },
    { value: 'value2', label: 'option2' },
    { value: 'value3', label: 'option3' },
  ]
  const props = {
    name: 'Select Box',
    defaultValue: 'value2',
    label: 'Select',
    error: null,
    required: true,
    options,
    onChangeHandler,
    onBlurHandler,
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<Select {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should has passed options', () => {
    const wrapper = shallow(<Select {...props} />)
    expect(wrapper.find('option[value="value1"]').length).toBe(1)
    expect(wrapper.find('option[value="value2"]').length).toBe(1)
    expect(wrapper.find('option[value="value3"]').length).toBe(1)
  })

  // it('should call handlers', () => {
  //   const wrapper = shallow(<Select {...props} />)
  //   wrapper.find('select').simulate('change')
  //   expect(onChangeHandler).toHaveBeenCalled()
  //   wrapper.find('select').simulate('blur')
  //   expect(onBlurHandler).toHaveBeenCalled()
  // })
})
