import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import CropperUploader from '../CropperUploader'

jest.mock('../../../core/i18n')

describe('organisms/CropperUploader', () => {
  it('should matches to the snapshot', () => {
    const wrapper = shallow(
      <CropperUploader
        imageFile={null}
        setCroppedImage={() => {
          return
        }}
        cancelCrop={() => {
          return
        }}
      />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
