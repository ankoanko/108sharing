import * as moment from 'moment'
import * as React from 'react'
import { DateRangePicker } from 'react-dates'
import 'react-dates/initialize'
import I18n from 'core/i18n'
import { Button, InputText, Radio } from 'components/atoms'
import { css, Global } from '@emotion/core'
import {
  dateRangePickerCustomStyleOnForm,
  defaultCalendarProps,
} from 'constants/dateRangePickerCustomStyle'

interface ISelectedDate {
  start: null | moment.Moment
  end: null | moment.Moment
}

interface IEdit {
  reserved: boolean
  price: string
  availability: string
}

interface IProps {
  selectedDate: ISelectedDate
  handleSubmit: () => Promise<void>
  focusedInput: null | 'startDate' | 'endDate'
  onDateRangePickerChange: (dates: {
    startDate: moment.Moment | null
    endDate: moment.Moment | null
  }) => void
  onFocusChange: (focusedInput: string | null) => void
  updateInputValue: (event: React.FormEvent<HTMLInputElement>) => void
  clearSelectedDate: () => void
  edit: IEdit
  anyTouched: boolean
}

const CalendarDetail: React.FC<IProps> = props => {
  const {
    selectedDate,
    handleSubmit,
    focusedInput,
    onDateRangePickerChange,
    onFocusChange,
    updateInputValue,
    clearSelectedDate,
    edit,
    anyTouched,
  } = props

  return (
    <div className="relative w-64 border-l border-neutral-300 -ml-1px p-6">
      {focusedInput ||
      (moment.isMoment(selectedDate.start) && moment.isMoment(selectedDate.end)) ? (
        <form
          className="absolute inset-0 flex flex-col justify-between p-6"
          onSubmit={handleSubmit}
        >
          <div className="flex-1">
            <h2 className="text-sm mb-2">{I18n.t('calendar.selected_date')}</h2>
            <Global styles={css(dateRangePickerCustomStyleOnForm)} />
            <DateRangePicker
              startDate={selectedDate.start}
              startDateId="startDate"
              endDate={selectedDate.end}
              endDateId="endDate"
              onDatesChange={onDateRangePickerChange}
              focusedInput={focusedInput}
              onFocusChange={onFocusChange}
              numberOfMonths={1}
              minimumNights={0}
              {...defaultCalendarProps}
            />
            {edit.reserved ? (
              <p className="mt-6 text-sm">{I18n.t('calendar.cannot_edit_reserved_days')}</p>
            ) : (
              <div
                key={Object.values(selectedDate ?? {})
                  .map(v => v?.toString())
                  .filter(Boolean)
                  .join('')}
              >
                <div className="mt-8">
                  <div className="text-sm mb-2">{I18n.t('generic.price')}</div>
                  <InputText
                    name="price"
                    defaultValue={edit.price}
                    onChangeHandler={updateInputValue}
                  />
                </div>
                <div className="mt-8">
                  <h3 className="text-sm mb-2">{I18n.t('calendar.state')}</h3>
                  <Radio
                    name="availability"
                    label={I18n.t('calendar.available')}
                    value="available"
                    defaultChecked={edit.availability === 'available'}
                    onChangeHandler={updateInputValue}
                  />
                  <Radio
                    className="mt-2"
                    name="availability"
                    label={I18n.t('calendar.blocked')}
                    value="blocked"
                    defaultChecked={edit.availability === 'blocked'}
                    onChangeHandler={updateInputValue}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center -mx-2">
            <div className="w-1/2 px-2">
              <Button size="small" type="button" buttonType="muted" handleClick={clearSelectedDate}>
                {I18n.t('generic.cancel')}
              </Button>
            </div>
            <div className="w-1/2 px-2">
              <Button size="small" type="submit" disabled={!anyTouched}>
                {I18n.t('generic.save')}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <h2 className="text-sm">{I18n.t('calendar.selected_date')}</h2>
      )}
    </div>
  )
}

export default CalendarDetail
