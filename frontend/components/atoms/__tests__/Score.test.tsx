import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import Score from '../Score'

jest.mock('../../../core/i18n')

describe('atoms/Score.tsx', () => {
  it('should matches to the snapshot', () => {
    const wrapper = shallow(<Score size="small" score={3.6} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
