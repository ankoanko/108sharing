import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import '../../../../test/matchMedia.mock'
import ContactsNew from '../new'
import { userJson } from '../../../../test/fixtures/user'

jest.mock('../../../../core/i18n')

describe('ContactsNew', () => {
  const props = {
    user: userJson,
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<ContactsNew {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
