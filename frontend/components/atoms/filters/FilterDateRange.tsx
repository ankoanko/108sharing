import * as React from 'react'
import 'moment/locale/ja'
import 'react-dates/initialize'
import { DayPickerRangeController } from 'react-dates'
import { BREAKPOINT_TABLET_SMALL } from 'constants/constants'
import {
  dateRangePickerCustomStyleOnForm,
  defaultCalendarProps,
} from 'constants/dateRangePickerCustomStyle'
import FilterLayout from 'components/layouts/FilterLayout'
import { useDateRange } from 'hooks/useDataRange'
import { useMediaQuery } from 'react-responsive'
import { css, Global } from '@emotion/core'
import * as moment from 'moment'

interface IProps {
  setIsFilterPanelOpen?(isOpen: boolean): void
  handleOnSubmit(filterValue: any): void
}

const FilterDateRange: React.FC<IProps> = props => {
  const { setIsFilterPanelOpen, handleOnSubmit } = props

  const [isOpen, setIsOpen] = React.useState(false)
  const [focusedInput, setFocusedInput] = React.useState<null | 'startDate' | 'endDate'>(
    'startDate'
  )
  const isMobile = useMediaQuery({ query: `(max-width: ${BREAKPOINT_TABLET_SMALL}px)` })
  const setPanelIsOpen = React.useCallback(
    (open: boolean) => {
      if (open === isOpen) return
      if (setIsFilterPanelOpen) setIsFilterPanelOpen(open)
      setIsOpen(open)
    },
    [isOpen, setIsFilterPanelOpen]
  )
  const {
    hasValue,
    labelName,
    onApply,
    onClear,
    onDateRangePickerChange,
    selectedDate,
  } = useDateRange({ handleOnSubmit, setPanelIsOpen })
  const now = moment().startOf('day')

  return (
    <FilterLayout
      hasValue={hasValue()}
      label={labelName}
      onClear={onClear}
      onApply={onApply}
      setPanelIsOpen={setPanelIsOpen}
    >
      <Global styles={css(dateRangePickerCustomStyleOnForm)} />
      <div className="flex justify-center">
        {/* TODO support i18n */}
        <DayPickerRangeController
          startDate={selectedDate.startDate}
          endDate={selectedDate.endDate}
          onDatesChange={onDateRangePickerChange}
          focusedInput={focusedInput}
          onFocusChange={(currentFocusedInput: null | 'startDate' | 'endDate') =>
            setFocusedInput(currentFocusedInput || 'startDate')
          }
          initialVisibleMonth={null}
          noBorder={true}
          numberOfMonths={isMobile ? 1 : 2}
          isOutsideRange={date => date.isBefore(now)}
          {...defaultCalendarProps}
        />
      </div>
    </FilterLayout>
  )
}

export default FilterDateRange
