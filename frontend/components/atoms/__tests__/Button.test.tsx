import { shallow } from 'enzyme'
import * as React from 'react'
import * as renderer from 'react-test-renderer'
import Button from '../Button'

describe('<Button />', () => {
  it('matches to the snapshot', () => {
    const component = renderer.create(<Button />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('call handleClick props', () => {
    const mock = jest.fn()
    const wrapper = shallow(<Button handleClick={mock} />)
    wrapper.simulate('click')
    expect(mock).toHaveBeenCalled()
  })

  it('renders children when passed in', () => {
    const wrapper = shallow(
      <Button>
        <div className="unique" />
      </Button>
    )
    expect(wrapper.contains(<div className="unique" />)).toBe(true)
  })
})
