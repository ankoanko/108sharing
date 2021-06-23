import range from 'lodash-es/range'
import * as moment from 'moment'
import * as React from 'react'
import I18n from '../../../core/i18n'
import { DATE_FORMAT } from '../../../constants/constants'
import classNames from 'classnames'

function getSelectableYearMonthList(): moment.Moment[] {
  const list: moment.Moment[] = []
  const thisYear = moment().year()

  // 去年、今年、来年
  range(12).forEach((month: number) => {
    list.push(moment([thisYear - 1, month, 1]))
  })
  range(12).forEach((month: number) => {
    list.push(moment([thisYear, month, 1]))
  })
  range(12).forEach((month: number) => {
    list.push(moment([thisYear + 1, month, 1]))
  })

  return list
}

interface IProps {
  onChangeMonthSelector: (event: React.FormEvent<HTMLSelectElement | HTMLButtonElement>) => void
  yearMonth: moment.Moment
}

const CalendarYearMonthSelect: React.FC<IProps> = props => {
  const { onChangeMonthSelector, yearMonth } = props

  return (
    <div className="flex items-center py-4 px-6">
      <div className="flex items-center">
        <select
          className="appearance-none font-bold pr-4 cursor-pointer focus:outline-none"
          onChange={onChangeMonthSelector}
          value={yearMonth.format(DATE_FORMAT)}
        >
          {getSelectableYearMonthList().map((selectableYearMonth: moment.Moment, index: number) => (
            <option key={`yearMonth-${index}`} value={selectableYearMonth.format(DATE_FORMAT)}>
              {/* TODO I18n */}
              {selectableYearMonth.format('YYYY年 M月')}
            </option>
          ))}
        </select>
        <svg
          className="-ml-2"
          width="9"
          height="7"
          viewBox="0 0 9 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.5 7L0.602886 0.250001L8.39711 0.25L4.5 7Z" fill="currentColor" />
        </svg>
      </div>
      <div className="ml-8 flex">
        <button
          className={classNames([
            'block h-8 px-3 border border-neutral-300',
            'transition duration-75 hover:opacity-75 focus:outline-none',
          ])}
          type="button"
          value={moment(yearMonth)
            .subtract(1, 'months')
            .format(DATE_FORMAT)}
          onClick={onChangeMonthSelector}
        >
          ←
        </button>
        <button
          className={classNames([
            'block h-8 px-3 border border-neutral-300',
            'transition duration-75 hover:opacity-75 focus:outline-none',
          ])}
          type="button"
          value={moment(yearMonth)
            .add(1, 'months')
            .format(DATE_FORMAT)}
          onClick={onChangeMonthSelector}
        >
          →
        </button>
      </div>
      <button
        className={classNames([
          'block h-8 px-3 border border-neutral-300',
          'transition duration-75 hover:opacity-75 focus:outline-none',
          'ml-6 rounded-md text-sm',
        ])}
        type="button"
        value={moment([moment().year(), moment().month(), 1]).format(DATE_FORMAT)}
        onClick={onChangeMonthSelector}
      >
        {I18n.t('generic.today')}
      </button>
    </div>
  )
}

export default CalendarYearMonthSelect
