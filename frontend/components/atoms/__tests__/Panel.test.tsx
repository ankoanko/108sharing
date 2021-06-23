import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import Panel from '../Panel'

describe('atoms/Panel.tsx', () => {
  const props = {
    title: 'Title',
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<Panel {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should renders children when passed in', () => {
    const wrapper = shallow(
      <Panel>
        <div className="unique" />
      </Panel>
    )
    expect(wrapper.contains(<div className="unique" />)).toBe(true)
  })
})
