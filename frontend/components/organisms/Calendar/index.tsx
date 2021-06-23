import 'moment/locale/ja'
import * as React from 'react'
import { useEffect } from 'react'
import { IPost } from 'core/interfaces'
import CalendarDetail from './Detail'
import CalendarGrid from './Grid'
import CalendarYearMonthSelect from './YearMonthSelect'
import { usePostEditCalendar } from 'hooks/usePostEditCalendar'
import * as moment from 'moment'

interface IProps {
  post: IPost
  className?: string
}

const Calendar: React.FC<IProps> = ({ post, className }) => {
  const {
    yearMonth,
    selectedDate,
    data,
    edit,
    focusedInput,
    anyTouched,
    fetching,
    getCalendarCollections,
    clearSelectedDate,
    onChangeMonthSelector,
    handleSubmit,
    updateInputValue,
    getCalendarClassNames,
    onDragStart,
    onDrag,
    onDragEnd,
    onDateRangePickerChange,
    onFocusChange,
  } = usePostEditCalendar({ post })

  useEffect(() => {
    if (post.id === null) {
      return
    }
    getCalendarCollections(moment().format('YYYY-MM'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id])

  return (
    <div className={`flex h-full select-none bg-white shadow-colored-lg rounded-xlg ${className}`}>
      <div className={`${getCalendarClassNames()} flex flex-col flex-auto h-full overflow-y-auto`}>
        <div className="border-b border-neutral-300 mb-6">
          <CalendarYearMonthSelect
            onChangeMonthSelector={onChangeMonthSelector}
            yearMonth={yearMonth}
          />
        </div>
        <CalendarGrid
          fetching={fetching}
          data={data}
          clearSelectedDate={clearSelectedDate}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDrag={onDrag}
        />
      </div>
      <CalendarDetail
        selectedDate={selectedDate}
        handleSubmit={handleSubmit}
        focusedInput={focusedInput}
        onDateRangePickerChange={onDateRangePickerChange}
        onFocusChange={onFocusChange}
        updateInputValue={updateInputValue}
        clearSelectedDate={clearSelectedDate}
        edit={edit}
        anyTouched={anyTouched}
      />
    </div>
  )
}

export default Calendar
