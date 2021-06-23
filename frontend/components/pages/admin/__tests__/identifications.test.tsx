// tslint:disable-next-line
import '../../../../test/matchMedia.mock'

import { act } from '@testing-library/react'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import AdminIdentificationIndex from 'components/pages/admin/identifications/index'
import { identificationsJsonWithRequestedUser } from '../../../../test/fixtures/identifications'

jest.mock('../../../../core/services/AdminService')
jest.mock('../../../../core/i18n')

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

describe('AdminIdentificationIndex', () => {
  const props = {
    identifications: {
      identifications: identificationsJsonWithRequestedUser,
    },
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<AdminIdentificationIndex {...props} />)

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should remove identification request when approveIdentification has clicked', async () => {
    let wrapper

    act(() => {
      wrapper = mount(<AdminIdentificationIndex {...props} />, { attachTo: container })
    })

    expect(wrapper.find('tbody').find('tr')).toHaveLength(2)

    await act(async () => {
      wrapper
        .find('button[type="button"]')
        .first()
        .simulate('click')
    })
    wrapper.update()

    expect(wrapper.find('tbody').find('tr')).toHaveLength(1)
  })

  it('should remove identification request when declineIdentification has clicked', async () => {
    let wrapper

    act(() => {
      wrapper = mount(<AdminIdentificationIndex {...props} />, { attachTo: container })
    })

    expect(wrapper.find('tbody').find('tr')).toHaveLength(2)

    await act(async () => {
      wrapper
        .find('button[type="button"]')
        .last()
        .simulate('click')
    })
    wrapper.update()

    expect(wrapper.find('tbody').find('tr')).toHaveLength(1)
  })
})
