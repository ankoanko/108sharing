// tslint:disable-next-line
import '../../../test/matchMedia.mock'

import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import InputText from '../InputText'

jest.mock('../../../core/i18n')

describe('atoms/InputText.tsx', () => {
  const onChangeHandler = jest.fn()
  const onBlurHandler = jest.fn()
  const props = {
    name: 'test',
    defaultValue: 'test',
    onChangeHandler,
    onBlurHandler,
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<InputText {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  // it('should matches to the snapshot with label', () => {
  //   const wrapper = shallow(<InputText {...props} label="Label" />)
  //   expect(wrapper.find('.InputText_Title').length).toBe(1)
  //   expect(toJson(wrapper)).toMatchSnapshot()
  // })

  // it('should matches to the snapshot with required', () => {
  //   const wrapper = shallow(<InputText {...props} label="Label" required={true} />)
  //   expect(wrapper.find('.InputText_Required').length).toBe(1)
  //   expect(toJson(wrapper)).toMatchSnapshot()
  // })

  // it('should matches to the snapshot with error', () => {
  //   const wrapper = shallow(<InputText {...props} error={'error'} />)
  //   expect(wrapper.find('.InputText_Error').length).toBe(1)
  //   expect(toJson(wrapper)).toMatchSnapshot()
  // })

  // it('should call handlers', () => {
  //   const wrapper = shallow(<InputText {...props} />)
  //   wrapper.find('input[type="text"]').simulate('change')
  //   expect(onChangeHandler).toHaveBeenCalled()
  //   wrapper.find('input[type="text"]').simulate('blur')
  //   expect(onBlurHandler).toHaveBeenCalled()
  // })
})
