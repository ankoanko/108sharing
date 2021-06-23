import * as React from 'react'
import * as renderer from 'react-test-renderer'
import Slider from '../Slider'

describe('<Slider />', () => {
  it('matches to the snapshot', () => {
    const component = renderer.create(<Slider value={{ min: 0, max: 1 }} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
