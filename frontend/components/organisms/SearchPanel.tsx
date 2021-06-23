import * as Color from 'color'
import I18n from 'core/i18n'
import moment, { Moment } from 'moment'
import React from 'react'
import { DateRangePicker } from 'react-dates'
import 'react-dates/initialize'
import { COLORS } from 'constants/colors'
import { Button } from '../atoms'
import { Form } from '../molecules'
import { css, Global } from '@emotion/core'
import { defaultCalendarProps } from 'constants/dateRangePickerCustomStyle'

const FIELDS = {
  startDate: 'startDate',
  endDate: 'endDate',
  area: 'area',
}

interface IDate {
  start: null | Moment
  end: null | Moment
}

interface IProps {}

const SearchPanel: React.FC<IProps> = props => {
  const [focusedInput, setFocusedInput] = React.useState(null)
  const [selectedDate, setSelectedDate] = React.useState<IDate>({
    start: null,
    end: null,
  })

  const onDateRangePickerChange = React.useCallback(
    (dates: { startDate: moment.Moment | null; endDate: moment.Moment | null }) => {
      setSelectedDate({
        start: dates.startDate,
        end: dates.endDate,
      })
    },
    []
  )

  const handleSubmit = React.useCallback(
    (initialValues, values) => {
      const area = values.area || I18n.t('search_pan.tokyo')
      let queryParams = `?area=${area}`

      if (selectedDate.start !== null) {
        queryParams += `&start_date=${selectedDate.start.format('YYYY-MM-DD')}`
      }
      if (selectedDate.end !== null) {
        queryParams += `&end_date=${selectedDate.end.format('YYYY-MM-DD')}`
      }

      location.href = `/posts/search${queryParams}`
    },
    [selectedDate]
  )

  return (
    <React.Fragment>
      {/*max-width 460px*/}
      <div className="bg-white rounded-sm max-w-115 p-6">
        <h1 className="text-2xl font-bold">{I18n.t('search_pan.title')}</h1>
        <Form fields={FIELDS} handleSubmit={handleSubmit}>
          <div className="mt-6">
            <div className="mb-2">{I18n.t('generic.area')}</div>
            <input
              className="block w-full border border-neutral-300 rounded-sm p-3 focus:outline-none focus:border-primary appearance-none"
              type="text"
              name="area"
              placeholder={I18n.t('search_pan.anywhere')}
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center mb-2">
              <label className="w-1/2" htmlFor="startDate">
                {I18n.t('generic.check_in')}
              </label>
              <label className="w-1/2" htmlFor="endDate">
                {I18n.t('generic.check_out')}
              </label>
            </div>
            <Global styles={css(dateRangePickerCustomStyle)} />
            <DateRangePicker
              startDatePlaceholderText={'yyyy/mm/dd'}
              startDate={selectedDate.start}
              startDateId="startDate"
              endDatePlaceholderText={'yyyy/mm/dd'}
              endDate={selectedDate.end}
              endDateId="endDate"
              onDatesChange={onDateRangePickerChange}
              focusedInput={focusedInput}
              onFocusChange={(currentFocusedInput: string | null) =>
                setFocusedInput(currentFocusedInput)
              }
              numberOfMonths={1}
              {...defaultCalendarProps}
            />
          </div>

          <Button className="mt-6" full>
            {I18n.t('search_pan.search')}
          </Button>
        </Form>
      </div>
    </React.Fragment>
  )
}

const dateRangePickerCustomStyle = `
  .DateRangePicker.DateRangePicker_1 {
    width: 100%;
  }

  .DateRangePickerInput.DateRangePickerInput_1 {
    width: 100%;
    border: none;
  }

  .DateInput.DateInput_1 {
    width: 50%;
  }

  .DateRangePickerInput_arrow.DateRangePickerInput_arrow_1 {
    display: none;
  }

  input#startDate {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    border: solid 1px ${COLORS.Border};
  }

  input#endDate {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    border: solid 1px ${COLORS.Border};
    border-left-color: transparent;
  }

  input#startDate,
  input#endDate {
    &.DateInput_input__focused {
      border: solid 1px ${COLORS.Primary};
    }
    
    &:focus {
      outline: none;
      border: solid 1px ${COLORS.Primary};
    }
  }

  /* .DateInput_input__focused {
    border-color: ${COLORS.Primary};
  } */

  .CalendarDay__selected_span {
    background: ${Color(COLORS.Primary)
      .lighten(0.25)
      .hex()};
    border: 1px double
      ${Color(COLORS.Primary)
        .lighten(0.15)
        .hex()};
    color: #fff;
  }

  .CalendarDay__selected {
    background: ${COLORS.Primary};
    border: 1px double ${COLORS.Primary};
    color: white;
  }

  .CalendarDay__selected:hover {
    background: ${COLORS.Primary};
    color: white;
  }

  .CalendarDay__hovered_span:hover,
  .CalendarDay__hovered_span {
    background: ${Color(COLORS.Primary)
      .lighten(0.25)
      .hex()};
    border: 1px double ${Color(COLORS.Primary)
      .lighten(0.15)
      .hex()};
    color: #fff;
  }
  
  input {
    appearance: none;
  }
`

export default SearchPanel
