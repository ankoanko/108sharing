/** @jsx jsx */
import classNames from 'classnames'
import range from 'lodash-es/range'
import * as moment from 'moment'
import * as React from 'react'
import I18n from '../../../core/i18n'
import { DAYS_OF_THE_WEEK } from '../../../constants/constants'
import { COLORS } from 'constants/colors'
import { css, jsx } from '@emotion/core'
interface IDay {
  date: moment.Moment
  blocked: boolean
  reserved: boolean
  price: number
  selected?: boolean
  start?: boolean
  end?: boolean
}

function separate(stringNum: string): string {
  const len = stringNum.length

  if (len > 3) {
    return separate(stringNum.substring(0, len - 3)) + ',' + stringNum.substring(len - 3)
  } else {
    return stringNum
  }
}

function formatPrice(price: number): string {
  return `¥${separate(String(price))}`
}

function getDayClassNames(day: IDay) {
  return classNames({
    blocked: day.blocked,
    reserved: day.reserved,
    selected: day.selected,
    start: day.start,
    end: day.end,
  })
}

interface IProps {
  data: IDay[]
  clearSelectedDate: () => void
  onDragStart: (day: IDay, index: number) => void
  onDragEnd: () => void
  onDrag: (day: IDay) => void
  fetching: boolean
}

const CalendarGrid: React.FC<IProps> = props => {
  const { data, clearSelectedDate, onDragStart, onDragEnd, onDrag } = props
  const today = moment()
  const firstDayOfTheMonth = data[0].date
  const offsetCount = firstDayOfTheMonth.isoWeekday() % 7
  const cellCount = offsetCount + data.length
  const rowCount = Math.ceil(cellCount / 7)
  const cellData = [...range(offsetCount).map(() => null), ...data]

  return (
    <div className="relative flex flex-col flex-1">
      <div className="flex flex-wrap border-b border-neutral-300 pb-2">
        {DAYS_OF_THE_WEEK.map((day: string, index: number) => (
          <div key={`week-${index}`} className="flex justify-center h-5 text-sm w-1/7">
            {day}
          </div>
        ))}
      </div>
      <div className="flex flex-col flex-1 -mt-1px">
        {range(rowCount).map((rowIndex: number) => (
          <div key={`row-${rowIndex}`} className="relative flex flex-1 w-full">
            {range(7).map((dayIndex: number) => {
              const cellIndex = 7 * rowIndex + dayIndex
              const cell: null | IDay = cellData[cellIndex]

              return cell === null || cellIndex >= cellCount ? (
                <span
                  className="flex w-1/7 p-2 border-b last:border-r border-neutral-300"
                  key={`cell-${cellIndex}`}
                  onClick={clearSelectedDate}
                />
              ) : (
                <div
                  key={`cell-${cellIndex}`}
                  className={getDayClassNames(cell)}
                  css={dayStyle}
                  onMouseDown={() => onDragStart(cell, cell.date.date() - 1)}
                  onMouseUp={() => onDragEnd()}
                  onMouseEnter={() => onDrag(cell)}
                >
                  <h2
                    className={classNames([
                      'text-sm',
                      cell.date.isSame(today, 'day') && 'font-bold text-primary',
                    ])}
                  >
                    {`${cell.date.date()}${
                      cell.date.isSame(today, 'day') ? I18n.t('generic.today') : ''
                    }`}
                  </h2>
                  {cell.blocked ? (
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 150 150"
                      preserveAspectRatio="none"
                    >
                      <line x1="150" y1="0" x2="0" y2="150" stroke="#999" strokeWidth="1px" />
                    </svg>
                  ) : (
                    <p className="text-right text-sm">{formatPrice(cell.price)}</p>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {props.fetching && (
        <div className="absolute inset-0 z-99 bg-white bg-opacity-50 transition duration-150" />
      )}
    </div>
  )
}

// TODO replace with tailwind
const dayStyle = css`
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 14.286%;
  padding: 8px;
  border-right: solid 1px ${COLORS.Border};
  border-bottom: solid 1px ${COLORS.Border};
  cursor: pointer;
  transition: opacity 0.1s ease;

  &.blocked {
    background-color: #f3f3f3;
  }

  &.reserved {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${COLORS.Primary};
      opacity: 0.2;
    }
  }

  &.selected {
    padding: 6px 8px 7px 8px;
    border-top: solid 2px ${COLORS.Primary};
    border-bottom: solid 2px ${COLORS.Primary};

    &.start {
      padding: 6px 8px 7px 6px;
      border-left: solid 2px ${COLORS.Primary};
    }

    &.end {
      padding: 6px 7px 7px 8px;
      border-right: solid 2px ${COLORS.Primary};
    }

    &.start.end {
      padding: 6px 7px 7px 6px;
    }
  }

  .hasSelectedDate & {
    &:not(.selected) {
      opacity: 0.5;
    }
  }

  > svg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
`

export default CalendarGrid
