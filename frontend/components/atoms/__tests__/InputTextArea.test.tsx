// tslint:disable-next-line
import '../../../test/matchMedia.mock'

import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import InputTextArea from '../InputTextArea'

jest.mock('../../../core/i18n')

describe('atoms/InputTextArea.tsx', () => {
  const props = {
    name: 'test',
    defaultValue: 'test',
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<InputTextArea {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  // it('should matches to the snapshot with label', () => {
  //   const wrapper = shallow(<InputTextArea {...props} label="Label" />)
  //   expect(wrapper.find('.InputTextArea_Title').length).toBe(1)
  //   expect(toJson(wrapper)).toMatchSnapshot()
  // })

  // it('should matches to the snapshot with required', () => {
  //   const wrapper = shallow(<InputTextArea {...props} label="Label" required={true} />)
  //   expect(wrapper.find('.InputTextArea_Required').length).toBe(1)
  //   expect(toJson(wrapper)).toMatchSnapshot()
  // })

  // it('should matches to the snapshot with error', () => {
  //   const wrapper = shallow(<InputTextArea {...props} error={'error'} />)
  //   expect(wrapper.find('.InputTextArea_Error').length).toBe(1)
  //   expect(toJson(wrapper)).toMatchSnapshot()
  // })
})
