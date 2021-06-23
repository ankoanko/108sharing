import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import CheckBox from '../CheckBox'

describe('atoms/CheckBox.tsx', () => {
  const onChangeHandler = jest.fn()
  const props = {
    name: 'test',
    defaultChecked: false,
    onChangeHandler,
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<CheckBox {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should call handleClick props', () => {
    const wrapper = shallow(<CheckBox {...props} />)
    wrapper.find('input').simulate('change', { target: { checked: false } })
    expect(onChangeHandler).toHaveBeenCalled()
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
