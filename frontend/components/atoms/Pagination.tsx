import range from 'lodash-es/range'
import * as React from 'react'
import classNames from 'classnames'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface IProps {
  currentPage: number
  prevPage: number | null
  nextPage: number | null
  totalPages: number
  totalCount: number
  onChangePageHandler?(page: number): void
  className?: string
}

interface IPaginationItem {
  content: number | string | React.ReactElement
  onClick?: () => void
  disabled?: boolean
  active?: boolean
  isIcon?: boolean
}

const PAGE_LIMIT = 3

const Pagination: React.FC<IProps> = ({
  currentPage,
  prevPage,
  nextPage,
  totalPages,
  totalCount,
  onChangePageHandler,
  className = '',
}) => {
  const onChangePage = React.useCallback(
    (page: number) => {
      if (currentPage === page) return
      onChangePageHandler(page)
    },
    [currentPage, onChangePageHandler]
  )

  if (totalPages <= 1) {
    return null
  }

  const pages = range(currentPage - 1, currentPage - 1 + PAGE_LIMIT).filter(
    page => page > 1 && page < totalPages
  )
  const items: IPaginationItem[] = [
    {
      content: <FontAwesomeIcon icon={faChevronLeft} />,
      onClick: !prevPage ? null : () => onChangePage(currentPage - 1),
      disabled: !prevPage,
      active: false,
      isIcon: true,
    },
    {
      content: 1,
      onClick: () => (currentPage === 1 ? null : onChangePage(1)),
      active: currentPage === 1,
    },
    pages[0] > 2 && {
      content: '...',
    },
    ...pages.map(page => {
      return {
        content: page,
        onClick: currentPage === page ? null : () => onChangePage(page),
        active: currentPage === page,
      }
    }),
    pages[pages.length - 1] + 1 < totalPages && {
      content: '...',
    },
    {
      content: totalPages,
      onClick: currentPage === totalPages ? null : () => onChangePage(totalPages),
      active: currentPage === totalPages,
    },
    {
      content: <FontAwesomeIcon icon={faChevronRight} />,
      onClick: !nextPage ? null : () => onChangePage(currentPage + 1),
      disabled: !nextPage,
      active: false,
      isIcon: true,
    },
  ].filter(Boolean)

  return (
    <nav className={classNames(['flex items-center justify-center font-bold', className])}>
      {items.map((item, i) => {
        const Tag = item.onClick ? 'a' : 'div'
        return (
          <Tag
            key={i}
            className={classNames([
              'w-8 h-8 flex items-center justify-center mx-2 rounded-full',
              item.onClick && 'cursor-pointer transition duration-150 hover:opacity-85',
              !item.isIcon && item.active && 'text-white bg-primary',
              !item.isIcon && !item.active && 'text-primary',
              item.isIcon && item.disabled && 'text-neutral-500',
              item.isIcon && !item.disabled && 'text-primary shadow-icon',
            ])}
            onClick={item.onClick}
          >
            <div>{item.content}</div>
          </Tag>
        )
      })}
    </nav>
  )
}

export default Pagination
