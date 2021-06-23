import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import DropZoneUploader from '../DropZoneUploader'

jest.mock('../../../core/i18n')

describe('atoms/filters/DropZoneUploader.tsx', () => {
  const onDrop = jest.fn()
  const props = {
    onDrop,
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<DropZoneUploader {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
