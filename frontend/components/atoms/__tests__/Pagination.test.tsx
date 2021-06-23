import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import Pagination from '../Pagination'

describe('atoms/Pagination.tsx', () => {
  const onChangePageHandler = jest.fn()
  const props = {
    currentPage: 3,
    prevPage: 2,
    nextPage: 4,
    totalPages: 5,
    totalCount: 100,
    onChangePageHandler,
  }

  it('should matches to the snapshot', () => {
    const wrapper = shallow(<Pagination {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  // it('should call onChangePageHandler with next page', () => {
  //   const wrapper = shallow(<Pagination {...props} />)
  //   wrapper.find('.Pagination_Arrow._next').simulate('click')
  //   expect(onChangePageHandler).toHaveBeenCalledWith(4)
  // })

  // it('should call onChangePageHandler with prev page', () => {
  //   const wrapper = shallow(<Pagination {...props} />)
  //   wrapper.find('.Pagination_Arrow._prev').simulate('click')
  //   expect(onChangePageHandler).toHaveBeenCalledWith(2)
  // })
})
